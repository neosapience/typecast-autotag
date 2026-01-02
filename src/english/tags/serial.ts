import { digitToEnglish } from '../utils/number-to-english';

/**
 * Options for serial function
 */
export interface SerialOptions {
  /**
   * Separator between characters
   * @default ' '
   */
  separator?: string;

  /**
   * Separator between groups (for hyphenated serials)
   * @default ', '
   */
  groupSeparator?: string;
}

/**
 * Convert serial number to spoken English format
 *
 * Serial numbers are read character by character.
 *
 * @param input - Serial number to convert (string)
 * @param options - Options (separators)
 * @returns English serial number expression
 *
 * @example
 * ```typescript
 * serial('ABC-123');
 * // 'A B C, one two three'
 *
 * serial('XY-2024-0001');
 * // 'X Y, two zero two four, zero zero zero one'
 * ```
 */
export function serial(input: string, options?: SerialOptions): string {
  if (!input || input.trim() === '') {
    return input;
  }

  const separator = options?.separator ?? ' ';
  const groupSeparator = options?.groupSeparator ?? ', ';

  // Split by hyphens or other common separators
  const groups = input.split(/[-.\s]+/).filter((group) => group.length > 0);

  if (groups.length === 0) {
    return input;
  }

  const convertedGroups = groups.map((group) => {
    return group
      .split('')
      .map((char) => {
        if (/\d/.test(char)) {
          return digitToEnglish(char);
        }
        // Keep letters as-is (they will be spelled out)
        return char;
      })
      .join(separator);
  });

  return convertedGroups.join(groupSeparator);
}

/**
 * Convert only the numbers in a serial string
 *
 * Keeps labels and other text, only converts numeric parts.
 *
 * @param input - Serial number with label
 * @param options - Options (separators)
 * @returns String with numbers converted to English
 *
 * @example
 * ```typescript
 * serialNumbersOnly('Order Number: 12345');
 * // 'Order Number: one two three four five'
 * ```
 */
export function serialNumbersOnly(input: string, options?: SerialOptions): string {
  if (!input || input.trim() === '') {
    return input;
  }

  const separator = options?.separator ?? ' ';

  // Find numeric sequences and convert them
  return input.replace(/\d+/g, (numStr) => {
    return numStr
      .split('')
      .map((d) => digitToEnglish(d))
      .join(separator);
  });
}
