/* eslint-disable sonarjs/no-duplicate-string */
module.exports = {
    plugins: ['sonarjs', 'cypress'],
    extends: ['google', 'plugin:sonarjs/recommended', 'plugin:cypress/recommended'],
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 8,
    },
    env: {
        node: true,
        es6: true,
    },
    rules: {
        'indent': ['error', 4],
        'max-len': ['error', 100],
        'linebreak-style': 'off',
        'no-multi-spaces': [
            'error',
            {
                exceptions: {
                    VariableDeclarator: true,
                },
            },
        ],
        'object-curly-spacing': ['error', 'always'],
        'comma-dangle': [
            'error',
            {
                arrays: 'always-multiline',
                objects: 'always-multiline',
                imports: 'always-multiline',
                exports: 'always-multiline',
                functions: 'never',
            },
        ],
        'space-before-function-paren': [
            'error',
            {
                anonymous: 'always',
                named: 'never',
                asyncArrow: 'always',
            },
        ],
    },
    overrides: [
        {
            files: ['cypress/e2e/**/*'],
            rules: {
                'sonarjs/no-identical-functions': 'warn',
                'sonarjs/no-duplicate-string': ['warn', 5],
                'no-invalid-this': 'off',
            },
        },
    ],
};
