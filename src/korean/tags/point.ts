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
 * point('-5'); // '마이너스 오 점'
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

    // "95점", "100", "-5", "+10", "4.5점", ".5" 등의 형식 파싱
    const match = trimmed.match(/^([+-]?[\d,.]*\.?[\d]*)(.*)$/);
    if (match) {
      let numStr = match[1] ?? '';
      const remainder = match[2] ?? '';
      const parsedUnit = remainder.trim() || unit;

      // 빈 숫자 문자열인 경우 원본 반환
      if (numStr === '' || numStr === '+' || numStr === '-' || numStr === '.') {
        return String(input);
      }

      // 나머지 부분이 .숫자로 시작하면 잘못된 형식 (예: "1.2.3")
      if (/^\.\d/.test(remainder)) {
        return String(input);
      }

      // 소수점이 2개 이상이면 잘못된 형식 (예: "1.2.3")
      const dotCount = (numStr.match(/\./g) || []).length;
      if (dotCount > 1) {
        return String(input);
      }

      // + 기호 제거
      if (numStr.startsWith('+')) {
        numStr = numStr.slice(1);
      }

      // 음수 처리
      const isNegative = numStr.startsWith('-');
      if (isNegative) {
        numStr = numStr.slice(1);
      }

      // 소수점 처리
      if (numStr.includes('.')) {
        const result = formatDecimal(numStr);
        if (isNegative) {
          return '마이너스 ' + result + space + parsedUnit;
        }
        return result + space + parsedUnit;
      }

      const cleanNumStr = removeThousandSeparators(numStr);
      const num = parseInt(cleanNumStr, 10);

      if (isNaN(num)) {
        return String(input);
      }

      if (isNegative) {
        return '마이너스 ' + numberToKorean(num) + space + parsedUnit;
      }

      return numberToKorean(num) + space + parsedUnit;
    }

    return String(input);
  }

  // 숫자 처리
  if (!Number.isFinite(input)) {
    // NaN, Infinity, -Infinity 처리
    if (Number.isNaN(input)) {
      return String(input);
    }
    if (input === Infinity) {
      return '무한대' + space + unit;
    }
    if (input === -Infinity) {
      return '마이너스 무한대' + space + unit;
    }
    return String(input);
  }

  // 소수점 처리
  if (!Number.isInteger(input)) {
    if (input < 0) {
      return '마이너스 ' + formatDecimal(String(-input)) + space + unit;
    }
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

  // 소수점이 여러 개인 경우 (예: "1.2.3") 원본 반환
  if (parts.length !== 2) {
    return numStr;
  }

  const integerPart = removeThousandSeparators(parts[0] ?? '');
  const decimalPart = parts[1] ?? '';

  // 소수점 뒤가 비어있는 경우 (예: "1.") 정수로 처리
  if (decimalPart === '') {
    const intNum = parseInt(integerPart, 10);
    if (isNaN(intNum)) {
      return numStr;
    }
    return numberToKorean(intNum);
  }

  // 정수 부분이 비어있는 경우 (예: ".5") 0으로 처리
  const intNum = integerPart === '' ? 0 : parseInt(integerPart, 10);
  if (isNaN(intNum)) {
    return numStr;
  }

  // 정수 부분
  const intKorean = numberToKorean(intNum);

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
