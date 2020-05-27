import Head from 'next/head';
import React, { useEffect, useState, useContext } from 'react';
import { parseCookies } from 'nookies';

import { NavigationBar } from './NavigationBar';
import { InformationSection } from './InformationSection';
import { Footer } from './Footer';
import { CraftQL } from '../util/services/craftGQL';
import { AllTutorialsQuery } from '../util/queries/tutorialsQuery';

const defaultImage = 'https://s3.us-east-1.amazonaws.com/zerochass-assets/images/zerochass-rect.PNG';

interface LayoutProps {
    children?: any,
    pageTitle: string,
    description?: string,
    keywords?: string,
    slug?: string,
    image?: string,
    large?: boolean
};

interface AuthContext {
    isAuthenticated: boolean,
    profileImageUrl: string
};


export const AuthenticationContext: React.Context<AuthContext> = React.createContext({
    isAuthenticated: null,
    profileImageUrl: null
});

export const Layout = (props: LayoutProps) => {

    const { children, pageTitle, description, keywords, slug, image, large } = props;
    const fullPageTitle = `${pageTitle} | Zerochass`;
    const [tutorial, setTutorial] = useState(null);

    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [profileImageUrl, setProfileImageUrl] = useState(null);

    /** Sets the tutorial of the day */
    useEffect(() => {

        const fetchTutorialOfDay = async () => {
            const tutorials = await CraftQL(AllTutorialsQuery());

            const randomGenerator = () => {
                let seed = new Date().getDate() + 5;
                const x = Math.sin(seed++);
                return (x - Math.floor(x)) * tutorials.length;
            };

            const randomNumber = Math.floor(randomGenerator());
            const randomTutorial = tutorials[randomNumber];
            setTutorial(randomTutorial);
        };

        fetchTutorialOfDay();
    }, []);

    /** Determines if a user is authenticated client-side */
    useEffect(() => {

        const { zerochassClientCookie } = parseCookies();

        if (zerochassClientCookie) {
            const { authenticated, expires, profileImageUrl } = JSON.parse(zerochassClientCookie);
            setIsAuthenticated(authenticated);
            setProfileImageUrl(profileImageUrl);
        }

    }, [isAuthenticated, profileImageUrl]);

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="url" content={`${process.env.NEXT_PUBLIC_CANONICAL_ROOT}/${slug}`} />
                <meta name="description" content={description} />
                <meta name="keywords" content={keywords} />
                <meta name="robots" content="index, follow" />

                {/** Twitter metas */}
                <meta name="twitter:card" content={(large) ? 'summary_large_image' : 'summary'} />
                <meta name="twitter:site" content="@zerochass" />
                <meta name="twitter:title" content={fullPageTitle} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={(image) ? image : defaultImage} />

                <title>{fullPageTitle}</title>

                {/** Scripts */}
                <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>
                <script async src="https://www.googletagmanager.com/gtag/js?id=UA-163465719-1"></script>
                <script>
                    {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag("js", new Date());
                    gtag("config", "UA-163465719-1");
                    `}
                </script>
            </Head>
            <section className="layout">
                <AuthenticationContext.Provider value={{ isAuthenticated, profileImageUrl }}>
                    <NavigationBar tutorial={tutorial} />
                    <div className="app__body">{children}</div>
                </AuthenticationContext.Provider>
            </section>
            <InformationSection />
            <Footer />
        </>
    )
};