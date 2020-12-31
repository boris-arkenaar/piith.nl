import fs from "fs";
import matter from "gray-matter";
import { join } from "path";
import remark from "remark";
import html from "remark-html";

const pagesDirectory = join(process.cwd(), "content/pages");
const postsPerPage = 3;
const postsDirectory = join(process.cwd(), "content/articles");

type PostData = {
  content: string;
  date: string;
  hasMore: boolean;
  id: string;
  title: string;
};

const getPostData = async (fileName: string): Promise<PostData> => {
  const id = getArticleIdFromFileName(fileName);
  const fullPath = join(postsDirectory, fileName);
  const rawContent = fs.readFileSync(fullPath, "utf8");
  const frontMatter = matter(rawContent);
  const [content, ...more] = frontMatter.content.split("<!--more-->");
  const hasMore = more.length > 0;
  return {
    content,
    date: frontMatter.data.date.toISOString(),
    hasMore,
    id,
    title: frontMatter.data.title,
  };
};

export const getPostsData = async (page: number): Promise<PostData[]> => {
  const fileNames = fs.readdirSync(postsDirectory);
  const end = page * postsPerPage;
  const start = end - postsPerPage;
  return await Promise.all(
    fileNames.reverse().slice(start, end).map(getPostData)
  );
};

export const getPostsPages = (): string[] => {
  const fileNames = fs.readdirSync(postsDirectory);
  const pageCount = Math.ceil(fileNames.length / postsPerPage);
  return new Array(pageCount).fill(0).map((_, i) => (i + 1).toString());
};

const getPageIdFromFileName = (fileName: string): string =>
  fileName.replace(/\.md$/, "");
const getArticleIdFromFileName = (fileName: string): string =>
  fileName.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.md$/, "");

export const getPageNames = (): string[] => {
  return [
    ...fs.readdirSync(postsDirectory).map(getArticleIdFromFileName),
    ...fs.readdirSync(pagesDirectory).map(getPageIdFromFileName),
  ];
};

const getArticleContent = (id: string): string | undefined => {
  const fileName = fs
    .readdirSync(postsDirectory)
    .find((fileName) => getArticleIdFromFileName(fileName) === id);
  return fileName && fs.readFileSync(join(postsDirectory, fileName), "utf8");
};

const getPageContent = (id: string): string | undefined => {
  const fileName = fs
    .readdirSync(pagesDirectory)
    .find((fileName) => getPageIdFromFileName(fileName) === id);
  return fileName && fs.readFileSync(join(pagesDirectory, fileName), "utf8");
};

type Page = {
  content: string;
  title: string;
};

export const getPage = async (id: string): Promise<Page> => {
  const rawContent = getPageContent(id) || getArticleContent(id);
  const frontMatter = matter(rawContent);
  const processedContent = await remark()
    .use(html)
    .process(frontMatter.content);
  const content = processedContent.toString();
  return {
    content,
    title: frontMatter.data.title,
  };
};
