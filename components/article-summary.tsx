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
          <Link href={`/${article.id}`}>{article.title}</Link>
        </h1>
      </header>
      {article.excerpt || article.content}
      {article.excerpt && (
        <p>
          <Link href={`/${article.id}#lees-verder`} className="more-link">
            Lees verder →
          </Link>
        </p>
      )}
      <footer className="entry-meta">{formatDate(article.date)}</footer>
    </article>
  );
};

export default ArticleSummary;
