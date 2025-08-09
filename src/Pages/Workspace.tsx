import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { supabase } from "../lib/supabase";
import ThemeToggle from "../components/ThemeToggle";
import SideBar from "../components/SideBar";

function HomePage() {
  const { session } = useAuth();

  const nav = useNavigate();
  /* signs user out through supabase. Directs back to the landing page*/
  const logOut = async () => {
    await supabase.auth.signOut();
    nav("/");
  };

  return (
    <div className="grid min-h-dvh grid-cols-[280px_1fr] bg-white dark:bg-gray-800 dark:text-white">
      <SideBar />
      <h1 className="p-4"> StitchMate </h1>
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
      {/* main area */}
      <div>
        <span>{session?.user?.email}</span>
      </div>
    </div>
  );
}

export default HomePage;
