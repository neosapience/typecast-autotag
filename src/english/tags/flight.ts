import { digitToEnglish } from '../utils/number-to-english';

/**
 * Convert flight number to spoken English format
 *
 * Flight numbers are read: airline code + digits individually
 *
 * @param input - Flight number to convert (string)
 * @returns English flight number expression
 *
 * @example
 * ```typescript
 * flight('KE123');  // 'K E one two three'
 * flight('AA101');  // 'A A one zero one'
 * flight('DL45');   // 'D L four five'
 * flight('UA1234'); // 'U A one two three four'
 * ```
 */
export function flight(input: string): string {
  if (!input || input.trim() === '') {
    return input;
  }

  const trimmed = input.trim();

  // Parse flight number: 2 letters + 1-4 digits
  const match = trimmed.match(/^([A-Za-z]{2})(\d{1,4})$/);
  if (!match) {
    return input;
  }

  const airlineCode = match[1] ?? '';
  const flightNumber = match[2] ?? '';

  // Spell out airline code
  const airlineSpelled = airlineCode.toUpperCase().split('').join(' ');

  // Read digits individually
  const digitsSpelled = flightNumber
    .split('')
    .map((d) => digitToEnglish(d))
    .join(' ');

  return airlineSpelled + ' ' + digitsSpelled;
}
