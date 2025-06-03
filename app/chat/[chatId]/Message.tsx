import { Skeleton } from "@/components/ui/skeleton";
import { MessageSchema } from "@/convex/schema";
import { Infer } from "convex/values";
import { Suspense, useRef } from "react";
import { MessageTools } from "./MessageTools";
import "./message.css";
import dynamic from "next/dynamic";

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
}

export function Message(props: MessageProps) {
  const { message } = props;
  const messageRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative">
      <MessageTools {...props} messageRef={messageRef} />
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
                <Suspense
                  fallback={
                    <span className="message-suspense">{part.text}</span>
                  }
                >
                  <MemoizedMarkdown
                    id={message.id}
                    key={`${message.id}_${partIdx}`}
                    markdown={part.text}
                  />
                </Suspense>
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
    </div>
  );
}
