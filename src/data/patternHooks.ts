import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import type { Session } from "@supabase/supabase-js";
import type { PatternContent } from "../types/patternContent";

export type PatternRow = {
  id: string;
  owner: string;
  title: string;
  description: string | null;
  content: PatternContent; // the jsonb file containing all info for the specific pattern
  created_at: string;
  updated_at: string;
};

/* return all user's patterns */
export function useMyPatterns(session: Session | null) {
  return useQuery({
    // cache the patterns for the specific user
    queryKey: ["patterns", session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async (): Promise<PatternRow[]> => {
      const { data, error } = await supabase
        .from("patterns")
        .select(
          "id, owner, title, description, content, created_at, updated_at"
        )
        .order("created_at", { ascending: false }); // most recently updated first
      if (error) throw error;
      return data as any;
    },
  });
}

/* return a pattern by it's id */
export function usePattern(id: string | undefined) {
  return useQuery({
    queryKey: ["pattern", id],
    enabled: !!id,
    queryFn: async (): Promise<PatternRow> => {
      const { data, error } = await supabase
        .from("patterns")
        .select(
          "id, owner, title, description, content, created_at, updated_at"
        )
        .eq("id", id!)
        .single(); // returns the one row corresponding to the id
      if (error) throw error;
      return data as any;
    },
  });
}

/* MUTATIONS, use .mutate when referencing */
/* remember to invalidate so UI is synced */

/* insert new row in the patterns table with defaults */
export function useCreatePattern() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (init?: Partial<PatternRow>) => {
      // get the user id from the session
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");
      const payload = {
        owner: user.id,
        title: init?.title ?? "(Untitled)",
        description: init?.description ?? null,
        content: init?.content ?? { version: 1, rows: [] },
      };
      const { data, error } = await supabase
        .from("patterns")
        .insert(payload)
        .select("id")
        .single();
      if (error) throw error;
      return data as { id: string };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["patterns"] }),
  });
}

/* patches the title, description, or content if changed */
export function useUpdatePattern() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      id: string;
      patch: Partial<Pick<PatternRow, "title" | "description" | "content">>;
    }) => {
      const { id, patch } = args;
      const { error } = await supabase
        .from("patterns")
        .update({ ...patch, updated_at: new Date().toISOString() })
        .eq("id", id); // new updated_at timestamp as well
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["pattern", vars.id] });
      qc.invalidateQueries({ queryKey: ["patterns"] });
    },
  });
}

/* Delete specific pattern from patterns */
export function useDeletePattern() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("patterns").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["patterns"] }),
  });
}

/* Retrieve user's progress on a specific pattern */
export function usePatternProgress(patternId?: string) {
  return useQuery({
    queryKey: ["progress", patternId],
    enabled: !!patternId,
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");
      const { data, error } = await supabase
        .from("pattern_progress")
        .select("stitch_idx,row_id,in_row_idx,version")
        .eq("user_id", user.id)
        .eq("pattern_id", patternId!)
        .maybeSingle();
      if (error) throw error;
      return (
        data ?? { stitch_idx: 0, row_id: null, in_row_idx: 0, version: null }
      );
    },
  });
}

/* Upsert (insert or update) user's progress on a specific pattern */
export function useUpsertPatternProgress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      patternId: string;
      stitchIdx: number;
      rowId?: string | null;
      inRowIdx?: number | null;
      version?: number | null;
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");
      const payload = {
        user_id: user.id,
        pattern_id: args.patternId,
        stitch_idx: args.stitchIdx,
        row_id: args.rowId ?? null,
        in_row_idx: args.inRowIdx ?? null,
        version: args.version ?? null,
      };
      const { error } = await supabase
        .from("pattern_progress")
        .upsert(payload, { onConflict: "user_id,pattern_id" });
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["progress", vars.patternId] });
    },
  });
}
