export type RowId = string;

export type StitchRow = {
  id: RowId;
  type: "stitch";
  qty: string; // keep as string while editing
  stitch: string; // must be one of STITCHES or ""
  placement1: string; // must be one of PLACEMENTS or ""
  placement2: string; // must be one of PLACEMENTS2 or ""
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
  version: number;
};
