// next.config.js
const withImages = require('next-images');

module.exports = withImages({
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        return config;
    },
    experimental: { optionalCatchAll: true }
});




