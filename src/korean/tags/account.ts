import { digitToKorean } from '../utils/number-to-korean';

export interface AccountOptions {
  /**
   * 번호 그룹 사이에 '다시'를 포함할지 여부
   * @default true
   */
  includeSeparatorWord?: boolean;
}

/**
 * 계좌번호를 발음하기 좋은 형태로 변환
 *
 * @param input - 변환할 계좌번호 (예: '123-456-789012')
 * @param options - 추가 옵션
 * @returns 발음 교정된 계좌번호
 *
 * @example
 * ```typescript
 * account('123-456-789012'); // '일 이 삼 다시 사 오 육 다시 칠 팔 구 공 일 이'
 * account('110-123-456789'); // '일 일 공 다시 일 이 삼 다시 사 오 육 칠 팔 구'
 * account('123-456-789012', { includeSeparatorWord: false }); // '일 이 삼 사 오 육 칠 팔 구 공 일 이'
 * ```
 */
export function account(input: string, options?: AccountOptions): string {
  // null, undefined, 빈 문자열 처리
  if (input == null || input.length === 0) {
    return input;
  }

  // '다시' 포함 여부 (기본값: true)
  const includeSeparatorWord = options?.includeSeparatorWord ?? true;
  const separator = includeSeparatorWord ? ' 다시 ' : ' ';

  // 하이픈으로 분리
  const groups = input.split(/-/).filter((group) => group.length > 0);

  // 그룹이 없으면 원본 반환
  if (groups.length === 0) {
    return input;
  }

  const convertedGroups = groups.map((group) => {
    return group
      .split('')
      .map((char): string => {
        // 숫자인 경우 변환
        if (/\d/.test(char)) {
          return digitToKorean(char);
        }
        // 그 외 문자는 그대로 유지
        return char;
      })
      .join(' ');
  });

  return convertedGroups.join(separator);
}
