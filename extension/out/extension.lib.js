"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReplacement = void 0;
const getReplacement = (key, text, context) => {
    const outText = text.length > 0 ? text : context;
    const htmlRegex = /(<[^>]+>)([^<]+)(<\/[^>]+>)/;
    const stringLiteralRegex = /(['"`])([^'"`]+)\1/;
    const htmlMatch = outText.match(htmlRegex);
    const stringLiteralMatch = context.match(stringLiteralRegex);
    if (htmlMatch) {
        const [, startTag, innerText, endTag] = htmlMatch;
        return `${startTag}{t('${key}->${innerText.trim()}')}${endTag}`;
    }
    if (stringLiteralMatch) {
        const strippedText = outText.trim().replace(/^['"`]|['"`]$/g, '');
        return `t('${key}->${strippedText}')`;
    }
    return `{t('${key}->${outText.trim()}')}`;
};
exports.getReplacement = getReplacement;
//# sourceMappingURL=extension.lib.js.map