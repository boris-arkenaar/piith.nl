import { GetStaticProps, GetStaticPaths } from "next";

import Layout from "../components/layout";
import { getPage, getPageNames } from "../lib/api";

export const getStaticProps: GetStaticProps = async ({ params }) => {
  return {
    props: {
      page: await getPage(
        Array.isArray(params.pageName) ? params.pageName[0] : params.pageName
      ),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: getPageNames().map((page) => ({
      params: {
        pageName: page,
      },
    })),
    fallback: false,
  };
};

type PageProps = {
  page: any;
};

const Page: React.FC<PageProps> = ({ page }) => (
  <Layout>
    <article>
      <header>
        <h1>{page.title}</h1>
      </header>
      <div dangerouslySetInnerHTML={{ __html: page.content }} />
    </article>
  </Layout>
);

export default Page;
