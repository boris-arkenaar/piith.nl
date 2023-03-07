import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

import { LayoutProps } from "../components/layout";

const pagesDirectory = join(process.cwd(), "content/pages");
const articlesPerPage = 3;
const articlesDirectory = join(process.cwd(), "content/articles");
const practitionersDirectory = join(process.cwd(), "content/practitioners");

const getIdFromFileName = (fileName: string): string =>
  fileName.replace(/\.md$/, "");

const getAliasFromId = (id: string): string =>
  id.substring(id.indexOf("_") + 1);

const getAliasFromFileName = (fileName: string): string =>
  getAliasFromId(getIdFromFileName(fileName));

const getDateFromId = (id: string): string =>
  `${id.substring(0, id.indexOf("_"))}Z`;

export type PageData = {
  alias?: string;
  content: string;
  date?: string;
  excerpt?: string;
  id: string;
  isArticle: boolean;
  label?: string;
  menuWeight?: number;
  nextArticle?: PageData;
  previousArticle?: PageData;
  showInLeftMenu?: boolean;
  showInRightMenu?: boolean;
  showInTopMenu?: boolean;
  title: string;
};

const getPageData = (fileName: string): PageData => {
  const id = getIdFromFileName(fileName);
  const rawContent = fs.readFileSync(join(pagesDirectory, fileName), "utf8");
  const frontMatter = matter(rawContent);
  return {
    content: frontMatter.content,
    id,
    isArticle: false,
    label: frontMatter.data.label || "",
    menuWeight: frontMatter.data.menuWeight || 0,
    showInLeftMenu: Boolean(frontMatter.data.showInLeftMenu),
    showInRightMenu: Boolean(frontMatter.data.showInRightMenu),
    showInTopMenu: Boolean(frontMatter.data.showInTopMenu),
    title: frontMatter.data.title,
  };
};

const getArticleData = (fileName: string): PageData => {
  const id = getIdFromFileName(fileName);
  const date = getDateFromId(id);
  const alias = getAliasFromId(id);
  const rawContent = fs.readFileSync(join(articlesDirectory, fileName), "utf8");
  const {
    content,
    excerpt,
    data: { title },
  } = matter(rawContent, { excerpt_separator: "<!--more-->" });
  return {
    content,
    date,
    excerpt,
    id,
    alias,
    isArticle: true,
    title,
  };
};

export const getArticles = (page?: number): PageData[] => {
  const end = page ? page * articlesPerPage : undefined;
  const start = page ? end - articlesPerPage : 0;
  return fs
    .readdirSync(articlesDirectory)
    .map((name) => getArticleData(name))
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(start, end);
};

export const getArticlesPagination = (): string[] => {
  const fileNames = fs.readdirSync(articlesDirectory);
  const pageCount = Math.ceil(fileNames.length / articlesPerPage);
  return new Array(pageCount).fill(0).map((_, i) => (i + 1).toString());
};

export const getPageNames = (): string[] => {
  return [
    ...fs.readdirSync(articlesDirectory).map(getAliasFromFileName),
    ...fs
      .readdirSync(pagesDirectory)
      .map(getIdFromFileName)
      .filter((id) => id !== "wie-doet-wat"),
  ];
};

const getArticleDataByAlias = (alias: string): PageData | undefined => {
  const articles = getArticles();
  const currentIndex = articles.findIndex((article) => article.alias === alias);
  const currentArticle = currentIndex > -1 && articles[currentIndex];
  const nextArticle = currentIndex - 1 >= 0 && articles[currentIndex - 1];
  const previousArticle =
    currentArticle &&
    currentIndex + 1 < articles.length &&
    articles[currentIndex + 1];
  return (
    currentArticle && {
      ...currentArticle,
      nextArticle,
      previousArticle,
    }
  );
};

const getPageFileNameById = (id: string): string | undefined =>
  fs
    .readdirSync(pagesDirectory)
    .find((fileName) => getIdFromFileName(fileName) === id);

export const getPage = (id: string): PageData => {
  const pageFileName = getPageFileNameById(id);
  const isArticle = !pageFileName;
  return isArticle ? getArticleDataByAlias(id) : getPageData(pageFileName);
};

const getMenuItems = (): {
  leftMenuItems: PageData[];
  rightMenuItems: PageData[];
  topMenuItems: PageData[];
} => {
  const pageNames = fs.readdirSync(pagesDirectory);
  const pages = pageNames.map(getPageData);
  const leftMenuItems = pages.filter((page) => page.showInLeftMenu);
  const rightMenuItems = pages.filter((page) => page.showInRightMenu);
  const topMenuItems = pages
    .filter((page) => page.showInTopMenu)
    .sort((a, b) => (a.menuWeight > b.menuWeight ? 1 : -1));
  return {
    leftMenuItems,
    rightMenuItems,
    topMenuItems,
  };
};

export const getLayoutProps = (): LayoutProps => getMenuItems();

export type PractitionerData = {
  activities: string[];
  company: string;
  companyLink: string;
  companyLogo: string;
  content: string;
  id: string;
  menuWeight: number;
  name: string;
  showInMenu: boolean;
};

const getPractitionerData = (fileName: string): PractitionerData => {
  const id = getIdFromFileName(fileName);
  const rawContent = fs.readFileSync(
    join(practitionersDirectory, fileName),
    "utf8"
  );
  const frontMatter = matter(rawContent);
  return {
    activities: frontMatter.data.activities || [],
    company: frontMatter.data.company || "",
    companyLink: frontMatter.data.companyLink || "",
    companyLogo: frontMatter.data.companyLogo || "",
    content: frontMatter.content,
    id,
    menuWeight: frontMatter.data.menuWeight || 0,
    name: frontMatter.data.name,
    showInMenu: Boolean(frontMatter.data.showInMenu),
  };
};

export const getPractitionerNames = (): string[] =>
  fs.readdirSync(practitionersDirectory).map(getIdFromFileName);

const getPractitionerFileNameById = (id: string): string | undefined =>
  fs
    .readdirSync(practitionersDirectory)
    .find((fileName) => getIdFromFileName(fileName) === id);

export const getPractitioner = (id: string): PractitionerData =>
  getPractitionerData(getPractitionerFileNameById(id));

export const getPractitioners = (): PractitionerData[] =>
  fs
    .readdirSync(practitionersDirectory)
    .map(getPractitionerData)
    .sort((a, b) => (a.menuWeight > b.menuWeight ? 1 : -1));
