const _ = Cypress._;
const $ = Cypress.$;

const OptionValidator = require('./utils/optionValidator');
const validator = new OptionValidator('text');

/**
 * Get the text contents of the subject
 *
 * @example
 * cy.get('footer').text();
 *
 * @param {Object} [options]
 * @param {boolean} [options.log=true]
 *   Log the command to the Cypress command log
 * @param {'simplify'|'keep-newline'|'keep'} [options.whitespace='simplify']
 *   Replace complex whitespace (`&nbsp;`, `\t`, `\n`, multiple spaces and more
 *   obscure whitespace characters) with a single regular space.
 * @param {number} [options.depth=0]
 *   Include the text contents of child elements up to a depth of `n`
 *
 * @yields {string|string[]}
 * @since 0.1.0
 */
Cypress.Commands.add('text', { prevSubject: 'element' }, (element, options = {}) => {
    validator.check('log', options.log, [true, false]);
    validator.check('whitespace', options.whitespace, ['simplify', 'keep', 'keep-newline']);
    validator.check('depth', options.depth, '>= 0');

    _.defaults(options, {
        log: true,
        whitespace: 'simplify',
        depth: 0,
    });


    const consoleProps = {
        'Applied to': $(element),
    };
    if (options.log) {
        options._log = Cypress.log({
            $el: $(element),
            name: 'text',
            message: '',
            consoleProps: () => consoleProps,
        });
    }


    options._whitespace = (v) => v;
    if (options.whitespace == 'simplify') {
        options._whitespace = (v) => {
            return v.replace(/\s+/g, ' ');
        };
    }
    else if (options.whitespace == 'keep-newline') {
        options._whitespace = (v) => {
            return v
                .replace(/[^\S\n]+/g, ' ')
                .replace(/[^\S\n]*\n[^\S\n]*/g, '\n');
        };
    }


    /**
     * @param {Array.<string>|string} result
     */
    function updateLog(result) {
        consoleProps.Yielded = result;
        if (_.isArray(result)) {
            options._log.set('message', JSON.stringify(result));
        }
        else {
            options._log.set('message', result);
        }
    }


    /**
     * @param {JQuery} element
     * @param {number} depth
     * @return {string}
     */
    function getTextOfElement(element, depth) {
        let ret = element
            .contents()
            .filter((_, cont) => cont.nodeType === Node.TEXT_NODE)
            .text()
            .trim();

        const children = element.children();
        if (depth > 0 && children.length) {
            ret += ' ' + getTextOfElement(children, --depth);
        }

        return ret;
    }


    /**
     * Get the text and do the upcoming assertion
     * @return {Promise}
     */
    function resolveText() {
        let text = [];
        element.each((_, elem) => {
            text.push(
                getTextOfElement($(elem), options.depth)
            );
        });

        text = text.map(options._whitespace);

        if (text.length == 1) {
            text = text[0];
        }

        if (options.log) updateLog(text);

        return cy.verifyUpcomingAssertions(text, options, {
            // Retry untill the upcoming assertion passes
            onRetry: resolveText,
        });
    }

    return resolveText()
        .then((text) => {
            // The upcoming assertion passed, finish up the log
            if (options.log) {
                options._log.snapshot().end();
            }
            return text;
        });
});
