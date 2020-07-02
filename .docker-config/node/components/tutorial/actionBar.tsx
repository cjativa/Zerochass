
export const ActionBar = (props) => {

    return (
        <div className="ta-bar">

            {/** Code icon */}
            <span className="ta-bar__btn ta-bar__btn--code fa-stack fa-2x" >
                <i className={`fas fa-circle fa-stack-2x`} />
                <i className={`fas fa-code fa-stack-1x fa-inverse`} />
            </span>

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
    )
};