import { digitToKorean } from '../utils/number-to-korean';

/**
 * seat 함수의 옵션
 */
export interface SeatOptions {
  /**
   * 숫자 사이 구분자
   * @default ' . '
   */
  separator?: string;
}

/**
 * 좌석번호를 한글로 변환
 *
 * 좌석번호는 숫자를 개별로 읽습니다:
 * - 23A → 이 . 삼 A
 * - 15F → 일 . 오 F
 * - 7C → 칠 C
 *
 * @param input - 변환할 좌석번호 (문자열)
 * @param options - 옵션 (구분자)
 * @returns 한글 좌석번호 표현
 *
 * @example
 * ```typescript
 * seat('23A');   // '이 . 삼 A'
 * seat('15F');   // '일 . 오 F'
 * seat('7C');    // '칠 C'
 * ```
 */
export function seat(input: string, options?: SeatOptions): string {
  const separator = options?.separator ?? ' . ';

  const trimmed = input.trim();
  if (trimmed === '') return input;

  // 좌석번호 패턴 매칭: 숫자 1-3자리 + 영문 1자리
  const match = trimmed.match(/^(\d{1,3})([A-Za-z])$/);
  if (match) {
    const seatNum = match[1] ?? '';
    const seatLetter = (match[2] ?? '').toUpperCase();

    const parts: string[] = [];

    // 숫자를 개별로 변환
    const digits = seatNum.split('').map((d) => digitToKorean(d));
    parts.push(...digits);

    // 영문 문자 추가
    parts.push(seatLetter);

    return parts.join(separator);
  }

  return input;
}
