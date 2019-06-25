const _ = Cypress._;

import CommandError from './commandError';
import { repository } from '../../package.json';

/**
 * Validate user set options
 */
export default class OptionValidator {
    /**
     * @param {string} commandName
     */
    constructor(commandName) {
        /**
         * @type {string}
         */
        this.command = commandName;

        /**
         * Url to the full documentation of the command
         * @type {string}
         */
        this.docUrl = `${repository.url}/blob/master/docs/${commandName}.md`;
    }

    /**
     * Validate a user set option
     * @param {string} option
     * @param {*} actual
     * @param {string[]|string} expected
     * @throws {CommandError}
     */
    check(option, actual, expected) {
        if (_.isUndefined(actual)) {
            // The option is not set. This is fine.
            return;
        }

        const errMessage = {
            start: `Bad value for the option "${option}" of the command "${this.command}".\n\n`,
            received: `Command received the value "${actual}" but `,
            end: `\n\nFor details refer to the documentation at ${this.docUrl}`,
        };

        if (_.isArray(expected)) {
            if (!expected.includes(actual)) {
                throw new CommandError([
                    errMessage.start,
                    errMessage.received,
                    `expected one of ${JSON.stringify(expected)}`,
                    errMessage.end,
                ]);
            }
        }
        else if (_.isString(expected)) {
            if (!eval(`'${actual}' ${expected}`)) {
                throw new CommandError([
                    errMessage.start,
                    errMessage.received,
                    `expected a value ${expected}`,
                    errMessage.end,
                ]);
            }
        }
        else {
            throw new CommandError(`Not sure how to validate `
                + `the option "${option}" of the command "${this.command}".\n\n`
                + `If you see this message in the wild, please create an issue `
                + `so this error can be resolved.\n${repoUrl}`);
        }
    }
}
