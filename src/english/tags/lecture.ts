import { numberToEnglish, numberToOrdinal } from '../utils/number-to-english';

/**
 * Options for lecture function
 */
export interface LectureOptions {
  /**
   * Output format: 'ordinal' (fifth lecture) or 'cardinal' (lecture five)
   * @default 'ordinal'
   */
  format?: 'ordinal' | 'cardinal';
}

/**
 * Remove thousand separators
 */
function removeThousandSeparators(str: string): string {
  return str.replace(/,/g, '');
}

function romanToNumber(roman: string): number {
  const values: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  return [...roman.toUpperCase()].reduceRight((total, letter, index, chars) => {
    const value = values[letter] ?? 0;
    const next = values[chars[index + 1] ?? ''] ?? 0;
    return total + (value < next ? -value : value);
  }, 0);
}

/**
 * Convert lecture number to English words
 *
 * @param input - Lecture number to convert (string)
 * @param options - Options (format)
 * @returns English lecture expression
 *
 * @example
 * ```typescript
 * lecture('26강');  // 'twenty-sixth lecture'
 * lecture('40강');  // 'fortieth lecture'
 * lecture('1강');   // 'first lecture'
 * lecture('26강', { format: 'cardinal' }); // 'lecture twenty-six'
 * ```
 */
export function lecture(input: string, options?: LectureOptions): string {
  const format = options?.format ?? 'ordinal';

  const trimmed = input.trim();
  if (trimmed === '') return input;

  // Parse "Lesson N", "Chapter N", "Episode N", "Part N", "Unit N", "Section N", "Lecture N" format
  const labelMatch = trimmed.match(
    /^(lesson|chapter|episode|part|unit|section|lecture)\s*#?\s*([\d,]+|[IVXLCDM]+)$/i
  );
  if (labelMatch) {
    const label = labelMatch[1] ?? '';
    const numStr = removeThousandSeparators(labelMatch[2] ?? '');
    const num = /^\d/.test(numStr) ? parseInt(numStr, 10) : romanToNumber(numStr);

    if (isNaN(num) || num < 0) {
      return input;
    }

    // Preserve original case for the label
    const originalLabel =
      trimmed.match(/^(lesson|chapter|episode|part|unit|section|lecture)\s*#?/i)?.[1] ?? label;

    return originalLabel + ' ' + numberToEnglish(num);
  }

  // Parse lecture number: N강 or N lesson/lecture
  const match = trimmed.match(/^([\d,]+)\s*(?:강|lessons?|lectures?)$/i);
  if (match) {
    const numStr = removeThousandSeparators(match[1] ?? '');
    const num = parseInt(numStr, 10);

    if (isNaN(num) || num < 0) {
      return input;
    }

    if (format === 'cardinal') {
      return 'lecture ' + numberToEnglish(num);
    }

    // Ordinal format: first lecture, second lecture, etc.
    if (num === 0) {
      return 'zeroth lecture';
    }
    return numberToOrdinal(num) + ' lecture';
  }

  return input;
}
