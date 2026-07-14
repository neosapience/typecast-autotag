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

interface CurrencyWords {
  unit: string;
  singularUnit: string;
  subunit: string;
  singularSubunit: string;
}

const DOLLARS: CurrencyWords = {
  unit: 'dollars',
  singularUnit: 'dollar',
  subunit: 'cents',
  singularSubunit: 'cent',
};

const CURRENCY_BY_SYMBOL: Record<string, CurrencyWords> = {
  $: DOLLARS,
  '£': { unit: 'pounds', singularUnit: 'pound', subunit: 'pence', singularSubunit: 'penny' },
  '€': { unit: 'euros', singularUnit: 'euro', subunit: 'cents', singularSubunit: 'cent' },
  '¥': { unit: 'yen', singularUnit: 'yen', subunit: 'sen', singularSubunit: 'sen' },
  '₩': { unit: 'won', singularUnit: 'won', subunit: 'jeon', singularSubunit: 'jeon' },
};

const CURRENCY_BY_NAME: Record<string, CurrencyWords> = {
  dollar: DOLLARS,
  dollars: DOLLARS,
  usd: DOLLARS,
  pound: CURRENCY_BY_SYMBOL['£']!,
  pounds: CURRENCY_BY_SYMBOL['£']!,
  gbp: CURRENCY_BY_SYMBOL['£']!,
  euro: CURRENCY_BY_SYMBOL['€']!,
  euros: CURRENCY_BY_SYMBOL['€']!,
  eur: CURRENCY_BY_SYMBOL['€']!,
  yen: CURRENCY_BY_SYMBOL['¥']!,
  jpy: CURRENCY_BY_SYMBOL['¥']!,
  won: CURRENCY_BY_SYMBOL['₩']!,
  krw: CURRENCY_BY_SYMBOL['₩']!,
};

const SUBUNIT_BY_NAME: Record<string, [string, string]> = {
  cent: ['cents', 'cent'],
  cents: ['cents', 'cent'],
  penny: ['pence', 'penny'],
  pence: ['pence', 'penny'],
  sen: ['sen', 'sen'],
  jeon: ['jeon', 'jeon'],
};

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
  const defaultCurrency: CurrencyWords = {
    unit: options?.unit ?? DOLLARS.unit,
    singularUnit: options?.singularUnit ?? DOLLARS.singularUnit,
    subunit: options?.subunit ?? DOLLARS.subunit,
    singularSubunit: options?.singularSubunit ?? DOLLARS.singularSubunit,
  };
  const { unit, singularUnit, subunit, singularSubunit } = defaultCurrency;
  const includeSpace = options?.includeSpace ?? true;
  const space = includeSpace ? ' ' : '';

  // String processing
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (trimmed === '') return input;

    // Remove currency symbols: $, £, €, ¥, ₩
    const symbol = trimmed.match(/^[$£€¥₩]/)?.[0] ?? '';
    let withoutCurrency = trimmed.replace(/^[$£€¥₩]\s*/, '');

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
      const rawSuffix = (match[2] ?? '').trim();
      const magnitudeMatch = rawSuffix.match(
        /^(thousand|million|billion|trillion)(?:\s+([a-z]+))?$/i
      );
      const magnitude = magnitudeMatch?.[1]?.toLowerCase() ?? '';
      const rawCurrencyName = magnitudeMatch?.[2] ?? (magnitude ? '' : rawSuffix);
      const currencyName = rawCurrencyName.toLowerCase();
      const namedCurrency = CURRENCY_BY_NAME[currencyName];
      const symbolCurrency = CURRENCY_BY_SYMBOL[symbol];
      const genericCurrency = currencyName
        ? {
            ...defaultCurrency,
            unit: rawCurrencyName,
            singularUnit: rawCurrencyName.endsWith('s')
              ? rawCurrencyName.slice(0, -1)
              : rawCurrencyName,
          }
        : defaultCurrency;
      const currency = symbolCurrency ?? namedCurrency ?? genericCurrency;
      const parsedUnit = currency.unit;
      const parsedSingularUnit = currency.singularUnit;
      const parsedSubunit = currency.subunit;
      const parsedSingularSubunit = currency.singularSubunit;

      const standaloneSubunit = SUBUNIT_BY_NAME[currencyName];
      if (standaloneSubunit && !magnitude) {
        const value = Number(numStr);
        if (!Number.isFinite(value)) return String(input);
        const subunitWord = value === 1 ? standaloneSubunit[1] : standaloneSubunit[0];
        return negativePrefix + numberToEnglish(value) + space + subunitWord;
      }

      if (magnitude) {
        const value = Number(numStr);
        if (!Number.isFinite(value)) return String(input);
        return negativePrefix + numberToEnglish(value) + ' ' + magnitude + space + parsedUnit;
      }

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
          const centsWord = decNum === 1 ? parsedSingularSubunit : parsedSubunit;
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
        const centsWord = decNum === 1 ? parsedSingularSubunit : parsedSubunit;
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
