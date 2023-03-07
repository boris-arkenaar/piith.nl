import fs from "fs";
import matter from "gray-matter";
import { GetStaticProps } from "next";
import Head from "next/head";
import { join } from "path";
import { useMemo } from "react";
import deepmerge from "deepmerge";
import { defaultSchema } from "hast-util-sanitize";

import ArticleSummary from "../components/article-summary";
import PostsPagination from "../components/posts-pagination";
import { getArticles, getArticlesPagination, getLayoutProps } from "../lib/api";
import { processMarkdown } from "../lib/md";
import Script from "next/script";

export const getStaticProps: GetStaticProps = async () => {
  const home = join(process.cwd(), "content/home.md");
  const sanitizeSchema = deepmerge(defaultSchema, {
    attributes: { "*": ["className"] },
  });
  const rawContent = fs.readFileSync(home, "utf8");
  const frontMatter = matter(rawContent);

  return {
    props: {
      content: frontMatter.content,
      layoutProps: getLayoutProps(),
      pageCount: getArticlesPagination().length,
      posts: getArticles(1),
      sanitizeSchema,
      title: frontMatter.data.title,
    },
  };
};

type HomeProps = {
  content: string;
  pageCount: number;
  posts: any;
  sanitizeSchema: any;
  title: string;
};

const Home: React.FC<HomeProps> = ({
  content,
  pageCount,
  posts,
  sanitizeSchema,
  title,
}) => {
  const processedContent = useMemo(
    () => processMarkdown(content, sanitizeSchema),
    [content]
  );
  const processedPosts = useMemo(
    () =>
      posts.map((post) => ({
        ...post,
        content: !post.excerpt
          ? processMarkdown(post.content, sanitizeSchema)
          : "",
        excerpt: post.excerpt
          ? processMarkdown(post.excerpt, sanitizeSchema)
          : "",
      })),
    [posts]
  );

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" type="image/png" href="/icon.png" />
      </Head>
      <Script src="https://identity.netlify.com/v1/netlify-identity-widget.js" />
      {processedContent}
      {processedPosts.map((post) => (
        <ArticleSummary article={post} key={post.id} />
      ))}
      <PostsPagination pageCount={pageCount} />
    </>
  );
};

export default Home;
