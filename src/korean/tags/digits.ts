/**
 * 숫자를 한 자리씩 끊어 읽는 형태로 변환
 * 숫자를 그대로 유지하고 각 자리 사이에 구분자를 삽입합니다.
 *
 * @param input - 변환할 숫자 (문자열 또는 숫자)
 * @param separator - 숫자 사이 구분자 (기본값: ' . ')
 * @returns 한 자리씩 구분된 숫자 문자열
 *
 * @example
 * ```typescript
 * digits('56901846001013'); // '5 . 6 . 9 . 0 . 1 . 8 . 4 . 6 . 0 . 0 . 1 . 0 . 1 . 3'
 * digits(123456);           // '1 . 2 . 3 . 4 . 5 . 6'
 * digits('789');            // '7 . 8 . 9'
 * digits('007');            // '0 . 0 . 7'
 * digits('123', '');        // '123'
 * digits('123', ' ');       // '1 2 3'
 * ```
 */
export function digits(input: number | string, separator: string = ' . '): string {
  const str = String(input);

  if (!str || str.length === 0) {
    return str;
  }

  return str.split('').join(separator);
}
