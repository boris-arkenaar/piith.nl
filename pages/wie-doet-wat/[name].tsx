import { GetStaticProps, GetStaticPaths } from "next";
import { useMemo } from "react";
import PractitionerLogo from "../../components/practitioner-logo";
import deepmerge from "deepmerge";
import { defaultSchema } from "hast-util-sanitize";

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
  const sanitizeSchema = deepmerge(defaultSchema, {
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
                  <PractitionerLogo
                    className="alignleft"
                    practitioner={practitioner}
                  />
                  {practitioner.company}
                </a>
              ) : (
                <>
                  <PractitionerLogo
                    className="alignleft"
                    practitioner={practitioner}
                  />
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
