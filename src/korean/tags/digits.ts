import { digitToKorean } from '../utils/number-to-korean';

/**
 * 숫자를 한 자리씩 끊어 읽는 형태로 변환
 *
 * @param input - 변환할 숫자 (문자열 또는 숫자)
 * @param separator - 숫자 사이 구분자 (기본값: ' ')
 * @returns 한 자리씩 구분된 한글 숫자
 *
 * @remarks
 * - 소수점(.)은 '쩜'으로 변환됩니다.
 * - 그 외 숫자가 아닌 문자(예: '-', 공백 등)는 변환 없이 그대로 유지됩니다.
 * - 각 문자 사이에 구분자가 삽입됩니다.
 *
 * @example
 * ```typescript
 * digits(123456);     // '일 이 삼 사 오 육'
 * digits('789');      // '칠 팔 구'
 * digits('007');      // '영 영 칠'
 * digits('-123');     // '- 일 이 삼'
 * digits('1.5');      // '일 쩜 오'
 * digits('123', '');  // '일이삼'
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
      if (char === '.') {
        return '쩜';
      }
      return char;
    })
    .join(separator);
}
