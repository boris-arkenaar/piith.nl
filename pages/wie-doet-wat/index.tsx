import { GetStaticProps } from "next";
import Link from "next/link";
import { Fragment, useMemo } from "react";
import PractitionerLogo from "../../components/practitioner-logo";

import {
  getLayoutProps,
  getPage,
  getPractitioners,
  PageData,
  PractitionerData,
} from "../../lib/api";
import { processMarkdown } from "../../lib/md";

export const getStaticProps: GetStaticProps = async () => {
  const merge = require("deepmerge");
  const githubSchema = require("hast-util-sanitize/lib/github");
  const sanitizeSchema = merge(githubSchema, {
    attributes: { "*": ["className"] },
  });
  return {
    props: {
      layoutProps: getLayoutProps(),
      page: getPage("wie-doet-wat"),
      practitioners: getPractitioners(),
      sanitizeSchema,
    },
  };
};

type PageProps = {
  page: PageData;
  practitioners: PractitionerData[];
  sanitizeSchema: any;
};

const Practitioners: React.FC<PageProps> = ({
  page,
  practitioners,
  sanitizeSchema,
}) => {
  const processedContent = useMemo(
    () => processMarkdown(page.content, sanitizeSchema),
    [page]
  );

  return (
    <article>
      <header>
        <h1>{page.title}</h1>
      </header>
      {processedContent}
      {practitioners.map((practitioner) => (
        <Fragment key={practitioner.id}>
          <h2 className="who-header">
            <Link href={`/wie-doet-wat/${practitioner.id}`}>
              <a>
                <PractitionerLogo
                  className="alignleft who-logo"
                  practitioner={practitioner}
                />
                {practitioner.name}
              </a>
            </Link>
          </h2>
          {practitioner.activities.length > 0 && (
            <ul className="who-list">
              {practitioner.activities.map((activity) => (
                <li className="menu-item" key={activity}>
                  {activity}
                </li>
              ))}
            </ul>
          )}
        </Fragment>
      ))}
    </article>
  );
};

export default Practitioners;
