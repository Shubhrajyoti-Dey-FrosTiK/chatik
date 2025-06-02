"use client";
import useChat from "@/hooks/use-chat";
import {
  useElementSize,
  useInViewport,
  useScrollIntoView,
} from "@mantine/hooks";
import { useEffect } from "react";
import { MessageLoading } from "./Message";
import Messages from "./Messages";
import { FloatingSearchBox } from "./SearchBox";

interface Props {
  chatId: string;
}

function Chat(props: Props) {
  const { chatId } = props;
  const { uiMessages, submit, loading } = useChat({ chatId });
  const searchbox = useElementSize();
  const { scrollIntoView, targetRef, scrollableRef } = useScrollIntoView<
    HTMLDivElement,
    HTMLDivElement
  >({});
  const { ref: bottomElementRef, inViewport: hasBottomReached } =
    useInViewport<HTMLDivElement>();

  useEffect(() => {
    if (!scrollableRef.current) return;

    window.addEventListener("scroll", (event) => {
      console.log(event);
    });
  }, [scrollableRef]);

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
                  lastMessageRef={targetRef}
                  messages={uiMessages}
                  bottomElementRef={bottomElementRef}
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
