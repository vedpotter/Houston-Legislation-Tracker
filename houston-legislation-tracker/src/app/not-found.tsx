import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap py-24">
      <h1 className="text-4xl font-extrabold">That page could not be found</h1>
      <p className="mt-3 max-w-prose text-lg text-soft">
        The link may be old, or the page may have moved. Try searching, or start from the legislation library.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/legislation" className="btn btn-primary">Explore Legislation</Link>
        <Link href="/search" className="btn btn-secondary">Search the site</Link>
      </div>
    </div>
  );
}
