import { numberToKorean } from '../utils/number-to-korean';

/**
 * area 함수의 옵션
 */
export interface AreaOptions {
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
 * 면적 단위 매핑
 */
const AREA_UNITS: Record<string, string> = {
  '㎡': '제곱미터',
  m2: '제곱미터',
  'm²': '제곱미터',
  제곱미터: '제곱미터',
  평: '평',
  평방미터: '제곱미터',
};

/**
 * 면적을 한글로 변환
 *
 * 면적 표현에서는 한자어 수사를 사용합니다:
 * - 35㎡ → 삼십오 제곱미터
 * - 10평 → 십 평
 *
 * @param input - 변환할 면적 (문자열)
 * @param options - 옵션 (공백 포함 여부)
 * @returns 한글 면적 표현
 *
 * @example
 * ```typescript
 * area('35㎡');      // '삼십오 제곱미터'
 * area('10평');      // '십 평'
 * area('100m2');     // '백 제곱미터'
 * ```
 */
export function area(input: string, options?: AreaOptions): string {
  const includeSpace = options?.includeSpace ?? true;
  const space = includeSpace ? ' ' : '';

  const trimmed = input.trim();
  if (trimmed === '') return input;

  // 면적 단위 패턴 매칭 (더 긴 단위부터 먼저 매칭)
  const unitPattern = Object.keys(AREA_UNITS)
    .sort((a, b) => b.length - a.length)
    .join('|');

  const match = trimmed.match(new RegExp(`^([\\d,]+(?:\\.\\d+)?)\\s*(${unitPattern})$`, 'i'));
  if (match) {
    const numStr = removeThousandSeparators(match[1] ?? '');
    const parsedUnit = match[2] ?? '';
    const targetUnit = AREA_UNITS[parsedUnit] ?? AREA_UNITS[parsedUnit.toLowerCase()] ?? parsedUnit;

    // 소수점 처리
    if (numStr.includes('.')) {
      const [intPart, decPart] = numStr.split('.');
      const intNum = parseInt(intPart ?? '0', 10);
      const intKorean = intNum === 0 ? '영' : numberToKorean(intNum);
      const decKorean = (decPart ?? '')
        .split('')
        .map((d) => numberToKorean(parseInt(d, 10)))
        .join(' ');
      return intKorean + ' 쩜 ' + decKorean + space + targetUnit;
    }

    const num = parseInt(numStr, 10);

    if (isNaN(num) || num < 0) {
      return input;
    }

    if (num === 0) {
      return '영' + space + targetUnit;
    }

    return numberToKorean(num) + space + targetUnit;
  }

  return input;
}
