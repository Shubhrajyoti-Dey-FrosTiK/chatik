"use client";
import useChat from "@/hooks/use-chat";
import { useElementSize, useScrollIntoView } from "@mantine/hooks";
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
  return (
    <div className="h-full">
      <FloatingSearchBox ref={searchbox.ref} submit={submit} />
      {loading ? (
        <div className="h-full m-auto max-w-[800px] w-[95vw]">
          <MessageLoading />
        </div>
      ) : (
        <div>
          {uiMessages?.length ? (
            <div
              ref={scrollableRef}
              className="overflow-scroll"
              style={{
                height: `calc(100dvh - ${(searchbox.height || 60) + 60}px)`,
              }}
            >
              <div className="m-auto max-w-[800px] w-[95vw] h-full">
                <Messages
                  scrollIntoView={scrollIntoView}
                  lastMessageRef={targetRef}
                  messages={uiMessages}
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
