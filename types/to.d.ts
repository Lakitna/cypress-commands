declare namespace Cypress {
    interface Chainable<Subject = any> {
        /**
         * Cast the subject to a given type
         *
         * - When the subject is an array it will cast all items in the array instead
         * - When the subject is already the given type it will do nothing
         *
         * @see https://github.com/Lakitna/cypress-commands/blob/master/docs/to.md
         */
        to(type: 'string'|'number'|'array', options?: {
            log?: boolean;
        }): Chainable<Subject>
    }
}
