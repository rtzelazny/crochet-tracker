export type RowId = string;

export type StitchRow = {
  id: RowId;
  type: "stitch";
  qty: string; // keep as string while editing
  stitch: string; // must be one of STITCHES or ""
  placement: string; // must be one of PLACEMENTS or ""
};

export type SectionRow = {
  id: RowId;
  type: "section";
  title: string; // e.g., "Row 3", "Round 5", "Sleeve start", Repeat x
};

export type NoteRow = {
  id: RowId;
  type: "note";
  text: string;
};

export type PatternRow = StitchRow | SectionRow | NoteRow;

export type PatternContent = {
  rows: PatternRow[];
  version: 1;
};
