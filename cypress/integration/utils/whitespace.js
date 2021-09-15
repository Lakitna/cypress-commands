import whitespace from '../../../src/utils/whitespace';
const _ = Cypress._;

describe('Whitespace options for commands yielding strings', function () {
    it('returns a function', function () {
        expect(_.isFunction(whitespace('mode'))).to.be.true;
    });

    context('mode = `simplify`', function () {
        beforeEach(function () {
            this.ws = whitespace('simplify');
        });

        it('simplifies whitespace in the middle of the string', function () {
            expect(this.ws('Lorum  ipsum\n\xa0dolor\tsit  \r \n\tamet')).to.equal(
                'Lorum ipsum dolor sit amet'
            );
        });

        it('removes whitespace at the ends of the string', function () {
            expect(this.ws(' Lorum ipsum dolor sit amet\n')).to.equal('Lorum ipsum dolor sit amet');

            expect(this.ws('\tLorum ipsum dolor sit amet\r')).to.equal(
                'Lorum ipsum dolor sit amet'
            );

            expect(this.ws('\t \r \n\xa0   Lorum ipsum dolor sit amet')).to.equal(
                'Lorum ipsum dolor sit amet'
            );
        });

        it('removes zero-width whitespace', function () {
            expect(this.ws('Lorum\u200Bipsum dol\uFEFFor sit amet')).to.equal(
                'Lorumipsum dolor sit amet'
            );

            expect(this.ws('Lorum\u200Cips\uFEFFum dolor sit amet')).to.equal(
                'Lorumipsum dolor sit amet'
            );

            expect(this.ws('Lorum\u200Dipsum dolor sit am\uFEFFet')).to.equal(
                'Lorumipsum dolor sit amet'
            );
        });
    });

    context('mode = `keep-newline`', function () {
        beforeEach(function () {
            this.ws = whitespace('keep-newline');
        });

        it('simplifies non-newline whitespace in the middle of the string', function () {
            expect(this.ws('Lorum  ipsum dolor\tsit  \r \tamet')).to.equal(
                'Lorum ipsum dolor sit amet'
            );
        });

        it('keeps newline characters in the middle of a string', function () {
            expect(this.ws('Lorum \n ipsum\xa0 dolor\tsit  \r \n\tamet')).to.equal(
                'Lorum\nipsum dolor sit\namet'
            );
        });

        it('removes non-newline whitespace at the ends of the string', function () {
            expect(this.ws(' Lorum ipsum dolor sit amet')).to.equal('Lorum ipsum dolor sit amet');

            expect(this.ws('\tLorum ipsum dolor sit amet\r')).to.equal(
                'Lorum ipsum dolor sit amet'
            );

            expect(this.ws('\t\xa0 \r    Lorum ipsum dolor sit amet')).to.equal(
                'Lorum ipsum dolor sit amet'
            );
        });

        it('keeps newline characters at the ends of a string', function () {
            expect(this.ws(' \n Lorum ipsum dolor sit amet\t\n')).to.equal(
                '\nLorum ipsum dolor sit amet\n'
            );

            expect(this.ws('\nLorum ipsum dolor sit amet')).to.equal(
                '\nLorum ipsum dolor sit amet'
            );
        });

        it('removes zero-width whitespace', function () {
            expect(this.ws('Lorum\u200Bipsum dol\uFEFFor sit amet')).to.equal(
                'Lorumipsum dolor sit amet'
            );

            expect(this.ws('Lorum\u200Cips\uFEFFum dolor sit amet')).to.equal(
                'Lorumipsum dolor sit amet'
            );

            expect(this.ws('Lorum\u200Dipsum dolor sit am\uFEFFet')).to.equal(
                'Lorumipsum dolor sit amet'
            );
        });
    });

    context('mode = `keep`', function () {
        beforeEach(function () {
            this.ws = whitespace('keep');
        });

        it('does not change the string at all', function () {
            const string = 'Lorum  \t\r\xa0 ipsum dolor \n\nsit amet\n\r';

            expect(this.ws(string)).to.equal(string);
        });
    });
});
