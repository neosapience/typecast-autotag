/**
 * typecast-autotag
 *
 * Text preprocessing SDK for Typecast TTS API.
 * Automatically converts phone numbers, dates, names, and other patterns
 * into speech-friendly formats for AICC environments.
 */

/**
 * Options for the convertScript function.
 */
export interface ConvertOptions {
  /**
   * Custom separator for name conversion.
   * @default ' '
   */
  nameSeparator?: string;

  /**
   * Custom separator for phone number segments.
   * @default ' 다시 '
   */
  phoneSeparator?: string;

  /**
   * Custom separator for digit-by-digit reading.
   * @default ' '
   */
  digitSeparator?: string;
}

/**
 * Converts tagged script text into speech-friendly format.
 *
 * Supported tags:
 * - `name(이름)` - Reads name character by character
 * - `phone(번호)` - Converts phone number to speech-friendly format
 * - `month(월)` - Converts to Korean month format
 * - `day(일)` - Converts to Korean day format
 * - `date(날짜)` - Converts birth date to Korean format
 * - `minsec(분초)` - Converts waiting time format
 * - `digits(숫자)` - Reads digits one by one
 *
 * @param input - The input text containing tags to convert
 * @param options - Optional conversion options
 * @returns The converted text with all tags processed
 *
 * @example
 * ```typescript
 * const result = convertScript('name(김형우) 고객님');
 * // Returns: '김 형 우 고객님'
 * ```
 */
export function convertScript(input: string, _options?: ConvertOptions): string {
  // TODO: Implement tag parsing and conversion logic
  return input;
}

/**
 * Options for the autoConvert function.
 */
export interface AutoConvertOptions {
  /**
   * Enable automatic phone number detection and conversion.
   * @default true
   */
  phone?: boolean;

  /**
   * Enable automatic date pattern detection and conversion.
   * @default true
   */
  date?: boolean;

  /**
   * Enable automatic name pattern detection and conversion.
   * @default false
   */
  name?: boolean;

  /**
   * Enable automatic account/card number detection and conversion.
   * @default false
   */
  account?: boolean;
}

/**
 * Automatically detects and converts patterns in text to speech-friendly format.
 * This function uses pattern recognition to identify phone numbers, dates, etc.
 * without requiring explicit tags.
 *
 * @param input - The input text to process
 * @param options - Options to control which patterns to detect and convert
 * @returns The converted text with detected patterns processed
 *
 * @example
 * ```typescript
 * const result = autoConvert('010-2055-4783으로 연락주세요', { phone: true });
 * // Returns: '공일공 다시 이공오오 다시 사칠팔삼으로 연락주세요'
 * ```
 */
export function autoConvert(input: string, _options?: AutoConvertOptions): string {
  // TODO: Implement automatic pattern detection and conversion
  return input;
}
