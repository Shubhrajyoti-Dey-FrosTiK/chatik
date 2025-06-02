import { MemoizedMarkdown } from "@/components/markdown/Markdown";
import { Skeleton } from "@/components/ui/skeleton";
import { UIMessage } from "ai";
import React from "react";
import "./message.css";

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

interface Props {
  message: UIMessage;
}

function Message(props: Props) {
  const { message } = props;

  return (
    <div className="leading-5 text-lg message">
      {message.parts.map((part, partIdx) => {
        switch (part.type) {
          case "file":
            <div>{part.filename}</div>;
            break;
          case "text":
            return (
              <MemoizedMarkdown
                id={message.id}
                key={`${message.id}_${partIdx}`}
                markdown={part.text}
              />
              // JSON.stringify(message)
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
  );
}

export default Message;
