import NumericTextbox from "./NumericTextbox";
import AddStitch from "./AddStitch";
import InsertButtonsBar from "./InsertButtonsBar";
import SelectButtonsBar from "./SelectButtonsBar";
import { useState, useRef } from "react";

// id for each row
type Row = { id: string };

function PatternEditor() {
    // list for stitches
    const [rows, setRows] = useState<Row[]>([]);
    // ref for last stitch
    const lastAddedRef = useRef<string | null>(null);

    const addStitch = () => {
    const id = crypto.randomUUID();
    lastAddedRef.current = id;
    setRows((prev) => [...prev, { id }]);
  };

  const removeStitch = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="h-dvh">
      <div className="sticky top-0 flex inline-flex gap-5 rounded-lg bg-gray-200 w-full p-5">
        <InsertButtonsBar onAddStitch={addStitch}/>
        <SelectButtonsBar />
      </div>
      <div className="mx-10 bg-gray-100 h-dvh rounded-lg">
      {rows.map(({ id }) => (
          <AddStitch
            key={id}
            id={id}
            onRemove={() => removeStitch(id)}
            autoFocus={lastAddedRef.current === id}
          />
        ))}
      </div>
    </div>
  );
}
export default PatternEditor;
