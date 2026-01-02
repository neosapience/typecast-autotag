import { numberToEnglish, digitToEnglish } from '../utils/number-to-english';

/**
 * Options for volume function
 */
export interface VolumeOptions {
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
 * Volume unit mapping
 */
const VOLUME_UNITS: Record<string, { singular: string; plural: string }> = {
  L: { singular: 'liter', plural: 'liters' },
  l: { singular: 'liter', plural: 'liters' },
  ℓ: { singular: 'liter', plural: 'liters' },
  mL: { singular: 'milliliter', plural: 'milliliters' },
  ml: { singular: 'milliliter', plural: 'milliliters' },
  ML: { singular: 'milliliter', plural: 'milliliters' },
  'cm³': { singular: 'cubic centimeter', plural: 'cubic centimeters' },
  cm3: { singular: 'cubic centimeter', plural: 'cubic centimeters' },
  cc: { singular: 'cc', plural: 'cc' },
  CC: { singular: 'cc', plural: 'cc' },
  'm³': { singular: 'cubic meter', plural: 'cubic meters' },
  m3: { singular: 'cubic meter', plural: 'cubic meters' },
  gal: { singular: 'gallon', plural: 'gallons' },
  gallon: { singular: 'gallon', plural: 'gallons' },
  gallons: { singular: 'gallon', plural: 'gallons' },
  oz: { singular: 'fluid ounce', plural: 'fluid ounces' },
  'fl oz': { singular: 'fluid ounce', plural: 'fluid ounces' },
};

/**
 * Convert volume to English words
 *
 * @param input - Volume to convert (string)
 * @param options - Options (space inclusion)
 * @returns English volume expression
 *
 * @example
 * ```typescript
 * volume('12L');       // 'twelve liters'
 * volume('500mL');     // 'five hundred milliliters'
 * volume('1L');        // 'one liter'
 * volume('2.5L');      // 'two point five liters'
 * volume('100m³');     // 'one hundred cubic meters'
 * ```
 */
export function volume(input: string, options?: VolumeOptions): string {
  const includeSpace = options?.includeSpace ?? true;
  const space = includeSpace ? ' ' : '';

  const trimmed = input.trim();
  if (trimmed === '') return input;

  // Volume unit pattern matching (longer units first)
  const unitPattern = Object.keys(VOLUME_UNITS)
    .sort((a, b) => b.length - a.length)
    .map((u) => u.replace(/[³]/g, (m) => '\\' + m))
    .join('|');

  const match = trimmed.match(new RegExp(`^([\\d,]+(?:\\.\\d+)?)\\s*(${unitPattern})$`, 'i'));
  if (match) {
    const numStr = removeThousandSeparators(match[1] ?? '');
    const parsedUnit = match[2] ?? '';
    const unitInfo = VOLUME_UNITS[parsedUnit] ??
      VOLUME_UNITS[parsedUnit.toLowerCase()] ?? { singular: parsedUnit, plural: parsedUnit };

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
