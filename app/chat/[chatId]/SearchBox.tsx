"use client";
import { AutosizeTextAreaRef } from "@/components/ui/auto-size-textarea";
import { Button } from "@/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input";
import { useElementSize, useHotkeys, useLocalStorage } from "@mantine/hooks";
import { ArrowDown, ArrowUp, LucidePaperclip, Square } from "lucide-react";
import { RefObject, useEffect, useRef, useState } from "react";
import { useFileDialog } from "@mantine/hooks";
import { ClientSideAttachment, useAttachments } from "@/hooks/use-attachments";
import Attachments from "@/components/attachments/Attachment";

export interface SearchBoxData {
  text: string;
  attachments: ClientSideAttachment[];
}

export interface SearchBoxProps {
  initialData?: SearchBoxData;
  closeEditMode?: () => void;
  submit: (searchBoxData: SearchBoxData) => Promise<void>;
  ref?: RefObject<HTMLDivElement>;
  goToBottom?: {
    scrollIntoView: (params: { alignment: "center" | "start" | "end" }) => void;
  };
}

export function FloatingSearchBox(props: SearchBoxProps) {
  return (
    <div className="w-full mx-auto absolute bottom-0 m-auto max-w-[800px] w-[95vw]">
      <SearchBox {...props} />
    </div>
  );
}

function SearchBox(props: SearchBoxProps) {
  // Load localstorage
  const [cachedSearcBoxData, setCachedSearchBoxData] = useLocalStorage({
    defaultValue: JSON.stringify({
      text: "",
      attachments: [],
    }),
    key: "chatik-search",
    getInitialValueInEffect: false,
  });

  // Refs
  const searchbox = useElementSize();
  const searchBoxRef = useRef<AutosizeTextAreaRef>(null);

  // States
  const [searchBoxInFocus, setSearchBoxInFocus] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchBoxData, setSearchBoxData] = useState<SearchBoxData>(
    props.initialData ?? JSON.parse(cachedSearcBoxData),
  );

  // File Picker
  const {
    handleBatchFileUplaods,
    attachments,
    handleDeleteAttachmentById,
    clearAttachments,
  } = useAttachments({
    initialAttachments: searchBoxData.attachments,
  });
  const pdfInput = useFileDialog({
    accept: "application/pdf",
    onChange: async (files: FileList | null) => {
      searchBoxRef.current?.textArea.focus();
      if (!files) return;
      await handleBatchFileUplaods(files);
    },
  });
  const imageInput = useFileDialog({
    accept: "image/jpeg,image/jpg,image/png",
    onChange: async (files: FileList | null) => {
      searchBoxRef.current?.textArea.focus();
      if (!files) return;
      await handleBatchFileUplaods(files);
    },
  });

  // Hotkeys
  useHotkeys([
    [
      "Tab",
      () => {
        if (document.activeElement !== searchBoxRef.current) {
          searchBoxRef.current?.textArea.focus();
        } else {
          document.getElementById("messages-container")?.focus();
        }
      },
    ],
  ]);

  const submit = async () => {
    if (loading) return;
    const submitPromise = props.submit(searchBoxData);
    const emptySearchBoxData = { text: "", attachments: [] };
    setSearchBoxData(emptySearchBoxData);
    setCachedSearchBoxData(JSON.stringify(emptySearchBoxData));
    clearAttachments();
    await submitPromise;
    setLoading(true);
    setLoading(false);
  };

  useEffect(() => {
    setSearchBoxData((prev) => ({ ...prev, attachments }));
    if (props.closeEditMode) return;
    setCachedSearchBoxData(
      JSON.stringify({
        text: searchBoxData.text,
        attachments,
      }),
    );
  }, [attachments]);

  return (
    <div ref={props.ref}>
      {props.goToBottom && (
        <div
          className="flex w-full justify-center my-2 absolute z-10"
          style={{
            bottom: `${searchbox.height}px`,
          }}
        >
          <span
            className="bg-black p-2 rounded-full border-1 cursor-pointer"
            onClick={() => {
              props.goToBottom?.scrollIntoView({
                alignment: "start",
              });
            }}
          >
            <ArrowDown />
          </span>
        </div>
      )}
      <div
        ref={searchbox.ref}
        className="relative w-full"
        onClick={() => {
          searchBoxRef?.current?.textArea.focus();
        }}
      >
        <PromptInput
          value={searchBoxData.text}
          onValueChange={(text) => {
            setSearchBoxData((d) => ({ ...d, text }));

            // Dont cache for edit mode
            if (props.closeEditMode) return;
            setCachedSearchBoxData(JSON.stringify({ ...searchBoxData, text }));
          }}
          isLoading={loading}
          onSubmit={submit}
          className={`w-full bg-zinc-800 ${searchBoxInFocus ? "border-1 border-primary" : ""}`}
        >
          <Attachments
            attachments={attachments}
            handleDeleteAttachmentById={handleDeleteAttachmentById}
          />
          <PromptInputTextarea
            className="bg-zinc-800 my-1"
            style={{
              background: "var(--color-zinc-800)",
            }}
            maxHeight={200}
            onFocusCapture={(e) => {
              e.stopPropagation();
              setSearchBoxInFocus(true);
            }}
            onBlur={() => {
              setSearchBoxInFocus(false);
            }}
            autoFocus
            ref={searchBoxRef}
            placeholder="Ask me anything..."
          />
          <PromptInputActions className="justify-between pt-1">
            <div>
              <Menubar className="p-0 bg-zinc-800 border-none">
                <MenubarMenu>
                  <MenubarTrigger className="bg-zinc-800 p-0">
                    <LucidePaperclip
                      style={{
                        rotate: "-35deg",
                      }}
                    />
                  </MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem onClick={pdfInput.open}>
                      PDF <MenubarShortcut>.pdf</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem onClick={imageInput.open}>
                      Image <MenubarShortcut>.png, .jpg, .jpeg</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem>
                      Yotube <MenubarShortcut></MenubarShortcut>
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            </div>
            <PromptInputAction
              tooltip={loading ? "Stop generation" : "Send message"}
            >
              {props.closeEditMode ? (
                <div className="flex gap-2 items-center mx-2">
                  <Button
                    onClick={props.closeEditMode}
                    size="sm"
                    variant="secondary"
                  >
                    Cancel
                  </Button>
                  <Button size="sm" onClick={submit}>
                    Edit
                  </Button>
                </div>
              ) : (
                <div
                  className="h-8 w-8 rounded-full bg-white flex items-center justify-center"
                  onClick={submit}
                >
                  {loading ? (
                    <Square color="black" className="size-5 fill-current" />
                  ) : (
                    <ArrowUp color="black" className="size-5" />
                  )}
                </div>
              )}
            </PromptInputAction>
          </PromptInputActions>
        </PromptInput>
      </div>
    </div>
  );
}

export default SearchBox;
