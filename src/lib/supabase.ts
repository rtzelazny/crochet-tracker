import { createClient } from "@supabase/supabase-js";

// all files will import the same client
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);
