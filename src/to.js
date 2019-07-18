const _ = Cypress._;

import { command } from './utils/errorMessages';
const errMsg = command.to;

import OptionValidator from './utils/optionValidator';
const validator = new OptionValidator('to');


const types = {
    array: (subject) => {
        return _.isArrayLikeObject(subject) ? subject : [subject];
    },
    string: (subject) => {
        if (_.isArrayLikeObject(subject) || _.isObject(subject)) {
            return JSON.stringify(subject);
        }
        return `${subject}`;
    },
    number: castNumber,
};

/**
 * @param {string} type Target type
 * @param {Object} [options]
 * @param {boolean} [options.log=true]
 *   Log the command to the Cypress command log
 *
 * @yields {any[]}
 * @since 0.3.0
 */
Cypress.Commands.add('to', { prevSubject: true }, (subject, type, options = {}) => {
    validator.check('log', options.log, [true, false]);

    _.defaults(options, {
        log: true,
    });

    if (_.isUndefined(subject)) {
        throw new Error(errMsg.cantCastType('undefined'));
    }
    if (_.isNull(subject)) {
        throw new Error(errMsg.cantCastType('null'));
    }
    if (_.isNaN(subject)) {
        throw new Error(errMsg.cantCastType('NaN'));
    }

    if (!_.keys(types).includes(type)) {
        throw new Error(`${errMsg.cantCast('subject', type)} ${errMsg.expected(_.keys(types))}`);
    }


    const consoleProps = {
        'Applied to': subject,
    };
    if (options.log) {
        options._log = Cypress.log({
            name: 'to',
            message: type,
            consoleProps: () => consoleProps,
        });
    }


    /**
     * Cast the subject and do the upcoming assertion
     * @return {Promise}
     */
    function castSubject() {
        try {
            return cy.verifyUpcomingAssertions(types[type](subject), options, {
                // Retry untill the upcoming assertion passes
                onRetry: castSubject,
            });
        }
        catch (err) {
            options.error = err;
            return cy.retry(castSubject, options, options._log);
        }
    }

    return castSubject()
        .then((result) => {
            // The upcoming assertion passed, finish up the log
            consoleProps.Yielded = result;
            return result;
        });
});


/**
 * @param {any|any[]} subject
 * @return {number|number[]}
 */
function castNumber(subject) {
    if (_.isArrayLikeObject(subject)) {
        const casted = subject.map((val) => {
            if (_.isArrayLikeObject(val)) {
                throw new Error(errMsg.cantCast('a nested array', 'number'));
            }
            return Number(val);
        });

        if (casted.includes(NaN)) {
            const uncastable = subject
                .map((val, i) => {
                    if (_.isNaN(casted[i])) {
                        return `[${i}]: ${errMsg.cantCastVal(val, 'number')}`;
                    }
                    return undefined;
                })
                .filter((val) => val !== undefined);

            throw new Error(`${errMsg.cantCast('all items in the subject', 'number')}\n\n`
                + `${uncastable.join('\n')}`);
        }

        return casted;
    }
    else if (_.isObject(subject)) {
        throw new Error(errMsg.cantCastType('object', 'number'));
    }

    const casted = Number(subject);
    if (isNaN(casted)) {
        throw new Error(errMsg.cantCastVal(subject, 'number'));
    };
    return casted;
}
