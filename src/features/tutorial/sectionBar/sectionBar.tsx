import { ColorBox } from '../colorBox/colorBox';

export const SectionBar = ({ sectionInformation }) => {

    return (
        <ColorBox
            title="Tutorial Content 📚"
        >
            <div className="section-bar">
                <ul>
                    {sectionInformation.map((section, index) =>
                        <li key={index}>
                            <a href={`#${section.slug}`}>
                                {section.title}
                            </a>
                        </li>
                    )}
                </ul>
            </div>
        </ColorBox>
    );
};