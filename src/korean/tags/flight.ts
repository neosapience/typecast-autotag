import { digitToPhoneKorean } from '../utils/number-to-korean';

/**
 * flight 함수의 옵션
 */
export interface FlightOptions {
  /**
   * 숫자 사이 구분자
   * @default ' . '
   */
  separator?: string;
}

/**
 * 항공편 번호를 한글로 변환
 *
 * 항공편 번호는 숫자를 개별로 읽습니다:
 * - OZ301 → OZ 삼 . 공 . 일
 * - KE123 → KE 일 . 이 . 삼
 * - OZ751 → OZ 칠 . 오 . 일
 *
 * @param input - 변환할 항공편 번호 (문자열)
 * @param options - 옵션 (구분자)
 * @returns 한글 항공편 번호 표현
 *
 * @example
 * ```typescript
 * flight('OZ301');   // 'OZ 삼 . 공 . 일'
 * flight('KE123');   // 'KE 일 . 이 . 삼'
 * flight('OZ751');   // 'OZ 칠 . 오 . 일'
 * ```
 */
export function flight(input: string, options?: FlightOptions): string {
  const separator = options?.separator ?? ' . ';

  const trimmed = input.trim();
  if (trimmed === '') return input;

  // 항공편 패턴 매칭: 영문 2-3자리 + 숫자 1-4자리
  const match = trimmed.match(/^([A-Za-z]{2,3})(\d{1,4})$/);
  if (match) {
    const airline = (match[1] ?? '').toUpperCase();
    const flightNum = match[2] ?? '';

    const parts: string[] = [airline];

    // 숫자를 개별로 변환
    const digits = flightNum.split('').map((d) => digitToPhoneKorean(d));
    parts.push(...digits);

    return parts.join(separator);
  }

  return input;
}
