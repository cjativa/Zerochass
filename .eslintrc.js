module.exports = {
    settings: {
        "import/resolver": {
            "node": {
                "extensions": [".js", ".jsx", ".ts", ".tsx"]
            }
        }
    },
    env: {
        browser: true,
        es6: true,
        jest: true
    },
    extends: [
        'plugin:import/errors',
        'plugin:import/warnings',
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "./tsconfig.json",
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 2018,
        sourceType: "module"
    },
    plugins: [
        "react",
        "@typescript-eslint",
        "import",
    ],
    rules: {
        "import/no-unresolved": 2,
    }
};