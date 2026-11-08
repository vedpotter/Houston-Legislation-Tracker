import type { Status } from "@/lib/types";

const styles: Record<Status, { box: string; dot: string }> = {
  Introduced: { box: "bg-amber-tint text-amber", dot: "bg-amber" },
  "In Committee": { box: "bg-amber-tint text-amber", dot: "bg-amber" },
  "Passed Legislature": { box: "bg-brand-tint text-brand-dark", dot: "bg-brand" },
  Signed: { box: "bg-brand-tint text-brand-dark", dot: "bg-brand" },
  "In Effect": { box: "bg-go-tint text-go", dot: "bg-go" },
  "Challenged in Court": { box: "bg-brick-tint text-brick", dot: "bg-brick" },
  Blocked: { box: "bg-alert-tint text-alert", dot: "bg-alert" },
  Vetoed: { box: "bg-alert-tint text-alert", dot: "bg-alert" },
  Expired: { box: "bg-wash text-soft", dot: "bg-soft" },
  Repealed: { box: "bg-wash text-soft", dot: "bg-soft" },
  Other: { box: "bg-wash text-soft", dot: "bg-soft" },
};

export const statusStripe: Record<Status, string> = {
  Introduced: "bg-amber",
  "In Committee": "bg-amber",
  "Passed Legislature": "bg-brand",
  Signed: "bg-brand",
  "In Effect": "bg-go",
  "Challenged in Court": "bg-brick",
  Blocked: "bg-alert",
  Vetoed: "bg-alert",
  Expired: "bg-soft",
  Repealed: "bg-soft",
  Other: "bg-soft",
};

export function StatusBadge({ status, className = "" }: { status: Status; className?: string }) {
  const s = styles[status];
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${s.box} ${className}`}>
      <span className={`h-2 w-2 rounded-full ${s.dot}`} aria-hidden="true" />
      <span className="sr-only">Status: </span>
      {status}
    </span>
  );
}
