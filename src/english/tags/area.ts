import { numberToEnglish, digitToEnglish } from '../utils/number-to-english';

/**
 * Options for area function
 */
export interface AreaOptions {
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
 * Area unit mapping
 */
const AREA_UNITS: Record<string, { singular: string; plural: string }> = {
  '㎡': { singular: 'square meter', plural: 'square meters' },
  'm²': { singular: 'square meter', plural: 'square meters' },
  m2: { singular: 'square meter', plural: 'square meters' },
  sqm: { singular: 'square meter', plural: 'square meters' },
  sqft: { singular: 'square foot', plural: 'square feet' },
  'ft²': { singular: 'square foot', plural: 'square feet' },
  평: { singular: 'pyeong', plural: 'pyeong' },
  제곱미터: { singular: 'square meter', plural: 'square meters' },
  평방미터: { singular: 'square meter', plural: 'square meters' },
  acre: { singular: 'acre', plural: 'acres' },
  acres: { singular: 'acre', plural: 'acres' },
  ha: { singular: 'hectare', plural: 'hectares' },
};

/**
 * Convert area to English words
 *
 * @param input - Area to convert (string)
 * @param options - Options (space inclusion)
 * @returns English area expression
 *
 * @example
 * ```typescript
 * area('100㎡');      // 'one hundred square meters'
 * area('1m²');        // 'one square meter'
 * area('500sqft');    // 'five hundred square feet'
 * area('30평');       // 'thirty pyeong'
 * area('2.5acres');   // 'two point five acres'
 * ```
 */
export function area(input: string, options?: AreaOptions): string {
  const includeSpace = options?.includeSpace ?? true;
  const space = includeSpace ? ' ' : '';

  const trimmed = input.trim();
  if (trimmed === '') return input;

  // Area unit pattern matching (longer units first)
  const unitPattern = Object.keys(AREA_UNITS)
    .sort((a, b) => b.length - a.length)
    .join('|');

  const match = trimmed.match(new RegExp(`^([\\d,]+(?:\\.\\d+)?)\\s*(${unitPattern})$`, 'i'));
  if (match) {
    const numStr = removeThousandSeparators(match[1] ?? '');
    const parsedUnit = match[2] ?? '';
    const unitInfo = AREA_UNITS[parsedUnit.toLowerCase()] ??
      AREA_UNITS[parsedUnit] ?? { singular: parsedUnit, plural: parsedUnit };

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
