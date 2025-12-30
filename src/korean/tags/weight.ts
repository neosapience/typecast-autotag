import { numberToKorean } from '../utils/number-to-korean';

/**
 * weight 함수의 옵션
 */
export interface WeightOptions {
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
 * 무게 단위 매핑
 */
const WEIGHT_UNITS: Record<string, string> = {
  kg: '킬로그램',
  g: '그램',
  mg: '밀리그램',
  ton: '톤',
  t: '톤',
  톤: '톤',
  킬로그램: '킬로그램',
  그램: '그램',
  밀리그램: '밀리그램',
};

/**
 * 무게를 한글로 변환
 *
 * 무게 표현에서는 한자어 수사를 사용합니다:
 * - 23kg → 이십삼 킬로그램
 * - 10g → 십 그램
 *
 * @param input - 변환할 무게 (문자열)
 * @param options - 옵션 (공백 포함 여부)
 * @returns 한글 무게 표현
 *
 * @example
 * ```typescript
 * weight('23kg');     // '이십삼 킬로그램'
 * weight('10kg');     // '십 킬로그램'
 * weight('500g');     // '오백 그램'
 * weight('1.5톤');    // '일 쩜 오 톤'
 * ```
 */
export function weight(input: string, options?: WeightOptions): string {
  const includeSpace = options?.includeSpace ?? true;
  const space = includeSpace ? ' ' : '';

  const trimmed = input.trim();
  if (trimmed === '') return input;

  // 무게 단위 패턴 매칭 (더 긴 단위부터 먼저 매칭)
  const unitPattern = Object.keys(WEIGHT_UNITS)
    .sort((a, b) => b.length - a.length)
    .join('|');

  const match = trimmed.match(new RegExp(`^([\\d,]+(?:\\.\\d+)?)\\s*(${unitPattern})$`, 'i'));
  if (match) {
    const numStr = removeThousandSeparators(match[1] ?? '');
    const parsedUnit = match[2]?.toLowerCase() ?? '';
    const targetUnit = WEIGHT_UNITS[parsedUnit] ?? parsedUnit;

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
