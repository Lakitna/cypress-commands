const _ = Cypress._;
const $ = Cypress.$;

import whitespace from './utils/whitespace';
import OptionValidator from './utils/optionValidator';
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

    options._whitespace = whitespace(options.whitespace);

    const consoleProps = {
        'Applied to': $(element),
        'Whitespace': options.whitespace,
        'Depth': options.depth,
    };
    if (options.log) {
        options._log = Cypress.log({
            $el: $(element),
            name: 'text',
            message: '',
            consoleProps: () => consoleProps,
        });
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


/**
 * @param {JQuery} element
 * @param {number} depth
 * @return {string}
 */
function getTextOfElement(element, depth) {
    let ret = element
        .contents()
        .filter((_, content) => {
            // Only keep the text nodes
            return content.nodeType === Node.TEXT_NODE;
        })
        .map((_, content) => {
            // Get the text from the nodes
            return content.data.trim();
        })
        .toArray()
        .join(' ');

    if (depth > 0) {
        const children = element.children();
        if (children.length) {
            ret += ' ' + getTextOfElement(children, --depth);
        }
    }

    return ret.trim();
}
