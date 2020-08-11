/**
 * @param {'simplify'|'keep-newline'|'keep'} mode
 * @return {function}
 */
export default function whitespace(mode) {
    const zeroWidthWhitespace = /[\u200B-\u200D\uFEFF]/g;

    if (mode === 'simplify') {
        return (input) => {
            return input
                .replace(zeroWidthWhitespace, '')
                .replace(/\s+/g, ' ')
                .trim();
        };
    }

    if (mode === 'keep-newline') {
        return (input) => {
            return input
                .replace(zeroWidthWhitespace, '')
                .replace(/[^\S\n]+/g, ' ')
                .replace(/^[^\S\n]/g, '')
                .replace(/[^\S\n]$/g, '')
                .replace(/[^\S\n]*\n[^\S\n]*/g, '\n');
        };
    }

    return (input) => input;
}
