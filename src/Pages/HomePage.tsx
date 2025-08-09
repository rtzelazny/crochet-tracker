import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { supabase } from "../lib/supabase";
import ThemeToggle from "../components/ThemeToggle";

function HomePage() {
  const { session } = useAuth();

  const nav = useNavigate();
  /* signs user out through supabase. Directs back to the landing page*/
  const logOut = async () => {
    await supabase.auth.signOut();
    nav("/");
  };

  return (
    <div className="relative min-h-dvh bg-white dark:bg-gray-800 dark:text-white">
      <h1 className="p-4"> Crochet Tracker </h1>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div>
        <span>{session?.user?.email}</span>
      </div>{" "}
      <button onClick={logOut}> Log out </button>
    </div>
  );
}

export default HomePage;
