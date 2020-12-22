import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="nl">
        <Head />
        <body>
          <Main />
          <NextScript />
          <script>
            {`
if (window.netlifyIdentity) {
  window.netlifyIdentity.on("init", function (user) {
    if (!user) {
      window.netlifyIdentity.on("login", function () {
        document.location.href = "/admin/";
      });
    }
  });
}
            `}
          </script>
        </body>
      </Html>
    );
  }
}
