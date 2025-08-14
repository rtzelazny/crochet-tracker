import type { SectionRow as SectionRowType } from "../types/patternContent";

type Props = {
  row: SectionRowType;
  onChange: (next: SectionRowType) => void;
  onRemove: () => void;
};

export default function SectionRow({ row, onChange, onRemove }: Props) {
  return (
    <div className="flex grid-cols">
      <div className="rounded-md  bg-indigo-200 dark:bg-blue-900/20 py-3 px-5 w-100 ml-5">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={row.title}
            onChange={(e) => onChange({ ...row, title: e.target.value })}
            placeholder="Section title (e.g., Row 3)"
            className="w-80 h-8 rounded-md px-2 text-m"
          />
        </div>
      </div>
      {/* remove row */}
      <button
        type="button"
        onClick={onRemove}
        className="text-gray-400 px-2 py-1 text-xs hover:text-gray-600"
        aria-label="Remove section"
        title="Remove section"
      >
        x
      </button>
    </div>
  );
}
