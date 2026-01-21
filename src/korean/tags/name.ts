/**
 * 이름을 한 글자씩 끊어 읽는 형태로 변환
 * - 한글, 숫자, 특수문자: 글자별로 분리
 * - 영문: 연속된 영문은 하나의 단어로 유지
 *
 * @param input - 변환할 이름
 * @param separator - 글자 사이 구분자 (기본값: ' . ')
 * @returns 글자별로 구분된 이름
 *
 * @example
 * ```typescript
 * name('김형우'); // '김 . 형 . 우'
 * name('홍길동', ', '); // '홍, 길, 동'
 * name('김John'); // '김 . John'
 * name(' 김 형우 '); // '김 . 형 . 우' (공백 정규화)
 * ```
 */
export function name(input: string, separator: string = ' . '): string {
  if (!input || input.length === 0) {
    return input;
  }

  // 앞뒤 공백 제거 및 내부 공백 정규화
  const normalized = input.trim().replace(/\s+/g, '');

  if (normalized.length === 0) {
    return '';
  }

  const tokens: string[] = [];
  let englishBuffer = '';

  for (const char of normalized) {
    if (/[a-zA-Z]/.test(char)) {
      // 영문은 버퍼에 누적
      englishBuffer += char;
    } else {
      // 영문이 아닌 문자가 나오면 버퍼를 먼저 비움
      if (englishBuffer) {
        tokens.push(englishBuffer);
        englishBuffer = '';
      }
      // 한글, 숫자, 특수문자는 개별 토큰으로 추가
      tokens.push(char);
    }
  }

  // 남은 영문 버퍼 처리
  if (englishBuffer) {
    tokens.push(englishBuffer);
  }

  return tokens.join(separator);
}
