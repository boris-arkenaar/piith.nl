import { GetStaticProps } from "next";
import { getLayoutProps } from "../lib/api";

import dynamic, { LoaderComponent } from "next/dynamic";

const CMS = dynamic(
  () => import("../components/cms") as unknown as LoaderComponent<unknown>,
  { ssr: false, loading: () => <p>Loading...</p> }
);

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      layoutProps: {
        ...getLayoutProps(),
        enabled: false,
      },
    },
  };
};

const Admin: React.FC = () => {
  return <CMS />;
};

export default Admin;
