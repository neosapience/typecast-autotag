import { numberToEnglish, numberToOrdinal } from '../utils/number-to-english';

/**
 * Options for floor function
 */
export interface FloorOptions {
  /**
   * Output format: 'ordinal' (first floor) or 'cardinal' (floor one)
   * @default 'ordinal'
   */
  format?: 'ordinal' | 'cardinal';
}

/**
 * Convert floor number to English words
 *
 * @param input - Floor number to convert (string or number)
 * @param options - Options (format)
 * @returns English floor expression
 *
 * @example
 * ```typescript
 * floor('3층');        // 'third floor'
 * floor('B1층');       // 'basement one'
 * floor('지하1층');    // 'basement one'
 * floor('1층');        // 'first floor'
 * floor('10층');       // 'tenth floor'
 * floor('21층');       // 'twenty-first floor'
 * floor(3);            // 'third floor'
 * floor(-1);           // 'basement one'
 * floor(0);            // 'ground floor'
 * floor('1층', { format: 'cardinal' }); // 'floor one'
 * ```
 */
export function floor(input: string | number, options?: FloorOptions): string {
  const format = options?.format ?? 'ordinal';

  // Handle number input
  if (typeof input === 'number') {
    if (isNaN(input)) {
      return 'NaN';
    }
    if (!isFinite(input)) {
      return input > 0 ? 'Infinity' : '-Infinity';
    }

    const num = Math.floor(input);

    // Negative floors are basement
    if (num < 0) {
      return 'basement ' + numberToEnglish(-num);
    }

    if (num === 0) {
      return 'ground floor';
    }

    if (format === 'cardinal') {
      return 'floor ' + numberToEnglish(num);
    }

    return numberToOrdinal(num) + ' floor';
  }

  const trimmed = input.trim();
  if (trimmed === '') return input;

  // Basement patterns: B1층, B2층, 지하1층, 지하2층, basement level N
  const basementMatch = trimmed.match(/^(?:B|지하|basement\s*(?:level\s*)?)\s*(\d+)\s*(?:층)?$/i);
  if (basementMatch) {
    const num = parseInt(basementMatch[1] ?? '0', 10);
    if (isNaN(num) || num < 0) {
      return input;
    }
    return 'basement ' + numberToEnglish(num);
  }

  // English ordinal floor: 1st floor, 2nd floor, 3rd floor, 10th floor
  const ordinalFloorMatch = trimmed.match(/^(\d+)(?:st|nd|rd|th)\s*floor$/i);
  if (ordinalFloorMatch) {
    const num = parseInt(ordinalFloorMatch[1] ?? '0', 10);
    if (isNaN(num) || num < 0) {
      return input;
    }

    if (format === 'cardinal') {
      return 'floor ' + numberToEnglish(num);
    }

    if (num === 0) {
      return 'ground floor';
    }
    return numberToOrdinal(num) + ' floor';
  }

  // Floor N format
  const floorNMatch = trimmed.match(/^floor\s*(\d+)$/i);
  if (floorNMatch) {
    const num = parseInt(floorNMatch[1] ?? '0', 10);
    if (isNaN(num) || num < 0) {
      return input;
    }

    if (format === 'cardinal') {
      return 'floor ' + numberToEnglish(num);
    }

    if (num === 0) {
      return 'ground floor';
    }
    return numberToOrdinal(num) + ' floor';
  }

  // Regular floor: N층
  const floorMatch = trimmed.match(/^(\d+)\s*(?:층|floor)?$/i);
  if (floorMatch) {
    const num = parseInt(floorMatch[1] ?? '0', 10);
    if (isNaN(num) || num < 0) {
      return input;
    }

    if (format === 'cardinal') {
      return 'floor ' + numberToEnglish(num);
    }

    // Ordinal format: first floor, second floor, etc.
    if (num === 0) {
      return 'ground floor';
    }
    return numberToOrdinal(num) + ' floor';
  }

  return input;
}
