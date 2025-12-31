import { numberToKorean } from '../utils/number-to-korean';

/**
 * fraction 함수의 옵션
 */
export interface FractionOptions {
  /**
   * 숫자와 단위 사이 공백 포함 여부
   * @default true
   */
  includeSpace?: boolean;
}

/**
 * 분수를 한글로 변환
 *
 * 분수는 "분모 분의 분자" 형태로 읽습니다:
 * - 1/4 → 사 분의 일
 * - 3/4 → 사 분의 삼
 * - 2/3 → 삼 분의 이
 *
 * @param input - 변환할 분수 (문자열)
 * @param options - 옵션 (공백 포함 여부)
 * @returns 한글 분수 표현
 *
 * @example
 * ```typescript
 * fraction('1/4');   // '사 분의 일'
 * fraction('3/4');   // '사 분의 삼'
 * fraction('2/3');   // '삼 분의 이'
 * fraction('1/2');   // '이 분의 일' (반)
 * fraction('5/8');   // '팔 분의 오'
 * ```
 */
export function fraction(input: string, options?: FractionOptions): string {
  const includeSpace = options?.includeSpace ?? true;
  const space = includeSpace ? ' ' : '';

  const trimmed = input.trim();
  if (trimmed === '') return input;

  // 분수 패턴: N/M
  const match = trimmed.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (match) {
    const numerator = parseInt(match[1] ?? '0', 10);
    const denominator = parseInt(match[2] ?? '0', 10);

    if (isNaN(numerator) || isNaN(denominator) || denominator === 0) {
      return input;
    }

    const numeratorKorean = numerator === 0 ? '영' : numberToKorean(numerator);
    const denominatorKorean = denominator === 0 ? '영' : numberToKorean(denominator);

    // "분모 분의 분자" 형태
    return denominatorKorean + space + '분의' + space + numeratorKorean;
  }

  return input;
}

/**
 * 컨텍스트가 포함된 분수 표현을 한글로 변환
 * 예: "1/4 잔량" → "사 분의 일 잔량"
 *
 * @param input - 변환할 분수 (컨텍스트 포함 문자열)
 * @param options - 옵션 (공백 포함 여부)
 * @returns 한글 분수 표현
 */
export function fractionWithContext(input: string, options?: FractionOptions): string {
  const includeSpace = options?.includeSpace ?? true;
  const space = includeSpace ? ' ' : '';

  const trimmed = input.trim();
  if (trimmed === '') return input;

  // 분수 + 후행 텍스트 패턴: N/M + 텍스트
  const match = trimmed.match(/^(\d+)\s*\/\s*(\d+)\s*(.*)$/);
  if (match) {
    const numerator = parseInt(match[1] ?? '0', 10);
    const denominator = parseInt(match[2] ?? '0', 10);
    const rest = match[3] ?? '';

    if (isNaN(numerator) || isNaN(denominator) || denominator === 0) {
      return input;
    }

    const numeratorKorean = numerator === 0 ? '영' : numberToKorean(numerator);
    const denominatorKorean = denominator === 0 ? '영' : numberToKorean(denominator);

    // "분모 분의 분자" 형태 + 후행 텍스트
    const fractionPart = denominatorKorean + space + '분의' + space + numeratorKorean;
    return rest ? fractionPart + ' ' + rest : fractionPart;
  }

  return input;
}
