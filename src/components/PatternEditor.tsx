import NumericTextbox from "./NumericTextbox";
import StitchRow from "./StitchRow";
import SectionRow from "./SectionRow";
import NoteRow from "./NoteRow";
import InsertButtonsBar from "./InsertButtonsBar";
import SelectButtonsBar from "./SelectButtonsBar";
import { useState, useRef } from "react";

import type { PatternRow } from "../types/patternRows";

function PatternEditor() {
  // list for rows
  const [rows, setRows] = useState<PatternRow[]>([]);

  const addStitch = () =>
    setRows((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: "stitch",
        qty: "",
        stitch: "",
        placement: "",
      },
    ]);

  const addSection = () =>
    setRows((prev) => [
      ...prev,
      { id: crypto.randomUUID(), type: "section", title: "", repeat: "" },
    ]);

  const addNote = () =>
    setRows((prev) => [
      ...prev,
      { id: crypto.randomUUID(), type: "note", text: "" },
    ]);

  const removeRow = (id: string) =>
    setRows((prev) => prev.filter((r) => r.id !== id));

  const updateRow = (id: string, next: PatternRow) =>
    setRows((prev) => prev.map((r) => (r.id === id ? next : r)));

  return (
    <div className="h-dvh overflow-y-auto">
      <div className="sticky top-0 flex inline-flex gap-5 rounded-lg bg-gray-200 w-full p-5 z-8">
        <InsertButtonsBar
          onAddStitch={addStitch}
          onAddSection={addSection}
          onAddNote={addNote}
        />
        <SelectButtonsBar />
      </div>
      <div className="mx-10 bg-gray-100 h-dvh rounded-lg">
        {rows.map((row, i) => {
          const isSection = row.type === "section";
          const marginTop = isSection && i !== 0 ? "mt-10" : ""; // more space if not first row

          switch (row.type) {
            case "stitch":
              return (
                <div key={row.id} className={marginTop}>
                  <StitchRow
                    row={row}
                    onChange={(next) => updateRow(row.id, next)}
                    onRemove={() => removeRow(row.id)}
                  />
                </div>
              );
            case "section":
              return (
                <div key={row.id} className={marginTop}>
                  <SectionRow
                    row={row}
                    onChange={(next) => updateRow(row.id, next)}
                    onRemove={() => removeRow(row.id)}
                  />
                </div>
              );
            case "note":
              return (
                <div key={row.id} className={marginTop}>
                  <NoteRow
                    row={row}
                    onChange={(next) => updateRow(row.id, next)}
                    onRemove={() => removeRow(row.id)}
                  />
                </div>
              );
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}
export default PatternEditor;
