import "../styles/global.css";

type AppProps = {
  Component: React.FC<JSX.ElementAttributesProperty>;
  pageProps: JSX.ElementAttributesProperty;
};

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default App;
