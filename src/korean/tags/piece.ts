import { numberToNativeKorean, numberToKorean } from '../utils/number-to-korean';

/**
 * piece 함수의 옵션
 */
export interface PieceOptions {
  /**
   * 단위 (기본값: '개')
   * 문자열 입력에 이미 단위가 포함된 경우 파싱된 단위가 우선됩니다.
   * @default '개'
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
 * 유효한 숫자인지 확인 (NaN, Infinity 제외)
 */
function isValidNumber(num: number): boolean {
  return !isNaN(num) && Number.isFinite(num);
}

/**
 * 개수를 고유어 수사로 변환
 *
 * 한국어에서 개수를 셀 때는 고유어 수사를 사용합니다:
 * - 1-99: 고유어 (한, 두, 세, 네, 다섯, ...)
 * - 100 이상: 한자어 (백, 이백, ...)
 *
 * @param input - 변환할 개수 (숫자 또는 문자열)
 * @param options - 옵션 (단위, 공백 포함 여부)
 * @returns 고유어 수사 + 단위
 *
 * @remarks
 * - 소수점 숫자는 버림하여 정수로 변환됩니다 (예: 1.7 → 1)
 * - 음수, NaN, Infinity는 원본 문자열로 반환됩니다
 * - 문자열 입력 시 파싱된 단위가 options.unit보다 우선됩니다
 * - 문자열에 단위가 없으면 options.unit이 사용됩니다
 *
 * @example
 * ```typescript
 * piece(1); // '한 개'
 * piece(3); // '세 개'
 * piece(5); // '다섯 개'
 * piece(10); // '열 개'
 * piece(23); // '스물세 개'
 * piece(100); // '백 개'
 * piece(1.7); // '한 개' (소수점 버림)
 * piece('5개'); // '다섯 개'
 * piece('5'); // '다섯 개' (기본 단위 사용)
 * piece('5개', { unit: '마리' }); // '다섯 개' (파싱된 단위 우선)
 * piece(3, { unit: '명' }); // '세 명'
 * piece(2, { unit: '마리' }); // '두 마리'
 * piece(5, { includeSpace: false }); // '다섯개'
 * ```
 */
export function piece(input: number | string, options?: PieceOptions): string {
  const unit = options?.unit ?? '개';
  const includeSpace = options?.includeSpace ?? true;
  const space = includeSpace ? ' ' : '';

  // 문자열 처리
  if (typeof input === 'string') {
    // 공백 제거
    const trimmed = input.trim();
    if (trimmed === '') return input;

    // "5개", "10마리", "3명", "1.5개" 등의 형식 파싱 (소수점 지원)
    const match = trimmed.match(/^([\d,]+(?:\.\d+)?)\s*(.*)$/);
    if (match) {
      const numStr = removeThousandSeparators(match[1] ?? '');
      const parsedNum = parseFloat(numStr);
      const parsedUnit = match[2] || unit;

      if (!isValidNumber(parsedNum) || parsedNum < 0) {
        return String(input);
      }

      // 소수점 버림
      const num = Math.floor(parsedNum);

      if (num === 0) {
        return '영' + space + parsedUnit;
      }

      const koreanNum = num < 100 ? numberToNativeKorean(num) : numberToKorean(num);
      return koreanNum + space + parsedUnit;
    }

    return String(input);
  }

  // 숫자 처리: 유효하지 않은 숫자 (NaN, Infinity, 음수)는 원본 반환
  if (!isValidNumber(input) || input < 0) {
    return String(input);
  }

  // 소수점 버림
  const num = Math.floor(input);

  if (num === 0) {
    return '영' + space + unit;
  }

  const koreanNum = num < 100 ? numberToNativeKorean(num) : numberToKorean(num);
  return koreanNum + space + unit;
}
