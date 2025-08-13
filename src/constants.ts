// view sizes
export const SIDEBAR_WIDTH = 220;

// supported stitches
export const STITCHES = [
  "sc",
  "dc",
  "hdc",
  "ch",
  "sl st",
  "tc",
  "mr",
  "increase st",
  "decrease st",
  "moss st",
  "puff st",
  "shell st",
  "v st",
  "cluster st",
  "waffle st",
  "bobble st",
];

// supported stitch placements
export const PLACEMENTS = [
  "none",
  "custom",
  // Basic stitch targets
  "next st",
  "same st",
  "each st",
  "beginning st",
  "beginning row st",
  "{n} st from hook",
  "{n} st from first stitch",

  // Loops
  "both loops",
  "blo", // back loop only
  "flo", // front loop only
  "3rd loop",

  // Chain targets
  "next ch",
  "each ch",
  "back bump of ch",
  "ch-1 sp",
  "ch-2 sp",
  "{n}-ch sp", // any chain space size

  // Spaces / rings / corners
  "same sp",
  "next sp",
  "between sts",
  "mr",
  "corner sp", // e.g., corner ch‑2 space in squares

  // Posts
  "around post (fp)", // front post
  "around post (bp)", // back post

  // Row/round specifics
  "top of dc",
  "end of row",
  "edge st",
  "prev rnd ch-2 sp",
];
