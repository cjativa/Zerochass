import { Knex } from '../../database/knex';
import { makeUser } from '../../models/user/index';
import { IUser, SignUpInformation, UserProfileInformation } from '../../models/user/userSchema';

export class UserDAO {

  public static async findUser(prop: string, val: number | string): Promise<IUser> {
    const users = await Knex
      .select('*')
      .from('user_information')
      .where(prop, val);

    return users.shift();
  };

  public static async registerUser(userData: SignUpInformation, providerId): Promise<IUser> {
    const results = await Knex('user_information')
      .insert({
        name: userData.name,
        uid: userData.uid,
        profileImage: userData.profileImageUrl,
        auth_provider: providerId
      })
      .returning('*');

    const addedUser = results.shift();

    // Add their account information
    await Knex('user_account_information')
      .insert({
        email: userData.email,
        username: userData.username,
        userId: addedUser.id
      });

    return addedUser;
  };

  public static async getUserInformation(userId: number): Promise<IUser> {
    const users = await Knex('user_information')
      .join('user_account_information', { 'user_information.id': 'user_account_information.userId' })
      .select('heading', 'about', 'name', 'website', 'profileImage', 'username')
      .where('user_information.id', userId);

    return users.shift();
  };

  public static async updateUserInformation(userData: UserProfileInformation): Promise<IUser> {
    const users = await Knex
      .where({ id: userData.id })
      .update({
        heading: userData.heading,
        name: userData.name,
        about: userData.about,
        website: userData.website,
        profileImage: userData.profileImage
      })
      .returning('*');

    return users.shift();
  };
};