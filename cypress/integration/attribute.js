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
                        .to.include('Expected element to have attribute: \'id\', '
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
                        .to.include('Expected element to have attribute: \'id\', '
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

        it('only yields the values of elements with the attribute', function() {
            cy.get('.parent div')
                .attribute('data-relation')
                .should('be.lengthOf', 3)
                .and('deep.equal', [
                    'child',
                    'grandchild',
                    'child',
                ]);
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
    });
});
