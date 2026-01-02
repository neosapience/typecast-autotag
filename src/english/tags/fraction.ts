import { numberToEnglish, numberToOrdinal } from '../utils/number-to-english';

/**
 * Options for fraction function
 */
export interface FractionOptions {
  /**
   * Style: 'ordinal' (one fourth) or 'slash' (one over four)
   * @default 'ordinal'
   */
  style?: 'ordinal' | 'slash';
}

/**
 * Convert fraction to English words
 *
 * @param input - Fraction to convert (string like "1/4")
 * @param options - Options (style)
 * @returns English fraction expression
 *
 * @example
 * ```typescript
 * fraction('1/2');    // 'one half'
 * fraction('1/4');    // 'one fourth'
 * fraction('3/4');    // 'three fourths'
 * fraction('2/3');    // 'two thirds'
 * fraction('1/8');    // 'one eighth'
 * fraction('5/8');    // 'five eighths'
 * fraction('1/4', { style: 'slash' }); // 'one over four'
 * ```
 */
export function fraction(input: string, options?: FractionOptions): string {
  const style = options?.style ?? 'ordinal';

  const trimmed = input.trim();
  if (trimmed === '') return input;

  // Parse fraction: N/M
  const match = trimmed.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (!match) {
    return input;
  }

  const numerator = parseInt(match[1] ?? '0', 10);
  const denominator = parseInt(match[2] ?? '0', 10);

  if (isNaN(numerator) || isNaN(denominator) || denominator === 0) {
    return input;
  }

  if (style === 'slash') {
    return numberToEnglish(numerator) + ' over ' + numberToEnglish(denominator);
  }

  // Ordinal style: "one fourth", "three fourths"
  // Special cases for common fractions
  const numeratorWord = numberToEnglish(numerator);

  // Handle special denominators
  let denominatorWord: string;
  const isPlural = numerator !== 1;

  if (denominator === 2) {
    denominatorWord = isPlural ? 'halves' : 'half';
  } else if (denominator === 4) {
    denominatorWord = isPlural ? 'quarters' : 'quarter';
  } else {
    // Use ordinal form: third, fourth, fifth, etc.
    const ordinal = numberToOrdinal(denominator);
    denominatorWord = isPlural ? ordinal + 's' : ordinal;
  }

  return numeratorWord + ' ' + denominatorWord;
}

/**
 * Convert fraction with context to English words
 *
 * @param input - Fraction with context (e.g., "1/4 remaining")
 * @returns English fraction expression with context
 *
 * @example
 * ```typescript
 * fractionWithContext('1/4 remaining'); // 'one quarter remaining'
 * fractionWithContext('3/4 full');      // 'three quarters full'
 * ```
 */
export function fractionWithContext(input: string): string {
  const trimmed = input.trim();
  if (trimmed === '') return input;

  // Parse fraction with context: N/M context
  const match = trimmed.match(/^(\d+)\s*\/\s*(\d+)\s+(.+)$/);
  if (!match) {
    return fraction(trimmed);
  }

  const fractionPart = match[1] + '/' + match[2];
  const context = match[3] ?? '';

  return fraction(fractionPart) + ' ' + context;
}
