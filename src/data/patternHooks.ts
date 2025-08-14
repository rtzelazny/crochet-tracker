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
    queryKey: ["patterns", session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async (): Promise<PatternRow[]> => {
      const { data, error } = await supabase
        .from("patterns")
        .select(
          "id, owner, title, description, content, created_at, updated_at"
        )
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data as any;
    },
  });
}

/* return specific pattern row */
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
        .single();
      if (error) throw error;
      return data as any;
    },
  });
}

/* insert new row in the patterns table */
export function useCreatePattern() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (init?: Partial<PatternRow>) => {
      const payload = {
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

/* Save pattern */
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
        .eq("id", id);
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
