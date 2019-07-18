const COMMAND_TIMEOUT = 4000;
const COMMAND_TIMEOUT_FAST = 100;

describe('The added command `to`', function() {
    before(function() {
        cy.visit('/');
    });

    beforeEach(function() {
        Cypress.config('defaultCommandTimeout', COMMAND_TIMEOUT);
    });

    context('Input validation', function() {
        let __logs;

        beforeEach(function() {
            __logs = [];

            cy.on('log:added', (_, log) => {
                __logs.push(log);
            });
        });

        it('throws when the subject is undefined', function(done) {
            cy.on('fail', (err) => {
                expect(__logs.length).to.eq(2);
                expect(err.message)
                    .to.include(`Can't cast subject of type undefined`);
                done();
            });

            cy.wrap(undefined)
                .to('string');
        });

        it('throws when the subject is null', function(done) {
            cy.on('fail', (err) => {
                expect(__logs.length).to.eq(2);
                expect(err.message)
                    .to.include(`Can't cast subject of type null`);
                done();
            });

            cy.wrap(null)
                .to('string');
        });

        it('throws when the subject is NaN', function(done) {
            cy.on('fail', (err) => {
                expect(__logs.length).to.eq(2);
                expect(err.message)
                    .to.include(`Can't cast subject of type NaN`);
                done();
            });

            cy.wrap(NaN)
                .to('string');
        });

        it('throws when a faulty value is provided for the option `log`', function(done) {
            cy.on('fail', (err) => {
                expect(__logs.length).to.eq(2);
                expect(err.message)
                    .to.include('Bad value for the option "log" of the command "to".');
                done();
            });

            cy.wrap(123)
                .to('string', { log: 'foo' });
        });

        it('throws when a faulty type is provided', function(done) {
            cy.on('fail', (err) => {
                expect(__logs.length).to.eq(2);
                expect(err.message)
                    .to.include('Can\'t cast subject to type badType.');
                done();
            });

            cy.wrap(123).to('badType');
        });

        it('requires types to be case sensitive', function(done) {
            cy.on('fail', (err) => {
                expect(__logs.length).to.eq(2);
                expect(err.message)
                    .to.include('Can\'t cast subject to type STRing.');
                done();
            });

            cy.wrap(123).to('STRing');
        });
    });

    context('String', function() {
        describe('In isolation', function() {
            let __logs;

            beforeEach(function() {
                Cypress.config('defaultCommandTimeout', COMMAND_TIMEOUT_FAST);
                __logs = [];

                cy.on('log:added', (_, log) => {
                    __logs.push(log);
                });
            });

            it('casts a number', function() {
                cy.wrap(123456)
                    .to('string')
                    .should('equal', '123456');
            });

            it('passes a string unmodified', function() {
                cy.wrap('foo bar baz')
                    .to('string')
                    .should('equal', 'foo bar baz');
            });

            it('casts an array to JSON', function() {
                cy.wrap(['foo', 'bar', 'baz'])
                    .to('string')
                    .should('equal', '["foo","bar","baz"]');
            });

            it('casts an object to JSON', function() {
                cy.wrap({ foo: 'bar', baz: true })
                    .to('string')
                    .should('equal', '{"foo":"bar","baz":true}');
            });
        });
    });

    context('Number', function() {
        describe('In isolation', function() {
            let __logs;

            beforeEach(function() {
                Cypress.config('defaultCommandTimeout', COMMAND_TIMEOUT_FAST);
                __logs = [];

                cy.on('log:added', (_, log) => {
                    __logs.push(log);
                });
            });

            it('casts a numberlike string', function() {
                cy.wrap('007')
                    .to('number')
                    .should('equal', 7);
            });

            it('throws on a non-numberlike string', function(done) {
                cy.on('fail', (err) => {
                    expect(__logs.length).to.eq(2);
                    expect(err.message)
                        .to.include(`Can't cast 'Five' to type number`);
                    done();
                });

                cy.wrap('Five')
                    .to('number');
            });

            it('throws on a non-array object', function(done) {
                cy.on('fail', (err) => {
                    expect(__logs.length).to.eq(2);
                    expect(err.message)
                        .to.include(`Can't cast subject of type object to type number`);
                    done();
                });

                cy.wrap({ number: '123' })
                    .to('number');
            });

            it('passes a subject of type number without modification', function() {
                cy.wrap(7)
                    .to('number')
                    .should('equal', 7);
            });

            it('casts all items in an array of numberlike strings', function() {
                cy.wrap(['1234', '009', '564864'])
                    .to('number')
                    .should('deep.equal', [1234, 9, 564864]);
            });

            it('throws on an array containing a non-numberlike string', function(done) {
                cy.on('fail', (err) => {
                    expect(__logs.length).to.eq(2);
                    expect(err.message)
                        .to.include(`Can't cast all items in the subject to type number`)
                        .to.include(`[0]: Can't cast 'foo' to type number`)
                        .to.include(`[3]: Can't cast 'a125' to type number`);
                    done();
                });

                cy.wrap(['foo', '1234', '009', 'a125'])
                    .to('number');
            });

            it('throws on a multidimentional array', function(done) {
                cy.on('fail', (err) => {
                    expect(__logs.length).to.eq(2);
                    expect(err.message)
                        .to.include(`Can't cast a nested array to type number.`);
                    done();
                });

                cy.wrap([[123, '123'], '9340'])
                    .to('number');
            });
        });
    });

    context('Array', function() {
        describe('In isolation', function() {
            it('does not cast an Array', function() {
                cy.wrap(['lorum', 'ipsum'])
                    .to('array')
                    .should('deep.equal', ['lorum', 'ipsum']);
            });

            it('casts a string', function() {
                cy.wrap('foo')
                    .to('array')
                    .should('deep.equal', ['foo']);
            });

            it('casts a number', function() {
                cy.wrap(123)
                    .to('array')
                    .should('deep.equal', [123]);
            });

            it('casts an object', function() {
                cy.wrap({ foo: 123 })
                    .to('array')
                    .should('deep.equal', [{ foo: 123 }]);
            });
        });

        describe('When interacting with page', function() {
            beforeEach(function() {
                cy.get('#list > *')
                    .as('list')
                    .should('have.length', 5);
            });

            it('does not cast a single element', function() {
                // Elements are jQuery objects, which are iterable.
                cy.get('@list')
                    .first()
                    .to('array')
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
                    .to('array')
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
                    .to('array')
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
                    .to('array')
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
});

