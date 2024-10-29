import { TutorialSnip } from "../tutorialSnippet/tutorialSnippet";

export const TutorialList = ({ tutorials }) => {
    return (
        <div className="tutorial-list">
            {tutorials &&
                tutorials.map((tutorial, index) => {
                    return <TutorialSnip
                        key={index}
                        tutorial={tutorial}
                    />;
                })}
        </div>
    );
};