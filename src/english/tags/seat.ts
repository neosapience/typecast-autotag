import { numberToEnglish } from '../utils/number-to-english';

/**
 * Convert seat number to spoken English format
 *
 * Seat numbers typically have a row number + seat letter
 *
 * @param input - Seat number to convert (string)
 * @returns English seat number expression
 *
 * @example
 * ```typescript
 * seat('23A');  // 'twenty-three A'
 * seat('15F');  // 'fifteen F'
 * seat('7C');   // 'seven C'
 * seat('1A');   // 'one A'
 * ```
 */
export function seat(input: string): string {
  if (!input || input.trim() === '') {
    return input;
  }

  const trimmed = input.trim();

  // Parse seat: 1-3 digits + 1 letter
  const match = trimmed.match(/^(\d{1,3})([A-Za-z])$/);
  if (!match) {
    return input;
  }

  const rowNumber = parseInt(match[1] ?? '0', 10);
  const seatLetter = (match[2] ?? '').toUpperCase();

  if (isNaN(rowNumber) || rowNumber <= 0) {
    return input;
  }

  return numberToEnglish(rowNumber) + ' ' + seatLetter;
}
