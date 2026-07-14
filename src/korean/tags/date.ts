import { numberToKorean } from '../utils/number-to-korean';
import { isValidCalendarDate } from '../../utils/date-validation';

/**
 * 월 발음 불규칙 처리 (국립국어원 표준 발음법)
 * - 6월: 육 → 유
 * - 10월: 십 → 시
 */
const IRREGULAR_MONTH_READINGS: Record<number, string> = {
  6: '유',
  10: '시',
};

/** 영어 월 이름 매핑 */
const ENGLISH_MONTHS: Record<string, number> = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
};

interface ParsedDate {
  year?: number;
  month?: number;
  day?: number;
}

/**
 * 다양한 형식의 날짜 문자열을 파싱
 */
function parseDate(str: string): ParsedDate | null {
  // YYYYMMDD 형식 (8자리 숫자)
  if (/^\d{8}$/.test(str)) {
    return {
      year: parseInt(str.substring(0, 4), 10),
      month: parseInt(str.substring(4, 6), 10),
      day: parseInt(str.substring(6, 8), 10),
    };
  }

  // YYYY-MM-DD, YYYY/MM/DD, YYYY.MM.DD 형식
  if (/^\d{4}[-/.]\d{1,2}[-/.]\d{1,2}$/.test(str)) {
    const parts = str.split(/[-/.]/);
    return {
      year: parseInt(parts[0] ?? '', 10),
      month: parseInt(parts[1] ?? '', 10),
      day: parseInt(parts[2] ?? '', 10),
    };
  }

  // 한글 형식: "1994년6월16일", "1994년 6월 16일", "1994년6월16일생"
  const koreanFullMatch = str.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
  if (koreanFullMatch) {
    return {
      year: parseInt(koreanFullMatch[1] ?? '', 10),
      month: parseInt(koreanFullMatch[2] ?? '', 10),
      day: parseInt(koreanFullMatch[3] ?? '', 10),
    };
  }

  // 한글 형식 (년월만): "2023년12월", "2023년 12월"
  const koreanYearMonth = str.match(/^(\d{4})년\s*(\d{1,2})월$/);
  if (koreanYearMonth) {
    return {
      year: parseInt(koreanYearMonth[1] ?? '', 10),
      month: parseInt(koreanYearMonth[2] ?? '', 10),
    };
  }

  // 한글 형식 (년만): "1994년", "1994년생"
  const koreanYearOnly = str.match(/^(\d{4})년(생)?$/);
  if (koreanYearOnly) {
    return {
      year: parseInt(koreanYearOnly[1] ?? '', 10),
    };
  }

  // 한글 형식 (월일만): "6월16일", "6월 16일"
  const koreanMonthDay = str.match(/^(\d{1,2})월\s*(\d{1,2})일/);
  if (koreanMonthDay) {
    return {
      month: parseInt(koreanMonthDay[1] ?? '', 10),
      day: parseInt(koreanMonthDay[2] ?? '', 10),
    };
  }

  // 영어 형식: "June 16, 1994", "June 16 1994"
  const englishMDY = str.match(/^([a-zA-Z]+)\s+(\d{1,2}),?\s+(\d{4})$/);
  if (englishMDY) {
    const monthName = englishMDY[1]?.toLowerCase() ?? '';
    const monthNum = ENGLISH_MONTHS[monthName];
    if (monthNum !== undefined) {
      return {
        year: parseInt(englishMDY[3] ?? '', 10),
        month: monthNum,
        day: parseInt(englishMDY[2] ?? '', 10),
      };
    }
  }

  // 영어 형식: "16 June 1994"
  const englishDMY = str.match(/^(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})$/);
  if (englishDMY) {
    const monthName = englishDMY[2]?.toLowerCase() ?? '';
    const monthNum = ENGLISH_MONTHS[monthName];
    if (monthNum !== undefined) {
      return {
        year: parseInt(englishDMY[3] ?? '', 10),
        month: monthNum,
        day: parseInt(englishDMY[1] ?? '', 10),
      };
    }
  }

  // 영어 형식 (년월만): "June 1994"
  const englishMonthYear = str.match(/^([a-zA-Z]+)\s+(\d{4})$/);
  if (englishMonthYear) {
    const monthName = englishMonthYear[1]?.toLowerCase() ?? '';
    const monthNum = ENGLISH_MONTHS[monthName];
    if (monthNum !== undefined) {
      return {
        year: parseInt(englishMonthYear[2] ?? '', 10),
        month: monthNum,
      };
    }
  }

  // MM-DD-YYYY 형식 (미국식)
  if (/^\d{2}[-/.]\d{2}[-/.]\d{4}$/.test(str)) {
    const parts = str.split(/[-/.]/);
    return {
      month: parseInt(parts[0] ?? '', 10),
      day: parseInt(parts[1] ?? '', 10),
      year: parseInt(parts[2] ?? '', 10),
    };
  }

  // DD-MM-YYYY 형식 (유럽식) - 첫 번째 숫자가 12보다 크면 일로 간주
  // 이 형식은 모호하므로 별도로 처리하지 않음

  return null;
}

/**
 * 날짜를 한글로 변환
 *
 * @param input - 변환할 날짜 (다양한 형식 지원)
 * @returns 한글 날짜 표기
 *
 * @example
 * ```typescript
 * date(19940616); // '천구백구십사년 유 월 십육 일'
 * date('2000-12-25'); // '이천년 십이 월 이십오 일'
 * date('1994년6월16일'); // '천구백구십사년 유 월 십육 일'
 * date('June 16, 1994'); // '천구백구십사년 유 월 십육 일'
 * date('2000-10-10'); // '이천년 시 월 십 일'
 * ```
 */
export function date(input: number | string): string {
  const str = String(input);
  const parsed = parseDate(str);

  if (!parsed) {
    return str;
  }

  const { year, month, day } = parsed;

  if (!isValidCalendarDate(year, month, day)) {
    return str;
  }

  // 모든 값이 없으면 원본 반환
  if (year === undefined && month === undefined && day === undefined) {
    return str;
  }

  // 입력 문자열이 "생"으로 끝나는지 확인 (생년월일인 경우)
  const endsWithSaeng = str.endsWith('생');

  const parts: string[] = [];

  // 년 처리
  if (year !== undefined && !isNaN(year)) {
    parts.push(numberToKorean(year) + '년');
  }

  // 월 처리
  if (month !== undefined && !isNaN(month)) {
    if (IRREGULAR_MONTH_READINGS[month]) {
      // 불규칙 발음 처리 (6월 → 유 월, 10월 → 시 월)
      parts.push(IRREGULAR_MONTH_READINGS[month] + ' 월');
    } else {
      parts.push(numberToKorean(month) + ' 월');
    }
  }

  // 일 처리
  if (day !== undefined && !isNaN(day)) {
    parts.push(numberToKorean(day) + ' 일');
  }

  let result = parts.join(' ');

  // 입력에 "생"이 있었으면 출력에도 추가
  if (endsWithSaeng) {
    result += '생';
  }

  return result;
}

/**
 * YYYY-MM 형식의 년월을 한글로 변환
 *
 * @param input - 변환할 년월 문자열 (YYYY-MM, YYYY-MM까지, YYYY-MM부터 등)
 * @returns 한글 년월 표기
 *
 * @example
 * ```typescript
 * yearMonth('2028-03까지'); // '이천이십팔년 삼 월까지'
 * yearMonth('2024-12부터'); // '이천이십사년 십이 월부터'
 * yearMonth('2025-06');     // '이천이십오년 유 월'
 * ```
 */
export function yearMonth(input: string): string {
  const trimmed = input.trim();
  if (trimmed === '') return input;

  // YYYY-MM + optional suffix (까지, 부터, 이후, 이전 등)
  const match = trimmed.match(/^(\d{4})-(\d{2})(까지|부터|이후|이전)?$/);
  if (!match) {
    return input;
  }

  const yearNum = parseInt(match[1] ?? '', 10);
  const monthNum = parseInt(match[2] ?? '', 10);
  const suffix = match[3] ?? '';

  if (isNaN(yearNum) || isNaN(monthNum)) {
    return input;
  }

  const yearKorean = numberToKorean(yearNum) + '년';

  let monthKorean: string;
  if (monthNum === 0) {
    monthKorean = '영 월';
  } else if (IRREGULAR_MONTH_READINGS[monthNum]) {
    monthKorean = IRREGULAR_MONTH_READINGS[monthNum] + ' 월';
  } else {
    monthKorean = numberToKorean(monthNum) + ' 월';
  }

  return yearKorean + ' ' + monthKorean + suffix;
}
