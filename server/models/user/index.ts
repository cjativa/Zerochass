import { buildMakeUser } from './user';
import { UserSchema } from './userSchema';
import { validator } from '../validator/index';

const userValidator = validator(UserSchema);
export const makeUser = buildMakeUser(userValidator);
