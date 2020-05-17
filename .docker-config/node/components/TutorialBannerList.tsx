import Link from 'next/link';
import { useState, useEffect } from 'react';

const colorWeights = {
    black: 1,
    pink: 2,
    white: 3,
    teal: 4
};

const colors = ['black', 'pink', 'white', 'teal'];

export const TutorialBannerList = (props: any) => {
    const [sorted, setSorted] = useState([]);

    const byColor = (a: any, b: any): number => {

        const colorA = a.color;
        const colorB = b.color;

        return colorWeights[colorA] - colorWeights[colorB];
    }

    const generateFourColor = (tutorials: any[]): any[] => {
        const sortedTutorials = [];

        // Extract 4 tutorials in this order as much as possible
        while (checkForFourColors(tutorials)) {
            colors.forEach((color) => {
                const index = tutorials.findIndex((tutorial) => { return tutorial.color === color; });
                sortedTutorials.push(tutorials[index]);
                tutorials.splice(index, 1);
            });
        }

        // Sort the remaining ones by color
        tutorials.sort(byColor);

        return [...sortedTutorials, ...tutorials];
    }

    const checkForFourColors = (tutorials: any[]) => {

        let black, pink, teal, white;

        black = (tutorials.some((tutorial) => { return tutorial.color === 'black' })) ? true : false;
        pink = (tutorials.some((tutorial) => { return tutorial.color === 'pink' })) ? true : false;
        teal = (tutorials.some((tutorial) => { return tutorial.color === 'teal' })) ? true : false;
        white = (tutorials.some((tutorial) => { return tutorial.color === 'white' })) ? true : false;

        return black && pink && teal && white;
    }

    const { tutorials } = props;

    useEffect(() => {
        setSorted(generateFourColor(tutorials));
    }, []);

    return (
        <div className="content-list">
            {sorted && sorted.map((tutorial, index) => {
                return (<TutorialBanner tutorial={tutorial} key={index} />)
            })}
        </div>
    );
};

const TutorialBanner = (props) => {

    const { tutorial } = props;
    const { color, description, featuredImage } = tutorial;

    return (
        <div className={`tutorial-banner tutorial-banner--${color.toLowerCase()}`}>
            <Link href={`/tutorial/${tutorial.slug}`}>
                <a className={`tutorial-banner__link`}>
                    <div className="banner-inner">
                        <h1 className="banner-inner__header">{tutorial.title}</h1>
                        <p className="banner-inner__description">{description[0].firstLine}</p>
                        <p className="banner-inner__description">{description[0].secondLine}</p>
                    </div>
                    {featuredImage.length > 0 && <div className="banner-image">
                        <img className="tutorial-banner__image" src={featuredImage[0].url} />
                    </div>}
                </a>
            </Link>
        </div>
    );
};
