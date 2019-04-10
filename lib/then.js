const _ = Cypress._;
const $ = Cypress.$;

const isJquery = require('./utils/isJquery');
const OptionValidator = require('./utils/optionValidator');
const validator = new OptionValidator('then');

/**
 * Enables you to work with the subject yielded from the previous command.
 *
 * @example
 * cy.then((subject) => {
 *   // ...
 * });
 *
 * @param {function} fn
 * @param {Object} options
 * @param {boolean} [options.log=false]
 *   Log to Cypress bar
 * @param {boolean} [options.retry=false]
 *   Retry when an upcomming assertion fails
 *
 * @yields {any}
 * @since 0.0.0
 */
Cypress.Commands.overwrite('then', (originalCommand, subject, fn, options = {}) => {
    if (_.isFunction(options)) {
        // Flip the values of `fn` and `options`
        [fn, options] = [options, fn];
    };

    validator.check('log', options.log, [true, false]);
    validator.check('retry', options.retry, [true, false]);

    if (options.retry && typeof options.log === 'undefined') {
        options.log = true;
    }

    _.defaults(options, {
        log: false,
        retry: false,
    });

    // Setup logging
    const consoleProps = {};
    if (options.log) {
        options._log = Cypress.log({
            name: 'then',
            message: '',
            consoleProps: () => consoleProps,
        });

        if (isJquery(subject)) {
            // Link the DOM element to the logger
            options._log.set('$el', $(subject));
            consoleProps['Applied to'] = $(subject);
        }
        else {
            consoleProps['Applied to'] = String(subject);
        }

        if (options.retry) {
            options._log.set('message', 'retry');
        }
    }

    /**
     * This function is recursively called untill timeout or the upcomming
     * assertion passes. Keep this function as fast as possible.
     *
     * @return {Promise}
     */
    async function executeFnAndRetry() {
        const result = await executeFn();

        return cy.verifyUpcomingAssertions(result, options, {
            // Try again by calling itself
            onRetry: executeFnAndRetry,
        });
    }

    /**
     * Execute the provided callback function
     *
     * @return {*}
     */
    async function executeFn() {
        // Execute using the original `then` to not reinvent the wheel
        return await originalCommand(subject, options, fn)
            .then((value) => {
                if (options.log) {
                    consoleProps.Yielded = value;
                }

                return value;
            });
    }

    if (options.retry) {
        return executeFnAndRetry();
    }
    return executeFn();
});
