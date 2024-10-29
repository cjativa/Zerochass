import { TagItem } from '../../../components/tagItem/tagItem';

export const TutorialHeader = (props) => {
    const { title, tags, featuredImage, color, author } = props;

    return (
        <header className={`tutorial-header ${color.toLowerCase()}`}>

            {/** Display the tutorial featured image */}
            <div className="tutorial-header__image">
                {featuredImage.length > 0 &&
                    <img className="featured-image" src={featuredImage} />}
            </div>

            {/** Display the available tags */}
                <ul className="tutorial-header__tags">
                    {tags.map((tag, index) =>
                        <TagItem
                            tagId={tag.id}
                            tagName={tag.tag}
                            key={`${index}__${tag.id}`}
                        />
                    )}
                </ul>

            <h1 className="tutorial-header__title">{title}</h1>
        </header>
    )
};