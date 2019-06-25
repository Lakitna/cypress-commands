import { repository } from '../../package.json';


export const notInProduction =
    `This message should never show if you're a user of cypress-commands. `
    + `If it does, please open an issue at ${repository.url}.`;

export const command = {
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
};
