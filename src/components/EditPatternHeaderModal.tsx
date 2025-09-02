import { useState } from "react";

type Props = {
  initialTitle: string;
  initialDescription?: string | null;
  onSave: (payload: { title: string; description: string | null }) => void | Promise<void>;
  onClose: () => void;
  saving?: boolean;
};

function EditPatternHeaderModal({ initialTitle, initialDescription, onSave, onClose, saving }: Props) {
  const [title, setTitle] = useState(initialTitle ?? "");
  const [description, setDescription] = useState(initialDescription ?? "");

  const handleSave = async () => {
    const t = title.trim() || "(Untitled)";
    const d = description.trim();
    await onSave({ title: t, description: d === "" ? null : d });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <h2 className="text-center text-xl font-semibold">Edit Pattern Info</h2>
        <div className="grid pt-5 pb-2 items-center justify-items-center">
          <input
            type="text"
            value={title}
            placeholder=""
            onChange={(e) => setTitle(e.currentTarget.value)}
            className="w-70 h-8 rounded-md px-2 font-semibold text-m text-center border-1 border-gray-400 rounded-md bg-gray-100 dark:bg-gray-700"
          />
            <p className="pb-4 text-sm text-gray-900 font-semibold"> Title </p>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
            placeholder=""
            className="w-90 min-h-25 max-h-50 rounded-md px-2 py-2 text-m text-gray-600 border-1 border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700"
          />
          <p className="text-sm text-gray-800"> Description </p>
        </div>

        {/* save and close button */}
        <div className="flex items-center justify-center pt-5">
          <button
            onClick={handleSave}
            disabled={!!saving}
            aria-label="Close"
            className="flex items-center justify-center text-sm text-gray-800 h-5 w-16 border-1 border-gray-400 bg-gray-300 hover:text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:hover:text-gray-300 font-bold dark:text-gray-200 rounded-lg dark:border-1"
          >
            {/* save button will display saving message if clicked */}
            {saving ? "saving..." : "save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditPatternHeaderModal;
