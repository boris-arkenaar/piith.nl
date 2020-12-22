import Head from "next/head";

import Layout from "../components/layout";

export default function Home(): JSX.Element {
  return (
    <Layout>
      <Head>
        <title>
          Piith | Professionele Integratieve Interactieve Therapeuten
        </title>
        <link rel="icon" type="image/png" href="/icon.png" />
        <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
      </Head>
      <div>Body</div>
    </Layout>
  );
}
