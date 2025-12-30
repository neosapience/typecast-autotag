/**
 * 이름을 한 글자씩 끊어 읽는 형태로 변환
 *
 * @param input - 변환할 이름
 * @param separator - 글자 사이 구분자 (기본값: ' ')
 * @returns 글자별로 구분된 이름
 *
 * @example
 * ```typescript
 * name('김형우'); // '김 형 우'
 * name('홍길동', ' '); // '홍 길 동'
 * ```
 */
export function name(input: string, separator: string = ' '): string {
  if (!input || input.length === 0) {
    return input;
  }

  return input.split('').join(separator);
}
