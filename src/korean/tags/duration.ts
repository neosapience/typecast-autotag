import { numberToKorean } from '../utils/number-to-korean';

/**
 * duration 함수의 옵션
 */
export interface DurationOptions {
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
 * 기간 단위 매핑
 * 문자열 입력에서 인식할 단위들과 그에 대응하는 한글 읽기
 */
const DURATION_UNITS: Record<string, string> = {
  개월: '개월',
  주일: '주일',
  주: '주',
  년간: '년간',
  년: '년',
  달: '달',
  학기: '학기',
  분기: '분기',
  일: '일',
};

/**
 * 기간을 한글로 변환
 *
 * 기간 표현에서는 한자어 수사를 사용합니다:
 * - 3개월 → 삼 개월
 * - 2주 → 이 주
 * - 5년 → 오 년
 *
 * @param input - 변환할 기간 (숫자 또는 문자열)
 * @param options - 옵션 (공백 포함 여부)
 * @returns 한글 기간 표현
 *
 * @remarks
 * - 기간 표현에서는 고유어가 아닌 한자어 수사를 사용합니다
 *   ("삼 개월"이 "세 개월"보다 자연스러움)
 * - 음수, NaN, Infinity는 원본 문자열로 반환됩니다
 *
 * @example
 * ```typescript
 * duration('3개월');       // '삼 개월'
 * duration('2주');         // '이 주'
 * duration('6개월');       // '육 개월'
 * duration('1년');         // '일 년'
 * duration('2주일');       // '이 주일'
 * duration('4분기');       // '사 분기'
 * duration('1학기');       // '일 학기'
 * duration('60일 이내');   // '육십일 이내'
 * duration('30일 이후');   // '삼십일 이후'
 * ```
 */
export function duration(input: number | string, options?: DurationOptions): string {
  const includeSpace = options?.includeSpace ?? true;
  const space = includeSpace ? ' ' : '';

  // 문자열 처리
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (trimmed === '') return input;

    // 괄호 안의 N년 패턴 처리: (2년), (30년) 등
    const parenYearMatch = trimmed.match(/^\(\s*([\d,]+)\s*년\s*\)$/);
    if (parenYearMatch) {
      const numStr = removeThousandSeparators(parenYearMatch[1] ?? '');
      const num = parseInt(numStr, 10);

      if (isNaN(num) || num < 0) {
        return String(input);
      }

      if (num === 0) {
        return '(영' + space + '년)';
      }

      return '(' + numberToKorean(num) + space + '년)';
    }

    // N일 이내/이후/이상/이하 패턴 처리
    const suffixMatch = trimmed.match(/^([\d,]+)\s*(일)\s*(이내|이후|이상|이하)$/);
    if (suffixMatch) {
      const numStr = removeThousandSeparators(suffixMatch[1] ?? '');
      const unit = suffixMatch[2] ?? '';
      const suffix = suffixMatch[3] ?? '';
      const num = parseInt(numStr, 10);

      if (isNaN(num) || num < 0) {
        return String(input);
      }

      if (num === 0) {
        return '영' + unit + ' ' + suffix;
      }

      return numberToKorean(num) + unit + ' ' + suffix;
    }

    // 기간 단위 패턴 매칭 (더 긴 단위부터 먼저 매칭)
    const unitPattern = Object.keys(DURATION_UNITS)
      .sort((a, b) => b.length - a.length) // 긴 것부터 매칭
      .join('|');

    const match = trimmed.match(new RegExp(`^([\\d,]+)\\s*(${unitPattern})$`));
    if (match) {
      const numStr = removeThousandSeparators(match[1] ?? '');
      const parsedUnit = match[2] ?? '';
      const num = parseInt(numStr, 10);

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

  // 숫자만 입력된 경우 (단위 없음) - 기본 단위 없이 그냥 숫자만 반환
  if (isNaN(input) || !isFinite(input) || input < 0) {
    return String(input);
  }

  // 숫자만 입력된 경우는 변환하지 않음 (단위 필요)
  return String(input);
}

/**
 * 세금 기분을 한글로 변환
 *
 * @param input - 변환할 기분 문자열 (예: "1기분", "2기분")
 * @returns 한글 기분 표현
 *
 * @example
 * ```typescript
 * gIbun('1기분');     // '일 기분'
 * gIbun('2기분');     // '이 기분'
 * ```
 */
export function gIbun(input: string): string {
  const trimmed = input.trim();
  if (trimmed === '') return input;

  const match = trimmed.match(/^(\d+)\s*기분$/);
  if (match) {
    const num = parseInt(match[1] ?? '', 10);
    if (isNaN(num) || num < 0) {
      return input;
    }
    return numberToKorean(num) + ' 기분';
  }

  return input;
}
