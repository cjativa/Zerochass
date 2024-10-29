import { useState, useEffect, useContext } from 'react';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';

import { FormField } from '../../../components/formField/formField';
import { Input } from '../../../components/input/input';
import { useAxios } from '../../../hooks/useAxios';

import { WriteSaveContext } from '../write';
const MdEditor = dynamic(() => import('react-markdown-editor-lite').then((mod) => mod.default), { ssr: false }) as any;

export const Section = (props) => {

    const { index, removeSection, id, title, content, tempKey } = props;
    const initialCollapse = props.collapsed != undefined ? props.collapsed : true;

    const [sectionTitle, setSectionTitle] = useState(title);
    const [sectionContent, setSectionContent] = useState(content);
    const [collapsed, setCollapsed] = useState(initialCollapse);

    const { sectionUpdate } = useContext(WriteSaveContext);

    const { performRequest } = useAxios();

    /** When the title or content changes locally, we'll need to update
     * it in the central parent */
    useEffect(() => {
        sectionUpdate(index, id, sectionTitle, sectionContent, tempKey);

    }, [sectionTitle, sectionContent]);

    const handleImageUpload = async (file: File): Promise<string> => {

        // Get the image as a blob
        const blob = await new Promise<string | ArrayBuffer>(resolve => {
            const reader = new FileReader();
            reader.onload = (data) => {
                resolve(data.target.result.toString());
            };
            reader.readAsDataURL(file);
        });

        // Send it off to be uploaded
        const uploadUrl = await performRequest({
            endpoint: 'assetUpload',
            method: 'POST',
            payload: { dataUrl: blob },
        }) as string;

        return uploadUrl;
    };

    const renderHTML = (text: string) => {
        return (
            <ReactMarkdown
                source={text}
            />
        );
    };

    return (
        <div className="section outline">
            <span
                className="section__title"
                onClick={(e) => setCollapsed(!collapsed)}
            >
                Section{(sectionTitle.length > 0) ? ': ' : ''}
                {sectionTitle}
                <span className="x-btn-cont">
                    <i
                        onClick={() => removeSection(index)}
                        className="x-btn fas fa-times" />
                </span>
            </span>
            {!collapsed &&
                <div className="section__body block">

                    {/** Section Title */}
                    <FormField
                        labelText={'Title'}
                    >
                        <Input
                            type={'text'}
                            onChange={(e) => setSectionTitle(e.target.value)}
                            value={sectionTitle}
                        />
                    </FormField>

                    {/** Section Content */}
                    <FormField
                        labelText={'Content'}
                    >
                        <MdEditor
                            defaultValue={sectionContent}
                            style={{ height: "500px" }}
                            view={{ menu: true, md: true, html: true }}
                            onChange={({ text }) => setSectionContent(text)}
                            onImageUpload={handleImageUpload}
                            renderHTML={renderHTML}
                        />
                    </FormField>
                </div>
            }
        </div>
    )
};