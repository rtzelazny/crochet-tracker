import NumericTextbox from "./NumericTextbox";
import TypePickBox from "./TypePickBox";
import { PLACEMENTS, STITCHES } from "../constants";
import type { StitchRow as StitchRowType } from "../types/patternContent";

type Props = {
  row: StitchRowType;
  onChange: (next: StitchRowType) => void;
  onRemove: () => void;
};

function AddStitch({ row, onChange, onRemove }: Props) {
  return (
    <div className="">
      <div className="flex grid-cols-4 grid-rows-2 text-sm gap-2 pt-5 px-10">
        <NumericTextbox
          value={row.qty}
          onChange={(v) => onChange({ ...row, qty: v })}
          min={1}
          max={999}
          className="border border-zinc-300 rounded w-8.5 h-6 text-center bg-white"
        />
        <TypePickBox
          options={STITCHES}
          value={row.stitch}
          onChange={(v) => onChange({ ...row, stitch: v })}
          placeholder="Stitch type…"
          wrapperClassName="w-30"
          inputClassName="h-6 border border-zinc-300"
        />
        <span className="text-sm text-zinc-600 dark:text-zinc-300">in</span>
        <TypePickBox
          options={PLACEMENTS}
          value={row.placement}
          onChange={(v) => onChange({ ...row, placement: v })}
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
