import type { Source } from "@/lib/types";
import { ExternalIcon } from "./icons";

const groups: { type: Source["type"]; heading: string; note: string }[] = [
  { type: "primary", heading: "Primary sources", note: "Official texts, government documents, and court records." },
  { type: "reporting", heading: "Additional reporting", note: "News coverage and analysis from independent outlets." },
  { type: "party", heading: "Statements from involved parties", note: "Groups that support or oppose the legislation. Read these as their positions, not neutral fact." },
];

export function SourceList({ sources, headingLevel = 2 }: { sources: Source[]; headingLevel?: 2 | 3 }) {
  if (sources.length === 0) return <p className="text-soft">No sources have been added yet.</p>;
  const H = headingLevel === 2 ? "h3" : "h4";
  return (
    <div className="space-y-7">
      {groups.map((g) => {
        const list = sources.filter((s) => s.type === g.type);
        if (list.length === 0) return null;
        return (
          <section key={g.type} aria-label={g.heading}>
            <H className={`text-base font-bold ${g.type === "primary" ? "text-brand-dark" : ""}`}>{g.heading}</H>
            <p className="text-sm text-soft">{g.note}</p>
            <ul className={`mt-3 divide-y divide-rule rounded-lg border bg-card ${g.type === "primary" ? "border-brand/40" : "border-rule"}`}>
              {list.map((s) => (
                <li key={s.url + s.title} className="px-4 py-3">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-start gap-1.5 font-semibold text-brand underline decoration-brand/30 hover:decoration-brand"
                  >
                    <span>{s.title}</span>
                    <ExternalIcon className="mt-1.5 shrink-0" />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                  <p className="text-sm text-soft">
                    {s.publisher}
                    {s.placeholder && (
                      <span className="ml-2 rounded bg-amber-tint px-1.5 py-0.5 text-xs font-bold text-amber">Placeholder link</span>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
