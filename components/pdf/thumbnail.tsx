import {
  Thumbnails,
  Thumbnail as PageThumbnail,
  usePdf,
} from "@anaralabs/lector";

function Thumbnail() {
  const pageNumber = usePdf((state) => state.currentPage);
  return (
    <div className="overflow-y-auto overflow-x-hidden">
      <div className="w-full overflow-x-hidden">
        <Thumbnails className="flex flex-col items-center py-4 pl-2 pr-4">
          <PageThumbnail
            pageNumber={pageNumber}
            className="transition-all w-full [&>div]:min-h-0 hover:shadow-lg hover:outline hover:outline-gray-300 hover:border-1 cursor-pointer rounded-md border-1 border-zinc-800 min-h-0"
          />
        </Thumbnails>
      </div>
    </div>
  );
}

export default Thumbnail;
