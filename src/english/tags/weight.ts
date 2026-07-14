import { numberToEnglish, digitToEnglish } from '../utils/number-to-english';

/**
 * Options for weight function
 */
export interface WeightOptions {
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
 * Weight unit mapping
 */
const WEIGHT_UNITS: Record<string, { singular: string; plural: string }> = {
  kg: { singular: 'kilogram', plural: 'kilograms' },
  g: { singular: 'gram', plural: 'grams' },
  mg: { singular: 'milligram', plural: 'milligrams' },
  ton: { singular: 'ton', plural: 'tons' },
  t: { singular: 'ton', plural: 'tons' },
  lb: { singular: 'pound', plural: 'pounds' },
  lbs: { singular: 'pound', plural: 'pounds' },
  oz: { singular: 'ounce', plural: 'ounces' },
  kilogram: { singular: 'kilogram', plural: 'kilograms' },
  kilograms: { singular: 'kilogram', plural: 'kilograms' },
  gram: { singular: 'gram', plural: 'grams' },
  grams: { singular: 'gram', plural: 'grams' },
  milligram: { singular: 'milligram', plural: 'milligrams' },
  milligrams: { singular: 'milligram', plural: 'milligrams' },
  pound: { singular: 'pound', plural: 'pounds' },
  pounds: { singular: 'pound', plural: 'pounds' },
  ounce: { singular: 'ounce', plural: 'ounces' },
  ounces: { singular: 'ounce', plural: 'ounces' },
  톤: { singular: 'ton', plural: 'tons' },
  킬로그램: { singular: 'kilogram', plural: 'kilograms' },
  그램: { singular: 'gram', plural: 'grams' },
  밀리그램: { singular: 'milligram', plural: 'milligrams' },
};

/**
 * Convert weight to English words
 *
 * @param input - Weight to convert (string)
 * @param options - Options (space inclusion)
 * @returns English weight expression
 *
 * @example
 * ```typescript
 * weight('23kg');     // 'twenty-three kilograms'
 * weight('1kg');      // 'one kilogram'
 * weight('500g');     // 'five hundred grams'
 * weight('1.5톤');    // 'one point five tons'
 * weight('10lbs');    // 'ten pounds'
 * ```
 */
export function weight(input: string, options?: WeightOptions): string {
  const includeSpace = options?.includeSpace ?? true;
  const space = includeSpace ? ' ' : '';

  const trimmed = input.trim();
  if (trimmed === '') return input;

  // Weight unit pattern matching (longer units first)
  const unitPattern = Object.keys(WEIGHT_UNITS)
    .sort((a, b) => b.length - a.length)
    .join('|');

  const match = trimmed.match(new RegExp(`^([\\d,]+(?:\\.\\d+)?)\\s*(${unitPattern})$`, 'i'));
  if (match) {
    const numStr = removeThousandSeparators(match[1] ?? '');
    const parsedUnit = match[2]?.toLowerCase() ?? '';
    const unitInfo = WEIGHT_UNITS[parsedUnit] ?? { singular: parsedUnit, plural: parsedUnit };

    // Handle decimal
    if (numStr.includes('.')) {
      const [intPart, decPart] = numStr.split('.');
      const intNum = parseInt(intPart ?? '0', 10);
      const intEnglish = intNum === 0 ? 'zero' : numberToEnglish(intNum);
      const decEnglish = (decPart ?? '')
        .split('')
        .map((d) => digitToEnglish(d))
        .join(' ');
      return intEnglish + ' point ' + decEnglish + space + unitInfo.plural;
    }

    const num = parseInt(numStr, 10);

    if (isNaN(num) || num < 0) {
      return input;
    }

    const unitWord = num === 1 ? unitInfo.singular : unitInfo.plural;

    if (num === 0) {
      return 'zero' + space + unitWord;
    }

    return numberToEnglish(num) + space + unitWord;
  }

  return input;
}
