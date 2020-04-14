import * as React from 'react';
import { SectionMeta } from '../../interfaces/tutorialPage/sectionMeta';


interface Props {
    sectionInformation: any
}

export const ContentBar = (props: Props) => {
    const { sectionInformation } = props;

    return (

        <div className="tutorial-content-bar">
            <div className="content-box">
                <span>Tutorial Content</span>
                <ul>
                    {sectionInformation.map((section, index) => {
                        return (<li key={index}><a href={`#${section.id}`}>{section.title}</a></li>)
                    })}
                </ul>
            </div>
        </div>
    )
}