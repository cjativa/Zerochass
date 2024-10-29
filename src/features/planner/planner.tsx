import { TutorialCard } from '../../components/tutorialCard/tutorialCard';
import { PaddedPage } from '../../components/paddedPage/paddedPage';

export const Planner = ({ tutorials }) => {

    const inProgressTutorials = [];
    const completeTutorials = [];

    // This sorting should take place server-side
    // but for now, just do it here
    tutorials.forEach((tutorial) => {
        if (parseInt(tutorial.totalSectionCount) === parseInt(tutorial.completedSectionCount)) {
            completeTutorials.push(tutorial);
        }

        else {
            inProgressTutorials.push(tutorial);
        }
    });

    return (
        <PaddedPage
            heading="Planner"
            subHeading="Here's where you'll find tutorials you've worked on."
        >
            <div className="planner">

                {/** Tutorials in-progress */}
                <div className="planner__section">
                    <h4>In-Progress</h4>
                    {
                        (inProgressTutorials.length > 0)
                            ?
                            <div className="planner__tutorials">
                                {inProgressTutorials.map((tutorial, index) =>
                                    <TutorialCard
                                        tutorial={tutorial}
                                        key={`${tutorial.slug}__${index}`}
                                    />
                                )}
                            </div>
                            : <p>You don't have any tutorials in progress yet!</p>
                    }
                </div>

                {/** Tutorials that have been completed */}
                <div className="planner__section">
                    <h4>Complete</h4>
                    {
                        (completeTutorials.length > 0)
                            ?
                            <div className="planner__tutorials">
                                {completeTutorials.map((tutorial, index) =>
                                    <TutorialCard
                                        tutorial={tutorial}
                                        key={`${tutorial.slug}__${index}`}
                                    />
                                )}
                            </div>
                            : <p>You haven't completed a tutorial yet!</p>
                    }
                </div>

            </div>
        </PaddedPage >
    )
};

