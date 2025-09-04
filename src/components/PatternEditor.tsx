import NumericTextbox from "./NumericTextbox";
import StitchRow from "./StitchRow";
import SectionRow from "./SectionRow";
import NoteRow from "./NoteRow";
import InsertButtonsBar from "./InsertButtonsBar";
import SelectButtonsBar from "./SelectButtonsBar";
import { useState, useEffect } from "react";

import type { PatternContent, PatternRow } from "../types/patternContent";

function PatternEditor({
  content,
  onChange,
  onTitleChange,
  onDescriptionChange,
}: {
  content: PatternContent;
  onChange: (next: PatternContent) => void;
  onTitleChange?: (title: string) => void;
  onDescriptionChange?: (desc: string) => void;
}) {
  // list for rows
  const rows = content.rows ?? [];

  const commit = (nextRows: PatternRow[]) => {
    console.log("[commit] from", content, "to", {
      version: (content.version ?? 0) + 1,
      rows: nextRows,
    });
    onChange({ version: (content.version ?? 0) + 1, rows: nextRows });
  };

  const addStitch = () =>
    commit([
      ...rows,
      {
        id: crypto.randomUUID(),
        type: "stitch",
        qty: "",
        stitch: "",
        placement1: "",
        placement2: "",
      },
    ]);

  const addSection = () =>
    commit([...rows, { id: crypto.randomUUID(), type: "section", title: "" }]);

  const addNote = () =>
    commit([...rows, { id: crypto.randomUUID(), type: "note", text: "" }]);

  const removeRow = (id: string) => commit(rows.filter((r) => r.id !== id));

  const updateRow = (id: string, next: PatternRow) =>
    commit(rows.map((r) => (r.id === id ? next : r)));

  return (
    <div className="h-dvh overflow-y-auto">
      <div className="sticky top-0 flex inline-flex gap-5 rounded-lg bg-gray-200 w-full p-5 z-10">
        <InsertButtonsBar
          onAddStitch={addStitch}
          onAddSection={addSection}
          onAddNote={addNote}
        />
        <SelectButtonsBar />
      </div>
      <div className="mx-10 bg-gray-100 rounded-lg pb-100">
        {rows.map((row, i) => {
          const isSection = row.type === "section";
          const paddingTop = isSection ? (i === 0 ? "pt-2" : "pt-10") : ""; // more space if not first row

          switch (row.type) {
            case "stitch":
              return (
                <div key={row.id} className={paddingTop}>
                  <StitchRow
                    key={row.id}
                    row={row}
                    onChange={(n) => updateRow(row.id, n)}
                    onRemove={() => removeRow(row.id)}
                  />
                </div>
              );
            case "section":
              return (
                <div key={row.id} className={paddingTop}>
                  <SectionRow
                    key={row.id}
                    row={row}
                    onChange={(n) => updateRow(row.id, n)}
                    onRemove={() => removeRow(row.id)}
                  />
                </div>
              );
            case "note":
              return (
                <div key={row.id} className={paddingTop}>
                  <NoteRow
                    key={row.id}
                    row={row}
                    onChange={(n) => updateRow(row.id, n)}
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
