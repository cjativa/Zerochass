import { UserDB } from '../dataAccess/user/entity';
import { PlannerDB } from '../dataAccess/planner/entity';
import { SignUpInformation } from '../models/user/userSchema';

type AuthProvider = 'GITHUB' | 'TWITTER';

interface ISignUpResponse {
  userId: number,
  profileImageUrl: string
}

export class UserService {

  /** Registers a user using the provided information for the designated provider */
  public static async signUp(suInfo: SignUpInformation, provider: AuthProvider): Promise<ISignUpResponse> {

    // Try to look up the user prior to sign-up -- to prevent double sign-ups
    const user = await UserDB.findUser('uid', suInfo.uid);

    // We've located the user - so no need to sign them up
    if (user) {
      return {
        userId: user.id,
        profileImageUrl: suInfo.profileImageUrl
      }
    }

    // Otherwise, let's sign them up
    else {

      // Get the auth provider id and userId after insertion
      const providerId = this.getIdForProvider(provider);
      const user = await UserDB.registerUser(suInfo, providerId);

      // Creating their planner is part of the sign up process
      await PlannerDB.createPlanner(user.id);

      return {
        userId: user.id,
        profileImageUrl: suInfo.profileImageUrl
      };
    }
  };

  private static getIdForProvider(provider: AuthProvider) {
    if (provider === 'GITHUB') return 1;
    if (provider === 'TWITTER') return 2;
  };
};