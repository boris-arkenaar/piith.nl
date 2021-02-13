import Link from "next/link";

type MarkdownLinkProps = {
  href: string;
};

const MarkdownLink: React.FC<MarkdownLinkProps> = ({
  children,
  href,
  ...props
}) =>
  href ? (
    <Link href={href}>
      <a {...props}>{children}</a>
    </Link>
  ) : (
    <a {...props}>{children}</a>
  );
export default MarkdownLink;
