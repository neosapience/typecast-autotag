import { numberToEnglish } from '../utils/number-to-english';

/**
 * Options for duration function
 */
export interface DurationOptions {
  /**
   * Whether to include space between components
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
 * Convert duration to English words
 *
 * Handles duration expressions like:
 * - N months, N weeks, N days
 * - N years, N quarters, N semesters
 *
 * @param input - Duration to convert (string)
 * @param options - Options
 * @returns English duration expression
 *
 * @example
 * ```typescript
 * duration('3개월');   // 'three months'
 * duration('2주');     // 'two weeks'
 * duration('5일');     // 'five days'
 * duration('1년');     // 'one year'
 * duration('2학기');   // 'two semesters'
 * duration('3 months'); // 'three months'
 * duration('1 day');    // 'one day'
 * ```
 */
export function duration(input: string, _options?: DurationOptions): string {
  const trimmed = input.trim();
  if (trimmed === '') return input;

  // Korean units mapping
  const DURATION_UNITS: Record<string, { singular: string; plural: string }> = {
    개월: { singular: 'month', plural: 'months' },
    주일: { singular: 'week', plural: 'weeks' },
    주: { singular: 'week', plural: 'weeks' },
    일: { singular: 'day', plural: 'days' },
    일간: { singular: 'day', plural: 'days' },
    년: { singular: 'year', plural: 'years' },
    년간: { singular: 'year', plural: 'years' },
    달: { singular: 'month', plural: 'months' },
    학기: { singular: 'semester', plural: 'semesters' },
    분기: { singular: 'quarter', plural: 'quarters' },
    months: { singular: 'month', plural: 'months' },
    month: { singular: 'month', plural: 'months' },
    weeks: { singular: 'week', plural: 'weeks' },
    week: { singular: 'week', plural: 'weeks' },
    days: { singular: 'day', plural: 'days' },
    day: { singular: 'day', plural: 'days' },
    years: { singular: 'year', plural: 'years' },
    year: { singular: 'year', plural: 'years' },
    hours: { singular: 'hour', plural: 'hours' },
    hour: { singular: 'hour', plural: 'hours' },
    시간: { singular: 'hour', plural: 'hours' },
    semesters: { singular: 'semester', plural: 'semesters' },
    semester: { singular: 'semester', plural: 'semesters' },
    quarters: { singular: 'quarter', plural: 'quarters' },
    quarter: { singular: 'quarter', plural: 'quarters' },
  };

  // Build pattern (longer units first)
  const unitPattern = Object.keys(DURATION_UNITS)
    .sort((a, b) => b.length - a.length)
    .join('|');

  // Handle "for N days/weeks/etc." pattern
  const forMatch = trimmed.match(
    new RegExp(`^(for)\\s+([\\d,]+)\\s*(${unitPattern})\\s*(.*)$`, 'i')
  );
  if (forMatch) {
    const prefix = forMatch[1] ?? '';
    const numStr = removeThousandSeparators(forMatch[2] ?? '');
    const parsedUnit = forMatch[3]?.toLowerCase() ?? '';
    const suffix = forMatch[4] ?? '';
    const unitInfo = DURATION_UNITS[parsedUnit] ?? { singular: parsedUnit, plural: parsedUnit };

    const num = parseInt(numStr, 10);

    if (isNaN(num) || num < 0) {
      return input;
    }

    const unitWord = num === 1 ? unitInfo.singular : unitInfo.plural;
    const result = prefix + ' ' + numberToEnglish(num) + ' ' + unitWord;

    return suffix ? result + ' ' + suffix : result;
  }

  const match = trimmed.match(new RegExp(`^([\\d,]+)\\s*(${unitPattern})\\s*(.*)$`, 'i'));
  if (match) {
    const numStr = removeThousandSeparators(match[1] ?? '');
    const parsedUnit = match[2]?.toLowerCase() ?? '';
    const suffix = match[3] ?? '';
    const unitInfo = DURATION_UNITS[parsedUnit] ?? { singular: parsedUnit, plural: parsedUnit };

    const num = parseInt(numStr, 10);

    if (isNaN(num) || num < 0) {
      return input;
    }

    const unitWord = num === 1 ? unitInfo.singular : unitInfo.plural;
    const result = numberToEnglish(num) + ' ' + unitWord;

    return suffix ? result + ' ' + suffix : result;
  }

  return input;
}
