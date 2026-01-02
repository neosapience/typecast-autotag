import { digitToEnglish, digitToPhoneticEnglish } from '../utils/number-to-english';

export interface DigitsOptions {
  /**
   * Separator between digits
   * @default ' '
   */
  separator?: string;

  /**
   * Whether to use phonetic alphabet (e.g., "niner" for 9)
   * @default false
   */
  usePhoneticCode?: boolean;
}

/**
 * Convert number to individual digit pronunciation
 *
 * @param input - Number to convert (string or number)
 * @param options - Separator string or options object
 * @returns Space-separated English digits
 *
 * @remarks
 * - Decimal point (.) is converted to 'point'.
 * - Other non-digit characters (e.g., '-', space) are preserved.
 * - Separator is inserted between each character.
 *
 * @example
 * ```typescript
 * digits(123456);     // 'one two three four five six'
 * digits('789');      // 'seven eight nine'
 * digits('007');      // 'zero zero seven'
 * digits('-123');     // '- one two three'
 * digits('1.5');      // 'one point five'
 * digits('123', '');  // 'onetwothree'
 * digits('123', { separator: '' });  // 'onetwothree'
 *
 * // Phonetic code usage
 * digits('1239', { usePhoneticCode: true }); // 'one two three niner'
 * ```
 */
export function digits(input: number | string, options?: string | DigitsOptions): string {
  const str = String(input);

  if (!str || str.length === 0) {
    return str;
  }

  // Backward compatibility: if string is passed, treat as separator
  const opts: DigitsOptions =
    typeof options === 'string' ? { separator: options } : (options ?? {});

  const separator = opts.separator ?? ' ';
  const usePhoneticCode = opts.usePhoneticCode ?? false;
  const digitConverter = usePhoneticCode ? digitToPhoneticEnglish : digitToEnglish;

  return str
    .split('')
    .map((char) => {
      if (/\d/.test(char)) {
        return digitConverter(char);
      }
      if (char === '.') {
        return 'point';
      }
      return char;
    })
    .join(separator);
}
