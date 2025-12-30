import { numberToKorean } from '../utils/number-to-korean';

/**
 * point 함수의 옵션
 */
export interface PointOptions {
  /**
   * 점수 단위 (기본값: '점')
   * @default '점'
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
 * 점수를 한글로 변환
 *
 * @param input - 변환할 점수 (숫자 또는 문자열)
 * @param options - 옵션 (단위, 공백 포함 여부)
 * @returns 한글 점수 표현
 *
 * @example
 * ```typescript
 * point(95); // '구십오 점'
 * point(100); // '백 점'
 * point(0); // '영 점'
 * point('85점'); // '팔십오 점'
 * point(4.5); // '사 쩜 오 점'
 * point('3.14'); // '삼 쩜 일사 점'
 * point(90, { unit: '등급' }); // '구십 등급'
 * point(5, { unit: '개' }); // '오 개'
 * ```
 */
export function point(input: number | string, options?: PointOptions): string {
  const unit = options?.unit ?? '점';
  const includeSpace = options?.includeSpace ?? true;
  const space = includeSpace ? ' ' : '';

  // 문자열 처리
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (trimmed === '') return input;

    // "95점", "100", "4.5점" 등의 형식 파싱
    const match = trimmed.match(/^([\d,.]+)\s*(.*)$/);
    if (match) {
      const numStr = match[1] ?? '';
      const parsedUnit = match[2] || unit;

      // 소수점 처리
      if (numStr.includes('.')) {
        return formatDecimal(numStr) + space + parsedUnit;
      }

      const cleanNumStr = removeThousandSeparators(numStr);
      const num = parseInt(cleanNumStr, 10);

      if (isNaN(num)) {
        return String(input);
      }

      if (num < 0) {
        return '마이너스 ' + numberToKorean(-num) + space + parsedUnit;
      }

      return numberToKorean(num) + space + parsedUnit;
    }

    return String(input);
  }

  // 숫자 처리
  if (isNaN(input)) {
    return String(input);
  }

  // 소수점 처리
  if (!Number.isInteger(input)) {
    return formatDecimal(String(input)) + space + unit;
  }

  if (input < 0) {
    return '마이너스 ' + numberToKorean(-input) + space + unit;
  }

  return numberToKorean(input) + space + unit;
}

/**
 * 소수를 한글로 변환 (예: 3.14 → 삼 쩜 일사)
 */
function formatDecimal(numStr: string): string {
  const parts = numStr.split('.');
  if (parts.length !== 2) {
    return numStr;
  }

  const integerPart = removeThousandSeparators(parts[0] ?? '');
  const decimalPart = parts[1] ?? '';

  const intNum = parseInt(integerPart, 10);
  if (isNaN(intNum)) {
    return numStr;
  }

  // 정수 부분
  const intKorean = intNum < 0 ? '마이너스 ' + numberToKorean(-intNum) : numberToKorean(intNum);

  // 소수 부분: 자릿수별로 읽기
  const DIGITS = ['영', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
  const decimalKorean = decimalPart
    .split('')
    .map((d) => {
      const digit = parseInt(d, 10);
      return DIGITS[digit] ?? d;
    })
    .join('');

  return intKorean + ' 쩜 ' + decimalKorean;
}
