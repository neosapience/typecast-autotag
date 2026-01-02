import { numberToOrdinal } from '../utils/number-to-english';

/** Month names */
const MONTH_NAMES = [
  '',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * Options for month function
 */
export interface MonthOptions {
  /**
   * Output format: 'name' (January) or 'ordinal' (first)
   * @default 'name'
   */
  format?: 'name' | 'ordinal';
}

/**
 * Remove thousand separators
 */
function removeThousandSeparators(str: string): string {
  return str.replace(/,/g, '');
}

/**
 * Convert month to English
 *
 * @param input - Month to convert (number 1-12 or string)
 * @param options - Options (format)
 * @returns English month expression
 *
 * @example
 * ```typescript
 * month(1);   // 'January'
 * month(12);  // 'December'
 * month('6'); // 'June'
 * month('6월'); // 'June'
 * month(3, { format: 'ordinal' }); // 'third'
 * ```
 */
export function month(input: number | string, options?: MonthOptions): string {
  const format = options?.format ?? 'name';

  // String processing
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (trimmed === '') return input;

    // Parse "6월", "12월", "6", "June", etc.
    const numMatch = trimmed.match(/^([\d,]+)\s*(?:월|month)?$/i);
    if (numMatch) {
      const numStr = removeThousandSeparators(numMatch[1] ?? '');
      const num = parseInt(numStr, 10);

      if (isNaN(num) || num < 1 || num > 12) {
        return String(input);
      }

      if (format === 'ordinal') {
        return numberToOrdinal(num);
      }
      return MONTH_NAMES[num] ?? String(input);
    }

    // Check if it's already an English month name
    const lowerInput = trimmed.toLowerCase();
    for (let i = 1; i <= 12; i++) {
      const monthName = MONTH_NAMES[i]?.toLowerCase() ?? '';
      if (lowerInput === monthName || lowerInput.startsWith(monthName.slice(0, 3))) {
        return MONTH_NAMES[i] ?? String(input);
      }
    }

    return String(input);
  }

  // Number processing
  if (isNaN(input) || input < 1 || input > 12) {
    return String(input);
  }

  const monthNum = Math.floor(input);

  if (format === 'ordinal') {
    return numberToOrdinal(monthNum);
  }
  return MONTH_NAMES[monthNum] ?? String(input);
}
