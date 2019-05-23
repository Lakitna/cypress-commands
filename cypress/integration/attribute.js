/* eslint-disable sonarjs/no-duplicate-string */

const COMMAND_TIMEOUT = 4000;

describe('The added command `text`', function() {
    before(function() {
        cy.visit('/');
    });


    beforeEach(function() {
        Cypress.config('defaultCommandTimeout', COMMAND_TIMEOUT);
    });


    it('considers empty attributes to be existing, but empty', function() {
        cy.get('.parent')
            .attribute('data-foo')
            .should('equal', '')
            .should('exist')
            .should('be.empty');
    });

    it('retries', function() {
        cy.get('form input')
            .attribute('data-attr')
            .should('equal', '5');
    });

    describe('handles implicit assertions correctly', function() {
        let __logs;
        let __lastLog;

        beforeEach(function() {
            Cypress.config('defaultCommandTimeout', 50);

            __logs = [];

            cy.on('log:added', (_, log) => {
                __lastLog = log;
                __logs.push(log);
            });

            return null;
        });

        describe('implicit assertion `to.exist`', function() {
            it('throws when the attribute does not exist', function(done) {
                cy.on('fail', (err) => {
                    const lastLog = __lastLog;

                    expect(__logs.length).to.eq(2);
                    expect(lastLog.get('error')).to.eq(err);
                    expect(err.message)
                        .to.include('Expected element to have attribute \'id\', '
                            + 'but never found it.');
                    done();
                });

                cy.get('.whitespace')
                    .attribute('id');
            });

            it('does not throw when the attribute does exist', function() {
                cy.get('.whitespace')
                    .attribute('class');
            });
        });

        describe('Overwriting implicit assertions', function() {
            it('can explicitly assert existence', function(done) {
                cy.on('fail', (err) => {
                    expect(__logs.length).to.eq(3);
                    expect(err.message)
                        .to.include('Expected element to have attribute \'id\', '
                            + 'but never found it.');
                    done();
                });

                cy.get('.whitespace')
                    .attribute('id')
                    .should('exist');
            });

            it('overwrites implicit assertion when testing for non-existence', function(done) {
                cy.on('fail', (err) => {
                    expect(__logs.length).to.eq(3);
                    expect(err.message)
                        .to.include('Expected element to not have attribute \'class\', '
                            + 'but it was continuously found.');
                    done();
                });

                cy.get('.whitespace')
                    .attribute('class')
                    .should('not.exist');
            });
        });
    });

    describe('The attribute of a single element', function() {
        it('yields a string', function() {
            cy.get('.whitespace')
                .attribute('class')
                .should('equal', 'whitespace');
        });

        it('yields the first when an attribute exists twice', function() {
            cy.get('.great-great-grandchild')
                .attribute('data-foo')
                .should('equal', 'bar');
        });
    });

    describe('The attribute of a multiple elements', function() {
        it('yields an array of strings', function() {
            cy.get('.parent > div')
                .attribute('data-relation')
                .should('have.lengthOf', 2)
                .should('deep.equal', ['child', 'child']);
        });
    });

    describe('options', function() {
        let __logs;
        let __lastLog;

        beforeEach(function() {
            Cypress.config('defaultCommandTimeout', 50);

            __logs = [];

            cy.on('log:added', (_, log) => {
                __lastLog = log;
                __logs.push(log);
            });

            return null;
        });

        it('does not mind flipping the order of properties', function() {
            cy.get('.whitespace')
                .attribute({}, 'class')
                .should('equal', 'whitespace');

            cy.get('.whitespace')
                .attribute('class', {})
                .should('equal', 'whitespace');
        });

        it('does not log with `log: false`', function() {
            cy.get('.whitespace')
                .attribute('class', { log: false })
                .then(() => {
                    const lastLog = __lastLog;

                    expect(__logs.length).to.equal(1);
                    expect(lastLog.get().name).to.equal('get');
                })
                .should('equal', 'whitespace');
        });

        describe('strict', function() {
            it('thows when not all subjects have the attribute', function(done) {
                cy.on('fail', (err) => {
                    expect(__logs.length).to.eq(2);
                    expect(err.message)
                        .to.include('Expected all 4 elements to have attribute '
                            + '\'data-relation\', but never found it on 1 elements.');
                    done();
                });

                cy.get('.parent > div > div, .parent > div')
                    .attribute('data-relation'); // strict: true is default
            });

            it('does not throw when not all subjects have the attribute '
                    + 'and `strict: false`', function() {
                cy.get('.parent div')
                    .attribute('data-relation', { strict: false });
            });

            it('only yields the values of elements with the attribute when'
                    + '`strict: false`', function() {
                cy.get('.parent div')
                    .attribute('data-relation', { strict: false })
                    .should('be.lengthOf', 3)
                    .and('deep.equal', [
                        'child',
                        'grandchild',
                        'child',
                    ]);
            });

            context('Upcoming assertions', function() {
                describe('should exist', function() {
                    it('throws when not all subjects have the attribute', function(done) {
                        cy.on('fail', (err) => {
                            expect(__logs.length).to.eq(3);
                            expect(err.message)
                                .to.include('Expected all 4 elements to have attribute '
                                    + '\'data-relation\', but never found it on 1 elements.');
                            done();
                        });

                        cy.get('.parent > div > div, .parent > div', { strict: true })
                            .attribute('data-relation')
                            .should('exist');
                    });

                    it('does not throw when all subjects have the attribute', function() {
                        cy.get('.parent > div')
                            .attribute('data-relation', { strict: true })
                            .should('exist');
                    });
                });

                describe('should not exist', function() {
                    it('does not throw when none of the subjects have attribute', function() {
                        cy.get('.parent > div > div, .parent > div')
                            .attribute('data-nonExistent', { strict: true })
                            .should('not.exist');
                    });

                    it('throws when some of the subjects have attribute', function(done) {
                        cy.on('fail', (err) => {
                            expect(__logs.length).to.eq(3);
                            expect(err.message)
                                .to.include('Expected all 4 elements to not have attribute '
                                    + '\'data-relation\', but it was continuously found on 3 '
                                    + 'elements.');
                            done();
                        });

                        cy.get('.parent > div > div, .parent > div')
                            .attribute('data-relation', { strict: true })
                            .should('not.exist');
                    });

                    it('throws when some of the subjects have attribute and '
                            + '`log: false`', function(done) {
                        cy.on('fail', (err) => {
                            expect(__logs.length).to.eq(2);
                            expect(err.message)
                                .to.include('Expected all 4 elements to not have attribute '
                                    + '\'data-relation\', but it was continuously found on 3 '
                                    + 'elements.');
                            done();
                        });

                        cy.get('.parent > div > div, .parent > div')
                            .attribute('data-relation', { strict: true, log: false })
                            .should('not.exist');
                    });
                });
            });
        });
    });
});
