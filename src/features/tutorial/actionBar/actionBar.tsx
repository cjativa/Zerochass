
export const ActionBar = (props) => {

    const { onEnrollClick, isTutorialRegistered, codeUrl, liveUrl } = props;
    const enrolledStyle = (isTutorialRegistered) ? 'enrolled' : '';

    return (
        <div className="tutorial-action-bar">

            <div className="ta-bar ta-bar--center">
                {/** Code icon */}
                {codeUrl && <span className="ta-bar__btn ta-bar__btn--code fa-stack fa-2x" >
                    <i className={`fas fa-circle fa-stack-2x`} />
                    <i className={`fas fa-code fa-stack-1x fa-inverse`} />
                </span>}

                {/** Comment icon */}
                <span className="ta-bar__btn ta-bar__btn--comments fa-stack fa-2x" >
                    <i className={`fas fa-circle fa-stack-2x`} />
                    <i className={`fas fas fa-comment-alt fa-stack-1x fa-inverse`} />
                </span>

                {/** Taken icon */}
                <span className="ta-bar__btn ta-bar__btn--enrolls fa-stack fa-2x" >
                    <i className={`fas fa-circle fa-stack-2x`} />
                    <i className={`fas fa-chalkboard-teacher fa-stack-1x fa-inverse`} />
                </span>
            </div>

            {/** Bookmark icon */}
            <div className="ta-bar ta-bar--right">
                <span className="ta-bar__btn ta-bar__btn--planner fa-stack fa-2x" onClick={onEnrollClick}>
                    <i className={`fas fa-circle fa-stack-2x`} />
                    <i className={`fas fa-bookmark fa-stack-1x fa-inverse ${enrolledStyle}`} />
                </span>
            </div>
            
        </div>
    )
};