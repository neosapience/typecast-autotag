// Reject non-finite values and unsafe integer magnitudes before reading numbers.
export function isSafeNumber(value: number): boolean {
  return isFinite(value) && Math.abs(value) <= 9007199254740991;
}
