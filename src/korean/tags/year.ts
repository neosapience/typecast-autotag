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
 * 천단위 구분자 제거
 */
function removeThousandSeparators(str: string): string {
  return str.replace(/,/g, '');
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
 * year('2024년도'); // '이천이십사년도'
 * year('2,024년'); // '이천이십사년'
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

    // "2024년", "2024", "1994년생", "2024년도", "2,024년" 등의 형식 파싱
    const match = trimmed.match(/^([\d,]+)년?(도|생)?$/);
    if (match) {
      const numStr = removeThousandSeparators(match[1] ?? '');
      const num = parseInt(numStr, 10);
      const extraSuffix = match[2] ?? '';

      if (isNaN(num) || num < 0) {
        return String(input);
      }

      return numberToKorean(num) + suffix + extraSuffix;
    }

    return String(input);
  }

  // 숫자 처리
  if (isNaN(input)) {
    return String(input);
  }

  if (!isFinite(input)) {
    return String(input);
  }

  if (input < 0) {
    return String(input);
  }

  // 소수점 버림 처리
  const intInput = Math.floor(input);

  return numberToKorean(intInput) + suffix;
}
