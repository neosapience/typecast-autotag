import { numberToEnglish, digitToEnglish } from '../utils/number-to-english';

/**
 * Options for inch function
 */
export interface InchOptions {
  /**
   * Whether to include space between number and unit
   * @default true
   */
  includeSpace?: boolean;
}

/**
 * Remove thousand separators
 */
function removeThousandSeparators(str: string): string {
  return str.replace(/,/g, '');
}

/**
 * Convert inch measurement to English words
 *
 * @param input - Inch measurement to convert (string)
 * @param options - Options (space inclusion)
 * @returns English inch expression
 *
 * @example
 * ```typescript
 * inch('65인치');   // 'sixty-five inches'
 * inch('55inches'); // 'fifty-five inches'
 * inch('1inch');    // 'one inch'
 * inch('4.5인치'); // 'four point five inches'
 * ```
 */
export function inch(input: string, options?: InchOptions): string {
  const includeSpace = options?.includeSpace ?? true;
  const space = includeSpace ? ' ' : '';

  const trimmed = input.trim();
  if (trimmed === '') return input;

  // Inch pattern matching
  const match = trimmed.match(/^([\d,]+(?:\.\d+)?)\s*(?:인치|inches?|in|")$/i);
  if (match) {
    const numStr = removeThousandSeparators(match[1] ?? '');

    // Handle decimal
    if (numStr.includes('.')) {
      const [intPart, decPart] = numStr.split('.');
      const intNum = parseInt(intPart ?? '0', 10);
      const intEnglish = intNum === 0 ? 'zero' : numberToEnglish(intNum);
      const decEnglish = (decPart ?? '')
        .split('')
        .map((d) => digitToEnglish(d))
        .join(' ');
      return intEnglish + ' point ' + decEnglish + space + 'inches';
    }

    const num = parseInt(numStr, 10);

    if (isNaN(num) || num < 0) {
      return input;
    }

    const unitWord = num === 1 ? 'inch' : 'inches';

    if (num === 0) {
      return 'zero' + space + unitWord;
    }

    return numberToEnglish(num) + space + unitWord;
  }

  return input;
}
