import { numberToKorean } from '../utils/number-to-korean';

/**
 * 월 숫자를 한글 월 표기로 변환
 *
 * @param input - 변환할 월 (숫자 또는 문자열)
 * @returns 한글 월 표기
 *
 * @example
 * ```typescript
 * month(12); // '십이월'
 * month('6'); // '육월'
 * month(1); // '일월'
 * ```
 */
export function month(input: number | string): string {
  const num = typeof input === 'string' ? parseInt(input, 10) : input;

  if (isNaN(num) || num < 1 || num > 12) {
    return String(input);
  }

  return numberToKorean(num) + '월';
}
