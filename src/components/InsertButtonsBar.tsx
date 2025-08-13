type Props = {
  onAddStitch: () => void;
  onAddSection: () => void;
  onAddNote: () => void;
};
function InsertButtonsBar({ onAddStitch, onAddSection, onAddNote }: Props) {
  return (
     <div className="ml-5 flex w-80 h-9 border border-gray-400 rounded-lg bg-gray-300 shadow-md justify-end pr-2">
      <div className="inline-flex items-center flex  gap-2">
        <p className="text-center px-3 text-m"> Insert </p>
        <button onClick={onAddStitch} className="rounded-lg w-17 bg-gray-100 shadow-md border border-gray-400">
          {" "}
          Stitch{" "}
        </button>
        <button onClick={onAddSection} className="rounded-lg w-17 bg-gray-100 shadow-md border border-gray-400">
          {" "}
          Section{" "}
        </button>
        <button onClick={onAddNote} className="rounded-lg w-17 bg-gray-100 shadow-md border border-gray-400">
          {" "}
          Notes{" "}
        </button>
      </div>
    </div>
  );
}

export default InsertButtonsBar;
