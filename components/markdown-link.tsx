import Link from "next/link";

type MarkdownLinkProps = {
  href: string;
};

const MarkdownLink: React.FC<MarkdownLinkProps> = ({
  children,
  href,
  ...props
}) => (
  <Link href={href}>
    <a {...props}>{children}</a>
  </Link>
);

export default MarkdownLink;
