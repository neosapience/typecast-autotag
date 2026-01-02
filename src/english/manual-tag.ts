import { name } from './tags/name';
import { month } from './tags/month';
import { day } from './tags/day';
import { date } from './tags/date';
import { time } from './tags/time';
import { year } from './tags/year';
import { phone } from './tags/phone';
import { money } from './tags/money';
import { order } from './tags/order';
import { point } from './tags/point';
import { piece } from './tags/piece';
import { digits } from './tags/digits';
import { minsec } from './tags/minsec';
import { datetime } from './tags/datetime';
import { ratio } from './tags/ratio';
import { numberTag } from './tags/number';
import { duration } from './tags/duration';
import { floor } from './tags/floor';
import { account } from './tags/account';
import { weight } from './tags/weight';
import { mile } from './tags/mile';
import { area } from './tags/area';
import { serial } from './tags/serial';
import { roomNumber } from './tags/room-number';
import { distance } from './tags/distance';
import { flight } from './tags/flight';
import { seat } from './tags/seat';
import { lecture } from './tags/lecture';
import { fraction } from './tags/fraction';
import { temperature } from './tags/temperature';
import { volume } from './tags/volume';
import { dataCapacity } from './tags/data-capacity';
import { inch } from './tags/inch';

/**
 * Available tag function mapping
 */
type TagFunction = (input: string) => string;

const TAG_FUNCTIONS: Record<string, TagFunction> = {
  name: (input) => name(input),
  month: (input) => month(input),
  day: (input) => day(input),
  date: (input) => date(input),
  time: (input) => time(input),
  year: (input) => year(input),
  phone: (input) => phone(input),
  money: (input) => money(input),
  order: (input) => order(input),
  point: (input) => point(input),
  piece: (input) => piece(input),
  digits: (input) => digits(input),
  minsec: (input) => minsec(input),
  datetime: (input) => datetime(input),
  ratio: (input) => ratio(input),
  number: (input) => numberTag(input),
  duration: (input) => duration(input),
  floor: (input) => floor(input),
  account: (input) => account(input),
  weight: (input) => weight(input),
  mile: (input) => mile(input),
  area: (input) => area(input),
  serial: (input) => serial(input),
  roomNumber: (input) => roomNumber(input),
  distance: (input) => distance(input),
  flight: (input) => flight(input),
  seat: (input) => seat(input),
  lecture: (input) => lecture(input),
  fraction: (input) => fraction(input),
  temperature: (input) => temperature(input),
  volume: (input) => volume(input),
  dataCapacity: (input) => dataCapacity(input),
  inch: (input) => inch(input),
};

/**
 * List of supported tag names
 */
export const SUPPORTED_TAGS = Object.keys(TAG_FUNCTIONS);

/**
 * Regular expression for tag matching
 * Format: tagName(value) - any characters allowed inside parentheses (excluding nested parentheses)
 */
const TAG_PATTERN = new RegExp(`(${SUPPORTED_TAGS.join('|')})\\(([^)]*)\\)`, 'g');

/**
 * Parse tags in text and replace with results of applying tag functions
 *
 * @param text - Text to convert
 * @returns Text with tags converted
 *
 * @example
 * ```typescript
 * manualTag('Hello, name(John Smith) customer.');
 * // 'Hello, J O H N S M I T H customer.'
 *
 * manualTag('month(12) day(25) is the date.');
 * // 'December twenty-fifth is the date.'
 *
 * manualTag('Order number is phone(555-123-4567).');
 * // 'Order number is five five five, one two three, four five six seven.'
 *
 * manualTag('Amount is money($100).');
 * // 'Amount is one hundred dollars.'
 * ```
 */
export function manualTag(text: string): string {
  if (!text || text.length === 0) {
    return text;
  }

  return text.replace(TAG_PATTERN, (match, tagName: string, value: string) => {
    const tagFunction = TAG_FUNCTIONS[tagName];
    if (tagFunction) {
      return tagFunction(value);
    }
    // If tag function not found, keep original
    return match;
  });
}

/**
 * Extract tags found in text
 *
 * @param text - Text to analyze
 * @returns Array of found tag information { tag, value, start, end }
 *
 * @example
 * ```typescript
 * extractTags('Hello, name(John) customer.');
 * // [{ tag: 'name', value: 'John', start: 7, end: 17 }]
 * ```
 */
export function extractTags(
  text: string
): Array<{ tag: string; value: string; start: number; end: number }> {
  if (!text || text.length === 0) {
    return [];
  }

  const results: Array<{ tag: string; value: string; start: number; end: number }> = [];
  const pattern = new RegExp(`(${SUPPORTED_TAGS.join('|')})\\(([^)]*)\\)`, 'g');

  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    results.push({
      tag: match[1] ?? '',
      value: match[2] ?? '',
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  return results;
}

/**
 * Selectively convert only specific tags
 *
 * @param text - Text to convert
 * @param allowedTags - Array of allowed tag names
 * @returns Text with only selected tags converted
 *
 * @example
 * ```typescript
 * manualTagSelective('name(John) month(12)', ['name']);
 * // 'J O H N month(12)'
 * ```
 */
export function manualTagSelective(text: string, allowedTags: string[]): string {
  if (!text || text.length === 0) {
    return text;
  }

  if (allowedTags.length === 0) {
    return text;
  }

  // Filter only allowed tags
  const filteredTags = allowedTags.filter((tag) => SUPPORTED_TAGS.includes(tag));
  if (filteredTags.length === 0) {
    return text;
  }

  const pattern = new RegExp(`(${filteredTags.join('|')})\\(([^)]*)\\)`, 'g');

  return text.replace(pattern, (match, tagName: string, value: string) => {
    const tagFunction = TAG_FUNCTIONS[tagName];
    if (tagFunction) {
      return tagFunction(value);
    }
    return match;
  });
}
