import {
  calculateHighlightRects,
  SearchResult,
  usePdf,
  usePdfJump,
  useSearch,
} from "@anaralabs/lector";
import { getHotkeyHandler, useDebouncedCallback } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "../ui/button";

export interface Props {
  closeSearchInput: () => void;
  darkMode: boolean;
}

// Search UI component
export function SearchUI(props: Props) {
  const [searchText, setSearchText] = useState("");
  const { searchResults: results, search } = useSearch();
  const getPdfPageProxy = usePdf((state) => state.getPdfPageProxy);
  const { jumpToHighlightRects } = usePdfJump();
  const [resultDisplayIndex, setResultDisplayIndex] = useState<number>(0);

  useEffect(() => {
    if (
      resultDisplayIndex < 0 ||
      resultDisplayIndex >= results.exactMatches.length
    )
      return;

    handleNextMatch(results.exactMatches[resultDisplayIndex]);
  }, [resultDisplayIndex]);

  const handleNextMatch = async (result: SearchResult) => {
    const pageProxy = getPdfPageProxy(result.pageNumber);
    const rects = await calculateHighlightRects(pageProxy, {
      pageNumber: result.pageNumber,
      text: result.text,
      matchIndex: result.matchIndex,
      searchText: searchText, // Pass searchText for exact term highlighting
    });
    jumpToHighlightRects(rects, "pixels");
  };

  const handleSearch = useDebouncedCallback(async (query: string) => {
    const results = search(query);
    if (!resultDisplayIndex && results.exactMatches.length) {
      handleNextMatch(results.exactMatches[0]);
    } else {
      setResultDisplayIndex(0);
    }
  }, 500);

  return (
    <div className="flex items-center">
      <div className="flex bg-zinc-200 items-center rounded-md pr-2">
        <div className="w-40">
          <Input
            size={20}
            type="text"
            autoFocus
            onChange={(e) => {
              setSearchText(e.target.value);
              handleSearch(e.target.value);
            }}
            onKeyDown={getHotkeyHandler([
              [
                "Enter",
                () => {
                  if (!results.exactMatches.length) return;
                  setResultDisplayIndex(
                    (prev) => (prev + 1) % results.exactMatches.length,
                  );
                },
              ],
            ])}
            placeholder="Search"
            className="rounded-lg h-8 selection:bg-purple-300 selection:text-purple-900 border-none focus:ring-0"
            style={{
              background: "var(--color-zinc-200)",
            }}
            onBlur={() => {
              if (!searchText || searchText == "") {
                props.closeSearchInput();
              }
            }}
          />
        </div>
        <X size={15} onClick={props.closeSearchInput} />
      </div>

      {results.exactMatches.length + results.fuzzyMatches.length > 0 && (
        <div className="flex items-center">
          <Button
            size="icon"
            className={`${props.darkMode ? "bg-zinc-300" : "bg-zinc-100"}`}
            disabled={resultDisplayIndex <= 0}
          >
            <ChevronLeft
              size={15}
              onClick={() => setResultDisplayIndex((prev) => prev - 1)}
            />
          </Button>
          <p className="whitespace-nowrap">
            {`${Math.min(results.exactMatches.length, resultDisplayIndex + 1)} of ${results.exactMatches.length}`}
          </p>

          <Button
            size="icon"
            className={`${props.darkMode ? "bg-zinc-300" : "bg-zinc-100"}`}
            disabled={resultDisplayIndex >= results.exactMatches.length - 1}
          >
            <ChevronRight
              size={15}
              onClick={() => setResultDisplayIndex((prev) => prev + 1)}
            />
          </Button>
        </div>
      )}
    </div>
  );
}
