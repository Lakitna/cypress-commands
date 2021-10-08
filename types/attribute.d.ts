/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable<Subject> {
        /**
         * Get the value of an attribute of a DOM element.
         *
         * @see https://github.com/Lakitna/cypress-commands/blob/master/docs/attribute.md
         */
        attribute(
            attribute: string,
            options?: Partial<AttributeOptions>
        ): Chainable<string | string[]>;

        /**
         * Get the value of an attribute of a DOM element.
         *
         * @see https://github.com/Lakitna/cypress-commands/blob/master/docs/attribute.md
         */
        attribute(
            options: Partial<AttributeOptions>,
            attribute: string
        ): Chainable<string | string[]>;
    }

    interface AttributeOptions extends Loggable, WhitespaceOptions {
        /**
         * If true, implicitly assert that all subjects have the requested attribute.
         *
         * @default true
         */
        strict: boolean;

        /**
         * @default 'keep'
         */
        whitespace: WhitespaceOptions['whitespace'];
    }
}
