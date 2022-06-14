const _ = Cypress._;

/**
 * Error namespace for command related issues
 */
export default class CommandError extends Error {
    /**
     * @param {string} message The error message
     */
    constructor(message) {
        if (_.isArray(message)) {
            message = message.join('');
        }

        super(message);

        this.name = 'CommandError';
    }
}
