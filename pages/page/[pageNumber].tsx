import { GetStaticProps, GetStaticPaths } from "next";

import Layout from "../../components/layout";
import PostsPagination from "../../components/posts-pagination";
import { getPostsData, getPostsPages } from "../../lib/api";

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const pageNumber = parseInt(
    Array.isArray(params.pageNumber) ? params.pageNumber[0] : params.pageNumber
  );
  return {
    props: {
      currentPage: pageNumber,
      pageCount: getPostsPages().length,
      posts: await getPostsData(pageNumber),
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
};

const Page: React.FC<PageProps> = ({ currentPage, pageCount, posts }) => (
  <Layout>
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
    <PostsPagination currentPage={currentPage} pageCount={pageCount} />
  </Layout>
);

export default Page;
