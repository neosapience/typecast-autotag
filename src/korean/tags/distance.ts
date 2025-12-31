import { numberToKorean } from '../utils/number-to-korean';

/**
 * distance 함수의 옵션
 */
export interface DistanceOptions {
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
 * 거리 단위 매핑
 */
const DISTANCE_UNITS: Record<string, string> = {
  km: '킬로미터',
  m: '미터',
  cm: '센티미터',
  mm: '밀리미터',
  킬로미터: '킬로미터',
  미터: '미터',
  센티미터: '센티미터',
  밀리미터: '밀리미터',
};

/**
 * 거리를 한글로 변환
 *
 * 거리 표현에서는 한자어 수사를 사용합니다:
 * - 35,000km → 삼만오천 킬로미터
 * - 10km → 십 킬로미터
 *
 * @param input - 변환할 거리 (문자열)
 * @param options - 옵션 (공백 포함 여부)
 * @returns 한글 거리 표현
 *
 * @example
 * ```typescript
 * distance('35,000km');  // '삼만오천 킬로미터'
 * distance('10km');      // '십 킬로미터'
 * distance('500m');      // '오백 미터'
 * distance('1.5km');     // '일 쩜 오 킬로미터'
 * ```
 */
export function distance(input: string, options?: DistanceOptions): string {
  const includeSpace = options?.includeSpace ?? true;
  const space = includeSpace ? ' ' : '';

  const trimmed = input.trim();
  if (trimmed === '') return input;

  // 거리 단위 패턴 매칭 (더 긴 단위부터 먼저 매칭)
  const unitPattern = Object.keys(DISTANCE_UNITS)
    .sort((a, b) => b.length - a.length)
    .join('|');

  const match = trimmed.match(new RegExp(`^([\\d,]+(?:\\.\\d+)?)\\s*(${unitPattern})$`, 'i'));
  if (match) {
    const numStr = removeThousandSeparators(match[1] ?? '');
    const parsedUnit = match[2]?.toLowerCase() ?? '';
    const targetUnit = DISTANCE_UNITS[parsedUnit] ?? parsedUnit;

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
