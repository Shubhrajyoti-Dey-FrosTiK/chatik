"use client";
import { BackgroundGradient } from "@/components/acceternity/background-gradient";
import { AutosizeTextarea } from "@/components/input/textarea/auto-size-textarea";
import { useElementSize } from "@mantine/hooks";
import { SendHorizontalIcon } from "lucide-react";
import { useState } from "react";

function SearchBox() {
  const searchbox = useElementSize();
  const [searchBoxInFocus, setSearchBoxInFocus] = useState<boolean>(false);

  return (
    <div
      ref={searchbox.ref}
      className="m-2 max-w-[800px] w-[95vw] mx-auto absolute bottom-5"
      style={{
        left: `calc(50% - ${(searchbox.width || 800) / 2}px)`,
      }}
    >
      <BackgroundGradient enable={searchBoxInFocus}>
        <div className="bg-gray-900 p-5 rounded-md ">
          <AutosizeTextarea
            maxHeight={200}
            onFocusCapture={() => {
              setSearchBoxInFocus(true);
            }}
            onBlur={() => {
              setSearchBoxInFocus(false);
            }}
            placeholder="Search anything..."
            className="border-none bg-transperant resize-none"
          />
          <div className="flex items-center justify-between">
            <div></div>
            <SendHorizontalIcon />
          </div>
        </div>
      </BackgroundGradient>
    </div>
  );
}

export default SearchBox;
