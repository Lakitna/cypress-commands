const pkg = require('../../package.json');

module.exports = {
    not_in_prod: `This message should never show if you're a user of cypress-commands. `
        + `If it does, please open an issue at ${pkg.repository}.`,
    command: {
        attribute: {
            disable_strict: `This behaviour can be disabled by calling `
                + `'.attribute()' with the option 'strict: false'.`,
            existence: {
                single: {
                    negated: (attribute) => {
                        return `Expected element to not have attribute `
                            + `'${attribute}', but it was continuously found.`;
                    },
                    normal: (attribute) => {
                        return `Expected element to have attribute `
                            + `'${attribute}', but never found it.`;
                    },
                },
                multiple: {
                    negated: (attribute, inputCount, outputCount) => {
                        return `Expected all ${inputCount} elements to not have `
                            + `attribute '${attribute}', but it was continuously found on `
                            + `${outputCount} elements.`;
                    },
                    normal: (attribute, inputCount, outputCount) => {
                        return `Expected all ${inputCount} elements to have `
                            + `attribute '${attribute}', but never found it on `
                            + `${inputCount - outputCount} elements.`;
                    },
                },
            },
        },
    },
};
