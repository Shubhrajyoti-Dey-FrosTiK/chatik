import { MessageSchema } from "@/convex/schema";
import { useElementSize } from "@mantine/hooks";
import { Infer } from "convex/values";
import { RefObject, useEffect, useState } from "react";
import { MessageGraph } from "./graph";
import { Message, MessageLoading } from "./Message";
import { SearchBoxData } from "./SearchBox";
import { SwitchMessagePathsConfig } from "@/hooks/use-chat";

interface Props {
  messages: Array<Infer<typeof MessageSchema>>;
  scrollRef: RefObject<HTMLDivElement>;
  scrollIntoView: (params: { alignment: "center" | "start" | "end" }) => void;
  bottomElementRef: (node: HTMLDivElement) => void;
  messageGraph: MessageGraph;
  submit: (
    SearchBoxData: SearchBoxData,
    config?: { lastMessageId: string },
  ) => Promise<void>;
  switchMessagePaths: (config: SwitchMessagePathsConfig) => Promise<void>;
}

function Messages(props: Props) {
  const {
    messages,
    scrollRef,
    scrollIntoView,
    bottomElementRef,
    messageGraph,
    submit,
    switchMessagePaths,
  } = props;
  const [lastUserMessageIdx, setLastUserMessageIdx] = useState<number>(0);
  const lastUserMessage = useElementSize<HTMLDivElement>();

  const handleScroll = async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    scrollIntoView({
      alignment: "start",
    });
  };

  useEffect(() => {
    let lastUserMessageIdx = 0;
    messages.forEach((message, midx) => {
      if (message.role == "user") lastUserMessageIdx = midx;
    });
    setLastUserMessageIdx(lastUserMessageIdx);
    handleScroll();
  }, [messages.length]);

  return (
    <div className="w-full h-full relative z-0">
      {messages.map((message, midx) => {
        const addExtraPadding =
          midx == messages.length - 1 && message.role == "assistant";
        return (
          <div
            ref={midx == lastUserMessageIdx ? lastUserMessage.ref : null}
            key={`Message_${midx}`}
            className={`w-full group ${message.role == "assistant" && "pb-10 pt-2"}`}
            style={{
              minHeight: addExtraPadding
                ? `calc(100% - ${lastUserMessage.height + 20}px)`
                : "auto",
            }}
          >
            {message.role == "user" && (
              <div className="flex w-full justify-end">
                <div className="bg-gray-800 max-w-[80%] px-4 py-2 rounded-sm">
                  <Message
                    submit={submit}
                    message={message}
                    messageChoices={messageGraph[message.prevMessage ?? "ROOT"]}
                    switchMessagePaths={switchMessagePaths}
                  />
                </div>
              </div>
            )}

            {message.role == "assistant" && (
              <div>
                <Message
                  message={message}
                  messageChoices={messageGraph[message.prevMessage ?? "ROOT"]}
                  submit={submit}
                  switchMessagePaths={switchMessagePaths}
                />
              </div>
            )}
          </div>
        );
      })}

      {messages.length &&
        (messages[messages.length - 1].role == "user" ||
          messages[messages.length - 1].parts.length == 0) && (
          <div
            style={{
              minHeight: `calc(100% - ${lastUserMessage.height + 25}px)`,
            }}
          >
            <MessageLoading />
          </div>
        )}
      <div ref={scrollRef} className="pb-5">
        <div ref={bottomElementRef}></div>
      </div>
    </div>
  );
}

export default Messages;
