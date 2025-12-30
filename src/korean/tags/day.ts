import { numberToKorean } from '../utils/number-to-korean';

/**
 * 천단위 구분자 제거
 * @param str - 입력 문자열
 * @returns 구분자가 제거된 문자열
 */
function removeThousandSeparators(str: string): string {
  return str.replace(/,/g, '');
}

/**
 * D-day 형식을 파싱
 * @param str - 입력 문자열
 * @returns { sign: '+' | '-', num: number } 또는 null, 또는 D-Day만 있는 경우
 */
function parseDDay(str: string): { sign: '+' | '-'; num: number } | 'dday-only' | null {
  // D-Day, D-day, d-day 형식 (숫자 없음)
  if (/^[Dd]-?[Dd]ay$/i.test(str)) {
    return 'dday-only';
  }

  // D-day 형식: D-100, D+100, D - 100일, d-100일 등 (천단위 구분자 지원)
  const match = str.match(/^[Dd]\s*([-+])\s*([\d,]+)일?$/);
  if (match) {
    const numStr = removeThousandSeparators(match[2] ?? '0');
    return {
      sign: match[1] as '+' | '-',
      num: parseInt(numStr, 10),
    };
  }
  return null;
}

/**
 * N일째/N일차 형식을 파싱
 * @param str - 입력 문자열
 * @returns { num: number, suffix: '째' | '차' } 또는 null
 */
function parseDaySuffix(str: string): { num: number; suffix: '째' | '차' } | null {
  // "100일째", "365일차" 형식 (천단위 구분자 지원)
  const match = str.match(/^([\d,]+)일(째|차)$/);
  if (match) {
    const numStr = removeThousandSeparators(match[1] ?? '0');
    return {
      num: parseInt(numStr, 10),
      suffix: match[2] as '째' | '차',
    };
  }
  return null;
}

/**
 * 일수를 파싱 (숫자 또는 "숫자일" 형식)
 * @param str - 입력 문자열
 * @returns 파싱된 숫자 또는 null
 */
function parseDayNumber(str: string): number | null {
  // "25일", "25", "1,000일", "1,000" 형식 (천단위 구분자 지원)
  const match = str.match(/^([\d,]+)일?$/);
  if (match) {
    const numStr = removeThousandSeparators(match[1] ?? '0');
    return parseInt(numStr, 10);
  }
  return null;
}

/**
 * 일 숫자를 한글 일 표기로 변환
 *
 * 다양한 형식의 일수 표현을 지원합니다:
 * - 숫자: 25, 365, 0
 * - 문자열: "25", "365일", "100일", "1,000일"
 * - 앞자리 0: "01일", "007일"
 * - D-day: "D-100", "D+50일", "D-3418일", "D-Day"
 * - N일째/N일차: "100일째", "365일차"
 *
 * @param input - 변환할 일 (숫자 또는 문자열)
 * @returns 한글 일 표기
 *
 * @example
 * ```typescript
 * day(25); // '이십오일'
 * day('365일'); // '삼백육십오일'
 * day('D-100일'); // '디데이 백일'
 * day('1,000일'); // '천일'
 * day('100일째'); // '백일째'
 * day(0); // '영일'
 * ```
 */
export function day(input: number | string): string {
  const str = String(input).trim();

  if (str === '') {
    return str;
  }

  // D-day 형식 처리
  const dday = parseDDay(str);
  if (dday !== null) {
    // D-Day만 있는 경우
    if (dday === 'dday-only') {
      return '디데이';
    }
    // D-0, D+0인 경우
    if (dday.num === 0) {
      return '디데이';
    }
    const prefix = dday.sign === '+' ? '디데이 플러스 ' : '디데이 ';
    return prefix + numberToKorean(dday.num) + '일';
  }

  // N일째/N일차 형식 처리
  const daySuffix = parseDaySuffix(str);
  if (daySuffix !== null) {
    if (daySuffix.num === 0) {
      return '영일' + daySuffix.suffix;
    }
    return numberToKorean(daySuffix.num) + '일' + daySuffix.suffix;
  }

  // 숫자 입력 처리
  if (typeof input === 'number') {
    if (isNaN(input) || input < 0) {
      return String(input);
    }
    if (input === 0) {
      return '영일';
    }
    return numberToKorean(input) + '일';
  }

  // 문자열 숫자 또는 "숫자일" 형식 처리 (천단위 구분자, 앞자리 0 지원)
  const num = parseDayNumber(str);
  if (num !== null) {
    if (num === 0) {
      return '영일';
    }
    return numberToKorean(num) + '일';
  }

  // 파싱 실패시 원본 반환
  return String(input);
}
