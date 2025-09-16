import type { Stitch } from "../types/RowToStitchConverter";
import { useEffect, useRef } from "react";

function StitchTracker({
  atoms,
  currentIdx,
  onSetActive,
  onNext,
}: {
  atoms: Stitch[];            // (keep the type)
  currentIdx: number;
  onSetActive: (idx: number) => void;
  onNext: () => void;
}) {
  // SAFETY: normalize
  const items = Array.isArray(atoms) ? atoms : [];
  const safeIdx = Number.isFinite(currentIdx) ? currentIdx : 0;

  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = listRef.current?.querySelector(
      `[data-idx="${safeIdx}"]`
    ) as HTMLElement | null;
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [safeIdx]);

  const doneUntil = Math.min(safeIdx - 1, items.length - 1);

  return (
    <div className="h-full p-5 rounded-xl bg-zinc-100 dark:bg-zinc-900">
      <div ref={listRef} className="overflow-y-auto">
        {items.map((a) => {
          const isDone = a.index <= doneUntil;
          const isCurrent = a.index === safeIdx;
          return (
            <button
              key={a.index}
              data-idx={a.index}
              onClick={() => onSetActive(a.index)}
              className={[
                "block w-full text-left px-3 py-1 text-sm transition-colors",
                isCurrent && "bg-indigo-100 dark:bg-indigo-900/40 font-semibold",
                isDone && "text-zinc-400 line-through",
              ].filter(Boolean).join(" ")}
            >
              {a.label}
            </button>
          );
        })}
        {/* {items.length === 0 && (
          <div className="px-3 py-2 text-sm text-zinc-500">No stitches.</div>
        )}

         <div className="sticky bottom-0 border-t bg-white/90 dark:bg-zinc-900/80 p-2">
        <button
          onClick={onNext}
          className="w-full rounded bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-500 disabled:opacity-50"
          disabled={safeIdx >= items.length}
        >
          {safeIdx >= items.length ? "Finished 🎉" : "Next stitch"}
        </button>
      </div> */}
      </div>

     
    </div>
  );
}

export default StitchTracker;
