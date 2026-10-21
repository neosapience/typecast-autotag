import { isSafeNumber } from './number-safety';

/** Reuse the unit converter for both ends; never leave half of a range converted. */
export function convertUnitRange(
  input: string,
  convert: (value: string) => string,
  separator: string
): string {
  const match = input.match(/^([\d,]+(?:\.\d+)?)\s*[-~–—]\s*([\d,]+(?:\.\d+)?)\s*(.+)$/);
  if (!match) {
    const value = Number(input.match(/^[\d,.]+/)?.[0]?.replace(/,/g, ''));
    return isSafeNumber(value) ? convert(input) : input;
  }
  const [, first = '', second = '', unit = ''] = match;
  if (![first, second].every((value) => isSafeNumber(Number(value.replace(/,/g, '')))))
    return input;
  const left = first + unit;
  const right = second + unit;
  const a = convert(left);
  const b = convert(right);
  return a === left || b === right ? input : a + separator + b;
}
