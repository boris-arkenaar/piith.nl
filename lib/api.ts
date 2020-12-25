import fs from "fs";
import matter from "gray-matter";
import { join } from "path";
import remark from "remark";
import html from "remark-html";

const postsPerPage = 3;
const postsDirectory = join(process.cwd(), "content/articles");

const getPostData = async (fileName) => {
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

export const getPostsData = async (page) => {
  const fileNames = fs.readdirSync(postsDirectory);
  const end = page * postsPerPage;
  const start = end - postsPerPage;
  return Promise.all(fileNames.reverse().slice(start, end).map(getPostData));
};

export const getPostsPages = async () => {
  const postsDirectory = join(process.cwd(), "content/articles");
  const fileNames = fs.readdirSync(postsDirectory);
  const pageCount = Math.ceil(fileNames.length / postsPerPage);
  return new Array(pageCount).fill(0).map((_, i) => (i + 1).toString());
};
