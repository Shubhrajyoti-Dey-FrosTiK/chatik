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
import { convertMessageAttachmentToClientSideAttachment } from "@/hooks/use-attachments";
import { useClipboard } from "@mantine/hooks";
import { IconReload } from "@tabler/icons-react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Edit2,
  Info,
} from "lucide-react";
import { memo, RefObject } from "react";
import { MessageProps } from "./Message";

export const MessageTools = memo(
  (
    props: MessageProps & {
      messageRef: RefObject<HTMLDivElement | null>;
      toggleEditMode: () => void;
    },
  ) => {
    const {
      message,
      messageRef,
      toggleEditMode,
      submit,
      switchMessagePaths,
      messageChoices,
    } = props;
    const { copy, copied } = useClipboard();
    const choiceNumber = messageChoices.findIndex(
      (choice) => choice._id === message._id,
    );

    return (
      <div
        className={`absolute z-2 rounded-md px-3 py-2 bg-zinc-700 ${message.role == "user" ? "right-0" : "left-3"} opacity-0 flex items-center gap-5 group-hover:opacity-100 transition-opacity`}
        style={{
          bottom: "-45px",
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

        {message.role == "user" && <Edit2 size={15} onClick={toggleEditMode} />}

        {message.role == "user" && (
          <IconReload
            size={15}
            onClick={async () => {
              await submit(
                {
                  text:
                    message.parts[0].type == "text"
                      ? message.parts[0].text
                      : "",
                  attachments: convertMessageAttachmentToClientSideAttachment(
                    message.attachments ?? [],
                  ),
                },
                {
                  lastMessageId: message.prevMessage ?? "ROOT",
                },
              );
            }}
          />
        )}

        {message.role == "user" && props.messageChoices.length > 1 && (
          <div className="flex gap-2 items-center">
            <ChevronLeft
              size={15}
              className={`${choiceNumber == 0 && "opacity-25"}`}
              onClick={async () => {
                if (choiceNumber == 0) return;
                await switchMessagePaths({
                  lastMessageId: message.prevMessage ?? "",
                  newMessageId: messageChoices[choiceNumber - 1]?._id ?? "",
                  oldMessageId: message._id ?? "",
                });
              }}
            />
            <p>
              {choiceNumber + 1}/{props.messageChoices.length}
            </p>
            <ChevronRight
              size={15}
              className={`${choiceNumber == props.messageChoices.length - 1 && "opacity-25"}`}
              onClick={async () => {
                if (choiceNumber == messageChoices.length - 1) return;
                await switchMessagePaths({
                  lastMessageId: message.prevMessage ?? "",
                  newMessageId: messageChoices[choiceNumber + 1]?._id ?? "",
                  oldMessageId: message._id ?? "",
                });
              }}
            />
          </div>
        )}

        {message.time != undefined && (
          <div className="m-0 text-xs">{(message.time / 1000).toFixed(2)}s</div>
        )}
      </div>
    );
  },
);

MessageTools.displayName = "MessageTools";
