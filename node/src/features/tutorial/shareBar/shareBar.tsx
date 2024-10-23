import { useState } from 'react';

import { ColorBox } from '../colorBox/colorBox';
import { ShareButtons } from '../../../components/shareButtons/shareButtons';

interface Props {
    tutorialTitle: string,
    slug: string
}

export const ShareBar = (props: Props) => {

    const [value, setValue] = useState('');
    const [typed, setTyped] = useState(false);

    const { tutorialTitle, slug } = props;
    const taText = `I just started a tutorial at zerochass.io! \n\nSo excited to begin learning about "${tutorialTitle}"`;

    const onChange = (event) => {
        if (!typed) {
            setTyped(true);
        }

        // Update the value
        const { value } = event.target;
        setValue(value);
    }

    const onFocus = (event) => {
        if (!typed || value.length == 0) {
            setValue(taText);
        }
    }

    const onBlur = (event) => {
        if (value === taText) {
            setValue('');
        }
    }

    return (
        <ColorBox 
        title="Share 🚀"
        >
            <div className="tutorial-share-bar">
                <span className="box-subtitle">Tell all your friends!</span>
                <textarea className="box-text-area"
                    rows={6}
                    cols={30}
                    placeholder={taText}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    value={value}
                    onChange={onChange}>
                </textarea>

                {/** Share buttons for sharing the tutorial */}
                <ShareButtons link={`tutorial/${slug}`} title={tutorialTitle} text={taText} />
            </div>
        </ColorBox>
    );
};