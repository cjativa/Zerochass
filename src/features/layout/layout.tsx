import Head from "next/head";
import React, { useEffect, useState, useContext } from "react";
import { parseCookies } from "nookies";

import { NavigationBar } from "../../components/navigationBar/navigationBar";
import { InformationSection } from "../../components/informationSection/informationSection";
import { Footer } from "../../components/footer/footer";
import { AuthenticationContext } from "../../components/contexts";
import { useAuthenticationModal } from "../../hooks/useAuthenticationModal";

const defaultImage =
  "https://s3.us-east-1.amazonaws.com/zerochass-assets/images/zerochass-rect.PNG";

interface LayoutProps {
  children?: any;
  pageTitle: string;
  description?: string;
  keywords?: string;
  slug?: string;
  image?: string;
  large?: boolean;
}

export const Layout = (props: LayoutProps) => {
  const { children, pageTitle, description, keywords, slug, image, large } =
    props;
  const fullPageTitle = `${pageTitle} | Zerochass`;
  const [tutorial, setTutorial] = useState(null);

  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  const { toggleAuthenticationModal, AuthModal } = useAuthenticationModal();

  /** Determines if a user is authenticated client-side */
  useEffect(() => {
    const { zerochassClientCookie } = parseCookies();

    if (zerochassClientCookie) {
      const { authenticated, expires, profileImageUrl } = JSON.parse(
        zerochassClientCookie
      );
      setIsAuthenticated(authenticated);
      setProfileImageUrl(profileImageUrl);
    }
  }, [isAuthenticated, profileImageUrl]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="url"
          content={`${process.env.NEXT_PUBLIC_CANONICAL_ROOT}/${slug}`}
        />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="robots" content="index, follow" />

        {/** Twitter metas */}
        <meta
          name="twitter:card"
          content={large ? "summary_large_image" : "summary"}
        />
        <meta name="twitter:site" content="@zerochass" />
        <meta name="twitter:title" content={fullPageTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image ? image : defaultImage} />

        <title>{fullPageTitle}</title>

        {/** Scripts */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=UA-163465719-1"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag("js", new Date());
                    gtag("config", "UA-163465719-1");
                    `,
          }}
        ></script>
        <script
          async
          src="https://platform.twitter.com/widgets.js"
          charSet="utf-8"
        ></script>
      </Head>
      <section className="layout">
        <AuthenticationContext.Provider
          value={{
            isAuthenticated,
            profileImageUrl,
            toggleAuthenticationModal,
          }}
        >
          <NavigationBar />
          <div className="app__body">{children}</div>

          <InformationSection />

          {/** Render the auth dialog  */}
          <AuthModal />
        </AuthenticationContext.Provider>
      </section>
      <Footer />
    </>
  );
};
