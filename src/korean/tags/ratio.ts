import { numberToKorean, digitToKorean } from '../utils/number-to-korean';

/**
 * ratio 함수의 옵션
 */
export interface RatioOptions {
  /**
   * 비율 구분자 (기본값: '대')
   * @default '대'
   */
  separator?: string;

  /**
   * 퍼센트 단위 (기본값: '퍼센트')
   * @default '퍼센트'
   */
  percentUnit?: string;
}

/**
 * 천단위 구분자 제거
 */
function removeThousandSeparators(str: string): string {
  return str.replace(/,/g, '');
}

/**
 * 숫자를 한글로 변환 (소수점 지원)
 */
function numberToKoreanWithDecimal(numStr: string): string {
  const cleaned = removeThousandSeparators(numStr);

  if (cleaned.includes('.')) {
    const [intPart, decPart] = cleaned.split('.');
    const intNum = parseInt(intPart || '0', 10);
    const intKorean = intNum === 0 ? '영' : numberToKorean(intNum);
    const decKorean = (decPart || '')
      .split('')
      .map((d) => digitToKorean(d))
      .join('');
    return intKorean + '쩜' + decKorean;
  }

  const num = parseInt(cleaned, 10);
  if (isNaN(num)) return numStr;
  return num === 0 ? '영' : numberToKorean(num);
}

/**
 * 비율을 한글로 변환
 *
 * 콜론(:) 비율과 퍼센트(%) 형식을 지원합니다.
 *
 * @param input - 변환할 비율 (문자열)
 * @param options - 옵션
 * @returns 한글 비율 표현
 *
 * @example
 * ```typescript
 * ratio('1:1');     // '일대일'
 * ratio('7:3');     // '칠대삼'
 * ratio('1:2:3');   // '일대이대삼'
 * ratio('15%');     // '십오 퍼센트'
 * ratio('3.5%');    // '삼쩜오 퍼센트'
 * ratio('100%');    // '백 퍼센트'
 * ```
 */
export function ratio(input: string, options?: RatioOptions): string {
  const separator = options?.separator ?? '대';
  const percentUnit = options?.percentUnit ?? '퍼센트';

  const trimmed = input.trim();
  if (trimmed === '') return input;

  // 퍼센트 형식: N%
  const percentMatch = trimmed.match(/^(-?[\d,.]+)\s*%$/);
  if (percentMatch) {
    const numStr = percentMatch[1] ?? '';
    const korean = numberToKoreanWithDecimal(numStr);

    // 마이너스 처리
    if (numStr.startsWith('-')) {
      return '마이너스 ' + numberToKoreanWithDecimal(numStr.slice(1)) + ' ' + percentUnit;
    }

    return korean + ' ' + percentUnit;
  }

  // 콜론 비율 형식: N:M 또는 N:M:O...
  const colonMatch = trimmed.match(/^(-?[\d,.]+(?:\s*:\s*-?[\d,.]+)+)$/);
  if (colonMatch) {
    const parts = trimmed.split(':').map((p) => p.trim());
    const koreanParts = parts.map((p) => {
      if (p.startsWith('-')) {
        return '마이너스' + numberToKoreanWithDecimal(p.slice(1));
      }
      return numberToKoreanWithDecimal(p);
    });
    return koreanParts.join(separator);
  }

  return input;
}
