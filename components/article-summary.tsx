type ArticleSummaryProps = {
  article: any;
};

const ArticleSummary: React.FC<ArticleSummaryProps> = ({ article }) => {
  return (
    <article>
      <header>
        <h1>
          <a href={`/${article.id}`}>{article.title}</a>
        </h1>
      </header>
      {article.content}
      {article.hasMore && (
        <a className="more-link" href={`/${article.id}#lees-verder`}>
          Lees verder →
        </a>
      )}
      <footer className="entry-meta">{article.date}</footer>
    </article>
  );
};

export default ArticleSummary;
