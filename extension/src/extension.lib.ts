const htmlRegex = /(<[^>]+>)([^<]+)(<\/[^>]+>)/;
const stringLiteralRegex = /(['"`])([^'"`]+)\1/;

/*
* Returns the replacement string for the given line.
*/
export const getReplacement = (key: string, text: string, context: string) => {
  let outText = text.length > 0 ? text : context;

  if (outText.includes('\n')) {
    outText = outText.replace(/\n(\s*)/g, ' ');
  }

  const htmlMatch = outText.match(htmlRegex);
  const stringLiteralMatch = context.match(stringLiteralRegex);

  if (htmlMatch) {
    const [, startTag, innerText, endTag] = htmlMatch;
    return `${startTag}{t('${key}->${innerText.trim()}')}${endTag}`;
  }

  if (stringLiteralMatch) {
    const [fullMatch, quote, innerText] = stringLiteralMatch;
    const strippedText = innerText.trim();
    const transformedText = `t('${key}->${strippedText}')`;
    return context.replace(fullMatch, transformedText).trim();
  }

  return `{t('${key}->${outText.trim()}')}`;
};