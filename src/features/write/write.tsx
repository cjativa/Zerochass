import React, { useState, useEffect } from 'react';

import { TutorialInterface, TutorialRequest } from '../../../server/api/interfaces/tutorial';
import { Main } from './main/main';
import { Sidebar } from './sidebar/sidebar';
import { useAxios } from '../../hooks/useAxios';

export const WriteSaveContext = React.createContext({
    saveOccurred: null,
    sectionUpdate: null,
    tutorialValidation: {
        titleError: '',
        description1Error: '',
        description2Error: '',
        sectionsError: '',
        tagsError: '',
        featuredImageError: '',
    },
    saveSuccessful: null,
    saveInProgress: null,
});

const colorOptions = [
    { value: 'pink', label: 'Pink' },
    { value: 'black', label: 'Black' },
    { value: 'teal', label: 'Teal' },
    { value: 'white', label: 'White' }
];

const getMatchingColor = (color: string) => colorOptions.find((co) => co.value === color);

interface Props {
    edit: boolean,
    tutorial: TutorialInterface,
    id?: number
}

export const Write = (props: Props) => {
    const { edit, tutorial, } = props;
    const { performRequest, requestSuccess, requestInProgress } = useAxios();

    // State variables and controls for Main component
    const [title, setTitle] = useState(tutorial.title || '');
    const [description1, setDescription1] = useState(tutorial.description1 || '');
    const [description2, setDescription2] = useState(tutorial.description2 || '');
    const [sections, setSections] = useState(tutorial.sections || []) as any;

    // State variables and controls for Sidebar component
    const [tags, setTags] = useState(tutorial.tags || []);
    const [color, setColor] = useState(tutorial.color || 'pink');
    const [enabled, setEnabled] = useState(tutorial.enabled || false);
    const [featuredImage, setFeaturedImage] = useState(tutorial.featuredImage || '');
    const [codeUrl, setCodeUrl] = useState(tutorial.codeUrl || '');
    const [liveUrl, setLiveUrl] = useState(tutorial.liveUrl || '');

    const [tutorialValidation, setTutorialValidation] = useState({
        titleError: '',
        description1Error: '',
        description2Error: '',
        sectionsError: '',
        tagsError: '',
        featuredImageError: '',
    });
    const [saveOccurred, setSaveOccurred] = useState(null);

    /** Handles updating the list of sections */
    const sectionUpdate = (index: number, id: number, title: string, content: string, tempKey: number) => {
        sections[index] = {
            id,
            title,
            content,
            tempKey,
        };
        setSections(sections);
    };

    /** Perform validations prior to save */
    const validateTutorial = () => {
        let tutorialValidationErrors = {
            titleError: '',
            description1Error: '',
            description2Error: '',
            sectionsError: '',
            tagsError: '',
            featuredImageError: '',
        };

        // Validation only runs when the tutorial is set to enabled
        if (enabled) {
            if (title.trim().length === 0) {
                tutorialValidationErrors = {
                    ...tutorialValidationErrors,
                    titleError: 'Please enter a title',
                }
            }

            if (description1.trim().length === 0) {
                tutorialValidationErrors = {
                    ...tutorialValidationErrors,
                    description1Error: 'Please add a small description for your post',

                }
            }

            if (sections.length < 2) {
                tutorialValidationErrors = {
                    ...tutorialValidationErrors,
                    sectionsError: 'Please add a couple of sections for your post',
                }
            }

            if (tags.length === 0 || tags.length > 4) {
                const tagsError = (tags.length === 0)
                    ? 'Please add at least 1 tag for your post'
                    : 'Only up to 4 tags are allowed for your posts';
                tutorialValidationErrors = {
                    ...tutorialValidationErrors,
                    tagsError,
                }
            }

            if (featuredImage.length === 0) {
                tutorialValidationErrors = {
                    ...tutorialValidationErrors,
                    featuredImageError: 'Please set an image for your post',
                }
            }
        }

        const tutorialIsValid = !Object
            .values(tutorialValidationErrors)
            .some((error) => error.length > 0);
        setTutorialValidation(tutorialValidationErrors);

        return tutorialIsValid;
    };

    /** When a save occurs */
    const onSave = async () => {

        // Validation check must pass when tutorial is to be enabled
        const tutorialIsValid = validateTutorial();

        // Only allow tutorial to be saved when validation passes
        if (tutorialIsValid) {

            let featuredImagePayload = '' as any;
            sections.forEach((section) => delete section.tempKey);

            // If there's a featured image, convert it to data url
            if (featuredImage && typeof featuredImage !== 'string') {
                await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.addEventListener('load', (event) => {
                        featuredImagePayload = { dataUrl: '' }
                        featuredImagePayload.dataUrl = event.target.result;
                        resolve('');
                    });

                    reader.readAsDataURL(featuredImage);
                });
            }

            else {
                featuredImagePayload = featuredImage
            }

            // Set up the payload
            const writeTutorialPayload: TutorialInterface | TutorialRequest = {
                title,
                description1, description2,
                sections,
                tags,
                color,
                featuredImage: featuredImagePayload,
                enabled,
                id: tutorial.id,
                liveUrl,
                codeUrl,
            };

            // If we have an id, this is an update, otherwise it's a create
            const method = (tutorial.id) ? 'PUT' : 'POST';
            const createdTutorialId = await performRequest({
                endpoint: 'write',
                method,
                payload: writeTutorialPayload,
            });

            // If this was a new tutorial
            // redirect to the created tutorial
            if (!tutorial.id && createdTutorialId) {
                window.location.href = `/write/${createdTutorialId}`;
            }

            setSaveOccurred(true);
        }
    };



    useEffect(() => {
        if (saveOccurred == true) {
            setSaveOccurred(false);
        }
    }, [saveOccurred]);

    return (
        <div className="write">
            <div className="write__body">

                <WriteSaveContext.Provider value={{
                    saveOccurred,
                    sectionUpdate, 
                    tutorialValidation, 
                    saveSuccessful: requestSuccess, 
                    saveInProgress: requestInProgress,
                }}>
                    <Main
                        edit={edit}
                        setTitle={setTitle} title={title}
                        setDescription1={setDescription1} description1={description1}
                        setDescription2={setDescription2} description2={description2}
                        setSections={setSections} sections={sections}
                    />



                    <Sidebar
                        tags={tags} setTags={setTags}
                        color={color} setColor={setColor}
                        enabled={enabled} setEnabled={setEnabled}
                        featuredImage={featuredImage} setFeaturedImage={setFeaturedImage}
                        onSave={onSave}
                        liveUrl={liveUrl} setLiveUrl={setLiveUrl}
                        codeUrl={codeUrl} setCodeUrl={setCodeUrl}
                        slug={tutorial.slug} edit={edit}
                    />
                </WriteSaveContext.Provider>

            </div>
        </div>
    )
};