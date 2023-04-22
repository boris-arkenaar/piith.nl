import Head from "next/head";

type TitleProps = {
  title: string;
};

const Title: React.FC<TitleProps> = ({ title }) =>
  title ? (
    <Head>
      <title>{title} | Piith</title>
    </Head>
  ) : (
    <Head>
      <title>Piith</title>
    </Head>
  );

export default Title;
