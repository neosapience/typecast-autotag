import { numberToKorean } from '../utils/number-to-korean';

/**
 * year 함수의 옵션
 */
export interface YearOptions {
  /**
   * '년' 접미사 포함 여부
   * @default true
   */
  includeSuffix?: boolean;

  /**
   * 숫자와 '년' 사이 공백 포함 여부
   * @default false
   */
  includeSpace?: boolean;
}

/**
 * 년도를 한글로 변환
 *
 * @param input - 변환할 년도 (숫자 또는 문자열)
 * @param options - 옵션 (접미사 포함 여부, 공백 포함 여부)
 * @returns 한글 년도 표현
 *
 * @example
 * ```typescript
 * year(2024); // '이천이십사년'
 * year(1994); // '천구백구십사년'
 * year('2024년'); // '이천이십사년'
 * year(2024, { includeSuffix: false }); // '이천이십사'
 * year(2024, { includeSpace: true }); // '이천이십사 년'
 * year(2000); // '이천년'
 * ```
 */
export function year(input: number | string, options?: YearOptions): string {
  const includeSuffix = options?.includeSuffix ?? true;
  const includeSpace = options?.includeSpace ?? false;
  const space = includeSpace ? ' ' : '';
  const suffix = includeSuffix ? space + '년' : '';

  // 문자열 처리
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (trimmed === '') return input;

    // "2024년", "2024", "1994년생" 등의 형식 파싱
    const match = trimmed.match(/^(\d+)년?(생)?$/);
    if (match) {
      const num = parseInt(match[1] ?? '', 10);
      const hasBirthSuffix = match[2] === '생';

      if (isNaN(num) || num < 0) {
        return String(input);
      }

      const koreanYear = numberToKorean(num) + suffix;
      return hasBirthSuffix ? koreanYear + '생' : koreanYear;
    }

    return String(input);
  }

  // 숫자 처리
  if (isNaN(input) || input < 0) {
    return String(input);
  }

  return numberToKorean(input) + suffix;
}
