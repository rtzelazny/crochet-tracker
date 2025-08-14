import type { NoteRow as NoteRowType } from "../types/patternContent";

type Props = {
  row: NoteRowType;
  onChange: (next: NoteRowType) => void;
  onRemove: () => void;
};

export default function NoteRow({ row, onChange, onRemove }: Props) {
  return (
    <div className="rounded-md px-10 pt-5 ">
      <div className="flex gap-2">
        <textarea
          value={row.text}
          onChange={(e) => onChange({ ...row, text: e.target.value })}
          placeholder="Add a note…"
          className="w-full min-h-10 rounded bg-white dark:bg-zinc-900 px-2 py-1 text-sm"
        />
        {/* remove row */}
        <button
          type="button"
          onClick={onRemove}
          className="text-gray-400 px-2 py-1 text-xs hover:text-gray-600"
          aria-label="Remove note"
          title="Remove note"
        >
          x
        </button>
      </div>
    </div>
  );
}
