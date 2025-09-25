import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import ThemeToggle from "../components/ThemeToggle";
import SideBar from "../components/SideBar";
import { useMemo, useState, useEffect } from "react";
// import StitchTrackerPanel from "../components/StitchTrackerPanel";
import PatternViewer from "../components/PatternViewer";
import PatternEditor from "../components/PatternEditor";
import { SIDEBAR_WIDTH } from "../constants";
import { useParams } from "react-router-dom";
import { usePattern, useUpdatePattern } from "../data/patternHooks";
import type { PatternContent } from "../types/patternContent";
import EditPatternHeaderModal from "../components/EditPatternHeaderModal";
import StitchTracker from "../components/StitchTracker";
import RowToStitchConverter from "../types/RowToStitchConverter";
import {
  usePatternProgress,
  useUpsertPatternProgress,
} from "../data/patternHooks";
import { resolveProgressIndex } from "../types/RowToStitchConverter";

type Mode = "view" | "edit";

function Workspace() {
  const nav = useNavigate();
  const logOut = async () => {
    await supabase.auth.signOut();
    nav("/");
  };

  const [mode, setMode] = useState<Mode>("view");
  const [trackerWidth, setTrackerWidth] = useState(320);

  const { id } = useParams<{ id: string }>();
  const { data: pattern, isLoading } = usePattern(id);
  const update = useUpdatePattern();

  const [draft, setDraft] = useState<PatternContent>({ version: 1, rows: [] });

  const [editHeaderOpen, setEditHeaderOpen] = useState(false);

  const { atoms } = useMemo(() => RowToStitchConverter(draft), [draft]);

  const { data: progress } = usePatternProgress(id); // loads { atom_index, row_id, in_row_index }
  const [activeIndex, setActiveIndex] = useState(0);

  // When atoms or saved progress changes, derive the starting index
  useEffect(() => {
    setActiveIndex(
      resolveProgressIndex({
        atoms,
        saved: {
          atomIndex: progress?.stitch_idx,
          rowId: progress?.row_id,
          inRowIndex: progress?.in_row_idx,
        },
      })
    );
  }, [atoms, progress]);

  const upsert = useUpsertPatternProgress();

  const setAndSave = (i: number) => {
    const clamped = Math.max(0, Math.min(i, atoms.length));
    const at = atoms[Math.min(clamped, atoms.length - 1)];
    setActiveIndex(clamped);
    upsert.mutate({
      patternId: id!,
      stitchIdx: clamped,
      rowId: at?.rowId ?? null,
      inRowIdx: at?.inRowIdx ?? null,
      version: draft.version ?? null,
    });
  };

  const handleNext = () => setAndSave(activeIndex + 1);
  const handlePrevious = () => setAndSave(activeIndex - 1);

  // Reinitialize draft ONLY when switching to a different pattern id
  useEffect(() => {
    if (!pattern?.id) return;
    setDraft(pattern.content ?? { version: 1, rows: [] });
  }, [pattern?.id]);

  // mode reset to view on pattern change
  useEffect(() => {
    setMode("view");
  }, [id]);

  // Debounced saver for editor
  const saveContent = useMemo(
    () =>
      debounce((next: PatternContent) => {
        if (!id) return;
        update.mutate({ id, patch: { content: next } });
      }, 500),
    [id, update]
  );

  const handleModeSwitch = (newMode: Mode) => {
    setMode(newMode);
    // If switching to edit mode, ensure draft is current
    if (newMode === "edit" && pattern?.content) {
      setDraft(pattern.content);
    }
  };

  const columns = useMemo(
    () =>
      mode === "view"
        ? `${SIDEBAR_WIDTH}px 1fr ${trackerWidth}px` // 3 columns (with fixed tracker width)
        : `${SIDEBAR_WIDTH}px 1fr`, // 2 columns (no tracker)
    [mode, trackerWidth]
  );

  return (
    <div className="h-dvh overflow-hidden bg-white dark:bg-gray-800 dark:text-white">
      <h2 className="pt-3 pb-2 pl-3 font-bold"> StitchMate []</h2>

      {/* Grid for [sidebar][pattern view/edit][stitch tracker] */}
      <div
        className="grid h-dvh"
        style={{
          gridTemplateColumns: columns,
        }}
      >
        {/* Sidebar column */}
        <aside className="h-dvh overflow-visible">
          <SideBar />
        </aside>

        {/* Pattern view/edit column */}
        <div className="pt-10">
          <section
            className={`h-dvh min-w-0 dark:border-zinc-800 ${
              mode === "view" ? "overflow-y-auto" : "overflow-hidden"
            }`}
          >
            <header className="sticky top-0 px-10 py-2 flex truncate text-lg font-semibold shadow-md z-10 bg-white dark:bg-gray-800">
              <div className="min-w-0">
                {/* Pattern title */}
                <div className="flex items-center gap-2">
                  <h2 className="truncate text-lg font-semibold">
                    {pattern?.title ?? "(Untitled)"}
                  </h2>
                  {/* title and description edit button */}
                  <button
                    title="Edit title/description"
                    className="text-zinc-500 text-xl hover:text-zinc-400"
                    onClick={() => setEditHeaderOpen(true)}
                  >
                    {" "}
                    ✎{" "}
                  </button>
                </div>
                {/* Pattern description if there is one */}
                {!!pattern?.description && (
                  <p className="mt-1 text-sm text-wrap text-zinc-500 dark:text-zinc-300 line-clamp-2 break-words">
                    {pattern.description}
                  </p>
                )}
                <p className="truncate text-xs text-zinc-500">
                  {isLoading ? "Loading…" : ""}
                </p>
              </div>

              {/* Mode toggle */}
              <div
                role="tablist"
                aria-label="Mode"
                className="w-20 h-6 ml-auto rounded-lg border text-sm dark:border-zinc-700"
              >
                <button
                  role="tab"
                  aria-selected={mode === "view"}
                  onClick={() => handleModeSwitch("view")}
                  className={`w-10 h-5.5 rounded-bl-md rounded-tl-md ${
                    mode === "view"
                      ? "bg-gray-200 dark:bg-gray-600 font-semibold"
                      : "hover:gray-zinc-100 dark:hover:bg-gray-700"
                  }`}
                >
                  View
                </button>
                <button
                  role="tab"
                  aria-selected={mode === "edit"}
                  onClick={() => handleModeSwitch("edit")}
                  className={`w-9.5 h-5.5 rounded-br-md rounded-tr-md ${
                    mode === "edit"
                      ? "bg-gray-200 dark:bg-gray-600 font-semibold"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  Edit
                </button>
              </div>
            </header>
            {editHeaderOpen && (
              <EditPatternHeaderModal
                initialTitle={pattern?.title ?? ""}
                initialDescription={pattern?.description ?? ""}
                saving={update.isPending}
                onSave={async ({ title, description }) => {
                  if (!id) return;
                  await update.mutateAsync({
                    id,
                    patch: { title, description },
                  });
                  // UI refreshes
                }}
                onClose={() => setEditHeaderOpen(false)}
              />
            )}

            <div className="min-h-0 flex-1 overflow-y-auto">
              <div>
                {/* Use draft for view mode */}
                {mode === "view" && <PatternViewer content={draft} />}
              </div>

              <div>
                {/* Editor is fully controlled by draft */}
                {mode === "edit" && (
                  <PatternEditor
                    content={draft}
                    onChange={(next) => {
                      setDraft(next); // immediate local update (no snap-back hopefully)
                      saveContent(next); // debounce save to Supabase
                    }}
                    onTitleChange={(title) =>
                      id && update.mutate({ id, patch: { title } })
                    }
                    onDescriptionChange={(description) =>
                      id && update.mutate({ id, patch: { description } })
                    }
                  />
                )}
              </div>

              <div className="pb-20" />
            </div>
          </section>
        </div>

        {/* Stitch Tracker column */}
        {mode === "view" && (
          <aside
            className="h-dvh overflow-hidden rounded-bl-lg pt-15 pb-15 pr-5 overscroll-none"
            // optional: let users resize later
            // style={{ width: trackerWidth }}
          >
            <StitchTracker
              atoms={atoms ?? []} // guard just in case
              currentIdx={activeIndex}
              onSetActive={setAndSave}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          </aside>
        )}
      </div>

      {/* top bar */}
      <button
        onClick={logOut}
        className="fixed top-2 right-4 hover:text-gray-600 dark:hover:text-gray-400"
      >
        Log out
      </button>
      <div className="fixed top-10 right-4">
        <ThemeToggle />
      </div>
    </div>
  );
}

export default Workspace;

/* util */
function debounce<T extends (...args: any[]) => void>(fn: T, ms: number) {
  let t: number | undefined;
  return (...args: Parameters<T>) => {
    window.clearTimeout(t);
    // @ts-ignore
    t = window.setTimeout(() => fn(...args), ms);
  };
}
