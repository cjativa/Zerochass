import { useEffect, useState, createRef } from 'react';
import axios from 'axios';
import { slugify } from '../../util/services/slugify';
import { TutorialHeader } from './tutorialHeader';
import { ActionBar } from './actionBar';
import { TutorialSection } from './tutorialSection';
import { SectionsBar } from './sectionsBar';
import { ShareBar } from './shareBar';
import { ProgressCheck } from './progressCheck';
import { TutorialProgress } from '../../util/interfaces/tutorial';

export const Tutorial = ({ tutorial }) => {
    if (!tutorial) return <></>

    let previousEntry, nextEntry;

    const { title, tags, featuredImage, color, sections, description1, description2, slug } = tutorial;

    const [sectionRefs, setSectionRefs] = useState([]);
    const [sectionInformation, setSectionInformation] = useState([]);

    const [isTutorialRegistered, setIsTutorialRegistered] = useState(null);
    const [sectionProgress, setSectionProgress] = useState([]);

    /** Effects to occur on mount */
    useEffect(() => {

        // Generate the section bar content
        generateSectionBarContent();

        // If this tutorial is part of a series, set up the next - prev links
        if (tutorial.hasOwnProperty('parent')) {
            setupTutorialSeries();
        }

        // Retrieve information on the user's progress with this tutorial
        retrieveTutorialProgress();

    }, []);

    /** Effects to occur when section information changes */
    useEffect(() => {

        // Add refs
        const refs = sectionInformation.map((s, i) => sectionRefs[i] || createRef());

        // Set the refs
        setSectionRefs(refs);

    }, [sectionInformation]);

    /** Iterates through each tutorial section to set up content for the Sections Bar */
    const generateSectionBarContent = () => {

        const { sections } = tutorial;
        const sectionInformation = [];

        sections.forEach((section) => {
            const { title, id } = section;
            const slug = slugify(title);
            const meta = { title, id, slug, sectionComplete: false };

            sectionInformation.push(meta);
        });

        setSectionInformation(sectionInformation);
    };

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
    };

    /** Handles scrolling to the next proceeding section during a progress checkmark click */
    const onProgressClick = (sectionId: number) => {

        const sectionIndexToUpdate = sectionInformation.findIndex((section) => section.id == sectionId);
        const nextIndex = sectionIndexToUpdate + 1;

        if (nextIndex !== sectionInformation.length) {

            // The offset on each scroll
            const yOffset = -80;
            const element = sectionRefs[nextIndex].current;

            // Scroll down to the next item
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }

        // Update the state that this section has been marked completed
        const sectionToUpdate = sectionInformation[sectionIndexToUpdate];
        sectionToUpdate.sectionComplete = !sectionToUpdate.sectionComplete;

        setSectionInformation([...sectionInformation]);
    };

    /** Handles enrolling a user into the tutorial */
    const onEnrollClick = async () => {

        // The user should become unenrolled if the tutorial is registered
        // and they should be enrolled if the tutorial is not already registered
        const shouldBeEnrolled = (isTutorialRegistered) ? false : true;

        const { isTutorialRegistered: updatedRegistration } = (await axios({
            url: '/api/planner/enroll',
            method: 'POST',
            data: { tutorialId: tutorial.id, shouldBeEnrolled }
        })).data as TutorialProgress;

        setIsTutorialRegistered(updatedRegistration);
    };

    /** Retrieves information on the user's progress with this tutorial */
    const retrieveTutorialProgress = async () => {

        const { isTutorialRegistered, sectionProgress } = (await axios({
            url: `/api/planner/enroll?tutorialId=${tutorial.id}`,
            method: 'GET'
        })).data as TutorialProgress;

        setIsTutorialRegistered(isTutorialRegistered);
        setSectionProgress(sectionProgress);
    };

    return (
        <article className="tutorial-page">

            {/* Header section containing the tutorial image and title */}
            <div className="tutorial-page__header">
                <TutorialHeader title={title} tags={tags} featuredImage={featuredImage} color={color} />

                {/** Display the tutorial actions */}
                <ActionBar onEnrollClick={onEnrollClick} isTutorialRegistered={isTutorialRegistered} />
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
                    {sections.map((section, index) => {

                        const sectionComplete = (sectionInformation.length > 0)
                            ? sectionInformation[index].sectionComplete
                            : null;

                        // Slugify the title
                        const slug = slugify(section.title);

                        // Build the Progress Check component
                        const progressCheck = <ProgressCheck
                            sectionId={section.id}
                            index={index}
                            onProgressClick={onProgressClick}
                            sectionComplete={sectionComplete}
                        />;

                        // Return the composed Section component
                        return (
                            <div className="section-item" key={index} ref={sectionRefs[index]}>
                                <TutorialSection content={section} key={index} slug={slug} progressCheck={progressCheck} />
                            </div>
                        );
                    })}
                </div>

            </div>

        </article>
    )
}