const fs = require("fs");
const sitemap = require("nextjs-sitemap-generator");

const BUILD_ID = fs.readFileSync(".next/BUILD_ID").toString();

sitemap({
    baseUrl: "https://zerochass.io",
    pagesDirectory: __dirname + "/.next/server/static/" + BUILD_ID + "/pages",
    targetDirectory: "public/",
    ignoredPaths: ["[fallback]", "/api", "/tutorial/[slug]"],
});