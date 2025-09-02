function EditPatternHeaderModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <h2>
            Edit Pattern Info
        </h2>
        <button
          onClick={onClose}
          aria-label="Close"
          className="flex items-center justify-center text-sm h-5 w-16 text-gray-500 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 hover:font-bold dark:hover:text-gray-200 rounded-lg hover:border-1 dark:hover:border-1"
        >
          cancel
        </button>
      </div>
    </div>
  );
}

export default EditPatternHeaderModal;
