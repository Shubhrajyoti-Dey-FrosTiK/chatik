import Attachments from "@/components/attachments/Attachment";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSchema } from "@/convex/schema/message";
import { convertMessageAttachmentToClientSideAttachment } from "@/hooks/use-attachments";
import { SwitchMessagePathsConfig } from "@/hooks/use-chat";
import { Infer } from "convex/values";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { MessageTools } from "./MessageTools";
import SearchBox, { SearchBoxData } from "./SearchBox";
import "./message.css";

const MemoizedMarkdown = dynamic(() =>
  import("@/components/markdown/Markdown").then((mod) => mod.MemoizedMarkdown),
);

export function MessageLoading() {
  return (
    <div className="h-full w-full">
      <Skeleton className="h-5 w-50 my-2" />
      <Skeleton className="h-5 w-full my-2" />
      <Skeleton className="h-5 w-full my-2" />
      <Skeleton className="h-5 w-70 my-2" />
    </div>
  );
}

export interface MessageProps {
  message: Infer<typeof MessageSchema>;
  messageChoices: Infer<typeof MessageSchema>[];
  submit: (
    SearchBoxData: SearchBoxData,
    config?: { lastMessageId: string },
  ) => Promise<void>;
  switchMessagePaths: (config: SwitchMessagePathsConfig) => Promise<void>;
}

export function Message(props: MessageProps) {
  const { message } = props;
  const [editMode, setEditMode] = useState<boolean>(false);
  const messageRef = useRef<HTMLDivElement>(null);

  const submitEdit = async (searchBoxData: SearchBoxData) => {
    setEditMode(false);
    props.submit(searchBoxData, {
      lastMessageId: message.prevMessage ?? "ROOT",
    });
  };

  return (
    <div className={`${message.role == "user" && "max-w-[80%]"}`}>
      {editMode == false && (
        <Attachments
          attachments={convertMessageAttachmentToClientSideAttachment(
            message.attachments ?? [],
          )}
        />
      )}
      <div
        className={`w-full flex ${message.role == "user" ? "justify-end" : "justify-start"} my-1`}
      >
        <div
          className={`${message.role == "user" && !editMode && "bg-gray-700"} relative px-4 py-2 rounded-sm`}
        >
          {editMode == false && (
            <MessageTools
              {...props}
              messageRef={messageRef}
              toggleEditMode={() => {
                setEditMode((prev) => !prev);
              }}
            />
          )}
          {editMode ? (
            <div className="min-w-[500px]">
              <SearchBox
                initialData={{
                  text: messageRef.current?.innerText ?? "",
                  attachments: convertMessageAttachmentToClientSideAttachment(
                    message.attachments ?? [],
                  ),
                }}
                submit={submitEdit}
                closeEditMode={() => setEditMode(false)}
              />
            </div>
          ) : (
            <div
              className={`leading-5 text-lg message ${message.role}`}
              ref={messageRef}
            >
              {message.parts.map((part, partIdx) => {
                switch (part.type) {
                  case "file":
                    <div>{part.filename}</div>;
                    break;
                  case "text":
                    return (
                      <MemoizedMarkdown
                        key={`${message._id}_${partIdx}`}
                        id={message._id ?? ""}
                        markdown={part.text}
                      />
                    );
                  case "reasoning":
                    return (
                      <div>
                        Reasoning:
                        <p>{part.text}</p>
                      </div>
                    );

                  default:
                    return null;
                }
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
