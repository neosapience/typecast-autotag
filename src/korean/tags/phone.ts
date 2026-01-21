import { digitToPhoneKorean, digitToPhoneticKorean } from '../utils/number-to-korean';

export interface PhoneOptions {
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
 * 하이픈 등 구분자를 제거하고, 각 숫자를 한글로 변환하여 ' . '로 구분
 *
 * @param input - 변환할 전화번호 (예: '010-2055-4783' 또는 '01020554783')
 * @param options - 추가 옵션
 * @returns 발음 교정된 전화번호
 *
 * @example
 * ```typescript
 * phone('010-3483-1810'); // '공 . 일 . 공 . 삼 . 사 . 팔 . 삼 . 일 . 팔 . 일 . 공'
 * phone('01020554783'); // '공 . 일 . 공 . 이 . 공 . 오 . 오 . 사 . 칠 . 팔 . 삼'
 * phone('02-1234-5678'); // '공 . 이 . 일 . 이 . 삼 . 사 . 오 . 육 . 칠 . 팔'
 * phone('1588-1234'); // '일 . 오 . 팔 . 팔 . 일 . 이 . 삼 . 사'
 * phone('112'); // '일 . 일 . 이'
 *
 * // 포네틱 코드 사용 (발음 혼동 방지)
 * phone('010-1234-5678', { usePhoneticCode: true });
 * // '공 . 하나 . 공 . 하나 . 둘 . 삼 . 넷 . 오 . 여섯 . 칠 . 팔'
 * ```
 */
export function phone(input: string, options?: PhoneOptions): string {
  // null, undefined, 빈 문자열 처리
  if (input == null || input.length === 0) {
    return input;
  }

  // 포네틱 코드 사용 여부 (기본값: false)
  const usePhoneticCode = options?.usePhoneticCode ?? false;
  const digitConverter = usePhoneticCode ? digitToPhoneticKorean : digitToPhoneKorean;

  // 모든 문자를 처리하여 결과 배열 생성
  const result = input
    .split('')
    .map((char): string | null => {
      // 숫자인 경우 한글로 변환
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
      // 하이픈, 점, 공백, 괄호는 제거
      if (char === '-' || char === '.' || char === ' ' || char === '(' || char === ')') {
        return null;
      }
      // 그 외 특수문자는 그대로 유지
      return char;
    })
    .filter((item): item is string => item !== null);

  // 결과가 없으면 원본 반환
  if (result.length === 0) {
    return input;
  }

  return result.join(' . ');
}
