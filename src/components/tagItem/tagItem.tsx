
interface ITagItemProps {
    tagId?: number | string,
    tagName: string,
    useMargin?: boolean,

    removable?: true,
    onRemoveClick?: () => void,
};

export const TagItem = ({ tagId, tagName, useMargin, removable, onRemoveClick }: ITagItemProps) => {

    let className = "tag-item";

    // If the tag should provide its own margin 
    // around itself
    if (useMargin) {
        className = className.concat(' tag-item--margin');
    }

    return (
        <div className={className}>
            {`#${tagName}`}

            {/** Display the "x" icon when removable */}
            {removable &&
                <i
                    onClick={onRemoveClick}
                    className="x-btn fas fa-times"
                />
            }
        </div>
    );
};