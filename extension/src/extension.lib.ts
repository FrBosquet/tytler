export const getReplacement = (key: string, text: string, context: string) => {
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