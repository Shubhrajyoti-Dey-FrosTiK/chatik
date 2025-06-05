"use client";
import { GlobalWorkerOptions } from "pdfjs-dist";
import { Root, Pages, Page as PDFPage, CanvasLayer } from "@anaralabs/lector";
import "pdfjs-dist/web/pdf_viewer.css";

// Set up the worker
GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export default function PDFViewer() {
  return (
    <div>
      <Root source="/test.pdf">
        <Pages className="dark:invert-[94%] dark:hue-rotate-180 dark:brightness-[80%] dark:contrast-[228%]">
          <PDFPage>
            <CanvasLayer />
          </PDFPage>
        </Pages>
      </Root>
    </div>
  );
}
