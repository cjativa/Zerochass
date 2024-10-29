import { IUser } from './userSchema';

export const buildMakeUser = function (userValidator) {
  return (user: IUser) => {

    const { error } = userValidator(user)
    if (error) throw new Error(error)

    return user;
  }
};