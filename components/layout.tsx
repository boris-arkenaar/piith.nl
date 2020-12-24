type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div id="outer">
    <div id="mainSpacerTop"></div>
    <div id="main">
      <div id="mainHead">
        <header>
          <h1>
            <a href="http://piith.nl/" rel="home">
              <span>Piith</span>
            </a>
          </h1>
          <h2>Professionele Integratieve Interactieve Therapeuten</h2>
        </header>
        <nav>
          <div className="menu-links-container">
            <ul id="menu-links" className="main-menu main-menu-left">
              <li
                id="menu-item-2382"
                className="menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-2382"
              >
                <a href="http://piith.nl/wie-doet-wat/">Wat &amp; Wie</a>
              </li>
            </ul>
          </div>
          <div className="menu-rechts-container">
            <ul id="menu-rechts" className="main-menu main-menu-right">
              <li
                id="menu-item-10"
                className="menu-item menu-item-type-post_type menu-item-object-page menu-item-10"
              >
                <a href="http://piith.nl/piith/">Over Piith</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <div id="mainContent">{children}</div>
      <nav>
        <div className="menu-top-container">
          <ul id="menu-top" className="top-menu">
            <li
              id="menu-item-599"
              className="menu-item menu-item-type-custom menu-item-object-custom current-menu-item current_page_item menu-item-home menu-item-599"
            >
              <a href="http://piith.nl/" aria-current="page">
                home
              </a>
            </li>
            <li
              id="menu-item-2044"
              className="menu-item menu-item-type-post_type menu-item-object-page menu-item-2044"
            >
              <a href="http://piith.nl/lesrooster/">lesrooster</a>
            </li>
            <li
              id="menu-item-2257"
              className="menu-item menu-item-type-post_type menu-item-object-page menu-item-2257"
            >
              <a href="http://piith.nl/recensies/">recensies</a>
            </li>
            <li
              id="menu-item-38"
              className="menu-item menu-item-type-post_type menu-item-object-page menu-item-38"
            >
              <a href="http://piith.nl/contact/">contact</a>
            </li>
            <li
              id="menu-item-1992"
              className="menu-item menu-item-type-post_type menu-item-object-page menu-item-1992"
            >
              <a href="http://piith.nl/privacyverklaring/">privacyverklaring</a>
            </li>
          </ul>
        </div>
      </nav>
      <div id="mc_embed_signup" className="newsletter-widget">
        <form
          action="http://piith.us7.list-manage1.com/subscribe/post?u=8f3a33283f070bfde53fa0d38&amp;id=1c635e357f"
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
      <p className="copyright">© 2013–2019 Piith</p>
      <p className="author">
        Deze website is gemaakt door <a href="http://apptoad.nl">appTOAD</a>.
      </p>
    </div>
  </div>
);

export default Layout;
