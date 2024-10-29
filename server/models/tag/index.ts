import { buildMakeTag } from './tag';
import { TagSchema } from './tagSchema';
import { validator } from '../validator/index';

const tagValidator = validator(TagSchema);
export const makeTag = buildMakeTag(tagValidator);
