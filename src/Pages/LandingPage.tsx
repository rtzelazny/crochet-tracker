import { useAuth } from "../auth/useAuth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LoginModal from "../auth/LoginModal";

function LandingPage() {
  /* const for the login modal */
  const [open, setOpen] = useState(false);
  const { session } = useAuth();
  const nav = useNavigate();

  /* if user is already logged in, redirect to the user home page */
  if (session) nav("/app");

  return (
    <div className="min-h-dvh flex flex-col items-center bg-white text-black dark:bg-gray-800 dark:text-white">
      <h1 className="text-4xl mt-20"> Crochet Tracker </h1>
      <h1> "Crochet made easy" </h1>
      <h1> Site description </h1>
      <h1> Maybe some pics of the site. Make them want to make an account! </h1>
      <button onClick={() => setOpen(true)}> Log in </button>
      {open && <LoginModal onClose={() => setOpen(false)} />}
    </div>
  );
}

export default LandingPage;
