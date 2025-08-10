import AddPatternModal from "../components/AddPatternModal";
import { useState } from "react";

function SideBar() {
  const [open, setOpen] = useState(false);
  return (
    <aside className="h-dvh x-[280 px] bg-gray-200 dark:bg-gray-900 rounded-xl">
      {/* minimize button- minimizes the side bar to the left so it's only a thin bar with a maximize button and add pattern button*/}

      <button className="mt-2 ml-[250px] flex items-center justify-center size-6 text-2xl hover:bg-gray-300 rounded-sm hover:dark:bg-gray-500">
        {" "}
        -{" "}
      </button>

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
    </aside>
  );
}
export default SideBar;
