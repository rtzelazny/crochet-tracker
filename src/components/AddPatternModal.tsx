function AddPatternModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {/* Modal content */}
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <h2 className="text-center text-xl font-semibold">Add Pattern</h2>

        {/* button grid */}
        <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-1">
          <button className="rounded-md bg-indigo-200 px-4 py-2 hover:bg-indigo-300 dark:bg-indigo-700 dark:hover:bg-indigo-600">
            Create new pattern
          </button>

          <button className="rounded-md bg-indigo-200 px-2 py-2 hover:bg-indigo-300 dark:bg-indigo-700 dark:hover:bg-indigo-600">
            Upload existing pattern
          </button>

          {/* button descriptions */}
          <p className="text-center text-gray-600 dark:text-gray-400 text-xs">
            {" "}
            Create a pattern from scratch using the StitchMate template{" "}
          </p>
          <p className="text-center text-gray-600 dark:text-gray-400 text-xs">
            {" "}
            Upload an already existing pattern to use with StitchMate{" "}
          </p>
        </div>
        <div className="flex items-center justify-center pt-5">
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex items-center justify-center h-5 w-18 text-gray-600 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 hover:font-bold dark:hover:text-gray-200 rounded-lg hover:border-1 dark:hover:border-1"
          >
            cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddPatternModal;
