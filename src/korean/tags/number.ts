import { numberToKorean } from '../utils/number-to-korean';

/**
 * number 함수의 옵션
 */
export interface NumberTagOptions {
  /**
   * 번호 접미사 (기본값: '번')
   * @default '번'
   */
  suffix?: string;

  /**
   * 숫자와 접미사 사이 공백 포함 여부
   * @default true
   */
  includeSpace?: boolean;
}

/**
 * 천단위 구분자 제거
 */
function removeThousandSeparators(str: string): string {
  return str.replace(/,/g, '');
}

/**
 * 번호를 한글로 변환
 *
 * 숫자 + 번 형식을 한자어로 변환합니다.
 * 순서(번째, 등, 위)와 달리 단순 번호를 나타냅니다.
 *
 * @param input - 변환할 번호 (숫자 또는 문자열)
 * @param options - 옵션
 * @returns 한글 번호 표현
 *
 * @example
 * ```typescript
 * numberTag(1);        // '일 번'
 * numberTag(2);        // '이 번'
 * numberTag('3번');    // '삼 번'
 * numberTag('10번');   // '십 번'
 * numberTag('1번');    // '일 번'
 * ```
 */
export function numberTag(input: number | string, options?: NumberTagOptions): string {
  const suffix = options?.suffix ?? '번';
  const includeSpace = options?.includeSpace ?? true;
  const space = includeSpace && suffix !== '' ? ' ' : '';

  // 문자열 처리
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (trimmed === '') return input;

    // "1번", "10번" 등의 형식 파싱
    const match = trimmed.match(/^(-?[\d,]+)\s*번$/);
    if (match) {
      const numStr = removeThousandSeparators(match[1] ?? '');
      const num = parseInt(numStr, 10);

      if (isNaN(num)) {
        return String(input);
      }

      if (num < 0) {
        const absResult = numberTag(-num, { suffix, includeSpace });
        return '마이너스 ' + absResult;
      }

      if (num === 0) {
        return '영' + space + suffix;
      }

      return numberToKorean(num) + space + suffix;
    }

    // 숫자만 있는 경우 (번 접미사 없이)
    const numOnlyMatch = trimmed.match(/^(-?[\d,]+)$/);
    if (numOnlyMatch) {
      const numStr = removeThousandSeparators(numOnlyMatch[1] ?? '');
      const num = parseInt(numStr, 10);

      if (isNaN(num)) {
        return String(input);
      }

      if (num < 0) {
        return '마이너스 ' + numberToKorean(-num) + space + suffix;
      }

      if (num === 0) {
        return '영' + space + suffix;
      }

      return numberToKorean(num) + space + suffix;
    }

    return String(input);
  }

  // 숫자 처리
  if (isNaN(input)) {
    return '숫자가 아닙니다';
  }

  if (!isFinite(input)) {
    return input > 0 ? '무한대' : '마이너스 무한대';
  }

  if (input < 0) {
    return '마이너스 ' + numberTag(-input, options);
  }

  if (input === 0) {
    return '영' + space + suffix;
  }

  return numberToKorean(input) + space + suffix;
}
