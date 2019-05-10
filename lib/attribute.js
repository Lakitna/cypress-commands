const _ = Cypress._;
const $ = Cypress.$;

const OptionValidator = require('./utils/optionValidator');
const validator = new OptionValidator('attribute');

/**
 * Get the value of an attribute of the subject
 *
 * @example
 * cy.get('a').attribute('href');
 *
 * @param {Object} [options]
 * @param {boolean} [options.log=true]
 *   Log the command to the Cypress command log
 *
 * @yields {string|string[]}
 * @since 0.2.0
 */
Cypress.Commands.add('attribute', { prevSubject: 'element' }, (subject, attribute, options={}) => {
    if (_.isObject(attribute)) {
        [attribute, options] = [options, attribute];
    }

    validator.check('log', options.log, [true, false]);

    _.defaults(options, {
        log: true,
    });


    const consoleProps = {
        'Applied to': $(subject),
    };
    if (options.log) {
        options._log = Cypress.log({
            $el: $(subject),
            name: 'attribute',
            message: attribute,
            consoleProps: () => consoleProps,
        });
    }


    /**
     * @param {Array.<string>|string} result
     * @param {jQuery} elements
     */
    function updateLog(result, elements) {
        consoleProps.Yielded = result;

        if (options.log && result.length) {
            options._log.set('$el', elements);
        }
    }

    /**
     * Get the attribute and do the upcoming assertion
     * @return {Promise}
     */
    function resolveAttribute() {
        const elements = $(subject).filter((i, elem) => {
            return $(elem).attr(attribute) !== undefined;
        });

        let attr = elements.map((i, elem) => {
            return $(elem).attr(attribute);
        });

        if (attr.length === 1) {
            attr = attr.get(0);
        }
        else if (attr.length > 1) {
            // Deconstruct jQuery object to normal array
            attr = attr.toArray();
        }

        if (options.log) {
            updateLog(attr, elements);
        }

        return cy.verifyUpcomingAssertions(attr, options, {
            onFail: (err) => {
                // Overwrite the error message of implicit assertions
                if (err.message.includes('to exist')) {
                    err.displayMessage = `Expected element to have attribute: `
                        + `'${attribute}', but never found it.`;
                }
                else if (err.message.includes('to not exist')) {
                    err.displayMessage = `Expected element to not have attribute `
                        + `'${attribute}', but it was continuously found.`;
                }
            },
            // Retry untill the upcoming assertion passes
            onRetry: resolveAttribute,
        });
    }

    return resolveAttribute()
        .then((attribute) => {
            // The upcoming assertion passed, finish up the log
            if (options.log) {
                options._log.snapshot().end();
            }
            return attribute;
        });
});
