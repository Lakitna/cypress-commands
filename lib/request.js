const path = require('path');

const methods = [
    'OPTIONS',
    'GET',
    'HEAD',
    'POST',
    'PUT',
    'DELETE',
    'TRACE',
    'CONNECT',
];

/**
 * @yields {any}
 * @since 0.2.0
 */
Cypress.Commands.overwrite('request', (originalCommand, ...args) => {
    if (args.length == 1) {
        args[0] = parseUrl(args[0]);
    }
    else if (args.length == 2) {
        if (methods.includes(args[0])) {
            args[1] = parseUrl(args[1]);
        }
        else {
            args[0] = parseUrl(args[0]);
        }
    }
    else if (args.length == 3) {
        args[1] = parseUrl(args[1]);
    }

    originalCommand(...args);
});


/**
 * @param {string} url
 * @return {string}
 */
function parseUrl(url) {
    if (url.split('://').length == 1) {
        // It's a relative path
        const config = Cypress.config();
        const split = (config.requestBaseUrl || config.baseUrl).split('://');
        const protocol = split[0] + '://';
        const baseUrl = split[1];

        url = protocol + path.join(baseUrl, url);
    }
    return url;
}
