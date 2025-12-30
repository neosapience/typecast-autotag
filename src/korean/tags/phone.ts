import { digitToPhoneKorean, digitToPhoneticKorean } from '../utils/number-to-korean';

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

  /**
   * 포네틱 코드 사용 여부
   * true: 1=하나, 2=둘, 3=삼, 4=넷, 5=오, 6=여섯, 7=칠, 8=팔, 9=아홉, 0=공
   * false: 1=일, 2=이, 3=삼, 4=사, 5=오, 6=육, 7=칠, 8=팔, 9=구, 0=공
   * @default false
   */
  usePhoneticCode?: boolean;
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
 *
 * // 포네틱 코드 사용 (발음 혼동 방지)
 * phone('010-1234-5678', { usePhoneticCode: true });
 * // '공 하나 공 다시 하나 둘 삼 넷 다시 오 여섯 칠 팔'
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

  // 포네틱 코드 사용 여부 (기본값: false)
  const usePhoneticCode = options?.usePhoneticCode ?? false;
  const digitConverter = usePhoneticCode ? digitToPhoneticKorean : digitToPhoneKorean;

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
          return digitConverter(char);
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
