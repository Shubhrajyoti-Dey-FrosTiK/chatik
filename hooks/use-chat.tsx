import { createMessageGraph, MessageGraph } from "@/app/chat/[chatId]/graph";
import { SearchBoxData } from "@/app/chat/[chatId]/SearchBox";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { MessagePart, MessageSchema } from "@/convex/schema/message";
import { dexie } from "@/lib/dexie";
import { UIMessage, useChat as useAISDKChat } from "@ai-sdk/react";
import { useMutation, useQuery } from "convex/react";
import { Infer } from "convex/values";
import { useEffect, useState } from "react";
import { convertClientSideAttachmentToMessageAttachment } from "./use-attachments";

interface Props {
  chatId: string;
}

export interface SwitchMessagePathsConfig {
  lastMessageId: string;
  oldMessageId: string;
  newMessageId: string;
}

function useChat(props: Props) {
  const { chatId } = props;

  // Convex States [Reactive]
  const chat = useQuery(api.chats.get, {
    id: chatId as Id<"chats">,
  });
  const allMessages = useQuery(api.messages.getByChatId, {
    chatId: chatId as Id<"chats">,
  });

  // Local States [Updated by convex states, AISDK, dexie]
  const [loading, setLoading] = useState<boolean>(true);
  const [chainIds, setChainIds] = useState<string[]>([]);
  const [messageGraph, setMessageGraph] = useState<MessageGraph>({ ROOT: [] });
  const [messageStore, setMessageStore] = useState<
    Record<string, Infer<typeof MessageSchema>>
  >({});

  // Convex states nutators
  const addUserMessage = useMutation(api.messages.create);
  const updateMessageChain = useMutation(api.chats.updateChatMessageChain);

  // AISDK
  const {
    messages: uiMessages,
    append: appendToUIMessages,
    setMessages: setUIMessages,
  } = useAISDKChat({
    chatId,
  });

  /**
   * When the page loads for the first time this triggers and populates the
   * uiMessages and chainIds from dexie.js
   */
  const loadCachedMessages = async () => {
    try {
      const allMessages = await dexie.messages
        .where("chatId")
        .equals(chatId)
        .toArray();
      allMessages.sort(
        (a, b) => (a._creationTime ?? 0) - (b._creationTime ?? 0),
      );
      const chainIds = (await dexie.chainIds.get(chatId))?.chainIds ?? [];

      await syncChatStates(chainIds, allMessages);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    loadCachedMessages();
  }, []);

  /**
   * This function is triggered only if the length of the message is 1.
   * Basically it is to handle the edge case of when the user has just created a chat with a messaage
   */
  const fetchInitialMessageResponse = async () => {
    if (!allMessages) return;
    await appendToUIMessages(
      {
        id: allMessages[0]._id,
        parts: allMessages[0].parts,
        role: allMessages[0].role as "user" | "assistant",
      },
      {
        body: {
          messageChainIds: [allMessages[0]._id],
        },
      },
    );
  };

  /**
   * This function triggers every time there is an update
   * to convex messages. This triggers in 2 scenarios:
   * - When the messages load in the first load cycle
   * - When the message streaming is finished and convex db gets updated by the backend
   */
  const handleMessageUpdates = async () => {
    if (!allMessages) return;
    setLoading(false);
    if (allMessages.length == 1) {
      dexie.messages.clear();
      fetchInitialMessageResponse();
    }
    const lastMessageId = allMessages[allMessages.length - 1]._id ?? "";
    await syncChatStates([...chainIds, lastMessageId], allMessages);
  };
  useEffect(() => {
    handleMessageUpdates();
  }, [allMessages?.length]);

  /**
   * This triggers when the convex db chat updates.
   * Mainly its for updating the chainIds
   */
  const handleChatUpdates = async () => {
    if (!chat) return;
    const chainIds = chat.chainIds ?? [];
    await syncChatStates(chainIds, allMessages ?? []);
  };
  useEffect(() => {
    handleChatUpdates();
  }, [chat]);

  const syncChatStates = async (
    chainIds: string[],
    allMessages: Infer<typeof MessageSchema>[],
  ) => {
    setChainIds(chainIds);
    const updatedMessageStore: Record<string, Infer<typeof MessageSchema>> = {};
    allMessages.forEach((m) => {
      updatedMessageStore[String(m._id) ?? ""] = m;
    });
    setMessageStore(updatedMessageStore);

    const updatedUIMessages: Infer<typeof MessageSchema>[] = [];
    chainIds.forEach((chainId) => {
      if (!updatedMessageStore[chainId]) return;
      updatedUIMessages.push(updatedMessageStore[chainId]);
    });
    setUIMessages(updatedUIMessages as any[]);
    setMessageGraph(createMessageGraph(allMessages));

    try {
      await Promise.all([
        dexie.chainIds.update(chatId, {
          chainIds,
        }),
        dexie.messages.bulkPut(allMessages),
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Function to submit a new message.
   */
  const submit = async (
    data: SearchBoxData,
    config?: { lastMessageId: string },
  ) => {
    const parts: Infer<typeof MessagePart>[] = [
      {
        type: "text",
        text: data.text,
      },
    ];
    if (data.attachments) {
      data.attachments.forEach((attachment) => {
        parts.push({
          type: "file",
          mediaType: attachment.contentType,
          url: attachment.url,
        });
      });
    }

    let resultantLastMessageId: Id<"messages"> | undefined = chainIds[
      chainIds.length - 1
    ] as Id<"messages">;
    if (config?.lastMessageId) {
      if (config.lastMessageId == "ROOT") resultantLastMessageId = undefined;
      else resultantLastMessageId = config?.lastMessageId as Id<"messages">;
    }

    const userMessageId = await addUserMessage({
      chatId: chatId as Id<"chats">,
      role: "user",
      parts,
      prevMessage: resultantLastMessageId,
      attachments: convertClientSideAttachmentToMessageAttachment(
        data.attachments,
      ),
    });

    const updatedChainIds = [];
    if (resultantLastMessageId) {
      for (const chainId of chainIds) {
        updatedChainIds.push(chainId);
        if (chainId == String(resultantLastMessageId)) break;
      }
    }

    const updatedUIMessages: UIMessage[] = [];
    updatedChainIds.forEach((id) => {
      updatedUIMessages.push(messageStore[id] as any);
    });
    updatedChainIds.push(userMessageId); //  The new user message which is being submitted

    setUIMessages(updatedUIMessages);
    const appendPromise = appendToUIMessages(
      {
        id: userMessageId,
        role: "user",
        parts: parts,

        // At all times we need the prevMessageId to be there in all elements of UIMessage
        // esline-disable-next-line
        // @ts-ignore
        prevMessage: resultantLastMessageId,
      },
      {
        body: {
          messageChainIds: updatedChainIds,
        },
      },
    );

    await Promise.all([
      appendPromise,
      updateMessageChain({
        id: chatId as Id<"chats">,
        chainIds: updatedChainIds as Id<"messages">[],
      }),
      syncChatStates(updatedChainIds, [
        ...(allMessages ?? []),
        {
          _id: userMessageId as Id<"messages">,
          role: "user",
          parts: parts,
          chatId: chatId as Id<"chats">,
        },
      ]),
    ]);
  };

  /**
   * This function is responsible for updating only the
   * chainIds.
   * Its triggered when the user wants to shift to a different flow of messages which is already created.
   * No new messages are made in this
   */
  const switchMessagePaths = async (config: SwitchMessagePathsConfig) => {
    const updatedChainIds: string[] = [];

    // Preserve the prefix
    if (config.lastMessageId != "ROOT") {
      for (const chainId of chainIds) {
        if (chainId == config.oldMessageId) break;
        updatedChainIds.push(chainId);
      }
    }
    updatedChainIds.push(config.newMessageId);

    // Add the suffix
    let currentMessageId = config.newMessageId;
    while (true) {
      if (!messageGraph[currentMessageId]?.length) break;

      const nextMessageId = messageGraph[currentMessageId][0]._id ?? "";
      updatedChainIds.push(nextMessageId);
      currentMessageId = nextMessageId;
    }

    await updateMessageChain({
      id: chatId as Id<"chats">,
      chainIds: updatedChainIds as Id<"messages">[],
    });
    // Sync up
    await syncChatStates(updatedChainIds, allMessages ?? []);
  };

  return {
    uiMessages: uiMessages as any[] as Infer<typeof MessageSchema>[],
    submit,
    loading,
    messageGraph,
    switchMessagePaths,
  };
}

export default useChat;
