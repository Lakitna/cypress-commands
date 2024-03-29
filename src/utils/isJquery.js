const _ = Cypress._;

/**
 * Find out if a given value is a jQuery object
 * @param {*} value
 * @return {boolean}
 */
export default function isJquery(value) {
    if (_.isUndefined(value) || _.isNull(value)) {
        return false;
    }
    return !!value.jquery;
}
