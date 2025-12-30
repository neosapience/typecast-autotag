import { numberToKorean } from '../utils/number-to-korean';

/**
 * mile 함수의 옵션
 */
export interface MileOptions {
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
 * 마일리지를 한글로 변환
 *
 * 마일리지 표현에서는 한자어 수사를 사용합니다:
 * - 45,800마일 → 사만오천팔백 마일
 *
 * @param input - 변환할 마일리지 (문자열)
 * @param options - 옵션 (공백 포함 여부)
 * @returns 한글 마일리지 표현
 *
 * @example
 * ```typescript
 * mile('45,800마일');  // '사만오천팔백 마일'
 * mile('1000mile');    // '천 마일'
 * mile('500마일');     // '오백 마일'
 * ```
 */
export function mile(input: string, options?: MileOptions): string {
  const includeSpace = options?.includeSpace ?? true;
  const space = includeSpace ? ' ' : '';

  const trimmed = input.trim();
  if (trimmed === '') return input;

  // 마일 단위 패턴 매칭
  const match = trimmed.match(/^([\d,]+(?:\.\d+)?)\s*(마일|mile|miles)$/i);
  if (match) {
    const numStr = removeThousandSeparators(match[1] ?? '');

    // 소수점 처리
    if (numStr.includes('.')) {
      const [intPart, decPart] = numStr.split('.');
      const intNum = parseInt(intPart ?? '0', 10);
      const intKorean = intNum === 0 ? '영' : numberToKorean(intNum);
      const decKorean = (decPart ?? '')
        .split('')
        .map((d) => numberToKorean(parseInt(d, 10)))
        .join(' ');
      return intKorean + ' 쩜 ' + decKorean + space + '마일';
    }

    const num = parseInt(numStr, 10);

    if (isNaN(num) || num < 0) {
      return input;
    }

    if (num === 0) {
      return '영' + space + '마일';
    }

    return numberToKorean(num) + space + '마일';
  }

  return input;
}
