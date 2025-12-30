/**
 * 숫자를 한글로 변환하는 유틸리티 함수들
 */

/** 기본 한글 숫자 (0-9) */
const DIGITS = ['영', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];

/** 전화번호용 한글 숫자 (0-9) */
const PHONE_DIGITS = ['공', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];

/** 단위 (일, 십, 백, 천) */
const SMALL_UNITS = ['', '십', '백', '천'];

/** 큰 단위 (만, 억, 조) */
const BIG_UNITS = ['', '만', '억', '조'];

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
