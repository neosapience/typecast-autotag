import { numberToEnglish, digitToEnglish } from '../utils/number-to-english';

/**
 * Options for point function
 */
export interface PointOptions {
  /**
   * Unit (default: 'points')
   * @default 'points'
   */
  unit?: string;

  /**
   * Singular form of unit (default: 'point')
   * @default 'point'
   */
  singularUnit?: string;

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
 * Convert decimal number to English words
 */
function numberToEnglishWithDecimal(numStr: string): string {
  const cleaned = removeThousandSeparators(numStr);

  if (cleaned.includes('.')) {
    const [intPart, decPart] = cleaned.split('.');
    const intNum = parseInt(intPart || '0', 10);
    const intEnglish = intNum === 0 ? 'zero' : numberToEnglish(intNum);
    const decEnglish = (decPart || '')
      .split('')
      .map((d) => digitToEnglish(d))
      .join(' ');
    return intEnglish + ' point ' + decEnglish;
  }

  const num = parseInt(cleaned, 10);
  if (isNaN(num)) return numStr;
  return num === 0 ? 'zero' : numberToEnglish(num);
}

/**
 * Convert score/points to English words
 *
 * @param input - Score to convert (number or string)
 * @param options - Options (unit, space)
 * @returns English score expression
 *
 * @example
 * ```typescript
 * point(100);        // 'one hundred points'
 * point(1);          // 'one point'
 * point(85.5);       // 'eighty-five point five points'
 * point('100점');    // 'one hundred points'
 * point('3.5점');    // 'three point five points'
 * point(50, { unit: 'credits', singularUnit: 'credit' }); // 'fifty credits'
 * ```
 */
export function point(input: number | string, options?: PointOptions): string {
  const unit = options?.unit ?? 'points';
  const singularUnit = options?.singularUnit ?? 'point';
  const includeSpace = options?.includeSpace ?? true;
  const space = includeSpace ? ' ' : '';

  // String processing
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (trimmed === '') return input;

    // Parse "100점", "85.5점", "100 points", "3.5 credits"
    const match = trimmed.match(/^([\d,]+(?:\.\d+)?)\s*(.*)$/);
    if (match) {
      const numStr = match[1] ?? '';
      const parsedUnit = match[2] || unit;

      // Determine if singular or plural
      const hasDecimal = numStr.includes('.');
      const num = hasDecimal ? parseFloat(numStr) : parseInt(removeThousandSeparators(numStr), 10);

      if (isNaN(num) || num < 0) {
        return String(input);
      }

      // Map Korean units
      let finalUnit = unit;
      let finalSingularUnit = singularUnit;
      if (parsedUnit === '점' || parsedUnit === 'points') {
        finalUnit = 'points';
        finalSingularUnit = 'point';
      } else if (parsedUnit === '크레딧' || parsedUnit === 'credits') {
        finalUnit = 'credits';
        finalSingularUnit = 'credit';
      } else if (parsedUnit) {
        finalUnit = parsedUnit;
        finalSingularUnit = parsedUnit;
      }

      const unitWord = num === 1 && !hasDecimal ? finalSingularUnit : finalUnit;

      if (hasDecimal) {
        const english = numberToEnglishWithDecimal(numStr);
        return english + space + unitWord;
      }

      if (num === 0) {
        return 'zero' + space + unitWord;
      }

      return numberToEnglish(num) + space + unitWord;
    }

    return String(input);
  }

  // Number processing
  if (isNaN(input) || !isFinite(input)) {
    return String(input);
  }

  if (input < 0) {
    return 'minus ' + point(-input, options);
  }

  const unitWord = input === 1 ? singularUnit : unit;

  // Handle decimal
  if (!Number.isInteger(input)) {
    const english = numberToEnglishWithDecimal(String(input));
    return english + space + unitWord;
  }

  if (input === 0) {
    return 'zero' + space + unitWord;
  }

  return numberToEnglish(input) + space + unitWord;
}
