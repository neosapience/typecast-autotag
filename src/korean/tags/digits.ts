import { digitToKorean } from '../utils/number-to-korean';

/**
 * 숫자를 한 자리씩 끊어 읽는 형태로 변환
 *
 * @param input - 변환할 숫자 (문자열 또는 숫자)
 * @param separator - 숫자 사이 구분자 (기본값: ' ')
 * @returns 한 자리씩 구분된 한글 숫자
 *
 * @example
 * ```typescript
 * digits(123456); // '일 이 삼 사 오 육'
 * digits('789'); // '칠 팔 구'
 * ```
 */
export function digits(input: number | string, separator: string = ' '): string {
  const str = String(input);

  if (!str || str.length === 0) {
    return str;
  }

  return str
    .split('')
    .map((char) => {
      if (/\d/.test(char)) {
        return digitToKorean(char);
      }
      return char;
    })
    .join(separator);
}
