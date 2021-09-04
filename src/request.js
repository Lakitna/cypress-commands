import path from 'path';
const _ = Cypress._;

const methods = [
    `GET`,
    `POST`,
    `PUT`,
    `DELETE`,
    `PATCH`,
    `HEAD`,
    `OPTIONS`,
    `TRACE`,
    `COPY`,
    `LOCK`,
    `MKCOL`,
    `MOVE`,
    `PURGE`,
    `PROPFIND`,
    `PROPPATCH`,
    `UNLOCK`,
    `REPORT`,
    `MKACTIVITY`,
    `CHECKOUT`,
    `MERGE`,
    `M-SEARCH`,
    `NOTIFY`,
    `SUBSCRIBE`,
    `UNSUBSCRIBE`,
    `SEARCH`,
    `CONNECT`,
];

/**
 * @yields {any}
 * @since 0.2.0
 */
Cypress.Commands.overwrite('request', (originalCommand, ...args) => {
    const options = {};

    if (_.isObject(args[0])) {
        _.extend(options, args[0]);
    } else if (args.length === 1) {
        options.url = args[0];
    } else if (args.length === 2) {
        if (methods.includes(args[0].toUpperCase())) {
            options.method = args[0];
            options.url = args[1];
        } else {
            options.url = args[0];
            options.body = args[1];
        }
    } else if (args.length === 3) {
        options.method = args[0];
        options.url = args[1];
        options.body = args[2];
    }

    options.url = parseUrl(options.url);

    return originalCommand(options);
});

/**
 * @param {string} url
 * @return {string}
 */
function parseUrl(url) {
    if (
        typeof url === 'string' &&
        !url.includes('://') &&
        !url.startsWith('localhost') &&
        !url.startsWith('www.')
    ) {
        // It's a relative url
        const config = Cypress.config();
        const requestBaseUrl = config.requestBaseUrl;

        if (_.isString(requestBaseUrl) && requestBaseUrl.length > 0) {
            const split = requestBaseUrl.split('://');
            const protocol = split[0] + '://';
            const baseUrl = split[1];

            url = protocol + path.join(baseUrl, url);
        }
    }
    return url;
}
