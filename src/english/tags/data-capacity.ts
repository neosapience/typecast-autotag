import { numberToEnglish, digitToEnglish } from '../utils/number-to-english';

/**
 * Options for dataCapacity function
 */
export interface DataCapacityOptions {
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
 * Data capacity unit mapping
 */
const DATA_UNITS: Record<string, string> = {
  TB: 'terabytes',
  tb: 'terabytes',
  GB: 'gigabytes',
  gb: 'gigabytes',
  MB: 'megabytes',
  mb: 'megabytes',
  KB: 'kilobytes',
  kb: 'kilobytes',
  Gbps: 'gigabits per second',
  gbps: 'gigabits per second',
  Mbps: 'megabits per second',
  mbps: 'megabits per second',
  Kbps: 'kilobits per second',
  kbps: 'kilobits per second',
  bps: 'bits per second',
  MWh: 'megawatt hours',
  mwh: 'megawatt hours',
  kWh: 'kilowatt hours',
  kwh: 'kilowatt hours',
  Wh: 'watt hours',
  wh: 'watt hours',
  MW: 'megawatts',
  mw: 'megawatts',
  kW: 'kilowatts',
  kw: 'kilowatts',
  W: 'watts',
  kV: 'kilovolts',
  kv: 'kilovolts',
  V: 'volts',
  mA: 'milliamps',
  ma: 'milliamps',
  A: 'amps',
};

/**
 * Convert data capacity/power to English words
 *
 * @param input - Data capacity or power to convert (string)
 * @param options - Options (space inclusion)
 * @returns English expression
 *
 * @example
 * ```typescript
 * dataCapacity('6GB');     // 'six gigabytes'
 * dataCapacity('500MB');   // 'five hundred megabytes'
 * dataCapacity('100Mbps'); // 'one hundred megabits per second'
 * dataCapacity('450kWh');  // 'four hundred and fifty kilowatt hours'
 * dataCapacity('220V');    // 'two hundred and twenty volts'
 * ```
 */
export function dataCapacity(input: string, options?: DataCapacityOptions): string {
  const includeSpace = options?.includeSpace ?? true;
  const space = includeSpace ? ' ' : '';

  const trimmed = input.trim();
  if (trimmed === '') return input;

  // Data unit pattern matching (longer units first)
  const unitPattern = Object.keys(DATA_UNITS)
    .sort((a, b) => b.length - a.length)
    .join('|');

  const match = trimmed.match(new RegExp(`^([+-]?[\\d,]+(?:\\.\\d+)?)\\s*(${unitPattern})$`, 'i'));

  if (match) {
    const numStr = removeThousandSeparators(match[1] ?? '');
    const parsedUnit = match[2] ?? '';
    const unitWord = DATA_UNITS[parsedUnit] ?? DATA_UNITS[parsedUnit.toLowerCase()] ?? parsedUnit;

    // Handle negative
    const isNegative = numStr.startsWith('-');
    const absNumStr = isNegative ? numStr.slice(1) : numStr;
    const negativePrefix = isNegative ? 'minus ' : '';

    // Handle decimal
    if (absNumStr.includes('.')) {
      const [intPart, decPart] = absNumStr.split('.');
      const intNum = parseInt(intPart ?? '0', 10);
      const intEnglish = intNum === 0 ? 'zero' : numberToEnglish(intNum);
      const decEnglish = (decPart ?? '')
        .split('')
        .map((d) => digitToEnglish(d))
        .join(' ');
      return negativePrefix + intEnglish + ' point ' + decEnglish + space + unitWord;
    }

    const num = parseInt(absNumStr, 10);

    if (isNaN(num)) {
      return input;
    }

    if (num === 0) {
      return negativePrefix + 'zero' + space + unitWord;
    }

    return negativePrefix + numberToEnglish(num) + space + unitWord;
  }

  return input;
}
