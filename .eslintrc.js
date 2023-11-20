module.exports = {
    root: true,
    'env': {
        'browser': true,
        'es2021': true,
        "node": true,
    },
    'extends': [
        'eslint:recommended',
        'plugin:react/recommended'
    ],
    'overrides': [
        {
            'env': {
                'node': true
            },
            'files': [
                '.eslintrc.{js,cjs}'
            ],
            'parserOptions': {
                'sourceType': 'script'
            }
        }
    ],
    'parserOptions': {
        'ecmaVersion': 'latest',
        'sourceType': 'module'
    },
    'plugins': [
        'react'
    ],
    'rules': {
        "react/prop-types": "off",
        // "react/prop-types": ["error", { "ignore": ["navigation"] }],
        "no-unused-vars": "warn",
        'linebreak-style': "off",
        "quotes": "off",
        // 'semi': [
        //     'warn',
        //     'always',
        // ]
    }
};
