const _ = Cypress._;
const $ = Cypress.$;

import OptionValidator from './utils/optionValidator';
const validator = new OptionValidator('toArray');

/**
 * Wrap a given subject in an Array
 * Will do nothing if the subject is array-like
 *
 * @example
 * cy.wrap(123).toArray();
 *
 * @example
 * cy.wrap('foo').toArray();
 *
 * @example
 * cy.wrap({ foo: 123 }).toArray();
 *
 * @param {Object} [options]
 * @param {boolean} [options.log=true]
 *   Log the command to the Cypress command log
 *
 * @yields {any[]}
 * @since 0.3.0
 */
Cypress.Commands.add('toArray', { prevSubject: true }, (subject, options = {}) => {
    validator.check('log', options.log, [true, false]);

    _.defaults(options, {
        log: true,
    });


    const consoleProps = {
        'Applied to': subject,
    };
    if (options.log) {
        options._log = Cypress.log({
            name: 'toArray',
            message: '',
            consoleProps: () => consoleProps,
        });
    }


    /**
     * Cast the subject and do the upcoming assertion
     * @return {Promise}
     */
    function castSubject() {
        const casted = _.isArrayLikeObject(subject) ? subject : [subject];

        return cy.verifyUpcomingAssertions(casted, options, {
            // Retry untill the upcoming assertion passes
            onRetry: castSubject,
        });
    }

    return castSubject()
        .then((result) => {
            // The upcoming assertion passed, finish up the log
            consoleProps.Yielded = result;
            return result;
        });
});
