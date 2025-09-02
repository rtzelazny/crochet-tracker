import { supabase } from "../lib/supabase";

function LoginModal({ onClose }: { onClose: () => void }) {
  const signInGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) console.error(error.message);
  };

  return (
    <div>
      {/* <h2> Sign in</h2>
       <button onClick={onClose} aria-label="Close" className="p-2">
        Close
      </button> */}
      <button className="hover:text-gray-600" onClick={signInGoogle}> Continue with Google </button>
    </div>
  );
}

export default LoginModal;
