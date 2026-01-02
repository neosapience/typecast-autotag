import { digitToEnglish } from '../utils/number-to-english';

/**
 * Options for account function
 */
export interface AccountOptions {
  /**
   * Separator between digit groups
   * @default ', '
   */
  groupSeparator?: string;

  /**
   * Separator between individual digits
   * @default ' '
   */
  digitSeparator?: string;
}

/**
 * Convert account number to spoken English format
 *
 * Account numbers are read digit by digit, with groups separated.
 *
 * @param input - Account number to convert (string)
 * @param options - Options (separators)
 * @returns English account number expression
 *
 * @example
 * ```typescript
 * account('123-456-789012');
 * // 'one two three, four five six, seven eight nine zero one two'
 *
 * account('110-123-456789');
 * // 'one one zero, one two three, four five six seven eight nine'
 * ```
 */
export function account(input: string, options?: AccountOptions): string {
  if (!input || input.trim() === '') {
    return input;
  }

  const groupSeparator = options?.groupSeparator ?? ', ';
  const digitSeparator = options?.digitSeparator ?? ' ';

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
        return char;
      })
      .join(digitSeparator);
  });

  return convertedGroups.join(groupSeparator);
}
