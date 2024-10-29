import { ITutorial } from './tutorialSchema';

export const buildMakeTutorial = function (tutorialValidator) {
    return (tutorial: ITutorial) => {

        const { error } = tutorialValidator(tutorial)
        if (error) throw new Error(error)

        return tutorial;
    }
};