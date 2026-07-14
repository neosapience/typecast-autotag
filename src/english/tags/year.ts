import { numberToEnglish } from '../utils/number-to-english';

/**
 * Options for year function
 */
export interface YearOptions {
  /**
   * Whether to include 'year' suffix
   * @default false
   */
  includeSuffix?: boolean;

  /**
   * Whether to include space between number and 'year'
   * @default true
   */
  includeSpace?: boolean;

  /**
   * Reading style: 'natural' (nineteen ninety-four) or 'full' (one thousand nine hundred and ninety-four)
   * @default 'natural'
   */
  style?: 'natural' | 'full';
}

/**
 * Remove thousand separators
 */
function removeThousandSeparators(str: string): string {
  return str.replace(/,/g, '');
}

/**
 * Convert year to natural English reading (e.g., 1994 → "nineteen ninety-four")
 */
function yearToNaturalEnglish(num: number): string {
  if (num < 0 || num > 9999) {
    return numberToEnglish(num);
  }

  // Special case: 2000-2009 (two thousand, two thousand one, etc.)
  if (num >= 2000 && num <= 2009) {
    if (num === 2000) return 'two thousand';
    return 'two thousand ' + numberToEnglish(num - 2000);
  }

  // Special case: 1000-1009
  if (num >= 1000 && num <= 1009) {
    if (num === 1000) return 'one thousand';
    return 'one thousand ' + numberToEnglish(num - 1000);
  }

  // For 4-digit years, split into two parts
  if (num >= 1000) {
    const firstTwo = Math.floor(num / 100);
    const lastTwo = num % 100;

    const firstPart = numberToEnglish(firstTwo);

    if (lastTwo === 0) {
      return firstPart + ' hundred';
    }

    // Handle "oh" for single-digit second part (1905 → "nineteen oh five")
    if (lastTwo < 10) {
      return firstPart + ' oh ' + numberToEnglish(lastTwo);
    }

    return firstPart + ' ' + numberToEnglish(lastTwo);
  }

  // For 3-digit years
  if (num >= 100) {
    return numberToEnglish(num);
  }

  // For 2-digit or 1-digit years
  return numberToEnglish(num);
}

/**
 * Convert year to English words
 *
 * @param input - Year to convert (number or string)
 * @param options - Options (suffix inclusion, style, etc.)
 * @returns English year expression
 *
 * @example
 * ```typescript
 * year(2024);       // 'twenty twenty-four'
 * year(1994);       // 'nineteen ninety-four'
 * year(2000);       // 'two thousand'
 * year(2001);       // 'two thousand one'
 * year(1900);       // 'nineteen hundred'
 * year(1905);       // 'nineteen oh five'
 * year('2024');     // 'twenty twenty-four'
 * year(2024, { includeSuffix: true }); // 'twenty twenty-four year'
 * year(2024, { style: 'full' }); // 'two thousand and twenty-four'
 * ```
 */
export function year(input: number | string, options?: YearOptions): string {
  const includeSuffix = options?.includeSuffix ?? false;
  const includeSpace = options?.includeSpace ?? true;
  const style = options?.style ?? 'natural';
  const space = includeSpace ? ' ' : '';
  const suffix = includeSuffix ? space + 'year' : '';

  // String processing
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (trimmed === '') return input;

    // Parse "year 2024", "in 2024" format
    const prefixMatch = trimmed.match(/^(year|in)\s+([\d,]+)\s*(?:년|year)?(?:도|생|s)?$/i);
    if (prefixMatch) {
      const prefix = prefixMatch[1]?.toLowerCase() ?? '';
      const numStr = removeThousandSeparators(prefixMatch[2] ?? '');
      const num = parseInt(numStr, 10);

      if (isNaN(num) || num < 0) {
        return String(input);
      }

      const yearWord = style === 'full' ? numberToEnglish(num) : yearToNaturalEnglish(num);
      return prefix + ' ' + yearWord + suffix;
    }

    // Parse year range: YYYY~YYYY, YYYY-YYYY, YYYY to YYYY
    const rangeMatch = trimmed.match(/^([\d,]+)(?:\s*[-~–—]\s*|\s+to\s+)([\d,]+)$/i);
    if (rangeMatch) {
      const num1Str = removeThousandSeparators(rangeMatch[1] ?? '');
      const num2Str = removeThousandSeparators(rangeMatch[2] ?? '');
      const num1 = parseInt(num1Str, 10);
      const num2 = parseInt(num2Str, 10);

      if (isNaN(num1) || isNaN(num2) || num1 < 0 || num2 < 0) {
        return String(input);
      }

      const year1Word = style === 'full' ? numberToEnglish(num1) : yearToNaturalEnglish(num1);
      const year2Word = style === 'full' ? numberToEnglish(num2) : yearToNaturalEnglish(num2);
      return year1Word + ' to ' + year2Word;
    }

    // Parse "2024", "2024년", "1994년생", etc.
    const match = trimmed.match(/^([\d,]+)\s*(?:년|year)?(?:도|생|s)?$/i);
    if (match) {
      const numStr = removeThousandSeparators(match[1] ?? '');
      const num = parseInt(numStr, 10);

      if (isNaN(num) || num < 0) {
        return String(input);
      }

      const yearWord = style === 'full' ? numberToEnglish(num) : yearToNaturalEnglish(num);
      return yearWord + suffix;
    }

    return String(input);
  }

  // Number processing
  if (isNaN(input) || !isFinite(input) || input < 0) {
    return String(input);
  }

  // Floor decimal
  const intInput = Math.floor(input);

  const yearWord = style === 'full' ? numberToEnglish(intInput) : yearToNaturalEnglish(intInput);
  return yearWord + suffix;
}
