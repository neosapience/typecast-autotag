import { numberToEnglish } from '../utils/number-to-english';

/**
 * Options for numberTag function
 */
export interface NumberTagOptions {
  /**
   * Suffix (default: '')
   * @default ''
   */
  suffix?: string;

  /**
   * Whether to include space between number and suffix
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
 * Convert number to English words
 *
 * This is a generic number tag for simple number + suffix patterns.
 *
 * @param input - Number to convert (number or string)
 * @param options - Options
 * @returns English number expression
 *
 * @example
 * ```typescript
 * numberTag(1);        // 'one'
 * numberTag(2);        // 'two'
 * numberTag('3번');    // 'three'
 * numberTag('10번');   // 'ten'
 * numberTag(5, { suffix: 'number' }); // 'five number'
 * ```
 */
export function numberTag(input: number | string, options?: NumberTagOptions): string {
  const suffix = options?.suffix ?? '';
  const includeSpace = options?.includeSpace ?? true;
  const space = includeSpace && suffix !== '' ? ' ' : '';

  // String processing
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (trimmed === '') return input;

    // Parse "Number N", "No. N", "#N" format
    const labelMatch = trimmed.match(/^(Number|number|No\.|no\.|#)\s*([\d,]+)$/);
    if (labelMatch) {
      const label = labelMatch[1] ?? '';
      const numStr = removeThousandSeparators(labelMatch[2] ?? '');
      const num = parseInt(numStr, 10);

      if (isNaN(num)) {
        return String(input);
      }

      // Preserve case for the label, normalize No. and # to number/Number
      let displayLabel: string;
      if (label === 'Number') {
        displayLabel = 'Number';
      } else if (label === 'number') {
        displayLabel = 'number';
      } else if (label === 'No.' || label === 'no.') {
        displayLabel = label === 'No.' ? 'Number' : 'number';
      } else if (label === '#') {
        displayLabel = 'number';
      } else {
        displayLabel = 'number';
      }

      if (num === 0) {
        return displayLabel + ' zero' + space + suffix;
      }

      return displayLabel + ' ' + numberToEnglish(num) + space + suffix;
    }

    // Parse "1번", "10번", "1", etc.
    const match = trimmed.match(/^(-?[\d,]+)\s*(?:번)?$/);
    if (match) {
      const numStr = removeThousandSeparators(match[1] ?? '');
      const num = parseInt(numStr, 10);

      if (isNaN(num)) {
        return String(input);
      }

      if (num < 0) {
        const absResult = numberTag(-num, { suffix, includeSpace });
        return 'minus ' + absResult;
      }

      if (num === 0) {
        return 'zero' + space + suffix;
      }

      return numberToEnglish(num) + space + suffix;
    }

    // Try parsing as just a number
    const numOnlyMatch = trimmed.match(/^(-?[\d,]+)$/);
    if (numOnlyMatch) {
      const numStr = removeThousandSeparators(numOnlyMatch[1] ?? '');
      const num = parseInt(numStr, 10);

      if (isNaN(num)) {
        return String(input);
      }

      if (num < 0) {
        return 'minus ' + numberToEnglish(-num) + space + suffix;
      }

      if (num === 0) {
        return 'zero' + space + suffix;
      }

      return numberToEnglish(num) + space + suffix;
    }

    return String(input);
  }

  // Number processing
  if (isNaN(input)) {
    return 'not a number';
  }

  if (!isFinite(input)) {
    return input > 0 ? 'infinity' : 'minus infinity';
  }

  if (input < 0) {
    return 'minus ' + numberTag(-input, options);
  }

  if (input === 0) {
    return 'zero' + space + suffix;
  }

  return numberToEnglish(input) + space + suffix;
}
