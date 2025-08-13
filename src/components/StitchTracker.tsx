function StitchTracker() {
  return (
    <div
      className="bg-gray-200 dark:bg-gray-700 p-4 overflow-auto rounded-lg fixed bottom-2 right-2"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="text-xs text-zinc-500 min-h-4"> Before stitch </div>
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-wide text-zinc-500">
            {" "}
            Current label{" "}
          </div>
          <div className="mt-1 text-2xl font-semibold">Current stitch</div>
        </div>
        <div className="text-xs text-zinc-500 min-h-4"> After stitch </div>

        <div className="mt-3 flex gap-2">
          <button className="rounded-md border px-3 py-1 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800">
            Back
          </button>
          <button className="rounded-md border px-3 py-1 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default StitchTracker;
