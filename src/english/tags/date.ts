import { numberToOrdinal } from '../utils/number-to-english';
import { year as yearTag } from './year';
import { isValidCalendarDate } from '../../utils/date-validation';

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

/** English month name to number mapping */
const ENGLISH_MONTHS: Record<string, number> = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
};

interface ParsedDate {
  year?: number;
  month?: number;
  day?: number;
}

/**
 * Parse various date string formats
 */
function parseDate(str: string): ParsedDate | null {
  // YYYYMMDD format (8 digits)
  if (/^\d{8}$/.test(str)) {
    return {
      year: parseInt(str.substring(0, 4), 10),
      month: parseInt(str.substring(4, 6), 10),
      day: parseInt(str.substring(6, 8), 10),
    };
  }

  // YYYY-MM-DD, YYYY/MM/DD, YYYY.MM.DD format
  if (/^\d{4}[-/.]\d{1,2}[-/.]\d{1,2}$/.test(str)) {
    const parts = str.split(/[-/.]/);
    return {
      year: parseInt(parts[0] ?? '', 10),
      month: parseInt(parts[1] ?? '', 10),
      day: parseInt(parts[2] ?? '', 10),
    };
  }

  // Korean format: "1994년6월16일", "1994년 6월 16일"
  const koreanFullMatch = str.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
  if (koreanFullMatch) {
    return {
      year: parseInt(koreanFullMatch[1] ?? '', 10),
      month: parseInt(koreanFullMatch[2] ?? '', 10),
      day: parseInt(koreanFullMatch[3] ?? '', 10),
    };
  }

  // Korean format (year-month only): "2023년12월"
  const koreanYearMonth = str.match(/^(\d{4})년\s*(\d{1,2})월$/);
  if (koreanYearMonth) {
    return {
      year: parseInt(koreanYearMonth[1] ?? '', 10),
      month: parseInt(koreanYearMonth[2] ?? '', 10),
    };
  }

  // Korean format (year only): "1994년"
  const koreanYearOnly = str.match(/^(\d{4})년(생)?$/);
  if (koreanYearOnly) {
    return {
      year: parseInt(koreanYearOnly[1] ?? '', 10),
    };
  }

  // Korean format (month-day only): "6월16일"
  const koreanMonthDay = str.match(/^(\d{1,2})월\s*(\d{1,2})일/);
  if (koreanMonthDay) {
    return {
      month: parseInt(koreanMonthDay[1] ?? '', 10),
      day: parseInt(koreanMonthDay[2] ?? '', 10),
    };
  }

  // English format: "June 16, 1994", "June 16 1994"
  const englishMDY = str.match(/^([a-zA-Z]+)\s+(\d{1,2}),?\s+(\d{4})$/);
  if (englishMDY) {
    const monthName = englishMDY[1]?.toLowerCase() ?? '';
    const monthNum = ENGLISH_MONTHS[monthName];
    if (monthNum !== undefined) {
      return {
        year: parseInt(englishMDY[3] ?? '', 10),
        month: monthNum,
        day: parseInt(englishMDY[2] ?? '', 10),
      };
    }
  }

  // English format: "16 June 1994"
  const englishDMY = str.match(/^(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})$/);
  if (englishDMY) {
    const monthName = englishDMY[2]?.toLowerCase() ?? '';
    const monthNum = ENGLISH_MONTHS[monthName];
    if (monthNum !== undefined) {
      return {
        year: parseInt(englishDMY[3] ?? '', 10),
        month: monthNum,
        day: parseInt(englishDMY[1] ?? '', 10),
      };
    }
  }

  // English format (year-month only): "June 1994"
  const englishMonthYear = str.match(/^([a-zA-Z]+)\s+(\d{4})$/);
  if (englishMonthYear) {
    const monthName = englishMonthYear[1]?.toLowerCase() ?? '';
    const monthNum = ENGLISH_MONTHS[monthName];
    if (monthNum !== undefined) {
      return {
        year: parseInt(englishMonthYear[2] ?? '', 10),
        month: monthNum,
      };
    }
  }

  // MM-DD-YYYY format (US)
  if (/^\d{2}[-/.]\d{2}[-/.]\d{4}$/.test(str)) {
    const parts = str.split(/[-/.]/);
    return {
      month: parseInt(parts[0] ?? '', 10),
      day: parseInt(parts[1] ?? '', 10),
      year: parseInt(parts[2] ?? '', 10),
    };
  }

  return null;
}

/**
 * Convert date to English
 *
 * @param input - Date to convert (various formats supported)
 * @returns English date expression
 *
 * @example
 * ```typescript
 * date(19940616);         // 'June sixteenth, nineteen ninety-four'
 * date('2000-12-25');     // 'December twenty-fifth, two thousand'
 * date('1994년6월16일');   // 'June sixteenth, nineteen ninety-four'
 * date('June 16, 1994');  // 'June sixteenth, nineteen ninety-four'
 * date('2024-01-01');     // 'January first, twenty twenty-four'
 * ```
 */
export function date(input: number | string): string {
  const str = String(input);
  const parsed = parseDate(str);

  if (!parsed) {
    return str;
  }

  const { year, month, day } = parsed;

  if (!isValidCalendarDate(year, month, day)) {
    return str;
  }

  // Return original if all values are missing
  if (year === undefined && month === undefined && day === undefined) {
    return str;
  }

  const parts: string[] = [];

  // Month processing
  if (month !== undefined && !isNaN(month) && month >= 1 && month <= 12) {
    parts.push(MONTH_NAMES[month] ?? '');
  }

  // Day processing (ordinal)
  if (day !== undefined && !isNaN(day) && day > 0) {
    parts.push(numberToOrdinal(day));
  }

  // Year processing
  if (year !== undefined && !isNaN(year)) {
    const yearWord = yearTag(year);
    if (parts.length > 0) {
      // Add comma before year if there are other parts
      parts.push(yearWord);
    } else {
      parts.push(yearWord);
    }
  }

  // Format: "Month Day, Year" or "Month Day" or "Month Year"
  if (parts.length === 3) {
    return parts[0] + ' ' + parts[1] + ', ' + parts[2];
  }
  if (parts.length === 2) {
    // Check if it's Month + Year (no day)
    if (day === undefined && month !== undefined && year !== undefined) {
      return parts[0] + ' ' + parts[1];
    }
    return parts.join(' ');
  }

  return parts.join(' ');
}

/**
 * Convert year-month to English
 *
 * @param input - Year-month string (YYYY-MM format with optional suffix)
 * @returns English year-month expression
 *
 * @example
 * ```typescript
 * yearMonth('2028-03');       // 'March twenty twenty-eight'
 * yearMonth('2024-12');       // 'December twenty twenty-four'
 * yearMonth('2025-06');       // 'June twenty twenty-five'
 * ```
 */
export function yearMonth(input: string): string {
  const trimmed = input.trim();
  if (trimmed === '') return input;

  // YYYY-MM + optional suffix
  const match = trimmed.match(/^(\d{4})-(\d{2})(.*)$/);
  if (!match) {
    return input;
  }

  const yearNum = parseInt(match[1] ?? '', 10);
  const monthNum = parseInt(match[2] ?? '', 10);
  const suffix = match[3] ?? '';

  if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
    return input;
  }

  const monthName = MONTH_NAMES[monthNum] ?? '';
  const yearWord = yearTag(yearNum);

  return monthName + ' ' + yearWord + suffix;
}
