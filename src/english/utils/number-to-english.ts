/**
 * Utility functions for converting numbers to English words
 */

/** Basic digit words (0-9) */
const DIGITS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

/** Phone/digit reading (0-9) - same as DIGITS but exported separately */
const PHONE_DIGITS = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
];

/** NATO phonetic alphabet for digits (alternative reading) */
const PHONETIC_DIGITS = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'niner',
];

/** Teen numbers (10-19) */
const TEENS = [
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
];

/** Tens (20, 30, ..., 90) */
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

/** Large number scales */
const SCALES = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion'];

/** Ordinal suffixes */
const ORDINAL_ONES = [
  '',
  'first',
  'second',
  'third',
  'fourth',
  'fifth',
  'sixth',
  'seventh',
  'eighth',
  'ninth',
];

const ORDINAL_TEENS = [
  'tenth',
  'eleventh',
  'twelfth',
  'thirteenth',
  'fourteenth',
  'fifteenth',
  'sixteenth',
  'seventeenth',
  'eighteenth',
  'nineteenth',
];

const ORDINAL_TENS = [
  '',
  '',
  'twentieth',
  'thirtieth',
  'fortieth',
  'fiftieth',
  'sixtieth',
  'seventieth',
  'eightieth',
  'ninetieth',
];

/**
 * Convert a single digit (0-9) to English
 * @param digit - Single digit character
 * @returns English word for the digit
 */
export function digitToEnglish(digit: string): string {
  const num = parseInt(digit, 10);
  if (isNaN(num) || num < 0 || num > 9) {
    return digit;
  }
  return DIGITS[num] ?? digit;
}

/**
 * Convert a single digit (0-9) to phone reading English
 * @param digit - Single digit character
 * @returns Phone reading English word
 */
export function digitToPhoneEnglish(digit: string): string {
  const num = parseInt(digit, 10);
  if (isNaN(num) || num < 0 || num > 9) {
    return digit;
  }
  return PHONE_DIGITS[num] ?? digit;
}

/**
 * Convert a single digit (0-9) to NATO phonetic reading
 * @param digit - Single digit character
 * @returns NATO phonetic word (niner for 9)
 */
export function digitToPhoneticEnglish(digit: string): string {
  const num = parseInt(digit, 10);
  if (isNaN(num) || num < 0 || num > 9) {
    return digit;
  }
  return PHONETIC_DIGITS[num] ?? digit;
}

/**
 * Convert a number less than 100 to English
 * @param num - Number (0-99)
 * @returns English words
 */
function twoDigitsToEnglish(num: number): string {
  if (num === 0) return '';
  if (num < 10) return DIGITS[num] ?? '';
  if (num < 20) return TEENS[num - 10] ?? '';

  const ten = Math.floor(num / 10);
  const one = num % 10;

  if (one === 0) return TENS[ten] ?? '';
  return (TENS[ten] ?? '') + '-' + (DIGITS[one] ?? '');
}

/**
 * Convert a number less than 1000 to English
 * @param num - Number (0-999)
 * @returns English words
 */
function threeDigitsToEnglish(num: number): string {
  if (num === 0) return '';

  const hundred = Math.floor(num / 100);
  const remainder = num % 100;

  let result = '';
  if (hundred > 0) {
    result = (DIGITS[hundred] ?? '') + ' hundred';
    if (remainder > 0) {
      result += ' and ' + twoDigitsToEnglish(remainder);
    }
  } else {
    result = twoDigitsToEnglish(remainder);
  }

  return result;
}

/**
 * Convert a number to English words
 * @param num - Number to convert
 * @returns English words
 *
 * @example
 * ```typescript
 * numberToEnglish(0);    // 'zero'
 * numberToEnglish(15);   // 'fifteen'
 * numberToEnglish(42);   // 'forty-two'
 * numberToEnglish(100);  // 'one hundred'
 * numberToEnglish(1234); // 'one thousand two hundred and thirty-four'
 * ```
 */
export function numberToEnglish(num: number): string {
  if (num === 0) return 'zero';
  if (num < 0) return 'minus ' + numberToEnglish(-num);

  // Handle decimals
  if (!Number.isInteger(num)) {
    const [intPart, decPart] = num.toString().split('.');
    const intNum = parseInt(intPart ?? '0', 10);
    const intWords = intNum === 0 ? 'zero' : numberToEnglish(intNum);
    const decWords = (decPart ?? '')
      .split('')
      .map((d) => digitToEnglish(d))
      .join(' ');
    return intWords + ' point ' + decWords;
  }

  const parts: string[] = [];
  let remaining = num;
  let scaleIndex = 0;

  while (remaining > 0) {
    const chunk = remaining % 1000;
    if (chunk > 0) {
      const chunkWords = threeDigitsToEnglish(chunk);
      const scale = SCALES[scaleIndex] ?? '';
      if (scale) {
        parts.unshift(chunkWords + ' ' + scale);
      } else {
        parts.unshift(chunkWords);
      }
    }
    remaining = Math.floor(remaining / 1000);
    scaleIndex++;
  }

  // Join with proper "and" placement
  let result = parts.join(' ');

  // Clean up extra spaces
  result = result.replace(/\s+/g, ' ').trim();

  return result;
}

/**
 * Convert a number less than 100 to ordinal English
 * @param num - Number (1-99)
 * @returns Ordinal English word
 */
function twoDigitsToOrdinal(num: number): string {
  if (num <= 0) return '';
  if (num < 10) return ORDINAL_ONES[num] ?? '';
  if (num < 20) return ORDINAL_TEENS[num - 10] ?? '';

  const ten = Math.floor(num / 10);
  const one = num % 10;

  if (one === 0) return ORDINAL_TENS[ten] ?? '';
  return (TENS[ten] ?? '') + '-' + (ORDINAL_ONES[one] ?? '');
}

/**
 * Convert a number to ordinal English (first, second, third, ...)
 * @param num - Number to convert
 * @returns Ordinal English word
 *
 * @example
 * ```typescript
 * numberToOrdinal(1);  // 'first'
 * numberToOrdinal(2);  // 'second'
 * numberToOrdinal(3);  // 'third'
 * numberToOrdinal(21); // 'twenty-first'
 * numberToOrdinal(100); // 'one hundredth'
 * ```
 */
export function numberToOrdinal(num: number): string {
  if (num <= 0) return numberToEnglish(num);
  if (num < 100) return twoDigitsToOrdinal(num);

  // For numbers >= 100, use cardinal + 'th' (simplified)
  // e.g., 100th, 1000th
  const cardinal = numberToEnglish(num);

  // Special handling for numbers ending in specific patterns
  const lastTwoDigits = num % 100;
  const lastDigit = num % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return cardinal + 'th';
  }

  if (lastTwoDigits === 0) {
    // 100, 1000, etc. - replace 'hundred' with 'hundredth', etc.
    if (cardinal.endsWith('hundred')) {
      return cardinal.slice(0, -7) + 'hundredth';
    }
    if (cardinal.endsWith('thousand')) {
      return cardinal.slice(0, -8) + 'thousandth';
    }
    if (cardinal.endsWith('million')) {
      return cardinal.slice(0, -7) + 'millionth';
    }
    return cardinal + 'th';
  }

  // For other numbers, get the last part and make it ordinal
  if (lastTwoDigits > 0 && lastTwoDigits < 100) {
    const withoutLast = num - lastTwoDigits;
    const lastPart = twoDigitsToOrdinal(lastTwoDigits);
    if (withoutLast === 0) {
      return lastPart;
    }
    const mainPart = numberToEnglish(withoutLast);
    return mainPart + ' ' + lastPart;
  }

  // Fallback
  switch (lastDigit) {
    case 1:
      return cardinal + 'st';
    case 2:
      return cardinal + 'nd';
    case 3:
      return cardinal + 'rd';
    default:
      return cardinal + 'th';
  }
}

/**
 * Get ordinal suffix for a number (st, nd, rd, th)
 * @param num - Number
 * @returns Ordinal suffix
 */
export function getOrdinalSuffix(num: number): string {
  const lastTwoDigits = Math.abs(num) % 100;
  const lastDigit = Math.abs(num) % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return 'th';
  }

  switch (lastDigit) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

/**
 * Convert hour to English (for 12-hour format)
 * @param hour - Hour (0-23)
 * @returns English hour word
 */
export function hourToEnglish(hour: number): string {
  const hour12 = hour % 12 || 12;
  return DIGITS[hour12] ?? numberToEnglish(hour12);
}

/**
 * Convert hour to English (for 24-hour format)
 * @param hour - Hour (0-23)
 * @returns English hour word
 */
export function hourToEnglish24(hour: number): string {
  if (hour < 0 || hour > 23) {
    return '';
  }
  if (hour === 0) return 'zero';
  return numberToEnglish(hour);
}

/**
 * Format a number with ordinal suffix
 * @param num - Number
 * @returns Number with ordinal suffix (e.g., "1st", "2nd", "3rd")
 */
export function formatOrdinal(num: number): string {
  return num + getOrdinalSuffix(num);
}
