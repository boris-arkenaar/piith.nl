import { GetStaticProps, GetStaticPaths } from "next";
import { useMemo } from "react";

import ArticleSummary from "../../components/article-summary";
import Layout from "../../components/layout";
import PostsPagination from "../../components/posts-pagination";
import { getPostsData, getPostsPages } from "../../lib/api";
import { processMarkdown } from "../../lib/md";

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const pageNumber = parseInt(
    Array.isArray(params.pageNumber) ? params.pageNumber[0] : params.pageNumber
  );
  const merge = require("deepmerge");
  const githubSchema = require("hast-util-sanitize/lib/github");
  const sanitizeSchema = merge(githubSchema, {
    attributes: { "*": ["className"] },
  });
  return {
    props: {
      currentPage: pageNumber,
      pageCount: getPostsPages().length,
      posts: await getPostsData(pageNumber),
      sanitizeSchema,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: getPostsPages().map((page) => ({
      params: {
        pageNumber: page,
      },
    })),
    fallback: false,
  };
};

type PageProps = {
  currentPage: number;
  pageCount: number;
  posts: any;
  sanitizeSchema: any;
};

const Page: React.FC<PageProps> = ({
  currentPage,
  pageCount,
  posts,
  sanitizeSchema,
}) => {
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
      {processedPosts.map((post) => (
        <ArticleSummary article={post} key={post.id} />
      ))}
      <PostsPagination currentPage={currentPage} pageCount={pageCount} />
    </Layout>
  );
};

export default Page;
