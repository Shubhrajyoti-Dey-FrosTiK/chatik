"use client";

import LandingPage from "@/components/landing-page/landing-page";
import Spinner from "@/components/spinner/spinner";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { authClient } from "@/lib/authClient";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import SearchBox, { SearchBoxData } from "./chat/[chatId]/SearchBox";
import { dexie } from "@/lib/dexie";
import { Infer } from "convex/values";
import { MessagePart } from "@/convex/schema/message";
import { convertClientSideAttachmentToMessageAttachment } from "@/hooks/use-attachments";

export default function Home() {
  const { data: session, isPending } = authClient.useSession();
  const createChat = useMutation(api.chats.create);
  const router = useRouter();

  const createNewChat = async (data: SearchBoxData) => {
    const parts: Infer<typeof MessagePart>[] = [
      { type: "text", text: data.text },
      ...data.attachments.map((attachment) => {
        return {
          type: "file" as const,
          mediaType: attachment.contentType,
          url: attachment.url,
        };
      }),
    ];
    const { chatId, messageId } = await createChat({
      name: data.text,
      parts,
      user: (session?.user.id ?? "") as Id<"user">,
      attachments: convertClientSideAttachmentToMessageAttachment(
        data.attachments,
      ),
    });
    await Promise.all([
      dexie.messages.add({
        chatId: chatId as Id<"chats">,
        role: "user",
        _id: messageId as Id<"messages">,
        attachments: data.attachments,
        parts,
      }),
      dexie.chainIds.put({
        chatId: chatId as Id<"chats">,
        chainIds: [messageId],
      }),
    ]);

    router.push(`/chat/${chatId}`);
  };

  return (
    <main className="flex flex-col items-center justify-between h-full">
      {isPending ? (
        <div className="h-full flex items-center">
          <Spinner />
        </div>
      ) : (
        <div className="w-full h-full">
          {session ? (
            <div className="h-full w-full flex items-center">
              <div className="max-w-[800px] w-[95vw] pb-[200px] m-auto text-center">
                <p className="text-5xl my-10 font-bold ">ChaTiK</p>
                <SearchBox submit={createNewChat} />
              </div>
            </div>
          ) : (
            <LandingPage />
          )}
        </div>
      )}
    </main>
  );
}
