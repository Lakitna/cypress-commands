declare namespace Cypress {
    interface Chainable<Subject = any> {
        /**
         * Enables you to work with the subject yielded from the previous command.
         *
         * @see https://github.com/Lakitna/cypress-commands/blob/master/docs/then.md
         */
        then<S>(options: {
            log?: boolean;
            retry?: boolean;
        }, fn: (this: ObjectLike, currentSubject: Subject) => Chainable<S>): Chainable<S>
        /**
         * Enables you to work with the subject yielded from the previous command / promise.
         *
         * @see https://github.com/Lakitna/cypress-commands/blob/master/docs/then.md
         */
        then<S>(options: {
            log?: boolean;
            retry?: boolean;
        }, fn: (this: ObjectLike, currentSubject: Subject) => PromiseLike<S>): Chainable<S>
        /**
         * Enables you to work with the subject yielded from the previous command / promise.
         *
         * @see https://github.com/Lakitna/cypress-commands/blob/master/docs/then.md
         */
        then<S extends object | any[] | string | number | boolean>(options: {
            log?: boolean;
            retry?: boolean;
        }, fn: (this: ObjectLike, currentSubject: Subject) => S): Chainable<S>
        /**
         * Enables you to work with the subject yielded from the previous command.
         *
         * @see https://github.com/Lakitna/cypress-commands/blob/master/docs/then.md
         * @example
         *    cy.get('.nav').then(($nav) => {})  // Yields .nav as first arg
         *    cy.location().then((loc) => {})   // Yields location object as first arg
         */
        then(options: {
            log?: boolean;
            retry?: boolean;
        }, fn: (this: ObjectLike, currentSubject: Subject) => void): Chainable<Subject>

        /**
         * Enables you to work with the subject yielded from the previous command.
         *
         * @see https://github.com/Lakitna/cypress-commands/blob/master/docs/then.md
         */
        then<S>(fn: (this: ObjectLike, currentSubject: Subject) => Chainable<S>, options: {
            log?: boolean;
            retry?: boolean;
        }): Chainable<S>
        /**
         * Enables you to work with the subject yielded from the previous command / promise.
         *
         * @see https://github.com/Lakitna/cypress-commands/blob/master/docs/then.md
         */
        then<S>(fn: (this: ObjectLike, currentSubject: Subject) => PromiseLike<S>, options: {
            log?: boolean;
            retry?: boolean;
        }): Chainable<S>
        /**
         * Enables you to work with the subject yielded from the previous command / promise.
         *
         * @see https://github.com/Lakitna/cypress-commands/blob/master/docs/then.md
         */
        then<S extends object | any[] | string | number | boolean>(fn: (this: ObjectLike, currentSubject: Subject) => S, options: {
            log?: boolean;
            retry?: boolean;
        }): Chainable<S>
        /**
         * Enables you to work with the subject yielded from the previous command.
         *
         * @see https://github.com/Lakitna/cypress-commands/blob/master/docs/then.md
         * @example
         *    cy.get('.nav').then(($nav) => {})  // Yields .nav as first arg
         *    cy.location().then((loc) => {})   // Yields location object as first arg
         */
        then(fn: (this: ObjectLike, currentSubject: Subject) => void, options: {
            log?: boolean;
            retry?: boolean;
        }): Chainable<Subject>
    }
}
