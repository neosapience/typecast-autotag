import { digitToKorean } from '../utils/number-to-korean';

/**
 * carNumber 함수의 옵션
 */
export interface CarNumberOptions {
  /**
   * 숫자 사이 구분자
   * @default ' '
   */
  separator?: string;
}

/**
 * 차량번호를 한글로 변환
 *
 * 차량번호는 숫자를 개별로 읽습니다:
 * - 12가 3456 → 일 이 가 삼 사 오 육
 * - 123가1234 → 일 이 삼 가 일 이 삼 사
 * - 서울12가3456 → 서울 일 이 가 삼 사 오 육
 *
 * @param input - 변환할 차량번호 (문자열)
 * @param options - 옵션 (구분자)
 * @returns 한글 차량번호 표현
 *
 * @example
 * ```typescript
 * carNumber('12가 3456');     // '일 이 가 삼 사 오 육'
 * carNumber('123가1234');     // '일 이 삼 가 일 이 삼 사'
 * carNumber('서울12가3456');  // '서울 일 이 가 삼 사 오 육'
 * ```
 */
export function carNumber(input: string, options?: CarNumberOptions): string {
  const separator = options?.separator ?? ' ';

  const trimmed = input.trim();
  if (trimmed === '') return input;

  // 차량번호 패턴 매칭
  // - 지역명(선택) + 숫자2-3자리 + 한글1자 + 공백(선택) + 숫자4자리
  const match = trimmed.match(/^([가-힣]*)\s*(\d{2,3})([가-힣])\s*(\d{4})$/);
  if (match) {
    const region = match[1] ?? '';
    const frontNum = match[2] ?? '';
    const letter = match[3] ?? '';
    const backNum = match[4] ?? '';

    const parts: string[] = [];

    // 지역명이 있으면 그대로 추가
    if (region) {
      parts.push(region);
    }

    // 앞 숫자를 개별로 변환
    const frontDigits = frontNum.split('').map((d) => digitToKorean(d));
    parts.push(...frontDigits);

    // 한글 문자 추가
    parts.push(letter);

    // 뒤 숫자를 개별로 변환
    const backDigits = backNum.split('').map((d) => digitToKorean(d));
    parts.push(...backDigits);

    return parts.join(separator);
  }

  return input;
}
