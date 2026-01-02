import { digitToEnglish, numberToEnglish } from '../utils/number-to-english';

/**
 * Options for roomNumber function
 */
export interface RoomNumberOptions {
  /**
   * Reading style: 'individual' (one two zero five) or 'grouped' (twelve oh five)
   * @default 'individual'
   */
  style?: 'individual' | 'grouped';
}

/**
 * Convert room number to spoken English format
 *
 * Room numbers are typically read digit by digit or in groups
 *
 * @param input - Room number to convert (string)
 * @param options - Options (style)
 * @returns English room number expression
 *
 * @example
 * ```typescript
 * roomNumber('1205');   // 'one two zero five'
 * roomNumber('302');    // 'three zero two'
 * roomNumber('1205호'); // 'one two zero five'
 *
 * // Grouped style (floor + room)
 * roomNumber('1205', { style: 'grouped' }); // 'twelve oh five'
 * ```
 */
export function roomNumber(input: string, options?: RoomNumberOptions): string {
  if (!input || input.trim() === '') {
    return input;
  }

  const style = options?.style ?? 'individual';
  const trimmed = input.trim();

  // Parse room number: digits + optional 호
  const match = trimmed.match(/^(\d+)\s*(?:호)?$/);
  if (!match) {
    return input;
  }

  const number = match[1] ?? '';

  if (style === 'grouped' && number.length >= 3) {
    // Grouped style: split into floor and room
    // For 4-digit: 12-05, for 3-digit: 3-02
    const splitPoint = number.length === 4 ? 2 : 1;
    const floor = number.slice(0, splitPoint);
    const room = number.slice(splitPoint);

    const floorNum = parseInt(floor, 10);
    const roomNum = parseInt(room, 10);

    if (!isNaN(floorNum) && !isNaN(roomNum)) {
      const roomStr = roomNum < 10 ? 'oh ' + numberToEnglish(roomNum) : numberToEnglish(roomNum);
      return numberToEnglish(floorNum) + ' ' + roomStr;
    }
  }

  // Individual style: read each digit
  return number
    .split('')
    .map((d) => digitToEnglish(d))
    .join(' ');
}
