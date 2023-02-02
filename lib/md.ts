import matter from "gray-matter";
import { createElement } from "react";
import rehypeRaw from "rehype-raw";
import rehypeReact from "rehype-react";
import rehypeSanitize from "rehype-sanitize";
import remark from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import MarkdownLink from "../components/markdown-link";

export const processMarkdown = (
  content: string,
  sanitizeSchema: Record<string, unknown>
): React.ReactNode => {
  const frontMatter = matter(content);
  const matterContent = unified()
    .use(remark)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeReact, {
      createElement,
      components: {
        a: MarkdownLink,
      },
    })
    .use(rehypeSanitize, sanitizeSchema)
    .processSync(frontMatter.content);
  return matterContent.result;
};
