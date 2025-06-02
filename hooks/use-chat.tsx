import { SearchBoxData } from "@/app/chat/[chatId]/SearchBox";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useChat as useAISDKChat } from "@ai-sdk/react";
import { UIMessage } from "ai";
import { useMutation, useQuery } from "convex/react";
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

  const fetchInitialMessageResponse = async () => {
    if (!messages) return;
    await append(messages[0] as any);
  };

  useEffect(() => {
    if (!messages) return;
    setLoading(false);

    if (messages.length == 1) {
      fetchInitialMessageResponse();
    }

    const newUIMessageState: UIMessage[] = [];
    for (const message of messages) {
      const uiMessage = uiMessages.filter((uim) => uim.id == message.id);
      if (uiMessage.length) {
        newUIMessageState.push(...uiMessage);
      } else {
        newUIMessageState.push(message as UIMessage);
      }
    }

    setMessages(newUIMessageState);
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

  return { uiMessages, submit, loading };
}

export default useChat;
