import fs from "fs";
import matter from "gray-matter";
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { join } from "path";
import { createElement, useMemo } from "react";
import rehypeRaw from "rehype-raw";
import rehypeReact from "rehype-react";
import rehypeSanitize from "rehype-sanitize";
import remark from "remark-parse";
import remarkRehype from "remark-rehype";
import unified from "unified";

import Layout from "../components/layout";
import PostsPagination from "../components/posts-pagination";
import { getPostsData, getPostsPages } from "../lib/api";

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

const MarkdownLink = ({ children, href, ...props }) => (
  <Link href={href}>
    <a {...props}>{children}</a>
  </Link>
);

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
  const processedContent = useMemo(() => {
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
  }, []);

  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <link rel="icon" type="image/png" href="/icon.png" />
        <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
      </Head>
      {processedContent}
      {posts.map((post) => (
        <article key={post.id}>
          <header>
            <h1>
              <a href={`/${post.id}`}>{post.title}</a>
            </h1>
          </header>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
          {post.hasMore && (
            <a className="more-link" href={`/${post.id}#lees-verder`}>
              Lees verder →
            </a>
          )}
          <footer className="entry-meta">{post.date}</footer>
        </article>
      ))}
      <PostsPagination pageCount={pageCount} />
    </Layout>
  );
};

export default Home;
