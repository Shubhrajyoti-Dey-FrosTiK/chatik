"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import {
  AnnotationLayer,
  CanvasLayer,
  Page,
  Pages,
  Root,
  Search,
  TextLayer,
} from "@anaralabs/lector";
import { useDisclosure } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { Columns2, PanelRightOpen } from "lucide-react";
import { GlobalWorkerOptions } from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";
import { useState } from "react";
import Spinner from "../spinner/spinner";
import PageNumber from "./page-number";
import { SearchUI } from "./search";
import { Highlight } from "./selection-tooltip";
import ThemeSwitch from "./theme-switch";
import Thumbnail from "./thumbnail";
import Zoom from "./zoom";

// Set up the worker
GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export default function PDFViewer() {
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [darkMode, darkModeControls] = useDisclosure();
  const [searchInputOpened, searchControls] = useDisclosure();

  return (
    <div>
      <Root
        source="/test.pdf"
        className={`bg-gray-100 border rounded-md overflow-hidden relative h-[700px] flex flex-col justify-stretch ${darkMode && "dark:invert-[88%] dark:hue-rotate-180 dark:brightness-[80%] dark:contrast-[228%]"}`}
        loader={
          <div className="h-full w-full flex justify-center items-center">
            <Spinner color="black" />
          </div>
        }
      >
        {/* Control Bar */}
        <div
          className={`${darkMode ? "bg-zinc-300" : "bg-zinc-100"} border-b p-1 px-4 flex items-center justify-between text-sm text-gray-600 gap-2`}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowThumbnails((show) => !show)}
              className="px-2 hover:bg-gray-300 hover:text-gray-900 py-1 rounded-full"
            >
              {showThumbnails ? (
                <PanelRightOpen size={15} />
              ) : (
                <Columns2 size={15} />
              )}
            </button>
            <PageNumber />
          </div>
          {!searchInputOpened ? (
            <Zoom />
          ) : (
            <Search>
              <SearchUI
                darkMode={darkMode}
                closeSearchInput={searchControls.close}
              />
            </Search>
          )}
          <div className="flex items-center gap-2">
            {!searchInputOpened && (
              <IconSearch size={15} onClick={searchControls.open} />
            )}
            <ThemeSwitch
              darkMode={darkMode}
              toggleMode={darkModeControls.toggle}
            />
          </div>
        </div>

        {/* Main Content */}
        <div
          className={cn(
            "basis-0 grow min-h-0 relative grid",
            "transition-all duration-300",
            "flex gap-2",
          )}
        >
          <ResizablePanelGroup direction="horizontal">
            {showThumbnails && (
              <>
                <ResizablePanel
                  defaultSize={20}
                  className="h-inherit"
                  style={{
                    overflowY: "scroll",
                    borderRight: `2px solid var(--color-zinc-${darkMode ? "300" : "100"})`,
                  }}
                >
                  {/* Thumbnails Panel */}
                  <Thumbnail />
                </ResizablePanel>
                <ResizableHandle withHandle />
              </>
            )}
            <ResizablePanel>
              {/* PDF Viewer */}
              <Pages className={`p-4 h-full ${darkMode && "bg-zinc-300"}`}>
                <Page>
                  <CanvasLayer />
                  <TextLayer />
                  <AnnotationLayer />
                  <Highlight
                    onSelect={(data) => {
                      console.log(data);
                    }}
                  />
                </Page>
              </Pages>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </Root>
    </div>
  );
}
