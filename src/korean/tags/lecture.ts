import { numberToKorean } from '../utils/number-to-korean';

/**
 * lecture 함수의 옵션
 */
export interface LectureOptions {
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
 * 강의수를 한글로 변환
 *
 * 강의수는 한자어 수사를 사용합니다:
 * - 26강 → 이십육 강
 * - 40강 → 사십 강
 * - 100강 → 백 강
 *
 * @param input - 변환할 강의수 (문자열)
 * @param options - 옵션 (공백 포함 여부)
 * @returns 한글 강의수 표현
 *
 * @example
 * ```typescript
 * lecture('26강');    // '이십육 강'
 * lecture('40강');    // '사십 강'
 * lecture('100강');   // '백 강'
 * lecture('1강');     // '일 강'
 * ```
 */
export function lecture(input: string, options?: LectureOptions): string {
  const includeSpace = options?.includeSpace ?? true;
  const space = includeSpace ? ' ' : '';

  const trimmed = input.trim();
  if (trimmed === '') return input;

  // N강 패턴 매칭
  const match = trimmed.match(/^([\d,]+)\s*강$/);
  if (match) {
    const numStr = removeThousandSeparators(match[1] ?? '');
    const num = parseInt(numStr, 10);

    if (isNaN(num) || num < 0) {
      return input;
    }

    if (num === 0) {
      return '영' + space + '강';
    }

    return numberToKorean(num) + space + '강';
  }

  return input;
}
