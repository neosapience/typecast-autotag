import { numberToEnglish, digitToEnglish } from '../utils/number-to-english';

/**
 * Options for temperature function
 */
export interface TemperatureOptions {
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
 * Temperature unit mapping
 */
const TEMP_UNITS: Record<string, string> = {
  '℃': 'degrees Celsius',
  '°C': 'degrees Celsius',
  '°c': 'degrees Celsius',
  C: 'Celsius',
  '℉': 'degrees Fahrenheit',
  '°F': 'degrees Fahrenheit',
  '°f': 'degrees Fahrenheit',
  F: 'Fahrenheit',
  K: 'Kelvin',
  켈빈: 'Kelvin',
  도: 'degrees',
};

/**
 * Convert temperature to English words
 *
 * @param input - Temperature to convert (string)
 * @param options - Options (space inclusion)
 * @returns English temperature expression
 *
 * @example
 * ```typescript
 * temperature('20℃');      // 'twenty degrees Celsius'
 * temperature('-5°C');     // 'minus five degrees Celsius'
 * temperature('68°F');     // 'sixty-eight degrees Fahrenheit'
 * temperature('273K');     // 'two hundred and seventy-three Kelvin'
 * temperature('36.5℃');    // 'thirty-six point five degrees Celsius'
 * ```
 */
export function temperature(input: string, options?: TemperatureOptions): string {
  const includeSpace = options?.includeSpace ?? true;
  const space = includeSpace ? ' ' : '';

  const trimmed = input.trim();
  if (trimmed === '') return input;

  // Temperature unit pattern matching
  const unitPattern = Object.keys(TEMP_UNITS)
    .sort((a, b) => b.length - a.length)
    .map((u) => u.replace(/[°℃℉]/g, (m) => '\\' + m))
    .join('|');

  const match = trimmed.match(new RegExp(`^([+-]?[\\d,]+(?:\\.\\d+)?)\\s*(${unitPattern})$`, 'i'));

  if (match) {
    const numStr = removeThousandSeparators(match[1] ?? '');
    const parsedUnit = match[2] ?? '';
    const unitWord = TEMP_UNITS[parsedUnit] ?? TEMP_UNITS[parsedUnit.toUpperCase()] ?? parsedUnit;

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

/**
 * Convert temperature range to English words
 *
 * @param input - Temperature range to convert
 * @returns English temperature range expression
 *
 * @example
 * ```typescript
 * temperatureRange('20℃~30℃'); // 'twenty degrees Celsius to thirty degrees Celsius'
 * temperatureRange('-5°C~10°C'); // 'minus five degrees Celsius to ten degrees Celsius'
 * ```
 */
export function temperatureRange(input: string): string {
  const trimmed = input.trim();
  if (trimmed === '') return input;

  // Split by ~ or -
  const parts = trimmed.split(/\s*[~]\s*/);
  if (parts.length === 2) {
    const temp1 = temperature(parts[0] ?? '');
    const temp2 = temperature(parts[1] ?? '');
    return temp1 + ' to ' + temp2;
  }

  return input;
}
