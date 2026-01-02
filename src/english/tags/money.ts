import { numberToEnglish } from '../utils/number-to-english';

/**
 * Options for money function
 */
export interface MoneyOptions {
  /**
   * Currency unit (default: 'dollars')
   * @default 'dollars'
   */
  unit?: string;

  /**
   * Singular form of currency (default: 'dollar')
   * @default 'dollar'
   */
  singularUnit?: string;

  /**
   * Subunit name (default: 'cents')
   * @default 'cents'
   */
  subunit?: string;

  /**
   * Singular form of subunit (default: 'cent')
   * @default 'cent'
   */
  singularSubunit?: string;

  /**
   * Whether to include space between number and unit
   * @default true
   */
  includeSpace?: boolean;
}

/**
 * Remove thousand separators
 */
function removeThousandSeparators(str: string): string {
  return str.replace(/,/g, '');
}

/**
 * Convert money amount to English words
 *
 * @param input - Amount to convert (number or string)
 * @param options - Options (unit, space inclusion, etc.)
 * @returns English money expression
 *
 * @example
 * ```typescript
 * money(100);       // 'one hundred dollars'
 * money(1);         // 'one dollar'
 * money(1.50);      // 'one dollar and fifty cents'
 * money(0.99);      // 'ninety-nine cents'
 * money('$10.00');  // 'ten dollars'
 * money('$1,234.56'); // 'one thousand two hundred and thirty-four dollars and fifty-six cents'
 * money(100, { unit: 'pounds', singularUnit: 'pound' }); // 'one hundred pounds'
 * money(-50);       // 'minus fifty dollars'
 * ```
 */
export function money(input: number | string, options?: MoneyOptions): string {
  const unit = options?.unit ?? 'dollars';
  const singularUnit = options?.singularUnit ?? 'dollar';
  const subunit = options?.subunit ?? 'cents';
  const singularSubunit = options?.singularSubunit ?? 'cent';
  const includeSpace = options?.includeSpace ?? true;
  const space = includeSpace ? ' ' : '';

  // String processing
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (trimmed === '') return input;

    // Remove currency symbols: $, £, €, ¥, ₩
    let withoutCurrency = trimmed.replace(/^[$$£€¥₩]\s*/, '');

    // Handle negative: -number
    let isNegative = false;
    if (withoutCurrency.startsWith('-')) {
      isNegative = true;
      withoutCurrency = withoutCurrency.slice(1).trim();
    }

    const negativePrefix = isNegative ? 'minus ' : '';

    // Parse number and unit
    const match = withoutCurrency.match(/^([\d,]+(?:\.\d+)?)\s*(.*)$/);
    if (match) {
      const numStr = removeThousandSeparators(match[1] ?? '');
      const parsedUnit = match[2] || unit;
      const parsedSingularUnit = parsedUnit === unit ? singularUnit : parsedUnit;

      // Handle decimal (cents)
      if (numStr.includes('.')) {
        const [intPart, decPart] = numStr.split('.');
        const intNum = parseInt(intPart || '0', 10);
        const decNum = parseInt((decPart || '0').padEnd(2, '0').slice(0, 2), 10);

        if (isNaN(intNum)) {
          return String(input);
        }

        // Cents only
        if (intNum === 0 && decNum > 0) {
          const centsWord = decNum === 1 ? singularSubunit : subunit;
          return negativePrefix + numberToEnglish(decNum) + space + centsWord;
        }

        // Dollars only (no cents)
        if (decNum === 0) {
          const unitWord = intNum === 1 ? parsedSingularUnit : parsedUnit;
          const intKorean = intNum === 0 ? 'zero' : numberToEnglish(intNum);
          return negativePrefix + intKorean + space + unitWord;
        }

        // Both dollars and cents
        const unitWord = intNum === 1 ? parsedSingularUnit : parsedUnit;
        const centsWord = decNum === 1 ? singularSubunit : subunit;
        const intKorean = intNum === 0 ? 'zero' : numberToEnglish(intNum);
        return (
          negativePrefix +
          intKorean +
          space +
          unitWord +
          ' and ' +
          numberToEnglish(decNum) +
          space +
          centsWord
        );
      }

      const num = parseInt(numStr, 10);

      if (isNaN(num) || num < 0) {
        return String(input);
      }

      const unitWord = num === 1 ? parsedSingularUnit : parsedUnit;

      if (num === 0) {
        return negativePrefix + 'zero' + space + unitWord;
      }

      return negativePrefix + numberToEnglish(num) + space + unitWord;
    }

    return String(input);
  }

  // Number processing
  if (isNaN(input) || !isFinite(input)) {
    return String(input);
  }

  // Negative handling
  if (input < 0) {
    return 'minus ' + money(-input, options);
  }

  // Handle decimals
  if (!Number.isInteger(input)) {
    const intPart = Math.floor(input);
    const decPart = Math.round((input - intPart) * 100);

    // Cents only
    if (intPart === 0 && decPart > 0) {
      const centsWord = decPart === 1 ? singularSubunit : subunit;
      return numberToEnglish(decPart) + space + centsWord;
    }

    // Dollars only
    if (decPart === 0) {
      const unitWord = intPart === 1 ? singularUnit : unit;
      return numberToEnglish(intPart) + space + unitWord;
    }

    // Both
    const unitWord = intPart === 1 ? singularUnit : unit;
    const centsWord = decPart === 1 ? singularSubunit : subunit;
    return (
      numberToEnglish(intPart) +
      space +
      unitWord +
      ' and ' +
      numberToEnglish(decPart) +
      space +
      centsWord
    );
  }

  const unitWord = input === 1 ? singularUnit : unit;

  if (input === 0) {
    return 'zero' + space + unitWord;
  }

  return numberToEnglish(input) + space + unitWord;
}
