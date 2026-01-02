import { numberToEnglish, digitToEnglish } from '../utils/number-to-english';

/**
 * Options for ratio function
 */
export interface RatioOptions {
  /**
   * Whether to include space around 'to'
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
 * Convert ratio/percentage to English words
 *
 * Supports:
 * - Ratio: N:M (e.g., 1:2 → "one to two")
 * - Percentage: N% (e.g., 50% → "fifty percent")
 * - Multiplier: Nx (e.g., 2x → "two times")
 *
 * @param input - Ratio to convert (string)
 * @param options - Options
 * @returns English ratio expression
 *
 * @example
 * ```typescript
 * ratio('1:2');       // 'one to two'
 * ratio('16:9');      // 'sixteen to nine'
 * ratio('50%');       // 'fifty percent'
 * ratio('3.5%');      // 'three point five percent'
 * ratio('2배');       // 'two times'
 * ratio('2x');        // 'two times'
 * ```
 */
export function ratio(input: string, options?: RatioOptions): string {
  const trimmed = input.trim();
  if (trimmed === '') return input;

  const includeSpace = options?.includeSpace ?? true;
  const space = includeSpace ? ' ' : '';

  // Ratio pattern: N:M or N:M:O...
  const ratioMatch = trimmed.match(/^([\d,]+)(?:\s*:\s*([\d,]+))+$/);
  if (ratioMatch) {
    const parts = trimmed.split(/\s*:\s*/);
    const englishParts = parts.map((part) => {
      const num = parseInt(removeThousandSeparators(part), 10);
      return isNaN(num) ? part : numberToEnglish(num);
    });
    return englishParts.join(space + 'to' + space);
  }

  // Percentage pattern: N% or N.N%
  const percentMatch = trimmed.match(/^([\d,]+(?:\.\d+)?)\s*%$/);
  if (percentMatch) {
    const numStr = removeThousandSeparators(percentMatch[1] ?? '');

    if (numStr.includes('.')) {
      const [intPart, decPart] = numStr.split('.');
      const intNum = parseInt(intPart ?? '0', 10);
      const intEnglish = intNum === 0 ? 'zero' : numberToEnglish(intNum);
      const decEnglish = (decPart ?? '')
        .split('')
        .map((d) => digitToEnglish(d))
        .join(' ');
      return intEnglish + ' point ' + decEnglish + ' percent';
    }

    const num = parseInt(numStr, 10);
    if (isNaN(num)) {
      return input;
    }
    return numberToEnglish(num) + ' percent';
  }

  // Multiplier pattern: N배 or Nx or N fold
  const multiplierMatch = trimmed.match(/^([\d,]+(?:\.\d+)?)\s*(?:배|x|times|fold)$/i);
  if (multiplierMatch) {
    const numStr = removeThousandSeparators(multiplierMatch[1] ?? '');
    // Check if original had "fold" to preserve the word
    const isFold = /fold$/i.test(trimmed);

    if (numStr.includes('.')) {
      const [intPart, decPart] = numStr.split('.');
      const intNum = parseInt(intPart ?? '0', 10);
      const intEnglish = intNum === 0 ? 'zero' : numberToEnglish(intNum);
      const decEnglish = (decPart ?? '')
        .split('')
        .map((d) => digitToEnglish(d))
        .join(' ');
      return intEnglish + ' point ' + decEnglish + (isFold ? ' fold' : ' times');
    }

    const num = parseInt(numStr, 10);
    if (isNaN(num)) {
      return input;
    }

    if (isFold) {
      return numberToEnglish(num) + ' fold';
    }
    return numberToEnglish(num) + (num === 1 ? ' time' : ' times');
  }

  return input;
}
