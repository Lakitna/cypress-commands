module.exports = {
    "plugins": [
        "sonarjs",
        "cypress",
    ],
    "extends": [
        "google",
        "plugin:sonarjs/recommended",
        "plugin:cypress/recommended",
    ],
    "parserOptions": {
        "sourceType": "module",
        "ecmaVersion": 8
    },
    "env": {
        "node": true,
        "es6": true,
    },
    "rules": {
        "indent": [
            "error",
            4,
        ],
        "max-len": [
            "error",
            100,
        ],
        "linebreak-style": "off",
        "no-multi-spaces": [
            "error", {
                "exceptions": {
                    "VariableDeclarator": true,
                }
            }
        ],
        "brace-style": [
            "error",
            "stroustrup",
        ],
        "object-curly-spacing": ["error", "always"]
    },
    "overrides": [{
        "files": ["lib/**/*"],
        "rules": {
            // This is fine as long as you know what you're doing
            "cypress/no-assigning-return-values": "warn",
        }
    },
    {
        "files": ["cypress/integration/**/*"],
        "rules": {
            "sonarjs/no-identical-functions": "warn",
            "sonarjs/no-duplicate-string": ["warn", 5],
            "no-invalid-this": "off",
        },
    }],
};
