import { createContext, useContext, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
/* import the client */
import { supabase } from "../lib/supabase";

type AuthCtx = { session: Session | null; loading: boolean };
const Ctx = createContext<AuthCtx>({ session: null, loading: true });
/* create a session listener */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  /* have it load in the meantime */
  const [loading, setLoading] = useState(true);

  /* Synch with supabase */
  useEffect(() => {
    let mounted = true;

    /* get the current supabase session on page load */
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
      // auth check completed
      setLoading(false);
    });

    /* listen for any login/outs in the session or for refreshes */
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      if (!mounted) return;
      setSession(s);
    });

    /* clean up */
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  /* provides the session and loading states */
  return <Ctx.Provider value={{ session, loading }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  return useContext(Ctx);
}
