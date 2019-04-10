declare namespace Cypress {
    interface Chainable<Subject = any> {
        /**
         * Get the text contents of a DOM element.
         *
         * @see https://github.com/Lakitna/cypress-commands/blob/master/docs/text.md
         */
        text(options?: {
            log?: boolean;
            whitespace?: 'simplify'|'keep-newline'|'keep';
            depth?: number;
        }): Chainable<Subject>
    }
}
