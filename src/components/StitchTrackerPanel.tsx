import { useRef, useEffect } from "react";
import StitchTracker from "./StitchTracker";

export default function StitchTrackerPanel({
  width,
  setWidth,
}: {
  width: number;
  setWidth: (w: number) => void;
}) {
  const handleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = handleRef.current;
    if (!handle) return;

    let startX = 0;
    let startWidth = 0;

    const onMouseDown = (e: MouseEvent) => {
      startX = e.clientX;
      startWidth = width;
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
      const delta = startX - e.clientX;
      setWidth(Math.min(Math.max(startWidth + delta, 200), 500)); // clamp between 200–500 px
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    handle.addEventListener("mousedown", onMouseDown);
    return () => {
      handle.removeEventListener("mousedown", onMouseDown);
    };
  }, [width, setWidth]);

  return (
    <div
      className="relative bg-gray-100 dark:bg-gray-700 p-4 overflow-auto mt-20"
      style={{ width }}
    >
      {/* Resize handle — top left */}
      <div
        ref={handleRef}
        className="absolute top-0 left-0 h-4 w-4 cursor-ew-resize bg-zinc-300 dark:bg-zinc-600 hover:bg-zinc-400"
        title="Resize"
      />
      <h3 className="font-bold mb-2">Stitch Tracker</h3>
      <div>
        <StitchTracker/>
      </div>
      
    </div>
  );
}
