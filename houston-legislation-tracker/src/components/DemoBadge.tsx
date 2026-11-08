export function DemoBadge({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border border-dashed border-ink/40 bg-card px-2.5 py-0.5 text-xs font-semibold text-soft ${className}`}>
      Demo content
    </span>
  );
}

export function DemoBanner({ what }: { what: string }) {
  return (
    <div role="note" className="border-b border-dashed border-ink/30 bg-amber-tint">
      <p className="wrap py-3 text-sm font-medium text-ink">
        <strong>Demo content.</strong> This {what} is a made-up example that shows how the site works. It does not describe real legislation. Delete its file in the <code className="rounded bg-white/70 px-1">content</code> folder when you publish your own.
      </p>
    </div>
  );
}
