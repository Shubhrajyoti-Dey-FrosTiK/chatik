import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getConvexClient } from "@/lib/convex";
import { google } from "@ai-sdk/google";
import {
  convertToModelMessages,
  smoothStream,
  streamText,
  UIMessage,
} from "ai";
import { NextRequest } from "next/server";
import { v4 } from "uuid";

const convex = getConvexClient();

export interface NewMessageInChatRequest {
  chatId: string;
  messages: UIMessage[];
}

export async function POST(request: NextRequest) {
  const { chatId, messages }: NewMessageInChatRequest = await request.json();
  const start = Date.now();

  const stream = await streamText({
    system: `
    Answer the questions of the user very elaboratively

    Note:
    Use mathjax syntax to denote mathematical equations
    `,
    model: google("gemini-2.0-flash-001"),
    messages: convertToModelMessages(messages),
    experimental_transform: smoothStream(),
    onFinish({ content, sources, usage }) {
      const end = Date.now();
      const timeSpentMs = end - start;
      convex.mutation(api.messages.create, {
        chatId: chatId as Id<"chats">,
        id: v4(),
        // eslint-disable-next-line
        parts: content as any,
        role: "assistant",
        sources,
        usage,
        time: timeSpentMs,
      });
    },
  });

  stream.consumeStream();

  return stream.toUIMessageStreamResponse();
}
