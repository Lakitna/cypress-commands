/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable<Subject> {
        /**
         * Get the text contents of a DOM element.
         *
         * @see https://github.com/Lakitna/cypress-commands/blob/master/docs/text.md
         */
        text(options?: Partial<TextOptions>): Chainable<string | string[]>;
    }

    interface TextOptions extends Loggable, WhitespaceOptions {
        /**
         * Include the text contents of child elements upto `n` levels.
         *
         * @default 0
         */
        depth: number;

        /**
         * @default 'simplify'
         */
        whitespace: WhitespaceOptions['whitespace'];
    }
}
