import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import ThemeToggle from "../components/ThemeToggle";
import SideBar from "../components/SideBar";
import { useState } from "react";

type Mode = "view" | "edit";

function Workspace() {
  const nav = useNavigate();
  /* signs user out through supabase. Directs back to the landing page*/
  const logOut = async () => {
    await supabase.auth.signOut();
    nav("/");
  };
  const [mode, setMode] = useState<Mode>("view");

  return (
    <div className="min-h-dvh bg-white dark:bg-gray-800 dark:text-white">
      <h2 className="pt-3 pb-2 pl-3 font-bold"> StitchMate []</h2>
      <div className="grid grid-cols-[280px_1fr]">
        <div>
          <SideBar />
        </div>
        {/* main area */}
        <div>
          <header className="flex items-center pt-10 pl-10 dark:border-zinc-800 space-x-5">
            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold">{"(Untitled)"}</h2>
              <p className="truncate text-xs text-zinc-500">
                {/* add last updated time */}
              </p>
            </div>

            {/* Mode toggle */}
            <div
              role="tablist"
              aria-label="Mode"
              className="w-20 h-6 inline-flex rounded-lg border text-sm dark:border-zinc-700"
            >
              <button
                role="tab"
                aria-selected={mode === "view"}
                onClick={() => setMode("view")}
                className={`w-10 h-5.5 rounded-bl-md rounded-tl-md ${
                  mode === "view"
                    ? "bg-gray-200 dark:bg-gray-600 font-semibold"
                    : "hover:gray-zinc-100 dark:hover:bg-gray-700"
                }`}
              >
                View
              </button>
              <button
                role="tab"
                aria-selected={mode === "edit"}
                onClick={() => setMode("edit")}
                className={`w-10 h-5.5 rounded-br-md rounded-tr-md ${
                  mode === "edit"
                    ? "bg-gray-200 dark:bg-gray-600 font-semibold"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                Edit
              </button>
            </div>
          </header>
        </div>
        {/* top bar */}
        <button
          onClick={logOut}
          className="absolute top-2 right-4 hover:text-gray-600 dark:hover:text-gray-400"
        >
          {" "}
          Log out{" "}
        </button>
        <div className="absolute top-10 right-4">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

export default Workspace;
