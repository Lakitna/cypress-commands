const $ = Cypress.$;
const COMMAND_TIMEOUT = 4000;

describe('The added command `toArray`', function() {
    before(function() {
        Cypress.config('defaultCommandTimeout', COMMAND_TIMEOUT);
        cy.visit('/');
    });

    context('Option validator', function() {
        let __logs;

        beforeEach(function() {
            __logs = [];

            cy.on('log:added', (_, log) => {
                __logs.push(log);
            });
        });

        it('throws when a faulty value is provided for '
                + 'the option `log`', function(done) {
            cy.on('fail', (err) => {
                expect(__logs.length).to.eq(2);
                expect(err.message)
                    .to.include('Bad value for the option "log" of the '
                        + 'command "toArray".');
                done();
            });

            cy.wrap(123)
                .toArray({ log: 'foo' });
        });
    });

    context('In isolation', function() {
        it('does not cast an Array', function() {
            cy.wrap(['foo', 'bar'])
                .toArray()
                .should('deep.equal', ['foo', 'bar']);
        });

        it('casts a string', function() {
            cy.wrap('foo')
                .toArray()
                .should('deep.equal', ['foo']);
        });

        it('casts a number', function() {
            cy.wrap(123)
                .toArray()
                .should('deep.equal', [123]);
        });

        it('casts an object', function() {
            cy.wrap({foo: 123})
                .toArray()
                .should('deep.equal', [{ foo: 123 }]);
        });
    });

    context('Interacting with page', function() {
        beforeEach(function() {
            cy.get('#list > *')
                .as('list')
                .should('have.length', 5);
        });

        it('does not cast a single element', function() {
            // Elements are jQuery objects, which are iterable.
            cy.get('@list')
                .first()
                .toArray()
                .should((result) => {
                    expect(Array.isArray(result)).to.be.false;
                    expect(result.length).to.equal(1);
                })
                .each((val) => {
                    expect(val.jquery).to.not.be.undefined;
                });
        });

        it('does not cast multiple elements', function() {
            // Elements are jQuery objects, which are iterable.
            cy.get('@list')
                .toArray()
                .should((result) => {
                    expect(Array.isArray(result)).to.be.false;
                    expect(result.length).to.equal(5);
                })
                .each((val) => {
                    expect(val.jquery).to.not.be.undefined;
                });
        });

        it('does cast the text result of a single element', function() {
            cy.get('@list')
                .first()
                .text()
                .toArray()
                .should((result) => {
                    expect(Array.isArray(result)).to.be.true;
                    expect(result.length).to.equal(1);
                })
                .each((val) => {
                    expect(typeof val).to.equal('string');
                });
        });

        it('does not cast the text result of multiple elements', function() {
            cy.get('@list')
                .text()
                .toArray()
                .should((result) => {
                    expect(Array.isArray(result)).to.be.true;
                    expect(result.length).to.equal(5);
                })
                .each((val) => {
                    expect(typeof val).to.equal('string');
                });
        });
    });
});

