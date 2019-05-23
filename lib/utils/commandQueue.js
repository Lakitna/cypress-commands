const errMsg = require('./errorMessages');

/**
 * By marking the current command we can retrieve it later in any
 * context, including retried context.
 * @param {string} commandName
 */
exports.markCurrentCommand = function markCurrentCommand(commandName) {
    const queue = Cypress.cy.queue;
    const currentCommand = queue
        .filter({ name: commandName })
        .filter((command) => !command.get('invoke'))
        .shift();

    // The mark
    currentCommand.attributes.invoked = true;
};


/**
 * Find out of the last marked command in the command queue has upcoming
 * assertions that negate existence.
 * @return {boolean}
 */
exports.upcomingAssertionNegatesExistence = function upcomingAssertionNegatesExistence() {
    const currentCommand = getLastMarkedCommand();
    if (!currentCommand) {
        return false;
    }

    const upcomingAssertions = getUpcomingAssertions(currentCommand);

    return upcomingAssertions.some((c) => {
        let args = c.get('args');
        if (typeof args[0] === 'string') {
            args = args[0].split('.');
            return args.includes('exist') && args.includes('not');
        }
        return false;
    });
};


/**
 * @return {Command|false}
 */
function getLastMarkedCommand() {
    const queue = Cypress.cy.queue;
    const cmd = queue.get()
        .filter((command) => command.get('invoked'))
        .pop();

    if (cmd === undefined) {
        console.error(`Could not find any marked commands in the queue. `
            + `Did you forget to mark the command during its initial invokation?`
            + `\n\n${errMsg.not_in_prod}`);

        return false;
    }

    return cmd;
}


/**
 * Recursively find all direct upcoming assertions
 * @param {Command} command
 * @return {Command[]}
 */
function getUpcomingAssertions(command) {
    const next = command.get('next');
    let ret = [];
    if (next && next.get('type') === 'assertion') {
        ret = [next, ...getUpcomingAssertions(next)];
    }
    return ret;
}
