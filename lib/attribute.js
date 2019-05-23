const _ = Cypress._;
const $ = Cypress.$;

const commandQueue = require('./utils/commandQueue');
const errMsg = require('./utils/errorMessages').command.attribute;

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
    subject = $(subject);

    // Make sure the order of input can be flipped
    if (_.isObject(attribute)) {
        [attribute, options] = [options, attribute];
    }

    // Handle options
    validator.check('log', options.log, [true, false]);
    validator.check('strict', options.strict, [true, false]);
    _.defaults(options, {
        log: true,
        strict: true,
    });


    const consoleProps = {
        'Applied to': subject,
    };
    if (options.log) {
        options._log = Cypress.log({
            $el: subject,
            name: 'attribute',
            message: attribute,
            consoleProps: () => consoleProps,
        });
    }

    // Mark this newly invoked command to be able to find it later.
    commandQueue.markCurrentCommand('attribute');

    /**
     * @param {Array.<string>|string} result
     */
    function updateLog(result) {
        consoleProps.Yielded = result;
    }

    /**
     * Get the attribute and do the upcoming assertion
     * @return {Promise}
     */
    function resolveAttribute() {
        let attr = subject.map((i, elem) => {
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
            updateLog(attr);
        }

        let result = attr;
        if (options.strict && attr.length && subject.length > attr.length) {
            const negate = commandQueue.upcomingAssertionNegatesExistence();

            if (!negate) {
                result = $([]);
            }
        }

        return cy.verifyUpcomingAssertions(result, options, {
            onFail: (err) => onFail(err, subject, attribute, attr),
            // Retry untill the upcoming assertion passes
            onRetry: resolveAttribute,
        });
    }

    return resolveAttribute()
        .then(function(attribute) {
            // The upcoming assertion passed, finish up the log
            if (options.log) {
                options._log.snapshot().end();
            }
            return attribute;
        });
});


/**
 * Overwrite the error message of implicit assertions
 * @param {AssertionError} err
 * @param {jQuery} subject
 * @param {string} attribute
 * @param {jQuery} result
 */
function onFail(err, subject, attribute, result) {
    const negate = err.message.includes(' not ');

    if (err.type === 'existence' && subject.length == 1) {
        const errorMessage = errMsg.existence.single;

        if (negate) {
            err.displayMessage = errorMessage.negated(attribute);
        }
        else {
            err.displayMessage = errorMessage.normal(attribute);
        }
    }
    else if (err.type === 'existence' && subject.length > 1) {
        const errorMessage = errMsg.existence.multiple;

        if (negate) {
            err.displayMessage = errorMessage.negated(attribute, subject.length, result.length);
        }
        else {
            err.displayMessage = errorMessage.normal(attribute, subject.length, result.length);
        }

        err.displayMessage += '\n\n' + errMsg.disable_strict;
    }
}
