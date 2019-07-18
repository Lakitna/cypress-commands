declare namespace Cypress {
    interface Chainable<Subject = any> {
        /**
         * Wrap the subject in an Array.
         * Will do nothing if the subject is array-like.
         *
         * @see https://github.com/Lakitna/cypress-commands/blob/master/docs/toArray.md
         */
        toArray(options?: {
            log?: boolean;
        }): Chainable<Subject>
    }
}
