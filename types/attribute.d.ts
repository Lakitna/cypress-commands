declare namespace Cypress {
    interface Chainable<Subject = any> {
        /**
         * Get the value of an attribute of a DOM element.
         *
         * @see https://github.com/Lakitna/cypress-commands/blob/master/docs/attribute.md
         */
        attribute(attribute: string, options?: {
            log?: boolean;
            whitespace?: 'simplify'|'keep-newline'|'keep';
            strict?: boolean;
        }): Chainable<Subject>

        /**
         * Get the value of an attribute of a DOM element.
         *
         * @see https://github.com/Lakitna/cypress-commands/blob/master/docs/attribute.md
         */
        attribute(options: {
            log?: boolean;
            whitespace?: 'simplify'|'keep-newline'|'keep';
            strict?: boolean;
        }, attribute: string): Chainable<Subject>
    }
}
