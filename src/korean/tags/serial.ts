import { digitToPhoneKorean } from '../utils/number-to-korean';

/**
 * serial 함수의 옵션
 */
export interface SerialOptions {
  /**
   * 숫자 사이 구분자
   * @default ' '
   */
  separator?: string;
}

/**
 * 일련번호/코드를 한글로 변환
 *
 * 일련번호는 숫자를 개별로 읽습니다:
 * - TSP-2024-001 → 티에스피 다시 이 공 이 사 다시 공 공 일
 * - 20240115-0042 → 이 공 이 사 공 일 일 오 다시 공 공 사 이
 *
 * @param input - 변환할 일련번호 (문자열)
 * @param options - 옵션 (구분자)
 * @returns 한글 일련번호 표현
 *
 * @example
 * ```typescript
 * serial('TSP-2024-001');        // 'TSP 다시 이 공 이 사 다시 공 공 일'
 * serial('20240115-0042');       // '이 공 이 사 공 일 일 오 다시 공 공 사 이'
 * serial('RX-20240115-1234');    // 'RX 다시 이 공 이 사 공 일 일 오 다시 일 이 삼 사'
 * ```
 */
export function serial(input: string, options?: SerialOptions): string {
  const separator = options?.separator ?? ' ';

  const trimmed = input.trim();
  if (trimmed === '') return input;

  // 각 문자를 변환
  const result: string[] = [];

  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed[i];
    if (char === undefined) continue;

    if (/\d/.test(char)) {
      // 숫자는 개별로 읽기
      result.push(digitToPhoneKorean(char));
    } else if (char === '-') {
      // 하이픈은 "다시"로 변환
      result.push('다시');
    } else if (char === '.') {
      // 점은 "쩜"으로 변환
      result.push('쩜');
    } else if (char === '_') {
      // 언더스코어는 건너뛰거나 공백 처리
      result.push('');
    } else if (/[A-Za-z]/.test(char)) {
      // 영문자는 그대로 유지 (연속된 영문자는 하나로 묶음)
      if (result.length > 0 && /^[A-Za-z]+$/.test(result[result.length - 1] ?? '')) {
        result[result.length - 1] += char.toUpperCase();
      } else {
        result.push(char.toUpperCase());
      }
    } else {
      // 기타 문자는 그대로 유지
      result.push(char);
    }
  }

  // 빈 문자열 제거하고 구분자로 연결
  return result.filter((s) => s !== '').join(separator);
}

/**
 * 일련번호에서 숫자 부분과 하이픈을 변환
 *
 * @param input - 변환할 일련번호 (문자열)
 * @param options - 옵션 (구분자)
 * @returns 숫자와 하이픈이 변환된 문자열
 *
 * @example
 * ```typescript
 * serialNumbersOnly('모델번호: TSP-2024-001');
 * // '모델번호: TSP 다시 이 공 이 사 다시 공 공 일'
 * serialNumbersOnly('계좌번호: 123-45-678901');
 * // '계좌번호: 일 이 삼 다시 사 오 다시 육 칠 팔 구 공 일'
 * ```
 */
export function serialNumbersOnly(input: string, options?: SerialOptions): string {
  const separator = options?.separator ?? ' ';

  const trimmed = input.trim();
  if (trimmed === '') return input;

  // 숫자 연속 부분을 찾아서 개별 숫자로 변환
  let result = trimmed.replace(/\d+/g, (match) => {
    return match
      .split('')
      .map((d) => digitToPhoneKorean(d))
      .join(separator);
  });

  // 하이픈을 "다시"로 변환 (숫자/한글 사이의 하이픈만)
  result = result.replace(/([가-힣\d])\s*-\s*([가-힣\d])/g, '$1 다시 $2');

  return result;
}
