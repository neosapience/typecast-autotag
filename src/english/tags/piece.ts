import { numberToEnglish } from '../utils/number-to-english';

/**
 * Options for piece function
 */
export interface PieceOptions {
  /**
   * Unit (default: 'pieces')
   * @default 'pieces'
   */
  unit?: string;

  /**
   * Singular form of unit (default: 'piece')
   * @default 'piece'
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
 * Check if number is valid (not NaN, finite)
 */
function isValidNumber(num: number): boolean {
  return !isNaN(num) && Number.isFinite(num);
}

/**
 * Common counting units mapping (Korean to English)
 */
const UNIT_MAP: Record<string, { singular: string; plural: string }> = {
  개: { singular: 'piece', plural: 'pieces' },
  마리: { singular: 'animal', plural: 'animals' },
  명: { singular: 'person', plural: 'people' },
  대: { singular: 'unit', plural: 'units' },
  장: { singular: 'sheet', plural: 'sheets' },
  권: { singular: 'volume', plural: 'volumes' },
  병: { singular: 'bottle', plural: 'bottles' },
  잔: { singular: 'cup', plural: 'cups' },
  그루: { singular: 'tree', plural: 'trees' },
  송이: { singular: 'flower', plural: 'flowers' },
  쌍: { singular: 'pair', plural: 'pairs' },
  벌: { singular: 'set', plural: 'sets' },
  켤레: { singular: 'pair', plural: 'pairs' },
  채: { singular: 'building', plural: 'buildings' },
  건: { singular: 'case', plural: 'cases' },
  회: { singular: 'time', plural: 'times' },
};

/**
 * Convert count to English words
 *
 * @param input - Count to convert (number or string)
 * @param options - Options (unit, space)
 * @returns English count expression
 *
 * @remarks
 * - Decimals are floored to integers (e.g., 1.7 → 1)
 * - Negative, NaN, Infinity are returned as original string
 * - Singular/plural forms are automatically handled
 *
 * @example
 * ```typescript
 * piece(1);         // 'one piece'
 * piece(3);         // 'three pieces'
 * piece(5);         // 'five pieces'
 * piece(10);        // 'ten pieces'
 * piece(23);        // 'twenty-three pieces'
 * piece(100);       // 'one hundred pieces'
 * piece(1.7);       // 'one piece' (decimal floored)
 * piece('5개');     // 'five pieces'
 * piece(3, { unit: 'items', singularUnit: 'item' }); // 'three items'
 * piece(1, { unit: 'items', singularUnit: 'item' }); // 'one item'
 * ```
 */
export function piece(input: number | string, options?: PieceOptions): string {
  const unit = options?.unit ?? 'pieces';
  const singularUnit = options?.singularUnit ?? 'piece';
  const includeSpace = options?.includeSpace ?? true;
  const space = includeSpace ? ' ' : '';

  // String processing
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (trimmed === '') return input;

    // Parse "5개", "10마리", "3명", "1.5개"
    const match = trimmed.match(/^([\d,]+(?:\.\d+)?)\s*(.*)$/);
    if (match) {
      const numStr = removeThousandSeparators(match[1] ?? '');
      const parsedNum = parseFloat(numStr);
      const parsedUnit = match[2] || '';

      if (!isValidNumber(parsedNum) || parsedNum < 0) {
        return String(input);
      }

      // Floor decimal
      const num = Math.floor(parsedNum);

      // Determine unit
      let finalUnit = unit;
      let finalSingularUnit = singularUnit;

      if (parsedUnit && UNIT_MAP[parsedUnit]) {
        finalUnit = UNIT_MAP[parsedUnit].plural;
        finalSingularUnit = UNIT_MAP[parsedUnit].singular;
      } else if (parsedUnit) {
        // Keep original unit if not in map
        finalUnit = parsedUnit;
        finalSingularUnit = parsedUnit;
      }

      const unitWord = num === 1 ? finalSingularUnit : finalUnit;

      if (num === 0) {
        return 'zero' + space + unitWord;
      }

      return numberToEnglish(num) + space + unitWord;
    }

    return String(input);
  }

  // Number processing
  if (!isValidNumber(input) || input < 0) {
    return String(input);
  }

  // Floor decimal
  const num = Math.floor(input);
  const unitWord = num === 1 ? singularUnit : unit;

  if (num === 0) {
    return 'zero' + space + unitWord;
  }

  return numberToEnglish(num) + space + unitWord;
}
