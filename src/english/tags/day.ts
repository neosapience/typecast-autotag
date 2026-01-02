import { numberToEnglish, numberToOrdinal } from '../utils/number-to-english';

/**
 * Options for day function
 */
export interface DayOptions {
  /**
   * Output format: 'ordinal' (twenty-first) or 'cardinal' (twenty-one)
   * @default 'ordinal'
   */
  format?: 'ordinal' | 'cardinal';

  /**
   * Whether to include 'day' suffix
   * @default false
   */
  includeSuffix?: boolean;
}

/**
 * Remove thousand separators
 */
function removeThousandSeparators(str: string): string {
  return str.replace(/,/g, '');
}

/**
 * Convert day to English
 *
 * @param input - Day to convert (number 1-31 or string)
 * @param options - Options (format, suffix)
 * @returns English day expression
 *
 * @example
 * ```typescript
 * day(1);    // 'first'
 * day(15);   // 'fifteenth'
 * day(21);   // 'twenty-first'
 * day('25'); // 'twenty-fifth'
 * day('25일'); // 'twenty-fifth'
 * day(3, { format: 'cardinal' }); // 'three'
 * day(1, { includeSuffix: true }); // 'first day'
 *
 * // D-day format
 * day('D-day');  // 'D-day'
 * day('D-3');    // 'D minus three'
 * day('D+5');    // 'D plus five'
 * ```
 */
export function day(input: number | string, options?: DayOptions): string {
  const format = options?.format ?? 'ordinal';
  const includeSuffix = options?.includeSuffix ?? false;
  const suffix = includeSuffix ? ' day' : '';

  // String processing
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (trimmed === '') return input;

    // Handle D-day format
    const dDayMatch = trimmed.match(/^[Dd]\s*[-+]?\s*([\d,]+)?(?:일|days?)?$/i);
    if (dDayMatch || /^[Dd]-?[Dd]ay$/i.test(trimmed)) {
      if (/^[Dd]-?[Dd]ay$/i.test(trimmed)) {
        return 'D-day';
      }

      const hasPlus = trimmed.includes('+');
      const hasMinus = trimmed.includes('-');
      const numStr = dDayMatch?.[1];

      if (numStr) {
        const num = parseInt(removeThousandSeparators(numStr), 10);
        if (!isNaN(num)) {
          const sign = hasPlus ? 'plus' : hasMinus ? 'minus' : 'minus';
          return 'D ' + sign + ' ' + numberToEnglish(num);
        }
      }

      return trimmed;
    }

    // Handle "day N" or "day Nth" or "the Nth" format
    const dayNMatch = trimmed.match(/^(day|the)\s+([\d,]+)(?:st|nd|rd|th)?$/i);
    if (dayNMatch) {
      const prefix = dayNMatch[1]?.toLowerCase() ?? '';
      const numStr = removeThousandSeparators(dayNMatch[2] ?? '');
      const num = parseInt(numStr, 10);

      if (isNaN(num) || num < 0) {
        return String(input);
      }

      if (format === 'cardinal') {
        return prefix + ' ' + numberToEnglish(num) + suffix;
      }
      return prefix + ' ' + numberToOrdinal(num) + suffix;
    }

    // Parse "25일", "25일째", "25일차", "25", "25th", etc.
    const numMatch = trimmed.match(/^([\d,]+)\s*(?:일|일째|일차|st|nd|rd|th|day)?$/i);
    if (numMatch) {
      const numStr = removeThousandSeparators(numMatch[1] ?? '');
      const num = parseInt(numStr, 10);

      if (isNaN(num) || num < 0) {
        return String(input);
      }

      if (format === 'cardinal') {
        return numberToEnglish(num) + suffix;
      }
      return numberToOrdinal(num) + suffix;
    }

    return String(input);
  }

  // Number processing
  if (isNaN(input) || input < 0) {
    return String(input);
  }

  const dayNum = Math.floor(input);

  if (format === 'cardinal') {
    return numberToEnglish(dayNum) + suffix;
  }
  return numberToOrdinal(dayNum) + suffix;
}
