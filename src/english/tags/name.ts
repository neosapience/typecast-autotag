/**
 * Convert name to spelled-out form (letter by letter for non-English)
 * - Non-ASCII characters: separated by the separator
 * - English letters: consecutive letters kept as words
 *
 * @param input - Name to convert
 * @param separator - Separator between characters (default: ' ')
 * @returns Name with characters separated
 *
 * @example
 * ```typescript
 * name('John');      // 'John'
 * name('John Doe');  // 'John Doe'
 * name('김John');    // '김 John'
 * name('A1B2');      // 'A 1 B 2'
 * ```
 */
export function name(input: string, separator: string = ' '): string {
  if (!input || input.length === 0) {
    return input;
  }

  // Normalize whitespace
  const normalized = input.trim().replace(/\s+/g, ' ');

  if (normalized.length === 0) {
    return '';
  }

  const tokens: string[] = [];
  let letterBuffer = '';
  let digitBuffer = '';

  for (const char of normalized) {
    if (/[a-zA-Z]/.test(char)) {
      // Flush digit buffer
      if (digitBuffer) {
        tokens.push(...digitBuffer.split(''));
        digitBuffer = '';
      }
      letterBuffer += char;
    } else if (/\d/.test(char)) {
      // Flush letter buffer
      if (letterBuffer) {
        tokens.push(letterBuffer);
        letterBuffer = '';
      }
      digitBuffer += char;
    } else if (char === ' ') {
      // Preserve spaces - flush buffers
      if (letterBuffer) {
        tokens.push(letterBuffer);
        letterBuffer = '';
      }
      if (digitBuffer) {
        tokens.push(...digitBuffer.split(''));
        digitBuffer = '';
      }
      tokens.push(' ');
    } else {
      // Non-ASCII or special characters
      if (letterBuffer) {
        tokens.push(letterBuffer);
        letterBuffer = '';
      }
      if (digitBuffer) {
        tokens.push(...digitBuffer.split(''));
        digitBuffer = '';
      }
      tokens.push(char);
    }
  }

  // Flush remaining buffers
  if (letterBuffer) {
    tokens.push(letterBuffer);
  }
  if (digitBuffer) {
    tokens.push(...digitBuffer.split(''));
  }

  // Join with separator, but preserve original spaces
  return tokens
    .reduce((acc: string[], token) => {
      if (token === ' ') {
        // Add space as-is
        acc.push(' ');
      } else if (acc.length === 0) {
        acc.push(token);
      } else if (acc[acc.length - 1] === ' ') {
        acc.push(token);
      } else {
        acc.push(separator + token);
      }
      return acc;
    }, [])
    .join('');
}
