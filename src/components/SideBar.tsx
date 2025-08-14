import AddPatternModal from "../components/AddPatternModal";
import { useState } from "react";
import { SIDEBAR_WIDTH } from "../constants";
import { useAuth } from "../auth/useAuth";
import { useMyPatterns, useCreatePattern } from "../data/patternHooks"
import { useNavigate, useParams } from "react-router-dom";

function SideBar() {
  const [open, setOpen] = useState(false);
  const { session } = useAuth();
  const nav = useNavigate();
  const { data, isLoading, error } = useMyPatterns(session);
  const params = useParams<{ id: string }>();
  const currentId = params.id;

  return (
    <aside
      className="h-dvh bg-gray-200 dark:bg-gray-900 rounded-xl"
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
      <ul className="space-y-1">
        {data?.map((p) => (
          <li key={p.id}>
            <button
              onClick={() => nav(`/app/p/${p.id}`)}
              className={`w-full truncate rounded px-2 py-1 text-left text-sm ${
                currentId === p.id
                  ? "bg-zinc-300 dark:bg-zinc-700"
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
              title={p.title}
            >
              {p.title || "(Untitled)"}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
export default SideBar;
