import Layout, { LayoutProps } from "../components/layout";
import "../styles/global.css";

type AppProps = {
  Component: React.FC<JSX.ElementAttributesProperty>;
  pageProps: { layoutProps: LayoutProps } & JSX.ElementAttributesProperty;
};

const App: React.FC<AppProps> = ({
  Component,
  pageProps: { layoutProps, ...props },
}) => {
  return (
    <Layout {...layoutProps}>
      <Component {...props} />
    </Layout>
  );
};

export default App;
