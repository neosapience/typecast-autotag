import { numberToKorean } from '../utils/number-to-korean';

/**
 * bakil 함수의 옵션
 */
export interface BakilOptions {
  /**
   * 숫자와 단위 사이 공백 포함 여부
   * @default false (이박삼일 형태)
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
 * N박 M일 패턴을 한글로 변환
 *
 * 박일 표현에서는 한자어 수사를 사용합니다:
 * - 2박 3일 → 이박 삼일
 * - 1박 2일 → 일박 이일
 *
 * @param input - 변환할 박일 (문자열)
 * @param options - 옵션 (공백 포함 여부)
 * @returns 한글 박일 표현
 *
 * @example
 * ```typescript
 * bakil('2박 3일');   // '이박 삼일'
 * bakil('1박 2일');   // '일박 이일'
 * bakil('3박4일');    // '삼박 사일'
 * bakil('2박');       // '이박'
 * ```
 */
export function bakil(input: string, options?: BakilOptions): string {
  const includeSpace = options?.includeSpace ?? false;
  const space = includeSpace ? ' ' : '';

  const trimmed = input.trim();
  if (trimmed === '') return input;

  // N박 M일 패턴 매칭
  const fullMatch = trimmed.match(/^([\d,]+)\s*박\s*([\d,]+)\s*일$/);
  if (fullMatch) {
    const bakStr = removeThousandSeparators(fullMatch[1] ?? '');
    const ilStr = removeThousandSeparators(fullMatch[2] ?? '');
    const bakNum = parseInt(bakStr, 10);
    const ilNum = parseInt(ilStr, 10);

    if (isNaN(bakNum) || isNaN(ilNum) || bakNum < 0 || ilNum < 0) {
      return input;
    }

    const bakKorean = bakNum === 0 ? '영' : numberToKorean(bakNum);
    const ilKorean = ilNum === 0 ? '영' : numberToKorean(ilNum);

    return bakKorean + space + '박 ' + ilKorean + space + '일';
  }

  // N박만 있는 경우
  const bakOnlyMatch = trimmed.match(/^([\d,]+)\s*박$/);
  if (bakOnlyMatch) {
    const bakStr = removeThousandSeparators(bakOnlyMatch[1] ?? '');
    const bakNum = parseInt(bakStr, 10);

    if (isNaN(bakNum) || bakNum < 0) {
      return input;
    }

    const bakKorean = bakNum === 0 ? '영' : numberToKorean(bakNum);
    return bakKorean + space + '박';
  }

  return input;
}
