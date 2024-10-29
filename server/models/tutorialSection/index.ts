import { buildMakeTutorialSection } from './tutorialSection';
import { TutorialSectionSchema } from './tutorialSectionSchema';
import { validator } from '../validator/index';

const tutorialSectionValidator = validator(TutorialSectionSchema);
export const makeTutorialSection = buildMakeTutorialSection(tutorialSectionValidator);