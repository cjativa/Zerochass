/** Authentication configuration for the application */
const AuthConfig = {

    /** Name for the server cookie */
    zerochassServerCookie: 'zerochassServerCookie',

    /** Name for the client cookie */
    zerochassClientCookie: 'zerochassClientCookie',

    /** Expiration time authentication token should expire at after issuing */
    tokenExpiration: '30d',

    /** Expiration time authentication cookie should expire at after issuing */
    cookieExpiration: 30 * 86400 * 1000 // 30 days
};

export default AuthConfig;