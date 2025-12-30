import { digitToKorean, digitToPhoneticKorean } from '../utils/number-to-korean';

export interface DigitsOptions {
  /**
   * 숫자 사이 구분자
   * @default ' '
   */
  separator?: string;

  /**
   * 포네틱 코드 사용 여부
   * true: 1=하나, 2=둘, 3=삼, 4=넷, 5=오, 6=여섯, 7=칠, 8=팔, 9=아홉, 0=공
   * false: 0=영, 1=일, 2=이, 3=삼, 4=사, 5=오, 6=육, 7=칠, 8=팔, 9=구
   * @default false
   */
  usePhoneticCode?: boolean;
}

/**
 * 숫자를 한 자리씩 끊어 읽는 형태로 변환
 *
 * @param input - 변환할 숫자 (문자열 또는 숫자)
 * @param options - 구분자 문자열 또는 옵션 객체
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
 * digits('123', { separator: '' });  // '일이삼'
 *
 * // 포네틱 코드 사용 (발음 혼동 방지)
 * digits('1234', { usePhoneticCode: true }); // '하나 둘 삼 넷'
 * ```
 */
export function digits(input: number | string, options?: string | DigitsOptions): string {
  const str = String(input);

  if (!str || str.length === 0) {
    return str;
  }

  // 하위 호환성: 문자열이 전달되면 separator로 처리
  const opts: DigitsOptions =
    typeof options === 'string' ? { separator: options } : (options ?? {});

  const separator = opts.separator ?? ' ';
  const usePhoneticCode = opts.usePhoneticCode ?? false;
  const digitConverter = usePhoneticCode ? digitToPhoneticKorean : digitToKorean;

  return str
    .split('')
    .map((char) => {
      if (/\d/.test(char)) {
        return digitConverter(char);
      }
      if (char === '.') {
        return '쩜';
      }
      return char;
    })
    .join(separator);
}
