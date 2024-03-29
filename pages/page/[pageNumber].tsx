import { GetStaticProps, GetStaticPaths } from "next";
import { useMemo } from "react";
import deepmerge from "deepmerge";
import { defaultSchema } from "hast-util-sanitize";

import ArticleSummary from "../../components/article-summary";
import PostsPagination from "../../components/posts-pagination";
import {
  getArticles,
  getArticlesPagination,
  getLayoutProps,
} from "../../lib/api";
import { processMarkdown } from "../../lib/md";
import Title from "../../components/title";

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const pageNumber = parseInt(
    Array.isArray(params.pageNumber) ? params.pageNumber[0] : params.pageNumber
  );
  const sanitizeSchema = deepmerge(defaultSchema, {
    attributes: { "*": ["className"] },
  });
  return {
    props: {
      currentPage: pageNumber,
      layoutProps: getLayoutProps(),
      pageCount: getArticlesPagination().length,
      posts: getArticles(pageNumber),
      sanitizeSchema,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: getArticlesPagination().map((page) => ({
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
      <Title title="" />
      {processedPosts.map((post) => (
        <ArticleSummary article={post} key={post.id} />
      ))}
      <PostsPagination currentPage={currentPage} pageCount={pageCount} />
    </>
  );
};

export default Page;
