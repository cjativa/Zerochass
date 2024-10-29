import { Octokit } from '@octokit/rest';
import type { NextApiRequest, NextApiResponse } from 'next'

import { SignUpInformation } from '../../../server/models/user/userSchema';
import { UserService } from '../../../server/services/userService';
import { AuthenticationService } from '../../../server/api/services/authenticationService';

const octokit = new Octokit();
const githubAuthUrl = 'https://github.com/login/oauth/access_token';

export default async (request: NextApiRequest, response: NextApiResponse) => {

    if (request.method.toLowerCase() === 'get') {
        return GitHubService.handleLogin(request, response);
    }
};

class GitHubService {

    /** Handles a sign up action with GitHub */
    public static async handleLogin(request: NextApiRequest, response: NextApiResponse) {

        const { data } = await octokit
            .request(`POST ${githubAuthUrl}`,
                {
                    headers: { accept: 'application/json' },
                    data: {
                        client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
                        client_secret: process.env.GITHUB_CLIENT_SECRET,
                        code: request.query.code
                    }
                });

        // If we have data in the response 
        // we can retrieve further user information
        if (data) {
            const userInformation = await this.retrieveUserInformation(data);

            // Attempt to sign them up
            const { userId, profileImageUrl } = await UserService.signUp(userInformation, "GITHUB");
            await AuthenticationService.signIn(data.access_token, userId, profileImageUrl, response);

            response.writeHead(302, { Location: '/' });
            response.end();
        }
    };

    /** Uses the provided authentication object to retrieve information for the user
     * to build the sign up data object */
    private static async retrieveUserInformation(authentication: any): Promise<SignUpInformation> {
        const headers = { Authorization: `token ${authentication.access_token}` };

        // Check if we have access to user information
        if (authentication.scope.includes('read:user')) {
            const { data } = await octokit
                .users
                .getAuthenticated({ headers });

            // Build the information object
            const signUpInformation: SignUpInformation = {
                email: data.email,
                username: data.login,
                profileImageUrl: data.avatar_url,
                name: data.name,
                uid: data.id
            };

            // Get primary email if possible
            if (authentication.scope.includes('user:email')) {
                const { data } = await octokit
                    .users
                    .listEmails({ headers });

                // Replace the original email
                const { email } = data.find((p) => p.primary == true);
                signUpInformation.email = email;
            }

            return signUpInformation;
        }
    };
}

