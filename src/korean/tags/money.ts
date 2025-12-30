import { numberToKorean } from '../utils/number-to-korean';

/**
 * money 함수의 옵션
 */
export interface MoneyOptions {
  /**
   * 화폐 단위 (기본값: '원')
   * @default '원'
   */
  unit?: string;

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
 * 금액을 한글로 변환
 *
 * @param input - 변환할 금액 (숫자 또는 문자열)
 * @param options - 옵션 (단위, 공백 포함 여부)
 * @returns 한글 금액 표현
 *
 * @example
 * ```typescript
 * money(1000); // '천 원'
 * money(10000); // '만 원'
 * money(15000); // '만오천 원'
 * money(123456); // '십이만삼천사백오십육 원'
 * money('10,000원'); // '만 원'
 * money('5,500'); // '오천오백 원'
 * money(100, { unit: '달러' }); // '백 달러'
 * money(50, { unit: '엔' }); // '오십 엔'
 * money('1억원'); // '일 억원'
 * money('1000만원'); // '천 만원'
 * money('100만원'); // '백 만원'
 * ```
 */
export function money(input: number | string, options?: MoneyOptions): string {
  const unit = options?.unit ?? '원';
  const includeSpace = options?.includeSpace ?? true;
  const space = includeSpace ? ' ' : '';

  // 문자열 처리
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (trimmed === '') return input;

    // "10,000원", "5000", "₩10000" 등의 형식 파싱
    // 통화 기호 제거: ₩, $, ¥, €, £
    const withoutCurrency = trimmed.replace(/^[₩$¥€£]\s*/, '');

    // 한글 큰 단위 처리: "1000만원" → "천 만원", "1억원" → "일 억원"
    // 숫자+(만|억|조|경|천)원 형식 감지
    const bigUnitMatch = withoutCurrency.match(/^([\d,]+)\s*(만|억|조|경|천)원\s*(.*)$/);
    if (bigUnitMatch) {
      const numStr = removeThousandSeparators(bigUnitMatch[1] ?? '');
      const bigUnit = bigUnitMatch[2]; // 만, 억, 조, 경, 천
      const num = parseInt(numStr, 10);

      if (isNaN(num) || num < 0) {
        return String(input);
      }

      if (num === 0) {
        return '영' + space + bigUnit + '원';
      }

      return numberToKorean(num) + space + bigUnit + '원';
    }

    // 숫자와 단위 분리
    const match = withoutCurrency.match(/^([\d,]+)\s*(.*)$/);
    if (match) {
      const numStr = removeThousandSeparators(match[1] ?? '');
      const num = parseInt(numStr, 10);
      const parsedUnit = match[2] || unit;

      if (isNaN(num) || num < 0) {
        return String(input);
      }

      if (num === 0) {
        return '영' + space + parsedUnit;
      }

      return numberToKorean(num) + space + parsedUnit;
    }

    return String(input);
  }

  // 숫자 처리
  if (isNaN(input) || !isFinite(input) || input < 0) {
    return String(input);
  }

  if (input === 0) {
    return '영' + space + unit;
  }

  return numberToKorean(input) + space + unit;
}
