import fs from "fs";
import matter from "gray-matter";
import { GetStaticProps } from "next";
import Head from "next/head";
import { join } from "path";
import { useMemo } from "react";

import ArticleSummary from "../components/article-summary";
import Layout from "../components/layout";
import PostsPagination from "../components/posts-pagination";
import { getPostsData, getPostsPages } from "../lib/api";
import { processMarkdown } from "../lib/md";

export const getStaticProps: GetStaticProps = async () => {
  const home = join(process.cwd(), "content/home.md");
  const merge = require("deepmerge");
  const githubSchema = require("hast-util-sanitize/lib/github");
  const sanitizeSchema = merge(githubSchema, {
    attributes: { "*": ["className"] },
  });
  const rawContent = fs.readFileSync(home, "utf8");
  const frontMatter = matter(rawContent);

  return {
    props: {
      content: frontMatter.content,
      pageCount: getPostsPages().length,
      posts: await getPostsData(1),
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
    []
  );
  const processedPosts = useMemo(
    () =>
      posts.map((post) => ({
        ...post,
        content: processMarkdown(post.content, sanitizeSchema),
      })),
    []
  );

  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <link rel="icon" type="image/png" href="/icon.png" />
        <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
      </Head>
      {processedContent}
      {processedPosts.map((post) => (
        <ArticleSummary article={post} key={post.id} />
      ))}
      <PostsPagination pageCount={pageCount} />
    </Layout>
  );
};

export default Home;
