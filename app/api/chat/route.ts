import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { MessagePart } from "@/convex/schema/message";
import { getConvexClient } from "@/lib/convex";
import { google } from "@ai-sdk/google";
import {
  convertToModelMessages,
  smoothStream,
  streamText,
  UIMessage,
} from "ai";
import { Infer } from "convex/values";
import { NextRequest } from "next/server";

const convex = getConvexClient();

export interface NewMessageInChatRequest {
  chatId: string;
  messages: UIMessage<{ lastMessageId: string }>[];
  messageChainIds: string[];
}

export async function POST(request: NextRequest) {
  const { chatId, messages, messageChainIds }: NewMessageInChatRequest =
    await request.json();
  const start = Date.now();

  for (const message of messages) {
    if (message.parts) {
      for (const part of message.parts) {
        if (part.type === "file" && part.url) {
          // Fetch the file and convert to base64
          const response = await fetch(part.url);
          const arrayBuffer = await response.arrayBuffer();
          const base64 = Buffer.from(arrayBuffer).toString("base64");
          // Replace the url with base64 data
          part.url = `data:${response.headers.get("content-type")};base64,${base64}`;
        }
      }
    }
  }

  const result = streamText({
    system: `
    Answer the questions of the user very elaboratively
    Try not to go above 1000 words
    Note:
    Use mathjax syntax to denote mathematical equations
    `,
    model: google("gemini-2.0-flash-001"),
    maxOutputTokens: 1200,
    messages: convertToModelMessages(messages),
    experimental_transform: smoothStream(),
    async onFinish({ content, sources, usage }) {
      const end = Date.now();
      const timeSpentMs = end - start;

      const newMessageId = await convex.mutation(api.messages.create, {
        chatId: chatId as Id<"chats">,
        role: "assistant",
        prevMessage: messageChainIds[messageChainIds.length - 1] as
          | Id<"messages">
          | undefined,
        parts: content as Infer<typeof MessagePart>[],
        sources,
        usage,
        time: timeSpentMs,
      });

      await convex.mutation(api.chats.updateChatMessageChain, {
        chainIds: [...messageChainIds, newMessageId] as Id<"messages">[],
        id: chatId as Id<"chats">,
      });
    },
  });

  result.consumeStream();

  return result.toUIMessageStreamResponse();
}
