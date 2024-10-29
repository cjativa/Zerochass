
export default async (request, response) => {

    const { slug, 'x-craft-live-preview': xCraftLivePreview, token } = request.query;

    // Check the secret and next parameters
    // This secret should only be known to this API route and the CMS
   /*  if (!xCraftLivePreview || !slug || !token) {
        return response.status(401).json({ message: 'Invalid token' });
    }

    const lastSlash = slug.lastIndexOf('/') + 1;
    const tutorialSlug = slug.substring(lastSlash, slug.length + 1);

    // Fetch the headless CMS to check if the provided `slug` exists
    // getPostBySug would implement the required fetching logic to the headless CMS
    const tutorialsQuery = AllTutorialsQuery();
    const params = { token, "x-craft-live-preview": xCraftLivePreview };
    const tutorialsContent = (await CraftQL(tutorialsQuery, params));

    // If the slug doesn't exist prevent preview mode from being enabled
    if (!tutorialsContent) {
        return response.status(401).json({ message: `Invalid slug ${tutorialSlug}` })
    }

    // Enable Preview Mode by setting the cookies
    response.setPreviewData({ params }); */

    // Redirect to the path from the fetched post
    // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
    response.writeHead(307, { Location: slug })
    response.end()
};