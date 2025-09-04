import AddPatternModal from "../components/AddPatternModal";
import { useState, useRef, useEffect } from "react";
import { SIDEBAR_WIDTH } from "../constants";
import { useAuth } from "../auth/useAuth";
import { useMyPatterns, useCreatePattern } from "../data/patternHooks";
import { useNavigate, useParams } from "react-router-dom";
import { useDeletePattern } from "../data/patternHooks";

function SideBar() {
  const [open, setOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [optionsMenuId, setOptionsMenuId] = useState<string | null>(null);
  const { session } = useAuth();
  const nav = useNavigate();
  const { data, isLoading, error } = useMyPatterns(session);
  const params = useParams<{ id: string }>();
  const currentId = params.id;
  const deletePattern = useDeletePattern();

  // ref to the wrapper that contains the ellipsis + its menu for the OPEN row
  const menuRootRef = useRef<HTMLDivElement | null>(null);

  // Close on click outside (and on Escape)
  useEffect(() => {
    if (!optionsMenuId) return; // only listen while a menu is open

    const onDocMouseDown = (e: MouseEvent) => {
      const root = menuRootRef.current;
      if (!root) {
        setOptionsMenuId(null);
        return;
      }
      if (!root.contains(e.target as Node)) {
        setOptionsMenuId(null);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOptionsMenuId(null);
    };

    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [optionsMenuId]);

  const handleDelete = async (id: string) => {
    // simple confirm for now
    if (!window.confirm("Delete this pattern? This cannot be undone.")) return;

    try {
      await deletePattern.mutateAsync(id);
      // if you were viewing it, leave the page
      if (currentId === id) nav("/app");
      // close the options menu
      setOptionsMenuId(null);
    } catch (err: any) {
      alert(err.message ?? "Failed to delete pattern");
    }
  };

  return (
    <aside
      className="relative z-50 h-dvh bg-gray-200 dark:bg-gray-900 rounded-xl"
      style={{ width: SIDEBAR_WIDTH }}
    >
      {/* minimize button- minimizes the side bar to the left so it's only a thin bar with a maximize button and add pattern button*/}
      <div className="flex justify-end">
        <button className="flex items-center justify-center size-6 text-2xl hover:bg-gray-300 rounded-lg hover:dark:bg-gray-500">
          {" "}
          -{" "}
        </button>
      </div>
      <div className="flex items-center gap-5">
        <h1 className="text-xl pl-5"> My Patterns </h1>
        {/* Add pattern button */}
        <button
          onClick={() => setOpen(true)}
          className="flex items-center justify-center size-6 text-xl bg-gray-400 hover:bg-gray-500 rounded-sm dark:bg-gray-700 hover:dark:bg-gray-500"
        >
          {" "}
          +{" "}
        </button>
      </div>

      {open && <AddPatternModal onClose={() => setOpen(false)} />}

      {/* List of user's patterns */}
      <div className="pt-5">
        <ul className="space-y-1">
          {data?.map((p) => {
            const thisOpen = optionsMenuId === p.id;
            return (
              <li
                key={p.id}
                className={`group flex items-center ${
                  currentId === p.id
                    ? "bg-zinc-300 dark:bg-zinc-700"
                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <button
                  onClick={() => nav(`/app/p/${p.id}`)}
                  className="w-full truncate rounded pl-2 pr-1 py-1 text-left text-sm"
                  title={p.title}
                >
                  {p.title || "(Untitled)"}
                </button>

                {/* pattern options button, appears when hovering over the pattern */}
                <div className="relative" ref={thisOpen ? menuRootRef : null}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOptionsMenuId(thisOpen ? null : p.id);
                    }}
                    className={`relative z-50 inline-flex h-7 w-7 items-center justify-center
                  text-lg text-base leading-none text-gray-600 hover:text-gray-400 rounded-tl-md rounded-bl-md
                  ${
                    thisOpen
                      ? "opacity-100 bg-zinc-400 text-gray-800 hover:text-gray-600"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                    title="Pattern Options"
                  >
                    <span className="leading-none tracking-tighter text-sm">
                      •••
                    </span>
                  </button>

                  {/* pattern options menu */}
                  {thisOpen && (
                    <div
                      className="absolute top-0 left-full z-30 w-30 h-10 rounded-tr-md rounded-br-md rounded-bl-md bg-zinc-400 text-sm shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      {/* delete button */}
                      <button
                        disabled={deletePattern.isPending}
                        className="block w-25 mt-2 mx-2 rounded px-3 py-1 text-center text-red-600 hover:bg-gray-300 dark:hover:bg-red-900/20"
                        onClick={() => handleDelete(p.id)}
                        aria-disabled={deletePattern.isPending}
                      >
                        {deletePattern.isPending ? "Deleting…" : "Delete 🗑"}
                      </button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
export default SideBar;
