const _ = Cypress._;

module.exports = function isJquery(val) {
    if (_.isUndefined(val) || _.isNull(val)) {
        return false;
    }
    return !!val.jquery;
};
