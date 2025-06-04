"use client";
import useChat from "@/hooks/use-chat";
import {
  useElementSize,
  useInViewport,
  useScrollIntoView,
} from "@mantine/hooks";
import { MessageLoading } from "./Message";
import Messages from "./Messages";
import { FloatingSearchBox } from "./SearchBox";

interface Props {
  chatId: string;
}

function Chat(props: Props) {
  const { chatId } = props;
  const { uiMessages, submit, loading, messageGraph, switchMessagePaths } =
    useChat({ chatId });
  const searchbox = useElementSize();
  const { scrollIntoView, targetRef, scrollableRef } = useScrollIntoView<
    HTMLDivElement,
    HTMLDivElement
  >({
    duration: 400,
  });
  const { ref: bottomElementRef, inViewport: hasBottomReached } =
    useInViewport<HTMLDivElement>();

  return (
    <div className="h-full">
      <FloatingSearchBox
        ref={searchbox.ref}
        submit={submit}
        goToBottom={
          !hasBottomReached
            ? {
                scrollIntoView,
              }
            : undefined
        }
      />
      {loading ? (
        <div className="h-full m-auto max-w-[800px] w-[95vw]">
          <MessageLoading />
        </div>
      ) : (
        <div>
          {uiMessages?.length ? (
            <div
              id="messages"
              ref={scrollableRef}
              className="overflow-scroll no-scrollbar"
              style={{
                height: `calc(100dvh - ${(searchbox.height || 60) + 60}px)`,
              }}
            >
              <div className="m-auto max-w-[800px] w-[95vw] h-full">
                <Messages
                  scrollIntoView={scrollIntoView}
                  scrollRef={targetRef}
                  messages={uiMessages}
                  bottomElementRef={bottomElementRef}
                  messageGraph={messageGraph}
                  submit={submit}
                  switchMessagePaths={switchMessagePaths}
                />
              </div>
            </div>
          ) : (
            <div>No messages yet</div>
          )}
        </div>
      )}
    </div>
  );
}

export default Chat;
