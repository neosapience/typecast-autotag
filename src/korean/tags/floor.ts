import { numberToKorean } from '../utils/number-to-korean';

/**
 * floor 함수의 옵션
 */
export interface FloorOptions {
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
 * 층수를 한글로 변환
 *
 * 층수 표현에서는 한자어 수사를 사용합니다:
 * - 3층 → 삼 층
 * - 10층 → 십 층
 * - B1층 → 지하 일 층
 * - 지하1층 → 지하 일 층
 *
 * @param input - 변환할 층수 (숫자 또는 문자열)
 * @param options - 옵션 (공백 포함 여부)
 * @returns 한글 층수 표현
 *
 * @remarks
 * - 지하층은 "B1층" 또는 "지하1층" 형식 모두 지원
 * - 음수는 지하층으로 해석하지 않고 원본 반환
 *
 * @example
 * ```typescript
 * floor('3층');      // '삼 층'
 * floor('10층');     // '십 층'
 * floor('B1층');     // '지하 일 층'
 * floor('B2층');     // '지하 이 층'
 * floor('지하1층');  // '지하 일 층'
 * floor('지하2층');  // '지하 이 층'
 * floor(5);          // '오 층'
 * ```
 */
export function floor(input: number | string, options?: FloorOptions): string {
  const includeSpace = options?.includeSpace ?? true;
  const space = includeSpace ? ' ' : '';

  // 문자열 처리
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (trimmed === '') return input;

    // B1층, B2층 등 (영문 B로 시작하는 지하층)
    const basementMatchB = trimmed.match(/^[Bb]([0-9]+)\s*층$/);
    if (basementMatchB) {
      const numStr = basementMatchB[1] ?? '';
      const num = parseInt(numStr, 10);

      if (isNaN(num) || num <= 0) {
        return String(input);
      }

      return '지하' + space + numberToKorean(num) + space + '층';
    }

    // 지하1층, 지하2층 등 (한글 "지하"로 시작)
    const basementMatchKo = trimmed.match(/^지하\s*([0-9]+)\s*층$/);
    if (basementMatchKo) {
      const numStr = basementMatchKo[1] ?? '';
      const num = parseInt(numStr, 10);

      if (isNaN(num) || num <= 0) {
        return String(input);
      }

      return '지하' + space + numberToKorean(num) + space + '층';
    }

    // 일반 층수: N층
    const match = trimmed.match(/^([0-9,]+)\s*층$/);
    if (match) {
      const numStr = removeThousandSeparators(match[1] ?? '');
      const num = parseInt(numStr, 10);

      if (isNaN(num) || num < 0) {
        return String(input);
      }

      if (num === 0) {
        return '영' + space + '층';
      }

      return numberToKorean(num) + space + '층';
    }

    return String(input);
  }

  // 숫자 처리
  if (isNaN(input) || !isFinite(input)) {
    return String(input);
  }

  if (input < 0) {
    // 음수는 지하층으로 해석
    return '지하' + space + numberToKorean(-input) + space + '층';
  }

  if (input === 0) {
    return '영' + space + '층';
  }

  return numberToKorean(input) + space + '층';
}
