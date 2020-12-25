import fs from "fs";
import matter from "gray-matter";
import { GetStaticProps } from "next";
import Head from "next/head";
import { join } from "path";
import remark from "remark";
import html from "remark-html";

import Layout from "../components/layout";
import { getPostsData } from "../lib/api";

const home = join(process.cwd(), "content/home.md");

export const getStaticProps: GetStaticProps = async () => {
  const rawContent = fs.readFileSync(home, "utf8");
  const frontMatter = matter(rawContent);

  const processedContent = await remark()
    .use(html)
    .process(frontMatter.content);
  const htmlContent = processedContent.toString();

  return {
    props: {
      content: htmlContent,
      posts: await getPostsData(1),
      title: frontMatter.data.title,
    },
  };
};

type HomeProps = {
  content: string;
  posts: any;
  title: string;
};

const Home: React.FC<HomeProps> = ({ content, posts, title }) => (
  <Layout>
    <Head>
      <title>{title}</title>
      <link rel="icon" type="image/png" href="/icon.png" />
      <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
    </Head>
    <div dangerouslySetInnerHTML={{ __html: content }} />
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
  </Layout>
);

export default Home;
