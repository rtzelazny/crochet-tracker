import NumericTextbox from "./NumericTextbox";
import TypePickBox from "./TypePickBox"
import { useState, useEffect, useRef } from "react";
import { PLACEMENTS, STITCHES } from "../constants";

type Props = {
  id: string;
  onRemove: () => void;
  autoFocus?: boolean;
};

function AddStitch({ onRemove, autoFocus }: Props) {
  const [stitchQty, setStitchQty] = useState("");
  const [stitch, setStitch] = useState("");  // must be one of STITCHES or ""
  const [placement, setPlacement] = useState("");
  const firstInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (autoFocus) {
      firstInputRef.current?.focus();
      firstInputRef.current?.select();
    }
  }, [autoFocus]);

  return (
    <div className="">
      <div className="flex grid-cols-4 grid-rows-2 text-sm gap-2 pt-5 px-5">
        <NumericTextbox
          value={stitchQty}
          onChange={setStitchQty}
          min={1}
          max={999}
          className="border border-zinc-300 rounded w-8.5 h-6 text-center bg-white"
        />
        <TypePickBox
        options={STITCHES}
        value={stitch}
        onChange={setStitch}
        placeholder="Stitch type…"
        wrapperClassName="w-30"
        inputClassName="h-6 border border-zinc-300"
      />
      <div className="text-sm text-zinc-600 dark:text-zinc-300">
        in
      </div>
      <TypePickBox
        options={PLACEMENTS}
        value={placement}
        onChange={setPlacement}
        placeholder="Placement…"
        wrapperClassName="w-40"
        inputClassName="h-6 border border-zinc-300"
      />
      {/* remove row */}
        <button
          type="button"
          onClick={onRemove}
          className="text-gray-400 px-2 py-1 text-xs hover:text-gray-600"
          aria-label="Remove stitch row"
          title="Remove stitch row"
        >
          x
        </button>
      </div>
    </div>
  );
}
export default AddStitch;
