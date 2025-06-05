import { usePdf, usePdfJump } from "@anaralabs/lector";
import { useDebouncedCallback, useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";

function PageNumber() {
  const { currentPage, setCurrentPage, pdfDocumentProxy } = usePdf(
    (state) => state,
  );
  const { jumpToPage } = usePdfJump();
  const [pageNumber, setpageNumber] = useState<number | undefined>(currentPage);
  const changePage = useDebouncedCallback((pageNumber) => {
    setCurrentPage(pageNumber);
    jumpToPage(pageNumber);
  }, 500);
  const [pageNumberInputOpened, pageNumberInputControls] = useDisclosure();

  useEffect(() => {
    setpageNumber(currentPage);
  }, [currentPage]);

  return (
    <div
      className="flex items-center gap-1"
      onClick={() => {
        if (!pageNumberInputOpened) pageNumberInputControls.open();
      }}
    >
      <p>Page:</p>
      {pageNumberInputOpened ? (
        <Input
          className="w-10 rounded-md p-1"
          type="number"
          height={30}
          autoFocus
          value={pageNumber}
          onBlur={() => {
            if (!pageNumber) {
              setpageNumber(currentPage);
            }
            pageNumberInputControls.close();
          }}
          onChange={(e) => {
            if (!e.target.value) {
              setpageNumber(undefined);
              return;
            }
            const newPageNumber = Math.max(
              Math.min(pdfDocumentProxy.numPages, Number(e.target.value ?? 1)),
              1,
            );
            setpageNumber(newPageNumber);
            changePage(newPageNumber);
          }}
        />
      ) : (
        <p className="cursor-pointer">{pageNumber}</p>
      )}
      <p>/</p>
      <p>{pdfDocumentProxy.numPages}</p>
    </div>
  );
}

export default PageNumber;
