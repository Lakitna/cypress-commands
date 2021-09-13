/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable<Subject> {
        /**
         * Cast the subject to a given type
         *
         * - When the subject is an array it will cast all items in the array instead
         * - When the subject is already the given type it will do nothing
         *
         * @see https://github.com/Lakitna/cypress-commands/blob/master/docs/to.md
         */
        to(type: 'string' | 'number' | 'array', options?: Partial<Loggable>): Chainable;

        /**
         * Cast the subject to a given type
         *
         * - When the subject is an array it will cast all items in the array instead
         * - When the subject is already the given type it will do nothing
         *
         * @see https://github.com/Lakitna/cypress-commands/blob/master/docs/to.md
         */
        to(
            type: 'string',
            options?: Partial<Loggable>
        ): Chainable<Subject extends any[] ? string[] : string>;

        /**
         * Cast the subject to a given type
         *
         * - When the subject is an array it will cast all items in the array instead
         * - When the subject is already the given type it will do nothing
         *
         * @see https://github.com/Lakitna/cypress-commands/blob/master/docs/to.md
         */
        to(
            type: 'number',
            options?: Partial<Loggable>
        ): Chainable<Subject extends any[] ? number[] : number>;

        /**
         * Cast the subject to a given type
         *
         * - When the subject is an array it will cast all items in the array instead
         * - When the subject is already the given type it will do nothing
         *
         * @see https://github.com/Lakitna/cypress-commands/blob/master/docs/to.md
         */
        to(
            type: 'array',
            options?: Partial<Loggable>
        ): Chainable<Subject extends any[] ? Subject : Subject[]>;
    }
}
