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
  const id = fileName.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, fileName);
  const rawContent = fs.readFileSync(fullPath, "utf8");
  const frontMatter = matter(rawContent);
  const splitContent = frontMatter.content.split("<!--more-->");
  const introContent = splitContent[0];
  const hasMore = splitContent.length > 1;
  const processedContent = await remark().use(html).process(introContent);
  const content = processedContent.toString();
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

export const getPageNames = (): string[] => {
  return fs.readdirSync(pagesDirectory);
  // return [...fs.readdirSync(postsDirectory), ...fs.readdirSync(pagesDirectory)];
};

type Page = {
  content: string;
  title: string;
};

export const getPage = async (fileName: string): Promise<Page> => {
  const fullPath = join(pagesDirectory, fileName);
  const rawContent = fs.readFileSync(fullPath, "utf8");
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
