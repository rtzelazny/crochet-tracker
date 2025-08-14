import type { PatternContent, PatternRow } from "../types/patternContent";

function PatternViewer({ content }: { content: PatternContent }) {
  const rows = content.rows;
  return (
    
    <div className="p-10">
      <article className="prose dark:prose-invert max-w-none">
      {rows.map((r) => {
        if (r.type === "section") {
          return <h3 key={r.id}>{r.title || "Section"}</h3>;
        }
        if (r.type === "note") {
          return <p key={r.id}><em>{r.text}</em></p>;
        }
        // stitch
        return (
          <p key={r.id}>
            {r.qty || "?"} {r.stitch || "(stitch)"} in {r.placement || "(placement)"}
          </p>
        );
      })}
    </article>
    </div>
  );
}
export default PatternViewer;
