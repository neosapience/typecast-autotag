import { digitToPhoneEnglish, digitToPhoneticEnglish } from '../utils/number-to-english';

export interface PhoneOptions {
  /**
   * Input delimiter pattern
   * @default /[-.\s]+/ (hyphen, dot, space)
   */
  inputDelimiters?: RegExp;

  /**
   * Whether to include separator word between groups
   * @default false
   */
  includeSeparatorWord?: boolean;

  /**
   * Whether to use phonetic alphabet (e.g., "niner" for 9)
   * @default false
   */
  usePhoneticCode?: boolean;
}

/**
 * Convert phone number to pronunciation-friendly format
 *
 * @param input - Phone number to convert (e.g., '555-123-4567')
 * @param options - Additional options
 * @returns Pronunciation-corrected phone number
 *
 * @example
 * ```typescript
 * phone('555-123-4567'); // 'five five five one two three four five six seven'
 * phone('(800) 555-1234'); // 'eight zero zero five five five one two three four'
 * phone('1-800-555-1234'); // 'one eight zero zero five five five one two three four'
 * phone('911'); // 'nine one one'
 *
 * // With phonetic code
 * phone('555-1239', { usePhoneticCode: true });
 * // 'five five five one two three niner'
 * ```
 */
export function phone(input: string, options?: PhoneOptions): string {
  // Handle null, undefined, empty string
  if (input == null || input.length === 0) {
    return input;
  }

  // Default: hyphen, dot, space as delimiters
  const delimiters = options?.inputDelimiters ?? /[-.\s]+/;

  // Include separator word (default: false for English)
  const includeSeparatorWord = options?.includeSeparatorWord ?? false;
  const separator = includeSeparatorWord ? ', ' : ' ';

  // Phonetic code usage
  const usePhoneticCode = options?.usePhoneticCode ?? false;
  const digitConverter = usePhoneticCode ? digitToPhoneticEnglish : digitToPhoneEnglish;

  // Split by delimiters
  const groups = input.split(delimiters).filter((group) => group.length > 0);

  // Return original if no groups
  if (groups.length === 0) {
    return input;
  }

  const convertedGroups = groups.map((group) => {
    return group
      .split('')
      .map((char): string | null => {
        // Convert digits
        if (/\d/.test(char)) {
          return digitConverter(char);
        }
        // Special character pronunciation
        if (char === '#') {
          return 'pound';
        }
        if (char === '*') {
          return 'star';
        }
        if (char === '+') {
          return 'plus';
        }
        // Remove parentheses (not needed for TTS)
        if (char === '(' || char === ')') {
          return null;
        }
        // Keep other characters as-is
        return char;
      })
      .filter((item): item is string => item !== null)
      .join(' ');
  });

  return convertedGroups.join(separator);
}
