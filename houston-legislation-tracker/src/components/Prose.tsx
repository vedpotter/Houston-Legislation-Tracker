/** Renders the HTML produced from a Markdown body. Content comes from our own files, so it is trusted. */
export function Prose({ html, className = "" }: { html: string; className?: string }) {
  return <div className={`prose-body ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
