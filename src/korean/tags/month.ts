import { numberToKorean } from '../utils/number-to-korean';

/**
 * 월 발음 불규칙 처리 (국립국어원 표준 발음법)
 * - 6월: 육월 → 유월
 * - 10월: 십월 → 시월
 */
const IRREGULAR_MONTHS: Record<number, string> = {
  6: '유월',
  10: '시월',
};

/**
 * 월 숫자를 한글 월 표기로 변환
 *
 * @param input - 변환할 월 (숫자 또는 문자열)
 * @returns 한글 월 표기
 *
 * @remarks
 * 6월은 '유월', 10월은 '시월'로 변환됩니다 (표준 발음법)
 *
 * @example
 * ```typescript
 * month(12); // '십이월'
 * month('6'); // '유월'
 * month(10); // '시월'
 * month(1); // '일월'
 * ```
 */
export function month(input: number | string): string {
  const num = typeof input === 'string' ? parseInt(input, 10) : Math.floor(input);

  if (isNaN(num) || num < 1 || num > 12) {
    return String(input);
  }

  // 불규칙 발음 처리
  if (IRREGULAR_MONTHS[num]) {
    return IRREGULAR_MONTHS[num];
  }

  return numberToKorean(num) + '월';
}
