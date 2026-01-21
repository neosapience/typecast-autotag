import { numberToNativeKorean, digitToKorean } from '../utils/number-to-korean';

/**
 * jari 함수의 옵션
 */
export interface JariOptions {
  /**
   * 자리 수와 자리 사이 공백 포함 여부
   * @default false
   */
  includeSpaceBeforeJari?: boolean;

  /**
   * 후행 숫자 사이 구분자
   * @default ' . '
   */
  digitSeparator?: string;
}

/**
 * 숫자를 자리 수 고유어로 변환
 * 0 -> 영, 1 -> 한, 2 -> 두, 3 -> 세, 4 -> 네...
 */
function numberToJariKorean(num: number): string {
  if (num === 0) return '영';
  if (num < 0) return '마이너스 ' + numberToJariKorean(-num);

  // 고유어 수사 사용
  return numberToNativeKorean(num);
}

/**
 * 후행 숫자를 한자어 digit 방식으로 변환 (0=영)
 */
function digitsToKorean(digits: string, separator: string = ''): string {
  return digits
    .split('')
    .map((d) => {
      if (/\d/.test(d)) {
        return digitToKorean(d);
      }
      return d;
    })
    .join(separator);
}

/**
 * 자리 표현을 한글로 변환
 *
 * 자리 수는 고유어 수사로, 뒤따르는 숫자는 한자어 digit 방식으로 변환합니다.
 *
 * @param input - 변환할 자리 표현 (문자열)
 * @param options - 옵션
 * @returns 한글 자리 표현
 *
 * @example
 * ```typescript
 * jari('4자리');           // '네자리'
 * jari('4자리 5678');      // '네자리 오 . 육 . 칠 . 팔'
 * jari('끝 4자리 5678');   // '끝 네자리 오 . 육 . 칠 . 팔'
 * jari('1자리');           // '한자리'
 * jari('10자리');          // '열자리'
 * jari('13자리');          // '열세자리'
 * ```
 */
export function jari(input: string, options?: JariOptions): string {
  const includeSpaceBeforeJari = options?.includeSpaceBeforeJari ?? false;
  const digitSeparator = options?.digitSeparator ?? ' . ';

  const trimmed = input.trim();
  if (trimmed === '') return input;

  // N자리 (+ 선택적 후행 숫자) 패턴 매칭
  // 예: "4자리", "4자리 5678", "끝 4자리 5678"
  const match = trimmed.match(/^(.*?)(\d+)\s*자리(?:\s+(\d+))?(.*)$/);
  if (match) {
    const prefix = match[1] ?? '';
    const jariNumStr = match[2] ?? '';
    const trailingDigits = match[3] ?? '';
    const suffix = match[4] ?? '';

    const jariNum = parseInt(jariNumStr, 10);
    if (isNaN(jariNum)) return input;

    const jariKorean = numberToJariKorean(jariNum);
    const space = includeSpaceBeforeJari ? ' ' : '';

    let result = prefix + jariKorean + space + '자리';

    if (trailingDigits) {
      const trailingKorean = digitsToKorean(trailingDigits, digitSeparator);
      result += ' ' + trailingKorean;
    }

    result += suffix;

    return result;
  }

  return input;
}
