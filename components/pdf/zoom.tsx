import { usePdf } from "@anaralabs/lector";
import { useDebouncedCallback, useDisclosure } from "@mantine/hooks";
import { ZoomInIcon, ZoomOutIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";

function Zoom() {
  const { zoom, updateZoom, zoomFitWidth } = usePdf((state) => state);
  const [currentZoom, setCurrentZoom] = useState<number | undefined>(
    zoom * 100,
  );
  const [zoomInputOpened, zoomInputControls] = useDisclosure();

  const changeZoomLevel = useDebouncedCallback((zoom: number) => {
    updateZoom(zoom / 100);
  }, 500);

  useEffect(() => {
    zoomFitWidth();
  }, []);

  useEffect(() => {
    setCurrentZoom(zoom * 100);
  }, [zoom]);

  return (
    <div className="flex items-center gap-2">
      <ZoomOutIcon size={15} onClick={() => updateZoom(zoom - 0.15)} />
      {zoomInputOpened ? (
        <Input
          className="w-10 rounded-md p-1"
          type="number"
          height={30}
          autoFocus
          value={currentZoom ? Math.round(currentZoom) : undefined}
          onBlur={() => {
            if (!currentZoom) {
              setCurrentZoom(zoom);
            }
            zoomInputControls.close();
          }}
          onChange={(e) => {
            if (!e.target.value) {
              setCurrentZoom(undefined);
              return;
            }
            const newZoom = Math.max(
              Math.min(1000, Number(e.target.value ?? 100)),
              0,
            );
            setCurrentZoom(newZoom);
            changeZoomLevel(newZoom);
          }}
        />
      ) : (
        <p className="cursor-pointer" onClick={zoomInputControls.open}>
          {currentZoom ? Math.round(currentZoom) : undefined}%
        </p>
      )}
      <ZoomInIcon size={15} onClick={() => updateZoom(zoom + 0.15)} />
    </div>
  );
}

export default Zoom;
