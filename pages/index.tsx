import fs from "fs";
import matter from "gray-matter";
import { GetStaticProps } from "next";
import Head from "next/head";
import { join } from "path";
import remark from "remark";
import html from "remark-html";

import Layout from "../components/layout";

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
      title: frontMatter.data.title,
    },
  };
};

type HomeProps = {
  content: string;
  title: string;
};

const Home: React.FC<HomeProps> = ({ content, title }) => (
  <Layout>
    <Head>
      <title>{title}</title>
      <link rel="icon" type="image/png" href="/icon.png" />
      <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
    </Head>
    <div dangerouslySetInnerHTML={{ __html: content }} />
  </Layout>
);

export default Home;
