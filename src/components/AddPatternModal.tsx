import { useCreatePattern } from "../data/patternHooks";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { useState } from "react";

function AddPatternModal({ onClose }: { onClose: () => void }) {
  const { session } = useAuth();
  const nav = useNavigate();
  const create = useCreatePattern();
  const params = useParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {/* Modal content */}
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <h2 className="text-center text-xl font-semibold">Add Pattern</h2>

        <div className="grid pt-5 pb-2 gap-2 items-center justify-items-center">
          <input
            type="text"
            value={title}
            placeholder="Pattern name... "
            onChange={(e) => setTitle(e.currentTarget.value)}
            className="w-70 h-8 rounded-md px-2 text-m border-1 border-gray-900 rounded-md bg-gray-100 dark:bg-gray-700"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
            placeholder="description (optional) "
            className="w-90 min-h-15 max-h-40 rounded-md px-2 text-m border-1 border-gray-500 rounded-md bg-gray-100 dark:bg-gray-700"
          />
        </div>

        {/* button grid */}
        <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-1">
          <button
            disabled={create.isPending}
            onClick={async () => {
              try {
                const res = await create.mutateAsync({
                  title: title.trim() || undefined,
                  description: description.trim() || undefined,
                });
                onClose(); // close modal
                nav(`/app/p/${res.id}`); // go to the new pattern
              } catch (err: any) {
                alert(err.message ?? "Failed to create pattern");
              }
            }}
            className="rounded-md bg-indigo-200 px-4 py-2 hover:bg-indigo-300 disabled:opacity-50 dark:bg-indigo-700 dark:hover:bg-indigo-600"
          >
            {create.isPending ? "Creating..." : "Create new pattern"}
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
            className="flex items-center justify-center text-sm h-5 w-16 text-gray-500 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 hover:font-bold dark:hover:text-gray-200 rounded-lg hover:border-1 dark:hover:border-1"
          >
            cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddPatternModal;
