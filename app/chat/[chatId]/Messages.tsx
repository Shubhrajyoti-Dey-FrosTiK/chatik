import { MessageSchema } from "@/convex/schema";
import { Infer } from "convex/values";
import { RefObject, useEffect, useState } from "react";
import { Message, MessageLoading } from "./Message";

interface Props {
  messages: Array<Infer<typeof MessageSchema>>;
  lastMessageRef: RefObject<HTMLDivElement>;
  scrollIntoView: (params: { alignment: "center" | "start" | "end" }) => void;
  bottomElementRef: (node: HTMLDivElement) => void;
}

function Messages(props: Props) {
  const { messages, lastMessageRef, scrollIntoView, bottomElementRef } = props;
  const [lastMessageHeight, setLastMessageHeight] = useState<number>(50);

  const handleScroll = async () => {
    scrollIntoView({
      alignment: "start",
    });
  };

  useEffect(() => {
    if (lastMessageRef.current) {
      const height = lastMessageRef.current.offsetHeight;
      setLastMessageHeight(height);
    }
  }, [lastMessageRef.current]);

  useEffect(() => {
    handleScroll();
  }, [messages.length]);

  return (
    <div className="w-full h-full relative z-0">
      {messages.map((message, midx) => {
        const addExtraPadding =
          midx == messages.length - 1 && message.role == "assistant";
        return (
          <div
            // ref={midx == lastUserMessageIdx ? lastMessageRef : null}
            key={`Message_${message.id}`}
            className={`w-full ${message.role == "assistant" && "pb-10 pt-2"}`}
            style={{
              minHeight: addExtraPadding
                ? `calc(100% - ${lastMessageHeight + 50}px)`
                : "auto",
            }}
          >
            {message.role == "user" && (
              <div className="flex w-full justify-end">
                <div className="bg-gray-800 max-w-[80%] px-4 py-2 rounded-sm">
                  <Message message={message} />
                </div>
              </div>
            )}

            {message.role == "assistant" && (
              <div>
                <Message message={message} />
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
              minHeight: `calc(100% - ${lastMessageHeight + 50}px)`,
            }}
          >
            <MessageLoading />
          </div>
        )}
      <div ref={lastMessageRef}>
        <div ref={bottomElementRef}></div>
      </div>
    </div>
  );
}

export default Messages;
