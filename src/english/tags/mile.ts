import { numberToEnglish, digitToEnglish } from '../utils/number-to-english';

/**
 * Options for mile function
 */
export interface MileOptions {
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
 * Convert mileage to English words
 *
 * @param input - Mileage to convert (string)
 * @param options - Options (space inclusion)
 * @returns English mileage expression
 *
 * @example
 * ```typescript
 * mile('100마일');   // 'one hundred miles'
 * mile('5000miles'); // 'five thousand miles'
 * mile('1mile');     // 'one mile'
 * mile('2.5마일');   // 'two point five miles'
 * ```
 */
export function mile(input: string, options?: MileOptions): string {
  const includeSpace = options?.includeSpace ?? true;
  const space = includeSpace ? ' ' : '';

  const trimmed = input.trim();
  if (trimmed === '') return input;

  // Mile pattern matching
  const match = trimmed.match(/^([\d,]+(?:\.\d+)?)\s*(?:마일|miles?)$/i);
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
      return intEnglish + ' point ' + decEnglish + space + 'miles';
    }

    const num = parseInt(numStr, 10);

    if (isNaN(num) || num < 0) {
      return input;
    }

    const unitWord = num === 1 ? 'mile' : 'miles';

    if (num === 0) {
      return 'zero' + space + unitWord;
    }

    return numberToEnglish(num) + space + unitWord;
  }

  return input;
}
