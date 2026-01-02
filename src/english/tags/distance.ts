import { numberToEnglish, digitToEnglish } from '../utils/number-to-english';

/**
 * Options for distance function
 */
export interface DistanceOptions {
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
 * Distance unit mapping
 */
const DISTANCE_UNITS: Record<string, { singular: string; plural: string }> = {
  km: { singular: 'kilometer', plural: 'kilometers' },
  m: { singular: 'meter', plural: 'meters' },
  cm: { singular: 'centimeter', plural: 'centimeters' },
  mm: { singular: 'millimeter', plural: 'millimeters' },
  mi: { singular: 'mile', plural: 'miles' },
  ft: { singular: 'foot', plural: 'feet' },
  in: { singular: 'inch', plural: 'inches' },
  yd: { singular: 'yard', plural: 'yards' },
  킬로미터: { singular: 'kilometer', plural: 'kilometers' },
  미터: { singular: 'meter', plural: 'meters' },
  센티미터: { singular: 'centimeter', plural: 'centimeters' },
  밀리미터: { singular: 'millimeter', plural: 'millimeters' },
};

/**
 * Distance context keywords (after)
 */
export const DISTANCE_CONTEXT_AFTER = [
  'ahead',
  'away',
  'further',
  'forward',
  'back',
  'behind',
  'left',
  'right',
  'north',
  'south',
  'east',
  'west',
];

/**
 * Distance context keywords (before)
 */
export const DISTANCE_CONTEXT_BEFORE = ['about', 'approximately', 'roughly', 'around', 'nearly'];

/**
 * Convert distance to English words
 *
 * @param input - Distance to convert (string)
 * @param options - Options (space inclusion)
 * @returns English distance expression
 *
 * @example
 * ```typescript
 * distance('5km');      // 'five kilometers'
 * distance('100m');     // 'one hundred meters'
 * distance('1.5mi');    // 'one point five miles'
 * distance('10ft');     // 'ten feet'
 * distance('1ft');      // 'one foot'
 * ```
 */
export function distance(input: string, options?: DistanceOptions): string {
  const includeSpace = options?.includeSpace ?? true;
  const space = includeSpace ? ' ' : '';

  const trimmed = input.trim();
  if (trimmed === '') return input;

  // Distance unit pattern matching (longer units first)
  const unitPattern = Object.keys(DISTANCE_UNITS)
    .sort((a, b) => b.length - a.length)
    .join('|');

  const match = trimmed.match(new RegExp(`^([\\d,]+(?:\\.\\d+)?)\\s*(${unitPattern})$`, 'i'));
  if (match) {
    const numStr = removeThousandSeparators(match[1] ?? '');
    const parsedUnit = match[2]?.toLowerCase() ?? '';
    const unitInfo = DISTANCE_UNITS[parsedUnit] ?? { singular: parsedUnit, plural: parsedUnit };

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

/**
 * Convert distance with context keywords
 *
 * @param input - Distance with context
 * @returns English distance expression with context
 *
 * @example
 * ```typescript
 * distanceWithContext('500m ahead'); // 'five hundred meters ahead'
 * distanceWithContext('about 1km');  // 'about one kilometer'
 * ```
 */
export function distanceWithContext(input: string): string {
  const trimmed = input.trim();

  // Check for context keywords after
  for (const keyword of DISTANCE_CONTEXT_AFTER) {
    const regex = new RegExp(`^([\\d,]+(?:\\.\\d+)?\\s*\\w+)\\s+(${keyword})$`, 'i');
    const match = trimmed.match(regex);
    if (match) {
      const distancePart = match[1] ?? '';
      const context = match[2] ?? '';
      return distance(distancePart) + ' ' + context.toLowerCase();
    }
  }

  // Check for context keywords before
  for (const keyword of DISTANCE_CONTEXT_BEFORE) {
    const regex = new RegExp(`^(${keyword})\\s+([\\d,]+(?:\\.\\d+)?\\s*\\w+)$`, 'i');
    const match = trimmed.match(regex);
    if (match) {
      const context = match[1] ?? '';
      const distancePart = match[2] ?? '';
      return context.toLowerCase() + ' ' + distance(distancePart);
    }
  }

  return distance(trimmed);
}
