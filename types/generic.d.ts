/// <reference types="cypress" />

declare namespace Cypress {
    interface WhitespaceOptions {
        /**
         * How to handle whitespace in the string.
         *
         * - 'simplify': Replace all whitespace with a single space.
         * - 'keep-newline': Replace all whitespace except for newline characters (`\n`) with a
         *   single space.
         * - 'keep': Don't replace any whitespace.
         */
        whitespace: 'simplify' | 'keep-newline' | 'keep';
    }

    /**
     * Options that controls if the command can will be retried when it fails.
     *
     * A command should only be retryable when the command does not retry by default.
     */
    interface Retryable {
        /**
         * Retry the command when upcoming assertions fail.
         *
         * @default false
         */
        retry: boolean;
    }
}
