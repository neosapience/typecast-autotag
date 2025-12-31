import { numberToKorean, digitToKorean } from '../utils/number-to-korean';

/**
 * inch 함수의 옵션
 */
export interface InchOptions {
  /**
   * 숫자와 단위 사이 공백 포함 여부
   * @default true
   */
  includeSpace?: boolean;
}

/**
 * 소수를 한글로 변환
 */
function numberToKoreanWithDecimal(numStr: string): string {
  if (numStr.includes('.')) {
    const [intPart, decPart] = numStr.split('.');
    const intNum = parseInt(intPart || '0', 10);
    const intKorean = intNum === 0 ? '영' : numberToKorean(intNum);
    const decKorean = (decPart || '')
      .split('')
      .map((d) => digitToKorean(d))
      .join('');
    return intKorean + ' 쩜 ' + decKorean;
  }

  const num = parseInt(numStr, 10);
  if (isNaN(num)) return numStr;
  return num === 0 ? '영' : numberToKorean(num);
}

/**
 * 인치를 한글로 변환
 *
 * @param input - 변환할 인치 (문자열)
 * @param options - 옵션 (공백 포함 여부)
 * @returns 한글 인치 표현
 *
 * @example
 * ```typescript
 * inch('65인치');    // '육십오 인치'
 * inch('55인치');    // '오십오 인치'
 * inch('32"');       // '삼십이 인치'
 * inch('27inch');    // '이십칠 인치'
 * ```
 */
export function inch(input: string, options?: InchOptions): string {
  const includeSpace = options?.includeSpace ?? true;
  const space = includeSpace ? ' ' : '';

  const trimmed = input.trim();
  if (trimmed === '') return input;

  // 인치 패턴: 숫자 + 인치/inch/in/"
  const match = trimmed.match(/^([\d,]+(?:\.\d+)?)\s*(인치|inch|in|")?$/i);

  if (match) {
    const numStr = (match[1] ?? '').replace(/,/g, '');
    const koreanNum = numberToKoreanWithDecimal(numStr);
    return koreanNum + space + '인치';
  }

  return input;
}
