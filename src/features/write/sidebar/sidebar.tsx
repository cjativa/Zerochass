import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import ReactSwitch from 'react-switch';

import { WriteSaveContext } from '../write';
import { Button } from '../../../components/button/button';
import { FormField } from '../../../components/formField/formField';
import { Input } from '../../../components/input/input';
import { TagItem } from '../../../components/tagItem/tagItem';
import { Fader } from '../../../components/fader/fader';

const ReactSelect = dynamic(() => import('react-select')
    .then((mod) => mod.default), { ssr: false }) as any;

const colorOptions = [
    { value: 'pink', label: 'Pink' },
    { value: 'black', label: 'Black' },
    { value: 'teal', label: 'Teal' },
    { value: 'white', label: 'White' }
]

export const Sidebar = (props) => {
    const [tag, setTag] = useState('');
    const { tags, setTags,
        color, setColor,
        enabled, setEnabled,
        featuredImage, setFeaturedImage,
        onSave,
        codeUrl, setCodeUrl,
        liveUrl, setLiveUrl,
        slug, edit
    } = props;

    const [matchingTags, setMatchingTags] = useState([]);
    const [previewFileUrl, setPreviewFileUrl] = useState(null);
    const [displayedColor, setDisplayedColor] = useState(null);

    const { tutorialValidation, saveSuccessful, saveInProgress } = useContext(WriteSaveContext);

    useEffect(() => {
        // If we've got a featured image that's a string -- it's a url we can preview
        if (typeof featuredImage === 'string') {
            setPreviewFileUrl(featuredImage);
        }
    }, [])

    useEffect(() => {
        const dColor = colorOptions.find((co) => co.value === color);
        setDisplayedColor(dColor);
    }, [color]);

    useEffect(() => {
        const fetchMatchingTags = async () => {
            const { data } = await axios.get('/api/tags', { params: { tag } });
            const foundMatchingTags = data.reduce((acc, matchingTag) => {

                // Check if this tag is already used by this tutorial
                // and if not, let's show it in the matching tags
                const isMatchingTagUsed = tags.some((tag) => tag === matchingTag.tag);
                if (isMatchingTagUsed == false) {
                    acc.push(matchingTag);
                }
                return acc;
            }, []);
            setMatchingTags(foundMatchingTags);
        };

        if (tag.length > 1) {
            fetchMatchingTags();
        } else if (tag.length == 0) {
            setMatchingTags([]);
        }

    }, [tag]);

    const fileChangedHandler = event => {
        const file = event.target.files[0];
        setFeaturedImage(file);
        setPreviewFileUrl(window.URL.createObjectURL(file));
    }

    const onImageRemove = () => {
        setFeaturedImage(null);
        window.URL.revokeObjectURL(previewFileUrl);
        setPreviewFileUrl(null);
    };

    const onEnabledChange = (checked, event, id) => {
        setEnabled(checked);
    };

    const onTagsKeyDown = (e) => {
        if (e.key === 'Enter') {
            setIntoTags(tag);
        }
    };

    const onMatchingTagClick = (matchingTag) => {
        setIntoTags(matchingTag.tag);
    };

    const setIntoTags = (value: string) => {

        // Find if this value is already in the tags list
        const tagToAdd = value.toLowerCase();
        const isMatchingTagUsed = tags.some((tag) => tag === tagToAdd);

        // If we don't already use this tag, let's display it
        if (isMatchingTagUsed == false) {
            setTags([...tags, tagToAdd]);
        }

        setTag('');
    };

    const onTagRemove = (index) => {
        tags.splice(index, 1);
        setTags([...tags]);
    };

    const onColorSelect = (selectedColor) => {
        setColor(selectedColor.value);
    };

    return (

        <div className="write__sidebar">

            <div className="write__sidebar write__sidebar--top outline block">
                {/** Featured image */}
                <div className="form-field">
                    <label className="form-field__label">Featured Image</label>
                    {!featuredImage && <label className="file-container">
                        <input
                            type="file"
                            className="file-hide"
                            onChange={fileChangedHandler}
                            accept="jpg, .jpeg, .png"
                        />
                        <i className="fas fa-image upload" />
                    </label>
                    }
                    {previewFileUrl &&
                        <div className="preview">
                            <img className="preview__file" src={previewFileUrl} />
                            <i
                                onClick={onImageRemove}
                                className="preview__remove x-btn fas fa-times" />
                        </div>}
                </div>

                {/** Color */}
                <FormField
                    labelText={'Color'}
                    helperText={'Set a color for your post header'}
                >
                    <ReactSelect
                        id={"react-select"}
                        value={displayedColor}
                        onChange={onColorSelect}
                        options={colorOptions}
                        className="slim"
                    />
                </FormField>
            </div>

            <div className="write__sidebar write__sidebar-bottom outline block">

                {/** Action buttons */}
                <div className="write__actions">
                    <div className="write__buttons">
                        <Button
                            style={'secondary'}
                            onClick={() => window.open(`/tutorial/${slug}?preview=true`,'_newtab')}
                            disabled={!edit}
                        >
                            Preview
                        </Button>
                        <Button
                            style={'primary'}
                            onClick={onSave}
                            disabled={saveInProgress}
                        >
                            Save
                        </Button>
                    </div>
                    <Fader
                        showIn={saveSuccessful === true || saveSuccessful === false}
                        isSuccess={saveSuccessful}
                        successText={'Post was successfully saved'}
                        errorText={'Post could not be saved'}
                    />
                </div>

                {/** Enablement switch */}
                <div className="write__enable">
                    <label className="enable-text">Enabled</label>
                    <ReactSwitch
                        height={24}
                        onChange={onEnabledChange}
                        onColor={'#45b914'}
                        checked={enabled}
                        checkedIcon={false}
                        uncheckedIcon={false} />
                </div>
            </div>

            <div className="write__sidebar write__sidebar--middle outline block">

                {/** Code Repository URL */}
                <FormField
                    labelText={'Code Repository'}
                    helperText={'Have a repo? Link it here'}
                >
                    <Input
                        type={'text'}
                        placeholder={'Github, BitBucket, GitLab, etc.'}
                        onChange={(e) => setCodeUrl(e.target.value)}
                        value={codeUrl}
                    />
                </FormField>

                {/** Live URL */}
                <FormField
                    labelText={'Live Site'}
                    helperText={'You can link a demo site here'}
                >
                    <Input
                        type={'text'}
                        placeholder={'CodePen, StackBlitz, etc.'}
                        onChange={(e) => setLiveUrl(e.target.value)}
                        value={liveUrl}
                    />
                </FormField>

                {/** Tags */}
                <div className="write__tags">
                    <FormField
                        labelText={'Tags'}
                        helperText={'Add up to 4 tags related to your post'}
                    >
                        <Input
                            type={'text'}
                            placeholder={'HTML, JavaScript, CSS, etc.'}
                            value={tag}
                            onChange={(e) => setTag(e.target.value)}
                            onKeyDown={(e) => onTagsKeyDown(e)}
                            invalidText={tutorialValidation.tagsError}
                        />
                    </FormField>

                    {/** List of tags for this tutorial */}
                    <div className="write__taglist">
                        {tags.map((tag, index) =>
                            <TagItem
                                key={index}
                                tagName={tag}
                                removable={true}
                                onRemoveClick={() => onTagRemove(tag)}
                            />
                        )}
                    </div>

                    {/** List of matching tags for the entered tag term */}
                    {matchingTags.length > 0 &&
                        <div className="write__foundtags">
                            {matchingTags.map((matchingTag, index) =>
                                <div
                                    className="f-tag-item"
                                    key={index}
                                    onClick={() => onMatchingTagClick(matchingTag)} >
                                    {matchingTag.tag}
                                </div>
                            )}
                        </div>
                    }
                </div>
            </div>
        </div >

    )
};