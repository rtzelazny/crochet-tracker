import NumericTextbox from "./NumericTextbox";
import TypePickBox from "./TypePickBox"
import { useState } from "react";
import { PLACEMENTS, STITCHES } from "../constants";

function AddStitch() {
  const [stitchQty, setStitchQty] = useState("");
  const [stitch, setStitch] = useState("");  // must be one of STITCHES or ""
  const [placement, setPlacement] = useState("");

  return (
    <div className="m-5">
      <div className="flex grid-cols-4 grid-rows-2 text-sm gap-2">
        <NumericTextbox
          value={stitchQty}
          onChange={setStitchQty}
          min={1}
          max={999}
          className="border border-zinc-300 rounded w-8.5 h-6 text-center"
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
      </div>
    </div>
  );
}
export default AddStitch;
