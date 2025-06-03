"use client";
import {
  AutosizeTextarea,
  AutosizeTextAreaRef,
} from "@/components/input/textarea/auto-size-textarea";
import Spinner from "@/components/spinner/spinner";
import { getHotkeyHandler, useElementSize } from "@mantine/hooks";
import { ArrowDown, SendHorizontalIcon } from "lucide-react";
import { RefObject, useRef, useState } from "react";

export interface SearchBoxData {
  text: string;
}

export interface SearchBoxProps {
  submit: (searchBoxData: SearchBoxData) => Promise<void>;
  ref?: RefObject<HTMLDivElement>;
  goToBottom?: {
    scrollIntoView: (params: { alignment: "center" | "start" | "end" }) => void;
  };
}

export function FloatingSearchBox(props: SearchBoxProps) {
  const searchbox = useElementSize();

  return (
    <div
      ref={searchbox.ref}
      className="w-full mx-auto absolute bottom-0 m-auto max-w-[800px] w-[95vw]"
      style={{
        left: `calc(50% - ${(searchbox.width || 800) / 2}px)`,
      }}
    >
      <SearchBox {...props} />
    </div>
  );
}

function SearchBox(props: SearchBoxProps) {
  const [searchBoxInFocus, setSearchBoxInFocus] = useState<boolean>(false);
  const [searchBoxData, setSearchBoxData] = useState<SearchBoxData>({
    text: "",
  });
  const searchBoxRef = useRef<AutosizeTextAreaRef>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const submit = async () => {
    if (loading) return;
    setSearchBoxData({
      text: "",
    });
    setLoading(true);
    await props.submit(searchBoxData);
    setLoading(false);
  };

  return (
    <div>
      {props.goToBottom && (
        <div className="flex w-full justify-center my-2 relative z-10">
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
        ref={props.ref}
        className="relative w-full"
        onClick={() => {
          searchBoxRef?.current?.textArea.focus();
        }}
      >
        <div
          className={`bg-zinc-800 p-5 rounded-md w-full relative z-20 ${searchBoxInFocus ? "border-1 border-primary" : ""}`}
        >
          <AutosizeTextarea
            ref={searchBoxRef}
            maxHeight={200}
            onFocusCapture={(e) => {
              e.stopPropagation();
              setSearchBoxInFocus(true);
            }}
            onBlur={() => {
              setSearchBoxInFocus(false);
            }}
            value={searchBoxData.text}
            onChange={(e) => {
              setSearchBoxData({ ...searchBoxData, text: e.target.value });
            }}
            onKeyDown={getHotkeyHandler([["Enter", submit]])}
            placeholder="Search anything..."
            className="border-none bg-transparent resize-none focus:outline-none text-md"
          />
          <div className="flex items-center justify-between">
            <div></div>
            {loading ? (
              <Spinner size={20} />
            ) : (
              <SendHorizontalIcon onClick={submit} className="cursor-pointer" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchBox;
