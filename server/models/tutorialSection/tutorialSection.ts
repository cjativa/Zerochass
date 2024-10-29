import { ITutorialSection } from './tutorialSectionSchema';

export const buildMakeTutorialSection = function (tutorialSectionValidator) {
  return (tutorialSection: ITutorialSection) => {

    const { error } = tutorialSectionValidator(tutorialSection);
    if (error) throw new Error(error);

    return tutorialSection;
  }
};