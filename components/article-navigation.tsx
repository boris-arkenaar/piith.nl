import Link from "next/link";

import { PageData } from "../lib/api";

type ArticleNavigationProps = {
  next?: PageData;
  previous?: PageData;
};

const ArticleNavigation: React.FC<ArticleNavigationProps> = ({
  next,
  previous,
}) => {
  return (
    <nav className="nav-single">
      <h3 className="assistive-text">Post navigation</h3>
      {previous && (
        <span className="nav-previous">
          <Link href={`/${previous.id}`} rel="prev">
            <span className="meta-nav">←</span> {previous.title}
          </Link>
        </span>
      )}
      {next && (
        <span className="nav-next">
          <Link href={`/${next.id}`} rel="next">
            {next.title} <span className="meta-nav">→</span>
          </Link>
        </span>
      )}
    </nav>
  );
};

export default ArticleNavigation;
