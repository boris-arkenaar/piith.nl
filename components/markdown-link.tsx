import Link from "next/link";

type MarkdownLinkProps = {
  children: any;
  href: string;
};

const MarkdownLink: React.FC<MarkdownLinkProps> = ({
  children,
  href,
  ...props
}) =>
  href ? (
    <Link href={href} {...props}>
      {children}
    </Link>
  ) : (
    <a {...props}>{children}</a>
  );
export default MarkdownLink;
