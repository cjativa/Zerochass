import { useEffect } from 'react'
import ReactMarkdown from 'react-markdown';
import prismjs from 'prismjs';

export const TutorialSection = (props) => {

    useEffect(() => {
        prismjs.highlightAll();
    }, []);

    const { slug, progressCheck } = props;
    const { title, content } = props.content;

    return (
        <section className="section line-numbers">

            {/** Section title and content */}
            <h2 id={slug}>{title}</h2>
            <ReactMarkdown
                className="section__text"
                source={content}
                linkTarget="_blank"
            />

            {/** Section progress check icon */}
            <div className="section__progress">
                <hr className="progress-rule" />
                {progressCheck}
            </div>
        </section >
    )
};