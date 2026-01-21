import { digitToPhoneKorean } from '../utils/number-to-korean';

/**
 * 숫자를 한 자리씩 끊어 한글로 변환
 * 각 숫자를 한글로 변환하고 구분자로 연결합니다.
 *
 * @param input - 변환할 숫자 (문자열 또는 숫자)
 * @param separator - 숫자 사이 구분자 (기본값: ' . ')
 * @returns 한글로 변환된 숫자 문자열
 *
 * @example
 * ```typescript
 * digits('56901846001013'); // '오 . 육 . 구 . 공 . 일 . 팔 . 사 . 육 . 공 . 공 . 일 . 공 . 일 . 삼'
 * digits(123456);           // '일 . 이 . 삼 . 사 . 오 . 육'
 * digits('789');            // '칠 . 팔 . 구'
 * digits('007');            // '공 . 공 . 칠'
 * digits('123', '');        // '일이삼'
 * digits('123', ' ');       // '일 이 삼'
 * ```
 */
export function digits(input: number | string, separator: string = ' . '): string {
  const str = String(input);

  if (!str || str.length === 0) {
    return str;
  }

  return str
    .split('')
    .map((char) => digitToPhoneKorean(char))
    .join(separator);
}
