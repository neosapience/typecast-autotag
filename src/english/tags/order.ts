import { numberToOrdinal } from '../utils/number-to-english';

/**
 * Options for order function
 */
export interface OrderOptions {
  /**
   * Ordinal suffix (default: '')
   * e.g., 'place', 'position'
   * @default ''
   */
  suffix?: string;

  /**
   * Whether to include space between number and suffix
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
 * Convert ordinal number to English
 *
 * English ordinals: first, second, third, fourth, fifth, ...
 *
 * @param input - Number to convert (number or string)
 * @param options - Options (suffix, space)
 * @returns English ordinal expression
 *
 * @example
 * ```typescript
 * order(1);         // 'first'
 * order(2);         // 'second'
 * order(3);         // 'third'
 * order(10);        // 'tenth'
 * order(21);        // 'twenty-first'
 * order(100);       // 'one hundredth'
 * order('1st');     // 'first'
 * order('3rd');     // 'third'
 * order(1, { suffix: 'place' }); // 'first place'
 * ```
 */
export function order(input: number | string, options?: OrderOptions): string {
  const suffix = options?.suffix ?? '';
  const includeSpace = options?.includeSpace ?? true;
  const space = includeSpace && suffix !== '' ? ' ' : '';

  // String processing
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (trimmed === '') return input;

    // Parse "1st place", "2nd rank", etc. (ordinal + following word)
    const contextMatch = trimmed.match(
      /^(?:the\s+|came\s+|finished\s+|ranked\s+)?(-?[\d,]+)\s*(?:st|nd|rd|th)\s*(place|rank|position|grade|level|round)?$/i
    );
    if (contextMatch) {
      const numStr = removeThousandSeparators(contextMatch[1] ?? '');
      const followingWord = contextMatch[2] ?? suffix;
      const num = parseInt(numStr, 10);

      if (isNaN(num)) {
        return String(input);
      }

      const prefix = trimmed.match(/^(the\s+|came\s+|finished\s+|ranked\s+)/i)?.[0] ?? '';

      if (num < 0) {
        const absOrdinal = numberToOrdinal(-num);
        const result = prefix + 'minus ' + absOrdinal;
        return followingWord ? result + ' ' + followingWord : result;
      }

      if (num === 0) {
        const result = prefix + 'zeroth';
        return followingWord ? result + ' ' + followingWord : result;
      }

      const result = prefix + numberToOrdinal(num);
      return followingWord ? result + ' ' + followingWord : result;
    }

    // Parse "1st", "2nd", "3rd", "4th", "1번째", "3등", "5위"
    const match = trimmed.match(/^(-?[\d,]+)\s*(?:st|nd|rd|th|번째|등|위|단계)?$/i);
    if (match) {
      const numStr = removeThousandSeparators(match[1] ?? '');
      const num = parseInt(numStr, 10);

      if (isNaN(num)) {
        return String(input);
      }

      if (num < 0) {
        const absResult = order(-num, { suffix, includeSpace });
        return 'minus ' + absResult;
      }

      if (num === 0) {
        return 'zeroth' + space + suffix;
      }

      return numberToOrdinal(num) + space + suffix;
    }

    return String(input);
  }

  // Number processing
  if (isNaN(input)) {
    return 'not a number';
  }

  if (!isFinite(input)) {
    return input > 0 ? 'infinity' : 'minus infinity';
  }

  if (input < 0) {
    return 'minus ' + order(-input, options);
  }

  if (input === 0) {
    return 'zeroth' + space + suffix;
  }

  return numberToOrdinal(input) + space + suffix;
}
