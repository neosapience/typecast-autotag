import { numberToOrdinalKorean, numberToKorean } from '../utils/number-to-korean';

/**
 * 한자어 수사를 사용해야 하는 접미사 목록
 * (순위를 나타내는 표현들)
 */
const HANJA_SUFFIXES = ['등', '위', '단계'];

/**
 * order 함수의 옵션
 */
export interface OrderOptions {
  /**
   * 서수 접미사 (기본값: '번째')
   * @default '번째'
   */
  suffix?: string;

  /**
   * 숫자와 접미사 사이 공백 포함 여부
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
 * 접미사가 한자어 수사를 사용해야 하는지 확인
 */
function shouldUseHanja(suffix: string): boolean {
  return HANJA_SUFFIXES.includes(suffix);
}

/**
 * 순서(서수)를 한글로 변환
 *
 * 한국어에서 순서를 나타낼 때:
 * - '번째' 접미사: 고유어 수사 사용 (첫 번째, 두 번째, 세 번째)
 * - '등', '위', '단계' 접미사: 한자어 수사 사용 (일 등, 이 위, 삼 단계)
 * - 100 이상: 항상 한자어 사용
 *
 * @param input - 변환할 순서 (숫자 또는 문자열)
 * @param options - 옵션 (접미사, 공백 포함 여부)
 * @returns 서수 표현
 *
 * @example
 * ```typescript
 * order(1); // '첫 번째'
 * order(2); // '두 번째'
 * order(3); // '세 번째'
 * order(10); // '열 번째'
 * order(21); // '스물한 번째'
 * order(100); // '백 번째'
 * order('1번째'); // '첫 번째'
 * order('3등'); // '삼 등'
 * order(2, { suffix: '등' }); // '이 등'
 * order(1, { suffix: '위' }); // '일 위'
 * order('2단계'); // '이 단계'
 * ```
 */
export function order(input: number | string, options?: OrderOptions): string {
  const suffix = options?.suffix ?? '번째';
  const includeSpace = options?.includeSpace ?? true;
  // 접미사가 비어있으면 공백도 제거
  const space = includeSpace && suffix !== '' ? ' ' : '';

  // 문자열 처리
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (trimmed === '') return input;

    // "1번째", "3등", "5위", "-1번째" 등의 형식 파싱
    const match = trimmed.match(/^(-?[\d,]+)\s*(.*)$/);
    if (match) {
      const numStr = removeThousandSeparators(match[1] ?? '');
      const num = parseInt(numStr, 10);
      const parsedSuffix = match[2] || suffix;

      if (isNaN(num)) {
        return String(input);
      }

      if (num < 0) {
        const absResult = order(-num, { suffix: parsedSuffix, includeSpace });
        return '마이너스 ' + absResult;
      }

      if (num === 0) {
        return '영' + space + parsedSuffix;
      }

      // 한자어 수사를 사용해야 하는 접미사인 경우 (등, 위, 단계)
      // 그 외에는 고유어 수사 사용 (번째)
      let koreanNum: string;
      if (shouldUseHanja(parsedSuffix)) {
        koreanNum = numberToKorean(num);
      } else {
        koreanNum = num < 100 ? numberToOrdinalKorean(num) : numberToKorean(num);
      }
      return koreanNum + space + parsedSuffix;
    }

    return String(input);
  }

  // 숫자 처리
  if (isNaN(input)) {
    return '숫자가 아닙니다';
  }

  if (!isFinite(input)) {
    return input > 0 ? '무한대' : '마이너스 무한대';
  }

  if (input < 0) {
    return '마이너스 ' + order(-input, options);
  }

  if (input === 0) {
    return '영' + space + suffix;
  }

  // 한자어 수사를 사용해야 하는 접미사인 경우 (등, 위, 단계)
  let koreanNum: string;
  if (shouldUseHanja(suffix)) {
    koreanNum = numberToKorean(input);
  } else {
    koreanNum = input < 100 ? numberToOrdinalKorean(input) : numberToKorean(input);
  }
  return koreanNum + space + suffix;
}
