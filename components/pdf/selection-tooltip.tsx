import {
  HighlightLayer,
  HighlightRect,
  SelectionTooltip as PDFSelectionTooltip,
  usePdf,
  useSelectionDimensions,
} from "@anaralabs/lector";
import { IconQuoteFilled } from "@tabler/icons-react";
import { Highlighter } from "lucide-react";
import { Button } from "../ui/button";

export const SelectionTooltip = ({
  onHighlight,
  onQuote,
}: {
  onHighlight: () => void;
  onQuote: () => void;
}) => {
  return (
    <PDFSelectionTooltip>
      <div className="mb-10">
        <div className="flex gap-2 cursor-pointer bg-black rounded-md items-center">
          <Button
            variant="secondary"
            className="flex items-center gap-2 px-3 py-1"
            onClick={onQuote}
          >
            <IconQuoteFilled size={15} />
            <div className="text-white bg-transperant">Quote</div>
          </Button>
          <Button
            onClick={onHighlight}
            variant="secondary"
            className="flex items-center gap-2 px-3 py-1"
          >
            <Highlighter size={15} />
            <div className="text-white bg-transperant">Highlight</div>
          </Button>
        </div>
      </div>
    </PDFSelectionTooltip>
  );
};

export interface SelectionData {
  highlights: HighlightRect[];
  text: string;
  isCollapsed: boolean;
  pageNumber: number;
}

export interface Props {
  onSelect: (data: SelectionData) => void;
}

export const Highlight = (props: Props) => {
  const pageNumber = usePdf((state) => state.currentPage);
  const selectionDimensions = useSelectionDimensions();
  const setHighlights = usePdf((state) => state.setHighlight);

  const handleHighlight = () => {
    const dimension = selectionDimensions.getDimension();
    if (dimension && !dimension.isCollapsed) {
      setHighlights(dimension.highlights);
    }
  };

  return (
    <>
      {selectionDimensions && (
        <SelectionTooltip
          onHighlight={handleHighlight}
          onQuote={() => {
            props.onSelect({
              ...selectionDimensions.getSelection(),
              pageNumber,
            });
          }}
        />
      )}
      <HighlightLayer className="bg-yellow-200/40" />
    </>
  );
};
