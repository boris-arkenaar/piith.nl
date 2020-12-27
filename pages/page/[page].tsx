import { GetStaticProps, GetStaticPaths } from "next";

import Layout from "../../components/layout";
import PostsPagination from "../../components/posts-pagination";
import { getPostsData, getPostsPages } from "../../lib/api";

export const getStaticProps: GetStaticProps = async ({ params }) => {
  return {
    props: {
      currentPage: parseInt(params.page.toString(), 10),
      pageCount: (await getPostsPages()).length,
      posts: await getPostsData(params.page),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: (await getPostsPages()).map((page) => ({
      params: {
        page,
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
