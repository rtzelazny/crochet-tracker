import type { Stitch } from "../types/RowToStitchConverter";
import { useEffect, useRef } from "react";

function StitchTracker({
  atoms,
  currentIdx,
  onSetActive,
  onNext,
  onPrevious,
}: {
  atoms: Stitch[]; // keep the type!
  currentIdx: number; // current active stitch index
  onSetActive: (idx: number) => void; // when user jumps to a different stitch
  onNext: () => void; // when user clicks "next stitch"
  onPrevious: () => void; // when user clicks "previous stitch"
}) {
  // SAFETY: normalize!
  const items = Array.isArray(atoms) ? atoms : [];
  const safeIdx = Number.isFinite(currentIdx) ? currentIdx : 0;

  // the list container for all the stitches
  const listRef = useRef<HTMLDivElement | null>(null);

  const scrollChildToCenter = (list: HTMLElement, el: HTMLElement) => {
    // Compute el's Y position relative to the list
    const listRect = list.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const elTopInList = elRect.top - listRect.top + list.scrollTop;

    const targetTop =
      elTopInList - (list.clientHeight / 2 - el.clientHeight / 2);

    const maxTop = Math.max(0, list.scrollHeight - list.clientHeight);
    const clamped = Math.max(0, Math.min(targetTop, maxTop));

    list.scrollTo({ top: clamped, behavior: "smooth" });
  };

  // Center current stitch in the LIST (not the page)
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const el = list.querySelector(
      `[data-idx="${safeIdx}"]`
    ) as HTMLElement | null;
    if (el) scrollChildToCenter(list, el);
  }, [safeIdx, items.length]);

  // TODO: make current stitch always centered in view

  // show all done up to (not including) current
  const doneUntil = Math.min(safeIdx - 1, items.length - 1);

  return (
    <div className="h-full p-5 rounded-xl bg-zinc-200 dark:bg-zinc-900 flex flex-col">
      <h1 className="text-md font-semibold pb-5">Stitch Tracker</h1>
      {/* List of all the stitch atoms (one stitch per row) */}
      <div
        ref={listRef}
        className="flex-1 min-h-0 overflow-y-auto overscroll-none py-10 text-lg"
      >
        {/* Gutter space so first/last items can be centered */}
        <div className="pointer-events-none h-[35vh]" aria-hidden />

        {items.map((a) => {
          // mark if done/current
          const isDone = a.index <= doneUntil;
          const isCurrent = a.index === safeIdx;
          const isNext = a.index === safeIdx + 1;
          const isPrevious = a.index === safeIdx - 1;
          const isFuture = a.index > safeIdx + 1;
          return (
            <button
              key={a.index}
              data-idx={a.index} // for scrolling (to find in DOM)
              onClick={() => onSetActive(a.index)}
              className={[
                "block w-full px-3 py-1 text-zinc-600 transition-colors",
                isCurrent &&
                  "bg-indigo-100 dark:bg-indigo-900/40 font-semibold rounded-lg text-zinc-900 text-3xl py-3",
                isDone && "text-zinc-900/50",
                isFuture && "text-zinc-900/50",
                isNext && "text-zinc-900/70 text-2xl",
                isPrevious && "text-zinc-900/70 text-2xl",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {a.label} {isDone && <p className="flex inline-flex">✓</p>}
            </button>
          );
        })}
      </div>
      {/* Bottom gutter for centering last item */}
      <div className="pointer-events-none h-[2vh]" aria-hidden />

      {items.length === 0 && (
        <div className="px-3 py-2 text-sm text-zinc-500 text-center">
          {" "}
          Pattern is empty. Click the edit toggle and start creating your
          pattern!
        </div>
      )}

      {/* Navigation buttons */}
      <div className="grid grid-cols-2 gap-4 py-5">
        {/* Previous stitch button */}
        <button
          onClick={onPrevious}
          className="rounded bg-indigo-500 px-3 py-2 text-white hover:bg-indigo-500 disabled:opacity-50"
          disabled={safeIdx <= 0}
        >
          ↩
        </button>

        {/* Next stitch button */}
        <button
          onClick={onNext}
          className="rounded bg-indigo-500 px-3 py-2 text-white hover:bg-indigo-500 disabled:opacity-50"
          disabled={safeIdx >= items.length}
        >
          {safeIdx >= items.length ? "Finished 🎉" : "Next"}
        </button>
      </div>
    </div>
  );
}

export default StitchTracker;
