import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import { useClipboard } from "@mantine/hooks";
import { Check, Copy, Info } from "lucide-react";
import { memo, RefObject } from "react";
import { MessageProps } from "./Message";

export const MessageTools = memo(
  (props: MessageProps & { messageRef: RefObject<HTMLDivElement | null> }) => {
    const { message, messageRef } = props;
    const { copy, copied } = useClipboard();

    return (
      <div
        className={`absolute rounded-md px-3 py-2 bg-zinc-700 ${message.role == "user" ? "right-[-20px]" : "left-0"} opacity-0 flex items-center gap-5 group-hover:opacity-100 transition-opacity`}
        style={{
          bottom: "-40px",
        }}
      >
        {copied ? (
          <Check color="green" size={15} />
        ) : (
          <Copy
            size={15}
            onClick={() => {
              if (!messageRef?.current) return;
              copy(messageRef.current.innerText);
            }}
          />
        )}

        <HoverCard>
          {message.usage != undefined && (
            <HoverCardTrigger>
              <Info size={15} />
            </HoverCardTrigger>
          )}
          <HoverCardContent>
            <p className="my-1 font-bold text-md">Usage</p>
            <div>Input Tokens: {message.usage?.inputTokens}</div>
            <div>Output Tokens: {message.usage?.outputTokens}</div>
            <div>
              ReasoningTokens Tokens: {message.usage?.reasoningTokens ?? 0}
            </div>
            <div>
              Cached Input Tokens: {message.usage?.cachedInputTokens ?? 0}
            </div>
            <Separator className="h-10 my-1" color="white" />
            <div className="font-bold">
              Total Tokens: {message.usage?.totalTokens}
            </div>
          </HoverCardContent>
        </HoverCard>
        <Dialog>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Message Usage</DialogTitle>
              <DialogDescription>
                The following are the token usage of the message
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        {message.time != undefined && (
          <div className="m-0 text-xs">{(message.time / 1000).toFixed(2)}s</div>
        )}
      </div>
    );
  },
);

MessageTools.displayName = "MessageTools";
