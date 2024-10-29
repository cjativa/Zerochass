import jsonwebtoken from 'jsonwebtoken';
import { Config } from '../../../util/config';
import nookies from 'nookies';

interface Authentication {
    authenticated: boolean,
    userId: string | number,
    accessToken: string
};

/** Returns boolean on user being authenticated */
export const isAuthenticated = (req, res): Authentication => {

    const authentication: Authentication = {
        authenticated: null,
        userId: null,
        accessToken: null,
    };

    // Check if there's a zerochassServerCookie on the request -- if it does exist, the jwt will be available
    const { zerochassServerCookie, zerochassClientCookie } = nookies.get({ req });

    // If there's no jwt, update the authentication object
    if (!zerochassServerCookie) {
        authentication['authenticated'] = false
    }

    // Else there's a jwt, let's see if it's valid
    else {
        const userPayload = jsonwebtoken.verify(zerochassServerCookie, Config.zerochassSecret) as object;

        // If the token is invalid (i.e. no payload), clear the cookie and update authentication object
        if (!userPayload) {

            nookies.destroy(null, zerochassServerCookie);
            nookies.destroy(null, zerochassClientCookie);

            authentication['authenticated'] = false;
        }

        // Else, token is valid - let's set the userId on the request object
        else {
            authentication['userId'] = userPayload['userId'];
            authentication['accessToken'] = userPayload['accessToken'];
            authentication['authenticated'] = true;
        }
    }

    return authentication;
};

/** Middleware that secures protected routes with authentication */
const handleAccess = (request, response) => {

    const { userId, authenticated, accessToken } = isAuthenticated(request, response);

    if (authenticated) {
        request['authenticated'] = true;
        request['userId'] = userId;
        request['accessToken'] = accessToken;
    }

    else {
        response.status(401).json(`Invalid or missing authorization token`);
    }

    return authenticated;
};

/** Protects secured API routes against non-authenticated sessions.
 * Also adds userId and access token to request object for authenticated sessions */
const protectWithAuthentication = (handler) => (request, response) => {

    // Determine if the session is authenticated
    const isAuthenticated = handleAccess(request, response);

    // If the session was authenticated, allows the requested endpoint to handle responding
    if (isAuthenticated) return handler(request, response);
};

export default protectWithAuthentication;