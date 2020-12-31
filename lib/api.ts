import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

const pagesDirectory = join(process.cwd(), "content/pages");
const postsPerPage = 3;
const postsDirectory = join(process.cwd(), "content/articles");

const getArticleIdFromFileName = (fileName: string): string =>
  fileName.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.md$/, "");

const getPageIdFromFileName = (fileName: string): string =>
  fileName.replace(/\.md$/, "");

type PageData = {
  content: string;
  date?: string;
  hasMore?: boolean;
  id: string;
  isArticle: boolean;
  title: string;
};

const getPageData = (fileName: string): PageData => {
  const id = getPageIdFromFileName(fileName);
  const rawContent = fs.readFileSync(join(pagesDirectory, fileName), "utf8");
  const frontMatter = matter(rawContent);
  return {
    content: frontMatter.content,
    id,
    isArticle: false,
    title: frontMatter.data.title,
  };
};

const getArticleData = (fileName: string): PageData => {
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
    isArticle: true,
    title: frontMatter.data.title,
  };
};

export const getPostsData = (page: number): PageData[] => {
  const fileNames = fs.readdirSync(postsDirectory);
  const end = page * postsPerPage;
  const start = end - postsPerPage;
  return fileNames.reverse().slice(start, end).map(getArticleData);
};

export const getPostsPages = (): string[] => {
  const fileNames = fs.readdirSync(postsDirectory);
  const pageCount = Math.ceil(fileNames.length / postsPerPage);
  return new Array(pageCount).fill(0).map((_, i) => (i + 1).toString());
};

export const getPageNames = (): string[] => {
  return [
    ...fs.readdirSync(postsDirectory).map(getArticleIdFromFileName),
    ...fs.readdirSync(pagesDirectory).map(getPageIdFromFileName),
  ];
};

const getArticleFileNameById = (id: string): string | undefined =>
  fs
    .readdirSync(postsDirectory)
    .find((fileName) => getArticleIdFromFileName(fileName) === id);

const getPageFileNameById = (id: string): string | undefined =>
  fs
    .readdirSync(pagesDirectory)
    .find((fileName) => getPageIdFromFileName(fileName) === id);

export const getPage = (id: string): PageData => {
  const pageFileName = getPageFileNameById(id);
  const isArticle = !pageFileName;
  const fileName = pageFileName || getArticleFileNameById(id);
  return isArticle ? getArticleData(fileName) : getPageData(fileName);
};
