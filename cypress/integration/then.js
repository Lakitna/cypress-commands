/* eslint-disable cypress/no-assigning-return-values */
/* eslint-disable cypress/no-unnecessary-waiting */

const $ = Cypress.$;
const Promise = Cypress.Promise;

describe('The overwritten command `then`', function () {
    let body;

    before(function () {
        cy.visit('/').then((win) => {
            body = win.document.body.outerHTML;
        });
    });

    describe('Tests copied from Cypress repo', function () {
        beforeEach(function () {
            const doc = cy.state('document');
            $(doc.body).empty().html(body);
        });

        it('converts raw DOM elements', function () {
            const div = cy.$$('div:first').get(0);

            cy.wrap(div).then(($div) => {
                expect($div.get(0)).to.eq(div);
            });
        });

        it('does not insert a mocha callback', function () {
            cy.noop().then(() => {
                expect(cy.queue.length).to.eq(2);
            });
        });

        it('passes timeout option to then', function () {
            cy.timeout(50);

            cy.then({ timeout: 150 }, function () {
                return Promise.delay(100);
            });
        });

        it('can resolve nested thens', function () {
            cy.get('div:first').then(() => {
                cy.get('div:first').then(() => {
                    cy.get('div:first');
                });
            });
        });

        it('can resolve cypress commands inside of a promise', function () {
            let _then = false;

            cy.wrap(null)
                .then(() => {
                    return Promise.delay(10).then(() => {
                        cy.then(() => {
                            _then = true;
                        });
                    });
                })
                .then(() => {
                    expect(_then).to.be.true;
                });
        });

        it('can resolve chained cypress commands inside of a promise', function () {
            let _then = false;

            cy.wrap(null)
                .then(() => {
                    return Promise.delay(10).then(() => {
                        cy.get('div:first').then(() => {
                            _then = true;
                        });
                    });
                })
                .then(() => {
                    expect(_then).to.be.true;
                });
        });

        it('can resolve cypress instance inside of a promise', function () {
            cy.then(() => {
                Promise.delay(10).then(() => cy);
            });
        });

        it('passes values to the next command', function () {
            cy.wrap({ foo: 'bar' })
                .then((obj) => obj.foo)
                .then((val) => {
                    expect(val).to.eq('bar');
                });
        });

        it('does not throw when returning thenables with cy command', function () {
            cy.wrap({ foo: 'bar' }).then((obj) => {
                return new Promise((resolve) => {
                    cy.wait(10);

                    resolve(obj.foo);
                });
            });
        });

        it('should pass the eventual resolved thenable value downstream', function () {
            cy.wrap({ foo: 'bar' })
                .then((obj) => {
                    cy.wait(10)
                        .then(() => obj.foo)
                        .then((value) => {
                            expect(value).to.eq('bar');

                            return value;
                        });
                })
                .then((val) => {
                    expect(val).to.eq('bar');
                });
        });

        it(
            'should not pass the eventual resolve thenable value downstream because ' +
                'thens are not connected',
            function () {
                cy.wrap({ foo: 'bar' }).then((obj) => {
                    cy.wait(10)
                        .then(() => obj.foo)
                        .then((value) => {
                            expect(value).to.eq('bar');

                            return value;
                        });
                });
                cy.then((val) => {
                    expect(val).to.be.undefined;
                });
            }
        );

        it('passes the existing subject if ret is undefined', function () {
            cy.wrap({ foo: 'bar' })
                .then(() => undefined)
                .then((obj) => {
                    expect(obj).to.deep.eq({ foo: 'bar' });
                });
        });

        it('sets the subject to null when given null', function () {
            cy.wrap({ foo: 'bar' })
                .then(() => null)
                .then((obj) => {
                    expect(obj).to.be.null;
                });
        });

        describe('errors', function () {
            let __logs;
            let __lastLog;

            beforeEach(function () {
                Cypress.config('defaultCommandTimeout', 50);

                __logs = [];

                cy.on('log:added', (_, log) => {
                    __lastLog = log;
                    __logs.push(log);
                });

                return null;
            });

            it('throws when promise timeout', function (done) {
                cy.on('fail', (err) => {
                    const lastLog = __lastLog;

                    expect(__logs.length).to.eq(1);
                    expect(lastLog.get('error')).to.eq(err);
                    expect(err.message).to.include('`cy.then()` timed out after waiting `150ms`.');
                    done();
                });

                cy.then({ timeout: 150 }, () => {
                    return new Promise(() => {});
                });
            });

            it('throws when mixing up async + sync return values', function (done) {
                cy.on('fail', (err) => {
                    const lastLog = __lastLog;

                    expect(__logs.length).to.eq(1);
                    expect(lastLog.get('error')).to.eq(err);
                    expect(err.message).to.include(
                        '`cy.then()` failed because you are mixing up async and sync code.'
                    );
                    done();
                });

                cy.then(() => {
                    cy.wait(5000);
                    return 'foo';
                });
            });

            it('unbinds command:enqueued in the case of an error thrown', function (done) {
                const listeners = [];

                cy.on('fail', () => {
                    listeners.push(cy.listeners('command:enqueued').length);

                    expect(__logs.length).to.eq(1);
                    expect(listeners).to.deep.eq([1, 0]);
                    done();
                });

                cy.then(() => {
                    listeners.push(cy.listeners('command:enqueued').length);

                    throw new Error('foo');
                });
            });
        });

        describe('yields to remote jQuery subject', function () {
            let __remoteWindow;
            beforeEach(function () {
                __remoteWindow = cy.state('window');
            });

            it('calls the callback function with the remote jQuery subject', function () {
                __remoteWindow.$.fn.foo = () => {};

                cy.get('div:first')
                    .then(($div) => {
                        expect($div).to.be.instanceof(__remoteWindow.$);
                        return $div;
                    })
                    .then(($div) => {
                        expect($div).to.be.instanceof(__remoteWindow.$);
                    });
            });

            it('does not store the remote jQuery object as the subject', function () {
                cy.get('div:first')
                    .then(($div) => {
                        expect($div).to.be.instanceof(__remoteWindow.$);
                        return $div;
                    })
                    .then(() => {
                        expect(cy.state('subject')).to.not.be.instanceof(__remoteWindow.$);
                    });
            });
        });
    });

    describe('Retryability', function () {
        before(function () {
            Cypress.config('defaultCommandTimeout', 1000);
        });

        beforeEach(function () {
            const doc = cy.state('document');
            $(doc.body).empty().html(body);
        });

        it('retries until the upcoming assertion passes', function () {
            let c = 0;

            cy.then(() => ++c, { retry: true }).should('equal', 5);
        });

        it('retries correctly when handling dom elements', function () {
            let initalResult = null;

            cy.get('ul#list')
                .then(
                    (list) => {
                        const result = list.children().length;
                        if (initalResult === null) {
                            initalResult = result;
                        }
                        return result;
                    },
                    { retry: true }
                )
                .should('equal', 3)
                .then((result) => {
                    expect(initalResult).to.below(result);
                });
        });

        describe('errors', function () {
            let __logs;
            let __lastLog;

            beforeEach(function () {
                Cypress.config('defaultCommandTimeout', 50);
                __logs = [];

                cy.on('log:added', (_, log) => {
                    __lastLog = log;
                    __logs.push(log);
                });
            });

            it('throws on timeout', function (done) {
                cy.on('fail', (err) => {
                    const lastLog = __lastLog;

                    expect(__logs.length).to.eq(2);
                    expect(err.message).to.contain(lastLog.get('error').message);
                    expect(err.message).to.equal(
                        'Timed out retrying after 50ms: expected 5 to equal 4'
                    );
                    done();
                });

                cy.then({ retry: true }, () => 5).should('equal', 4);
            });

            it('logs and fails on a thrown error', function (done) {
                cy.on('fail', (err) => {
                    const lastLog = __lastLog;

                    expect(__logs.length).to.eq(2);
                    expect(err.message).to.contain(lastLog.get('error').message);
                    expect(err.message).to.equal('foo');
                    done();
                });

                cy.then({ retry: true }, () => {
                    throw new Error('foo');
                }).should('equal', 4);
            });
        });
    });

    describe('Callback context', function () {
        it('passes aliasses to the callback function (fat-arrow notation)', function () {
            const outerThis = this;

            cy.wrap('fooBar').as('someAlias');

            cy.then(() => {
                expect(this.someAlias).to.equal('fooBar');
                expect(this).to.equal(outerThis);
            });
        });

        it('passes aliasses to the callback function (function notation)', function () {
            const outerThis = this;

            cy.wrap('fooBar').as('someAlias');

            cy.then(function () {
                expect(this.someAlias).to.equal('fooBar');
                expect(this).to.equal(outerThis);
            });
        });
    });
});
