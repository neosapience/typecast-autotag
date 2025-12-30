import { numberToKorean } from '../utils/number-to-korean';

/**
 * 일 숫자를 한글 일 표기로 변환
 *
 * @param input - 변환할 일 (숫자 또는 문자열)
 * @returns 한글 일 표기
 *
 * @example
 * ```typescript
 * day(25); // '이십오일'
 * day('1'); // '일일'
 * day(15); // '십오일'
 * ```
 */
export function day(input: number | string): string {
  const num = typeof input === 'string' ? parseInt(input, 10) : input;

  if (isNaN(num) || num < 1 || num > 31) {
    return String(input);
  }

  return numberToKorean(num) + '일';
}
