import type { PatternContent } from "../types/patternContent";

function PatternViewer({ content }: { content: PatternContent }) {
  const rows = content.rows;
  return (
    <div className="p-10">
      <article className="prose dark:prose-invert max-w-none">
        {rows.map((r, i) => {

          const isSection = r.type === "section";
          const paddingTop = isSection ? (i === 0 ? "" : "pt-10") : "";

          if (isSection) {
            return <h3 key={r.id} className={`text-lg font-semibold ${paddingTop}`}>{r.title || "Section"}</h3>;
          }   
          if (r.type === "note") {
            return (
              <p key={r.id} className="italic text-zinc-600 dark:text-zinc-400 py-2">
                {r.text}
              </p>
            );
          }
          // stitch
          return (
            <p key={r.id}>
              {r.qty || "?"} {r.stitch || "(stitch)"} in{" "}
              {r.placement1 || "(placement 1)"}{" "}
              {r.placement2 || "(placement 2)"}
            </p>
          );
        })}
      </article>
    </div>
  );
}
export default PatternViewer;
