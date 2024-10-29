import Joi from 'joi';

export interface IUser {
  id?: number,
  name: string,
  about: string,
  website: string,
  heading: boolean,
  profileImage: string,
  uid: string,
  auth_provider: 1 | 2
};

export interface SignUpInformation {

  name: string,
  username: string,
  profileImageUrl: string,
  email: string,
  uid: number
};

export interface UserProfileInformation {
  id?: number,
  heading: string,
  name: string,
  about: string,
  website: string,
  profileImage: string
};

export const UserSchema = Joi.object().keys({

  id: Joi
    .number(),

  name: Joi
    .string()
    .required()
    .error(() => 'must have a name as a string'),

  about: Joi
    .string()
    .required()
    .error(() => 'must have a short about as string'),

  website: Joi
    .string(),

  heading: Joi
    .string(),

  profileImage: Joi
    .string(),

  uid: Joi
    .number()
    .required()
    .error(() => 'must be non-empty'),

  auth_provider: Joi
    .number()
    .valid(1, 2)
    .error(() => 'must be one of 1 or 2')
});

export const UserSignUpSchema = Joi.object().keys({

});