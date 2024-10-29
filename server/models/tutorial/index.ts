import { buildMakeTutorial } from './tutorial';
import { TutorialSchema } from './tutorialSchema';
import { validator } from '../validator/index';

const tutorialValidator = validator(TutorialSchema);
export const makeTutorial = buildMakeTutorial(tutorialValidator);
