import { GetStaticProps, GetStaticPaths } from "next";
import { useMemo } from "react";

import Layout from "../components/layout";
import { getPage, getPageNames } from "../lib/api";
import { processMarkdown } from "../lib/md";

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const merge = require("deepmerge");
  const githubSchema = require("hast-util-sanitize/lib/github");
  const sanitizeSchema = merge(githubSchema, {
    attributes: { "*": ["className"] },
  });
  return {
    props: {
      page: await getPage(
        Array.isArray(params.pageName) ? params.pageName[0] : params.pageName
      ),
      sanitizeSchema,
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
  sanitizeSchema: any;
};

const Page: React.FC<PageProps> = ({ page, sanitizeSchema }) => {
  const processedContent = useMemo(
    () => processMarkdown(page.content, sanitizeSchema),
    [page]
  );

  return (
    <Layout>
      {page.isArticle ? (
        <article>
          <header>
            <h1>{page.title}</h1>
          </header>
          {processedContent}
          <footer className="entry-meta">{page.date}</footer>
        </article>
      ) : (
        <article>
          <header>
            <h1>{page.title}</h1>
          </header>
          {processedContent}
        </article>
      )}
    </Layout>
  );
};

export default Page;
