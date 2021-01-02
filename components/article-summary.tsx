import Link from "next/link";

import { formatDate } from "../lib/date";

type ArticleSummaryProps = {
  article: any;
};

const ArticleSummary: React.FC<ArticleSummaryProps> = ({ article }) => {
  return (
    <article>
      <header>
        <h1>
          <Link href={`/${article.id}`}>
            <a>{article.title}</a>
          </Link>
        </h1>
      </header>
      {article.content}
      {article.hasMore && (
        <Link href={`/${article.id}#lees-verder`}>
          <a className="more-link">Lees verder →</a>
        </Link>
      )}
      <footer className="entry-meta">{formatDate(article.date)}</footer>
    </article>
  );
};

export default ArticleSummary;
