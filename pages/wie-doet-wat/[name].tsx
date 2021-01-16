import { GetStaticProps, GetStaticPaths } from "next";
import { useMemo } from "react";

import PractitionerNavigation from "../../components/practitioner-navigation";
import {
  getLayoutProps,
  getPractitioner,
  getPractitioners,
  getPractitionerNames,
  PractitionerData,
} from "../../lib/api";
import { processMarkdown } from "../../lib/md";

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const merge = require("deepmerge");
  const githubSchema = require("hast-util-sanitize/lib/github");
  const sanitizeSchema = merge(githubSchema, {
    attributes: { "*": ["className"] },
  });
  return {
    props: {
      layoutProps: getLayoutProps(),
      practitioner: getPractitioner(
        Array.isArray(params.name) ? params.name[0] : params.name
      ),
      practitioners: getPractitioners(),
      sanitizeSchema,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: getPractitionerNames().map((practitioner) => ({
      params: {
        name: practitioner,
      },
    })),
    fallback: false,
  };
};

const renderLogo = (practitioner: PractitionerData) => (
  <img
    className="alignleft"
    src={practitioner.companyLogo}
    alt={`Logo ${practitioner.company}`}
    width="48"
    height="48"
  />
);

type PractitionerProps = {
  practitioner: PractitionerData;
  practitioners: PractitionerData[];
  sanitizeSchema: any;
};

const Practitioner: React.FC<PractitionerProps> = ({
  practitioner,
  practitioners,
  sanitizeSchema,
}) => {
  const processedContent = useMemo(
    () => processMarkdown(practitioner.content, sanitizeSchema),
    [practitioner]
  );

  return (
    <>
      <PractitionerNavigation practitioners={practitioners} />
      <article>
        <header>
          <h1>{practitioner.name}</h1>
          {practitioner.company && (
            <h2 className="company">
              {practitioner.companyLink ? (
                <a href={practitioner.companyLink}>
                  {practitioner.companyLogo && renderLogo(practitioner)}
                  {practitioner.company}
                </a>
              ) : (
                <>
                  {practitioner.companyLogo && renderLogo(practitioner)}
                  {practitioner.company}
                </>
              )}
            </h2>
          )}
        </header>
        {processedContent}
      </article>
    </>
  );
};

export default Practitioner;
