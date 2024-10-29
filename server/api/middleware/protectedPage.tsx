export default async function protectPageWithAuthentication({ req, res }) {
    const { isAuthenticated } = (await import('./protectWithAuthentcation'));
    const { authenticated, accessToken, userId } = isAuthenticated(req, res);
    
    if (!authenticated) {
        res.writeHead(302, { Location: '/' });
        res.end();
    }

    else {
        req['authenticated'] = true;
        req['userId'] = userId;
        req['accessToken'] = accessToken;
    }
};