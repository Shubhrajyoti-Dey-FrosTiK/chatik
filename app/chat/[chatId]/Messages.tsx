import { UIMessage } from "ai";
import { RefObject, useEffect, useState } from "react";
import Message, { MessageLoading } from "./Message";

interface Props {
  messages: Array<UIMessage>;
  lastMessageRef: RefObject<HTMLDivElement>;
  scrollIntoView: () => void;
}

function Messages(props: Props) {
  const { messages, lastMessageRef, scrollIntoView } = props;
  const [lastUserMessageIdx, setLastUserMessageIdx] = useState<number>(0);

  const handleScroll = async () => {
    let newLastUserMessageIdx = 0;
    messages.forEach((message, idx) => {
      if (message.role == "user") newLastUserMessageIdx = idx;
    });

    setLastUserMessageIdx(newLastUserMessageIdx);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    scrollIntoView();
  };

  useEffect(() => {
    handleScroll();
  }, [messages.length]);

  return (
    <div className="w-full">
      {messages.map((message, midx) => (
        <div
          ref={midx == lastUserMessageIdx ? lastMessageRef : null}
          key={`Message_${message.id}`}
          className="w-full my-5"
        >
          {message.role == "user" && (
            <div className="flex w-full justify-end">
              <div className="bg-gray-800 max-w-[80%] px-4 py-2 rounded-sm">
                <Message message={message as UIMessage} />
              </div>
            </div>
          )}

          {message.role == "assistant" && (
            <div>
              <Message message={message as UIMessage} />
            </div>
          )}
        </div>
      ))}

      {messages.length && messages[messages.length - 1].role == "user" && (
        <MessageLoading />
      )}
    </div>
  );
}

export default Messages;
