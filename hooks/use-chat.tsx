import { SearchBoxData } from "@/app/chat/[chatId]/SearchBox";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { MessageSchema } from "@/convex/schema";
import { dexie } from "@/lib/dexie";
import { useChat as useAISDKChat } from "@ai-sdk/react";
import { UIMessage } from "ai";
import { useMutation, useQuery } from "convex/react";
import { Infer } from "convex/values";
import { useEffect, useState } from "react";
import { v4 } from "uuid";

interface Props {
  chatId: string;
}

function useChat(props: Props) {
  const { chatId } = props;
  const [loading, setLoading] = useState<boolean>(true);
  const messages = useQuery(api.messages.getByChatId, {
    chatId: chatId as Id<"chats">,
  });
  const addUserMessage = useMutation(api.messages.create);
  const {
    messages: uiMessages,
    append,
    setMessages,
  } = useAISDKChat({
    chatId,
  });

  const loadCachedMessages = async () => {
    try {
      const messages = await dexie.messages
        .where("chatId")
        .equals(chatId)
        .toArray();

      // eslint-disable-next-line
      // @ts-ignore
      messages.sort((a, b) => a._creationTime - b._creationTime);
      setMessages(messages as UIMessage[]);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadCachedMessages();
  }, []);

  const fetchInitialMessageResponse = async () => {
    if (!messages) return;
    await append(messages[0] as any);
  };

  const handleMessageUpdates = async () => {
    if (!messages) return;
    setLoading(false);
    if (messages.length == 1) {
      fetchInitialMessageResponse();
    }

    setMessages(messages as UIMessage[]);
    await dexie.messages.bulkAdd(messages);
  };

  useEffect(() => {
    handleMessageUpdates();
  }, [messages]);

  const submit = async (data: SearchBoxData) => {
    const newMessageId = v4();
    const message: UIMessage = {
      parts: [
        {
          type: "text",
          text: data.text,
        },
      ],
      id: newMessageId,
      role: "user",
    };
    await Promise.all([
      append(message),
      addUserMessage({
        chatId: chatId as Id<"chats">,
        id: message.id,
        role: "user",
        parts: message.parts as any,
      }),
    ]);
  };

  return {
    uiMessages: uiMessages as any[] as Infer<typeof MessageSchema>[],
    submit,
    loading,
  };
}

export default useChat;
