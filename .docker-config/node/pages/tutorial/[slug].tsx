import { useEffect, useState, createRef } from 'react';
import { GetServerSideProps } from 'next'

import { Layout } from '../../components/Layout'
import { slugify } from '../../util/services/slugify';

import { TutorialHeader } from '../../components/tutorial/tutorialHeader';
import { TutorialSection } from '../../components/tutorial/tutorialSection';
import { SectionsBar } from '../../components/tutorial/sectionsBar';
import { ShareBar } from '../../components/tutorial/shareBar';
import { ProgressCheck } from '../../components/tutorial/progressCheck';
import { TutorialDatabaseService } from '../../util/database/classes/tutorialDatabaseService';

const TutorialPost = ({ siteTitle, tutorial }) => {
    if (!tutorial) return <></>

    let previousEntry, nextEntry;

    const { title, tags, featuredImage, color, sections, description1, description2, slug } = tutorial;

    const [sectionRefs, setSectionRefs] = useState([]);
    const [sectionInformation, setSectionInformation] = useState([]);

    /** Effects to occur on mount */
    useEffect(() => {
        parseContentSections();

        if (tutorial.hasOwnProperty('parent')) {
            setupTutorialSeries();
        }
    }, []);

    /** Effects to occur when section information changes */
    useEffect(() => {

        // Add refs
        const refs = sectionInformation.map((s, i) => sectionRefs[i] || createRef());

        // Set the refs
        setSectionRefs(refs);

    }, [sectionInformation]);

    const parseContentSections = () => {

        const { sections } = tutorial;
        const sectionInformation = [];

        sections.forEach((section) => {
            const { title } = section;
            const id = slugify(title);
            const meta = { title, id, sectionComplete: false };

            sectionInformation.push(meta);
        });

        setSectionInformation(sectionInformation);
    }

    const setupTutorialSeries = () => {
        const entries = tutorial.parent.children;

        // Locate this entry in the entries list
        const thisEntryIndex = entries.findIndex((entry) => {
            return tutorial.id === entry.id;
        });

        // Check if a previous entry would exist
        if (entries[thisEntryIndex - 1]) {

            // Get the title and slug
            const { title } = entries[thisEntryIndex - 1];
            const link = slugify(title);

            previousEntry = { title, link };
        }

        // Check if a next entry would exist
        if (entries[thisEntryIndex + 1]) {

            // Get the title and slug
            const { title } = entries[thisEntryIndex + 1];
            const link = slugify(title);

            nextEntry = { title, link };
        }
    }

    const onProgressClick = (index: number) => {
        const nextIndex = index + 1;

        if (nextIndex !== sectionInformation.length) {
            const yOffset = -80;
            const element = sectionRefs[nextIndex].current;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }

        const sections = [...sectionInformation];
        sections[index].sectionComplete = !sections[index].sectionComplete;

        setSectionInformation(sections);
    }
    const keywords = tags.map((tag) => tag.title).join();
    const descriptions = `${description1} ${description2}`;

    return (
        <Layout pageTitle={tutorial.title} description={descriptions} keywords={keywords} slug={`tutorial/${slug}`} image={featuredImage[0].url} large={true}>
            <article className="tutorial-page">

                {/* Header section containing the tutorial image and title */}
                <div className="tutorial-page__header">
                    <TutorialHeader title={title} tags={tags} featuredImage={featuredImage} color={color} />
                </div>

                {/** Body section containing the tutorial content and share bars, sections, and related tutorials */}
                <div className="tutorial-page__body">

                    {/** Display the side bar */}
                    <div className="side-bar-column">
                        {/* Display the content bar */}
                        <SectionsBar sectionInformation={sectionInformation} />

                        {/** Display the share bar */}
                        <ShareBar tutorialTitle={title} slug={slug} />
                    </div>

                    {/* Display the content sections */}
                    <div className="sections">
                        {sectionInformation.length > 0 && sections.map((section, index) => {

                            const sectionComplete = sectionInformation[index].sectionComplete;

                            // Slugify the title
                            const id = slugify(section.title);

                            // Build the Progress Check component
                            const progressCheck = <ProgressCheck index={index} onProgressClick={onProgressClick} sectionComplete={sectionComplete} />

                            // Return the composed Section component
                            return (
                                <div className="section-item" key={index} ref={sectionRefs[index]}>
                                    <TutorialSection content={section} key={index} index={index} id={id} progressCheck={progressCheck} />
                                </div>
                            );
                        })}
                    </div>

                </div>

            </article>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ ...ctx }) => {
    const slug = ctx.params.slug as string;

    const ts = new TutorialDatabaseService(null, null);
    const tutorial = await ts.retrieveTutorial(slug);
    const config = await import(`../../siteconfig.json`);

    return {
        props: {
            siteTitle: config.title,
            tutorial,
        },
    }
}

export default TutorialPost;

/* export const getStaticPaths: GetStaticPaths = async () => {
    const tutorials = await CraftQL(AllTutorialsQuery());
    const paths = tutorials.map((tutorial) => ({
        params: { slug: tutorial.slug }
    }));

    return {
        paths,
        fallback: false,
    }
} */