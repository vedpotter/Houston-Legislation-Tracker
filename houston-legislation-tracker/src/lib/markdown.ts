import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeExternalLinks from "rehype-external-links";
import rehypeStringify from "rehype-stringify";

export interface Heading {
  id: string;
  text: string;
}

/** Converts Markdown to HTML. Headings get ids so pages can link to them. */
export async function renderMarkdown(markdown: string): Promise<{ html: string; headings: Heading[] }> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] })
    .use(rehypeStringify)
    .process(markdown);

  const html = String(file);
  const headings: Heading[] = [];
  const re = /<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    headings.push({ id: m[1], text: m[2].replace(/<[^>]+>/g, "") });
  }
  return { html, headings };
}
