import { digitToKorean } from '../utils/number-to-korean';

/**
 * roomNumber 함수의 옵션
 */
export interface RoomNumberOptions {
  /**
   * 숫자 사이 구분자
   * @default ' '
   */
  separator?: string;
}

/**
 * 호실 번호를 한글로 변환
 *
 * 호실 번호는 숫자를 개별로 읽습니다:
 * - 1205호 → 일 이 공 오 호
 * - 302호 → 삼 공 이 호
 *
 * @param input - 변환할 호실 번호 (문자열)
 * @param options - 옵션 (구분자)
 * @returns 한글 호실 번호 표현
 *
 * @example
 * ```typescript
 * roomNumber('1205호');  // '일 이 공 오 호'
 * roomNumber('302호');   // '삼 공 이 호'
 * roomNumber('501');     // '오 공 일'
 * ```
 */
export function roomNumber(input: string, options?: RoomNumberOptions): string {
  const separator = options?.separator ?? ' ';

  const trimmed = input.trim();
  if (trimmed === '') return input;

  // N호 패턴 매칭
  const matchWithHo = trimmed.match(/^(\d+)\s*호$/);
  if (matchWithHo) {
    const numStr = matchWithHo[1] ?? '';
    const digits = numStr.split('').map((d) => digitToKorean(d));
    return digits.join(separator) + separator + '호';
  }

  // 숫자만 있는 경우
  const matchNumberOnly = trimmed.match(/^(\d+)$/);
  if (matchNumberOnly) {
    const numStr = matchNumberOnly[1] ?? '';
    const digits = numStr.split('').map((d) => digitToKorean(d));
    return digits.join(separator);
  }

  return input;
}
