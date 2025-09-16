import type { PatternContent, PatternRow } from "./patternContent";
/**
 *
 * @returns A function that converts PatternRow to human-readable stitch descriptions.
 */

export type Stitch = {
  index: number;
  rowId: string;
  inRowIdx: number;
  label: string; // label shown in the tracker
  stitch: string; // raw stitch name
  placement?: string; // normalized placement
};

// use for highlighting a row in the full pattern that a range of stitches belongs to
export type RowRanges = Record<string, [start: number, end: number]>;

function RowToStitchConverter(input: PatternContent | PatternRow[]): {
  atoms: Stitch[];
  rowRanges: RowRanges;
} {
  // normalize input to an array of rows
  const rows = Array.isArray(input) ? input : input?.rows ?? [];
  const atoms: Stitch[] = [];
  const rowRanges: RowRanges = {};

  // iterate through each row and extract stitches
  for (const row of rows) {
    // skip non-stitch rows
    if (!row || row.type !== "stitch") continue;
    // parse the quantity to an integer
    const qty = parseQty((row as any).qty);
    if (qty <= 0) continue; // skip invalid quantities

    // normalize the fields into human-readable forms
    const stitch = String((row as any).stitch ?? "").trim();
    const placementRaw =
      (row as any).placement ??
      (row as any).placement1 ??
      (row as any).placement2 ??
      "";
    const placement = normalizePlacement(placementRaw);
    // starting index of this row's stitches in the overall atoms array
    const start = atoms.length;

    for (let i = 0; i < qty; i++) {
      atoms.push({
        index: atoms.length, // global position
        rowId: (row as any).id,
        inRowIdx: i, // idx of stitch within this row
        label: formatLabel({ stitch, placement }), // what the user sees in the stitch tracker
        stitch,
        placement,
      });
    }
    const end = atoms.length - 1;
    rowRanges[(row as any).id] = [start, end];
  }

  // return the individual stitches and their associated row they're in
  return { atoms, rowRanges };
}
export default RowToStitchConverter;

export function resolveProgressIndex(opts: {
  atoms: Stitch[];
  saved?: {
    atomIndex?: number | null;
    rowId?: string | null;
    inRowIndex?: number | null;
  };
}): number {
  const { atoms, saved } = opts;
  if (!atoms.length) return 0;

  // Best: find the exact atom by (rowId, inRowIndex)
  if (saved?.rowId) {
    const wantRow = saved.rowId;
    const wantIdx = saved.inRowIndex ?? 0;
    const found = atoms.find(
      (a) => a.rowId === wantRow && a.inRowIdx === wantIdx
    );
    if (found) return found.index;
  }

  // Otherwise, use the previously saved linear position.
  const ai = saved?.atomIndex ?? 0;
  return clamp(ai, 0, atoms.length); // allow N == "finished"
}

function parseQty(q: unknown): number {
  if (typeof q === "number") return Math.max(0, Math.floor(q));
  const n = parseInt(String(q ?? "").trim(), 10);
  return Number.isFinite(n) && n > 0 ? n : 0; // default to 0 (not 1)
}

// normalize placement strings to human-readable forms
function normalizePlacement(placement: string): string {
  const lower = placement.toLowerCase();
  if (lower.includes("next")) return "next st";
  if (lower.includes("same")) return "current st";
  if (lower.includes("each")) return "next st";
  return placement; // return as-is if no match
}

function formatLabel({
  stitch,
  placement,
}: {
  stitch: string;
  placement?: string;
}): string {
  const s = stitch.toLowerCase();
  // Chains: show explicit unit (per atom)
  if (s === "ch" || s === "chain") return "ch 1";
  // Default: stitch + (optional) placement
  return placement ? `${stitch} in ${placement}` : stitch || "(stitch)";
}

function clamp(n: number, min: number, maxExclusive: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(n, Math.max(min, maxExclusive)));
}
