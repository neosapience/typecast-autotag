/**
 * 숫자를 한글로 변환하는 유틸리티 함수들
 */

/** 기본 한글 숫자 (0-9) */
const DIGITS = ['영', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];

/** 전화번호용 한글 숫자 (0-9) */
const PHONE_DIGITS = ['공', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];

/** 포네틱 코드용 한글 숫자 (0-9) - 혼동 방지를 위해 사용 */
const PHONETIC_DIGITS = ['공', '하나', '둘', '삼', '넷', '오', '여섯', '칠', '팔', '아홉'];

/** 단위 (일, 십, 백, 천) */
const SMALL_UNITS = ['', '십', '백', '천'];

/** 큰 단위 (만, 억, 조) */
const BIG_UNITS = ['', '만', '억', '조'];

/** 고유어 수사 (1-99) - 개수 세기용 */
const NATIVE_KOREAN_ONES = ['', '한', '두', '세', '네', '다섯', '여섯', '일곱', '여덟', '아홉'];

const NATIVE_KOREAN_TENS = ['', '열', '스물', '서른', '마흔', '쉰', '예순', '일흔', '여든', '아흔'];

/** 고유어 서수 (첫째, 둘째, ...) - 1은 '첫', 나머지는 고유어 수사 사용 */
const NATIVE_KOREAN_ORDINALS_ONES = [
  '',
  '한', // 11 → 열한, 21 → 스물한 (1은 특별히 '첫'으로 처리)
  '두',
  '세',
  '네',
  '다섯',
  '여섯',
  '일곱',
  '여덟',
  '아홉',
];

/** 시간용 고유어 수사 (1-12) */
const NATIVE_KOREAN_HOURS = [
  '열두', // 0시 = 열두 시
  '한',
  '두',
  '세',
  '네',
  '다섯',
  '여섯',
  '일곱',
  '여덟',
  '아홉',
  '열',
  '열한',
  '열두',
];

/**
 * 단일 숫자(0-9)를 한글로 변환
 * @param digit - 단일 숫자 문자
 * @returns 한글 숫자
 */
export function digitToKorean(digit: string): string {
  const num = parseInt(digit, 10);
  if (isNaN(num) || num < 0 || num > 9) {
    return digit;
  }
  return DIGITS[num] ?? digit;
}

/**
 * 단일 숫자(0-9)를 전화번호용 한글로 변환
 * @param digit - 단일 숫자 문자
 * @returns 전화번호용 한글 숫자
 */
export function digitToPhoneKorean(digit: string): string {
  const num = parseInt(digit, 10);
  if (isNaN(num) || num < 0 || num > 9) {
    return digit;
  }
  return PHONE_DIGITS[num] ?? digit;
}

/**
 * 단일 숫자(0-9)를 포네틱 코드 한글로 변환
 * 발음 혼동을 방지하기 위해 사용 (예: 1=하나, 2=둘, 4=넷, 6=여섯, 9=아홉)
 * @param digit - 단일 숫자 문자
 * @returns 포네틱 코드 한글 숫자
 */
export function digitToPhoneticKorean(digit: string): string {
  const num = parseInt(digit, 10);
  if (isNaN(num) || num < 0 || num > 9) {
    return digit;
  }
  return PHONETIC_DIGITS[num] ?? digit;
}

/**
 * 4자리 이하의 숫자를 한글로 변환 (예: 1234 → 천이백삼십사)
 * @param num - 변환할 숫자 (0-9999)
 * @returns 한글 숫자
 */
function fourDigitsToKorean(num: number): string {
  if (num === 0) return '';

  let result = '';
  const str = num.toString().padStart(4, '0');

  for (let i = 0; i < 4; i++) {
    const char = str[i];
    if (char === undefined) continue;

    const digit = parseInt(char, 10);
    const unitIndex = 3 - i;

    if (digit === 0) continue;

    const digitStr = DIGITS[digit] ?? '';
    const unitStr = SMALL_UNITS[unitIndex] ?? '';

    // 1인 경우 단위가 있으면 '일'을 생략 (십, 백, 천)
    if (digit === 1 && unitIndex > 0) {
      result += unitStr;
    } else {
      result += digitStr + unitStr;
    }
  }

  return result;
}

/**
 * 숫자를 한글로 변환 (예: 1994 → 천구백구십사)
 * @param num - 변환할 숫자
 * @returns 한글 숫자
 */
export function numberToKorean(num: number): string {
  if (num === 0) return '영';
  if (num < 0) return '마이너스 ' + numberToKorean(-num);

  let result = '';
  let remaining = num;
  let unitIndex = 0;

  while (remaining > 0) {
    const chunk = remaining % 10000;
    const chunkStr = fourDigitsToKorean(chunk);

    if (chunkStr) {
      result = chunkStr + (BIG_UNITS[unitIndex] ?? '') + result;
    }

    remaining = Math.floor(remaining / 10000);
    unitIndex++;
  }

  return result;
}

/**
 * 숫자를 고유어 수사로 변환 (개수 세기용: 한, 두, 세, 네...)
 * 1-99까지만 고유어, 100 이상은 한자어
 * @param num - 변환할 숫자
 * @returns 고유어 수사
 */
export function numberToNativeKorean(num: number): string {
  if (num <= 0) return numberToKorean(num);
  if (num >= 100) return numberToKorean(num);

  const tens = Math.floor(num / 10);
  const ones = num % 10;

  const tensStr = NATIVE_KOREAN_TENS[tens] ?? '';
  const onesStr = NATIVE_KOREAN_ONES[ones] ?? '';

  return tensStr + onesStr;
}

/**
 * 숫자를 서수 형태의 고유어로 변환 (번째용: 첫, 두, 세...)
 * 1-99까지만 고유어, 100 이상은 한자어
 * @param num - 변환할 숫자
 * @returns 서수용 고유어
 */
export function numberToOrdinalKorean(num: number): string {
  if (num <= 0) return numberToKorean(num);
  if (num >= 100) return numberToKorean(num);

  const tens = Math.floor(num / 10);
  const ones = num % 10;

  // 1은 특별히 '첫'으로 처리
  if (num === 1) {
    return '첫';
  }

  const tensStr = NATIVE_KOREAN_TENS[tens] ?? '';
  const onesStr = NATIVE_KOREAN_ORDINALS_ONES[ones] ?? '';

  // 십단위와 일단위 사이에 공백 추가 (둘 다 있는 경우에만)
  return tensStr + (tensStr && onesStr ? ' ' : '') + onesStr;
}

/**
 * 시간(시)을 고유어 수사로 변환 (한 시, 두 시, ..., 열두 시)
 * 12시간제용 - 0시와 12시 모두 "열두"로 변환
 * @param hour - 시간 (0-23)
 * @returns 고유어 시간
 */
export function hourToNativeKorean(hour: number): string {
  // 24시간제를 12시간제로 변환
  const hour12 = hour % 12;
  return NATIVE_KOREAN_HOURS[hour12] ?? '';
}

/** 24시간제 시간용 고유어 수사 (0-23) */
const NATIVE_KOREAN_HOURS_24: Record<number, string> = {
  0: '영',
  1: '한',
  2: '두',
  3: '세',
  4: '네',
  5: '다섯',
  6: '여섯',
  7: '일곱',
  8: '여덟',
  9: '아홉',
  10: '열',
  11: '열한',
  12: '열두',
  13: '열세',
  14: '열네',
  15: '열다섯',
  16: '열여섯',
  17: '열일곱',
  18: '열여덟',
  19: '열아홉',
  20: '스물',
  21: '스물한',
  22: '스물두',
  23: '스물세',
};

/**
 * 시간(시)을 24시간제 고유어 수사로 변환 (영 시, 한 시, ..., 스물세 시)
 * 24시간제용 - 0시는 "영"으로 변환
 * @param hour - 시간 (0-23)
 * @returns 24시간제 고유어 시간
 */
export function hourToNativeKorean24(hour: number): string {
  if (hour < 0 || hour > 23) {
    return '';
  }
  return NATIVE_KOREAN_HOURS_24[hour] ?? '';
}
