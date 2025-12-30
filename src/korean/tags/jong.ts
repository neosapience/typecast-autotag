import { numberToKorean } from '../utils/number-to-korean';

/**
 * jong 함수의 옵션
 */
export interface JongOptions {
  /**
   * 숫자와 단위 사이 공백 포함 여부
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
 * N종 (종류)를 한글로 변환
 *
 * 종류 표현에서는 한자어 수사를 사용합니다:
 * - 40종 → 사십 종
 * - 15종 → 십오 종
 *
 * @param input - 변환할 종류 (문자열)
 * @param options - 옵션 (공백 포함 여부)
 * @returns 한글 종류 표현
 *
 * @example
 * ```typescript
 * jong('40종');   // '사십 종'
 * jong('15종');   // '십오 종'
 * jong('100종');  // '백 종'
 * ```
 */
export function jong(input: string, options?: JongOptions): string {
  const includeSpace = options?.includeSpace ?? true;
  const space = includeSpace ? ' ' : '';

  const trimmed = input.trim();
  if (trimmed === '') return input;

  // N종 패턴 매칭
  const match = trimmed.match(/^([\d,]+)\s*종$/);
  if (match) {
    const numStr = removeThousandSeparators(match[1] ?? '');
    const num = parseInt(numStr, 10);

    if (isNaN(num) || num < 0) {
      return input;
    }

    if (num === 0) {
      return '영' + space + '종';
    }

    return numberToKorean(num) + space + '종';
  }

  return input;
}
