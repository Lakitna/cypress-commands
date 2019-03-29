const _ = Cypress._;
const $ = Cypress.$;

/**
 * Get the text value of an element, does not return text of its children.
 * @method text
 *
 * @param {JQuery} element
 * @param {Object} [options]
 * @param {boolean} [options.log=true]
 *      Log the command to the Cypress log
 * @param {boolean} [options.trim=true]
 *      Remove any whitespace on the ends of the string
 * @param {boolean} [options.replaceNbsp=true]
 *      Replace all non-breaking space characters with regular spaces
 * @returns {string|string[]}
 *
 * @example <div class='foo'>
 *     bar <span>lorum </span>
 * </div>
 * @example cy.get('.foo')
 *     .text()
 *     .should('equal', 'bar');
 * @example cy.get('.foo span')
 *     .text({trim: false})
 *     .should('equal', 'lorum ');
 */
Cypress.Commands.add('text', {prevSubject: 'element'}, (element, options={}) => {
    _.defaults(options, {
        log: true,
        trim: true,
        replaceNbsp: true,
    });

    const consoleProps = {
        'With options': options,
        'Applied to': $(element),
    };

    if (options.log) {
        options._log = Cypress.log({
            $el: $(element),
            name: 'text',
            message: '',
            consoleProps: () => {
                return consoleProps;
            },
        });
    }

    /**
     * @param {Array.<string>|string} result
     */
    function updateLog(result) {
        if (Array.isArray(result)) {
            options._log.set('message', JSON.stringify(result));
            consoleProps.Yielded = result;
        }
        else {
            options._log.set('message', result);
            consoleProps.Yielded = `'${result}'`;
        }
    }


    /**
     * Only returns text of current element, not its children
     * @param {JQuery} element
     * @return {string}
     */
    function getTextOfElement(element) {
        return element
            .contents()
            .filter(function() {
                return this.nodeType === Node.TEXT_NODE;
            })
            .text();
    }


    /**
     * Get the text, apply options and do the upcoming assertion
     * @return {Promise}
     */
    function resolveText() {
        let text = [];
        element.each(function() {
            text.push(
                getTextOfElement($(this))
            );
        });

        if (options.trim) {
            text = text.map((val) => val.trim());
        }
        if (options.replaceNbsp) {
            text = text.map((val) => val.replace(/\xa0/g, ' '));
        }

        if (text.length == 1) {
            text = text[0];
        }

        if (options.log) updateLog(text);

        return cy.verifyUpcomingAssertions(text, options, {
            // When the upcoming assertion failes first onFail is called
            // onFail: () => {},
            // When onFail resolves onRetry is called
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
