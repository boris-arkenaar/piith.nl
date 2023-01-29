import Button from "@material-ui/core/Button";
import Pagination from "@material-ui/lab/Pagination";
import PaginationItem from "@material-ui/lab/PaginationItem";
import Link from "next/link";

const ButtonLink = ({ children, href, ...buttonLinkProps }) => (
  <Link href={href} {...buttonLinkProps}>
    {children}
  </Link>
);

type PostsPaginationProps = {
  currentPage?: number;
  pageCount: number;
};

const PostsPagination: React.FC<PostsPaginationProps> = ({
  currentPage,
  pageCount,
}) => {
  const renderPaginationItem = (paginationItemProps) => {
    const ItemButton = ({ children, ...itemButtonProps }) => {
      const href =
        paginationItemProps.page === 1
          ? "/"
          : `/page/${paginationItemProps.page}`;
      return (
        <Button href={href} component={ButtonLink} {...itemButtonProps}>
          {children}
        </Button>
      );
    };
    return <PaginationItem component={ItemButton} {...paginationItemProps} />;
  };

  return (
    <div className="pagination">
      <Pagination
        count={pageCount}
        defaultPage={currentPage}
        renderItem={renderPaginationItem}
      />
    </div>
  );
};

export default PostsPagination;
