import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { supabase } from "../lib/supabase";

function HomePage() {
  const { session } = useAuth();

  const nav = useNavigate();
  /* signs user out through supabase. Directs back to the landing page*/
  const logOut = async () => {
    await supabase.auth.signOut();
    nav("/");
  };

  return (
    <div>
      <h1> Home Page</h1>
      <div>
        <span className="text-sm text-zinc-600">{session?.user?.email}</span>
      </div>{" "}
      <button onClick={logOut}> Log out </button>
    </div>
  );
}

export default HomePage;
