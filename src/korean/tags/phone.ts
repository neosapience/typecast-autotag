import { digitToPhoneKorean } from '../utils/number-to-korean';

export interface PhoneOptions {
  /**
   * 입력 전화번호의 구분자 패턴
   * @default /[-.\s]+/ (하이픈, 점, 공백)
   */
  inputDelimiters?: RegExp;

  /**
   * 번호 그룹 사이에 '다시'를 포함할지 여부
   * @default true
   */
  includeSeparatorWord?: boolean;
}

/**
 * 전화번호를 발음하기 좋은 형태로 변환
 *
 * @param input - 변환할 전화번호 (예: '010-2055-4783')
 * @param options - 추가 옵션
 * @returns 발음 교정된 전화번호
 *
 * @example
 * ```typescript
 * phone('010-2055-4783'); // '공 일 공 다시 이 공 오 오 다시 사 칠 팔 삼'
 * phone('02-1234-5678'); // '공 이 다시 일 이 삼 사 다시 오 육 칠 팔'
 * phone('1588-1234'); // '일 오 팔 팔 다시 일 이 삼 사'
 * phone('1588-1234', { includeSeparatorWord: false }); // '일 오 팔 팔 일 이 삼 사'
 * phone('112'); // '일 일 이'
 * ```
 */
export function phone(input: string, options?: PhoneOptions): string {
  // null, undefined, 빈 문자열 처리
  if (input == null || input.length === 0) {
    return input;
  }

  // 기본: 하이픈, 점, 공백을 구분자로 인식
  const delimiters = options?.inputDelimiters ?? /[-.\s]+/;

  // '다시' 포함 여부 (기본값: true)
  const includeSeparatorWord = options?.includeSeparatorWord ?? true;
  const separator = includeSeparatorWord ? ' 다시 ' : ' ';

  // 구분자로 분리 (구분자가 없으면 전체를 하나의 그룹으로)
  const groups = input.split(delimiters).filter((group) => group.length > 0);

  // 그룹이 없으면 원본 반환
  if (groups.length === 0) {
    return input;
  }

  const convertedGroups = groups.map((group) => {
    return group
      .split('')
      .map((char): string | null => {
        // 숫자인 경우 변환
        if (/\d/.test(char)) {
          return digitToPhoneKorean(char);
        }
        // 특수문자 발음 변환
        if (char === '#') {
          return '우물정자';
        }
        if (char === '*') {
          return '별표';
        }
        if (char === '+') {
          return '플러스';
        }
        // 괄호는 제거 (TTS에서 불필요)
        if (char === '(' || char === ')') {
          return null;
        }
        // 그 외 특수문자는 그대로 유지
        return char;
      })
      .filter((item): item is string => item !== null)
      .join(' ');
  });

  return convertedGroups.join(separator);
}
