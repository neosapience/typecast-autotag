import { numberToOrdinalKorean, numberToKorean } from '../utils/number-to-korean';

/**
 * order 함수의 옵션
 */
export interface OrderOptions {
  /**
   * 서수 접미사 (기본값: '번째')
   * @default '번째'
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
 * 순서(서수)를 한글로 변환
 *
 * 한국어에서 순서를 나타낼 때는 고유어 수사 + '번째'를 사용합니다:
 * - 1번째: 첫 번째
 * - 2번째: 두 번째
 * - 3번째: 세 번째
 * - 100 이상: 한자어 + 번째
 *
 * @param input - 변환할 순서 (숫자 또는 문자열)
 * @param options - 옵션 (접미사, 공백 포함 여부)
 * @returns 서수 표현
 *
 * @example
 * ```typescript
 * order(1); // '첫 번째'
 * order(2); // '두 번째'
 * order(3); // '세 번째'
 * order(10); // '열 번째'
 * order(21); // '스물한 번째'
 * order(100); // '백 번째'
 * order('1번째'); // '첫 번째'
 * order('3등'); // '세 등'
 * order(2, { suffix: '등' }); // '두 등'
 * order(1, { suffix: '위' }); // '첫 위'
 * ```
 */
export function order(input: number | string, options?: OrderOptions): string {
  const suffix = options?.suffix ?? '번째';
  const includeSpace = options?.includeSpace ?? true;
  // 접미사가 비어있으면 공백도 제거
  const space = includeSpace && suffix !== '' ? ' ' : '';

  // 문자열 처리
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (trimmed === '') return input;

    // "1번째", "3등", "5위", "-1번째" 등의 형식 파싱
    const match = trimmed.match(/^(-?[\d,]+)\s*(.*)$/);
    if (match) {
      const numStr = removeThousandSeparators(match[1] ?? '');
      const num = parseInt(numStr, 10);
      const parsedSuffix = match[2] || suffix;

      if (isNaN(num)) {
        return String(input);
      }

      if (num < 0) {
        const absResult = order(-num, { suffix: parsedSuffix, includeSpace });
        return '마이너스 ' + absResult;
      }

      if (num === 0) {
        return '영' + space + parsedSuffix;
      }

      // 1은 특별 처리: "첫 번째"
      // 21, 31 등은 "스물한 번째"로 처리 (numberToOrdinalKorean에서 처리)
      const koreanNum = num < 100 ? numberToOrdinalKorean(num) : numberToKorean(num);
      return koreanNum + space + parsedSuffix;
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
    return '마이너스 ' + order(-input, options);
  }

  if (input === 0) {
    return '영' + space + suffix;
  }

  const koreanNum = input < 100 ? numberToOrdinalKorean(input) : numberToKorean(input);
  return koreanNum + space + suffix;
}
