import Link from "next/link";

import { PageData } from "../lib/api";

export type LayoutProps = {
  children?: any;
  enabled?: boolean;
  leftMenuItems: PageData[];
  rightMenuItems: PageData[];
  topMenuItems: PageData[];
};

const Layout: React.FC<LayoutProps> = ({
  children,
  enabled = true,
  leftMenuItems,
  rightMenuItems,
  topMenuItems,
}) =>
  enabled ? (
    <div id="outer">
      <div id="mainSpacerTop"></div>
      <div id="main">
        <div id="mainHead">
          <header>
            <h1>
              <Link href="/" rel="home">
                <span>Piith</span>
              </Link>
            </h1>
            <h2>Professionele Integratieve Interactieve Therapeuten</h2>
          </header>
          <nav>
            <div className="menu-links-container">
              <ul id="menu-links" className="main-menu main-menu-left">
                {leftMenuItems && leftMenuItems[0] && (
                  <li>
                    <Link href={`/${leftMenuItems[0].id}`}>
                      {leftMenuItems[0].label || leftMenuItems[0].title}
                    </Link>
                  </li>
                )}
              </ul>
            </div>
            <div className="menu-rechts-container">
              <ul id="menu-rechts" className="main-menu main-menu-right">
                {rightMenuItems && rightMenuItems[0] && (
                  <li>
                    <Link href={`/${rightMenuItems[0].id}`}>
                      {rightMenuItems[0].label || rightMenuItems[0].title}
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </nav>
        </div>
        <div id="mainContent">{children}</div>
        <nav>
          <div className="menu-top-container">
            <ul id="menu-top" className="top-menu">
              <li>
                <Link href="/">home</Link>
              </li>
              {topMenuItems &&
                topMenuItems.map((item) => (
                  <li key={item.id}>
                    <Link href={`/${item.id}`}>{item.label || item.title}</Link>
                  </li>
                ))}
            </ul>
          </div>
        </nav>
        <div id="mc_embed_signup" className="newsletter-widget">
          <form
            action="https://piith.us7.list-manage1.com/subscribe/post?u=8f3a33283f070bfde53fa0d38&amp;id=1c635e357f"
            method="post"
            id="mc-embedded-subscribe-form"
            name="mc-embedded-subscribe-form"
            className="validate"
            target="_blank"
            noValidate
          >
            <h1>Schrijf je in voor de Piith-noot, nieuwsbrief</h1>
            <div className="mc-field-group">
              <label htmlFor="mce-EMAIL">Naam </label>
              <input
                type="text"
                defaultValue=""
                name="NAME"
                className="required"
                id="mce-NAME"
                placeholder="naam"
              />
              <label htmlFor="mce-EMAIL">Email adres </label>
              <input
                type="email"
                defaultValue=""
                name="EMAIL"
                className="required email"
                id="mce-EMAIL"
                placeholder="email"
              />
            </div>
            <div id="mce-responses" className="clear">
              <div
                className="response"
                id="mce-error-response"
                style={{ display: "none" }}
              ></div>
              <div
                className="response"
                id="mce-success-response"
                style={{ display: "none" }}
              ></div>
            </div>
            <div className="clear">
              <input
                type="submit"
                value="Aanmelden"
                name="subscribe"
                id="mc-embedded-subscribe"
                className="button"
              />
            </div>
          </form>
        </div>
        <div className="social">
          <a href="https://www.facebook.com/piith.zegmaarpit">
            <img alt="Facebook" src="/facebook.svg" width="32" height="32" />
          </a>
        </div>
      </div>
      <div id="mainFooter">
        <p className="copyright">© 2013–2021 Piith</p>
        <p className="author">
          Deze website is gemaakt door <a href="http://apptoad.nl">appTOAD</a>.
        </p>
      </div>
    </div>
  ) : (
    <>{children}</>
  );

export default Layout;
