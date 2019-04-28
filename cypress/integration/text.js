/* eslint-disable sonarjs/no-duplicate-string */

const $ = Cypress.$;
const COMMAND_TIMEOUT = 4000;

describe('The added command `text`', function() {
    let body;

    before(function() {
        cy.visit('/')
            .then((win) => {
                body = win.document.body.outerHTML;
            });
    });

    beforeEach(function() {
        Cypress.config('defaultCommandTimeout', COMMAND_TIMEOUT);

        const doc = cy.state('document');
        $(doc.body).empty().html(body);
    });

    it('yields text from a generic DOM element', function() {
        cy.get('div')
            .first()
            .text()
            .should('equal', 'div');
    });

    it('yields the value of a button element', function() {
        cy.get('button')
            .text()
            .should('equal', 'Some button');
    });

    it('yields the value of a textarea element', function() {
        cy.get('textarea')
            .text()
            .should('equal', 'A filled textarea');
    });

    it('retries the value of a generic DOM element', function() {
        cy.get('.counter')
            .text()
            .should('equal', '5');
    });

    it('retries the value of an input element', function() {
        cy.get('input')
            .text()
            .should('equal', '5');
    });

    describe('returns', function() {
        it('returns a string if the input is a single element', function() {
            cy.get('#foo')
                .text()
                .should('equal', 'foo');
        });

        it('returns an array if the input is multiple elements', function() {
            cy.get('.parent')
                .children()
                .text()
                .should((texts) => {
                    expect(texts).to.be.lengthOf(2);
                    expect(texts[0]).to.equal('child div');
                    expect(texts[1]).to.equal('secondchild div');
                });
        });
    });

    describe('The option `depth`', function() {
        it('`0` is the default value', function() {
            cy.get('div.parent')
                .text()
                .should('equal', 'parent div');
        });

        it('`0` results in only the contents of the element itself', function() {
            cy.get('div.parent')
                .text({ depth: 0 })
                .should('equal', 'parent div');
        });

        it('`1` results in the contents of the element and its direct children', function() {
            cy.get('div.parent')
                .text({ depth: 1 })
                .should('equal', 'parent div child div secondchild div');
        });

        it('`2` results in the contents of the element and its direct children', function() {
            cy.get('div.parent')
                .text({ depth: 2 })
                .should('equal', 'parent div child div secondchild div grandchild div '
                    + 'secondgrandchild div');
        });

        it('`Infinity` results in the contents of the element and all its children', function() {
            cy.get('div.parent')
                .text({ depth: Infinity })
                .should('equal', 'parent div child div secondchild div grandchild div '
                    + 'secondgrandchild div great-grandchild div great-great-grandchild div');
        });

        it('gets all values of form elements', function() {
            cy.get('form')
                .text({ depth: 1 })
                .should('equal', '5 A filled textarea Some button');
        });
    });

    describe('The option `whitespace`', function() {
        it('`simplify` is the default value', function() {
            cy.get('div.whitespace')
                .text()
                .should('equal', 'div containing some complex whitespace');
        });

        it('`simplify` simplifies all whitespace', function() {
            cy.get('div.whitespace')
                .text({ whitespace: 'simplify' })
                .should('equal', 'div containing some complex whitespace');
        });

        it('`keep-newline` simplifies all whitespace except newlines', function() {
            cy.get('div.whitespace')
                .text({ whitespace: 'keep-newline' })
                .should('equal', 'div\ncontaining some complex whitespace');
        });

        it('`keep` does not change whitespace at all', function() {
            cy.get('div.whitespace')
                .text({ whitespace: 'keep' })
                .should((text) => {
                    const lines = text.split('\n');

                    expect(lines[0]).to.equal('div');
                    expect(lines[1].trim())
                        .to.equal('containing\xa0 \xa0 \t some complex\twhitespace');
                });
        });
    });

    describe('errors', function() {
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

        it('is called as a parent command', function(done) {
            cy.on('fail', (err) => {
                const lastLog = __lastLog;

                expect(__logs.length).to.eq(1);
                expect(lastLog.get('error')).to.eq(err);
                expect(err.message)
                    .to.include('Oops, it looks like you are trying to call a child '
                        + 'command before running a parent command.');
                done();
            });

            cy.text();
        });

        it('not preceded with an element', function(done) {
            cy.on('fail', (err) => {
                const lastLog = __lastLog;

                expect(__logs.length).to.eq(2);
                expect(lastLog.get('error')).to.eq(err);
                expect(err.message)
                    .to.include('cy.text() failed because it requires a DOM element.');
                done();
            });

            cy.wrap('foo')
                .text();
        });

        it('wrong value for the option `depth`', function(done) {
            cy.on('fail', (err) => {
                const lastLog = __lastLog;

                expect(__logs.length).to.eq(2);
                expect(lastLog.get('error')).to.eq(err);
                expect(err.message)
                    .to.include('Bad value for the option "depth" of the command "text"');
                done();
            });

            cy.get('#foo')
                .text({ depth: -1 });
        });

        it('wrong value for the option `whitespace`', function(done) {
            cy.on('fail', (err) => {
                const lastLog = __lastLog;

                expect(__logs.length).to.eq(2);
                expect(lastLog.get('error')).to.eq(err);
                expect(err.message)
                    .to.include('Bad value for the option "whitespace" of the command "text"')
                    .and.include('["simplify","keep","keep-newline"]');
                done();
            });

            cy.get('#foo')
                .text({ whitespace: 1 });
        });

        it('wrong value for the option `log`', function(done) {
            cy.on('fail', (err) => {
                const lastLog = __lastLog;

                expect(__logs.length).to.eq(2);
                expect(lastLog.get('error')).to.eq(err);
                expect(err.message)
                    .to.include('Bad value for the option "log" of the command "text"')
                    .and.include('[true,false]');
                done();
            });

            cy.get('#foo')
                .text({ log: 1 });
        });
    });
});
