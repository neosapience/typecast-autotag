import { numberToKorean, numberToNativeKorean } from '../utils/number-to-korean';

/** 기본 한글 숫자 (0-9) */
const DIGITS = ['영', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];

/**
 * 천단위 구분자 제거
 */
function removeThousandSeparators(str: string): string {
  return str.replace(/,/g, '');
}

/**
 * 소수를 한글로 변환 (예: 0.3 → 영 쩜 삼, 1.5 → 일 쩜 오)
 */
function formatDecimalSeconds(numStr: string): string {
  const parts = numStr.split('.');

  // 소수점이 없으면 정수로 처리
  if (parts.length === 1) {
    const intNum = parseInt(parts[0] ?? '0', 10);
    if (isNaN(intNum)) {
      return numStr;
    }
    return numberToKorean(intNum);
  }

  // 소수점이 여러 개인 경우 (예: "1.2.3") 원본 반환
  if (parts.length !== 2) {
    return numStr;
  }

  const integerPart = parts[0] ?? '';
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
  const decimalKorean = decimalPart
    .split('')
    .map((d) => {
      const digit = parseInt(d, 10);
      return DIGITS[digit] ?? d;
    })
    .join('');

  return intKorean + ' 쩜 ' + decimalKorean;
}

/**
 * minsec 함수의 옵션
 */
export interface MinsecOptions {
  /**
   * 결과 앞에 붙일 문자열
   * @default ''
   */
  prefix?: string;

  /**
   * 결과 뒤에 붙일 문자열
   * @default ''
   */
  suffix?: string;

  /**
   * 시/분/초를 정규화할지 여부
   * true면 60초를 1분으로, 60분을 1시간으로 변환
   * @default false
   */
  normalize?: boolean;
}

const DEFAULT_OPTIONS: Required<MinsecOptions> = {
  prefix: '',
  suffix: '',
  normalize: false,
};

/**
 * 시분초 문자열을 한글로 변환하는 내부 함수
 */
function convertSingleMinsec(
  input: string,
  opts: Required<MinsecOptions>
): { result: string; matched: boolean } {
  // 공백 제거 및 소문자 변환
  const normalizedInput = input.replace(/\s+/g, '').toLowerCase();

  // 시, 분, 초 파싱 (영어 + 한글 지원, 소수점 초 지원, 천단위 구분자 지원)
  const hourMatch = normalizedInput.match(/([\d,]+)(?:hours?|시간|h)/);
  const minMatch = normalizedInput.match(/([\d,]+)(?:minutes?|mins?|분|m)/);
  // 소수점 초 지원: 0.3초, 1.5초 등
  const secMatch = normalizedInput.match(/([\d,.]+)(?:seconds?|secs?|초|s)/);
  const numberOnlyMatch = normalizedInput.match(/^([\d,]+)$/);

  const hasAnyMatch = hourMatch || minMatch || secMatch || numberOnlyMatch;
  if (!hasAnyMatch) {
    return { result: input, matched: false };
  }

  let hours = hourMatch ? parseInt(removeThousandSeparators(hourMatch[1] ?? '0'), 10) : 0;
  let minutes = minMatch ? parseInt(removeThousandSeparators(minMatch[1] ?? '0'), 10) : 0;

  // 초는 소수점이 있을 수 있으므로 문자열로 관리 (천단위 구분자 제거)
  let secondsStr = secMatch
    ? removeThousandSeparators(secMatch[1] ?? '0')
    : numberOnlyMatch
      ? removeThousandSeparators(numberOnlyMatch[1] ?? '0')
      : '0';
  const isDecimalSeconds = secondsStr.includes('.');

  // 정규화 옵션 (소수점이 아닌 경우에만 적용)
  if (opts.normalize && !isDecimalSeconds) {
    let seconds = parseInt(secondsStr, 10);
    if (seconds >= 60) {
      minutes += Math.floor(seconds / 60);
      seconds = seconds % 60;
    }
    if (minutes >= 60) {
      hours += Math.floor(minutes / 60);
      minutes = minutes % 60;
    }
    secondsStr = String(seconds);
  }

  const parts: string[] = [];

  if (hours > 0 || hourMatch) {
    const hourKorean =
      hours === 0 ? '영' : hours < 100 ? numberToNativeKorean(hours) : numberToKorean(hours);
    parts.push(hourKorean + ' 시간');
  }

  if (minutes > 0 || minMatch) {
    parts.push(numberToKorean(minutes) + ' 분');
  }

  // 초 변환 (소수점 지원)
  const secondsNum = parseFloat(secondsStr);
  if (secondsNum > 0 || secMatch || numberOnlyMatch) {
    if (isDecimalSeconds) {
      parts.push(formatDecimalSeconds(secondsStr) + ' 초');
    } else {
      parts.push(numberToKorean(parseInt(secondsStr, 10)) + ' 초');
    }
  }

  return { result: parts.join(' '), matched: true };
}

/**
 * 대기시간(시분초)을 한글 안내 문구로 변환
 *
 * @param input - 변환할 시간
 *   - 영문 형식: '3m20s', '5m', '30s', '1h30m', '1H30M20S', '3hour', '5minutes', '10sec'
 *   - 한글 형식: '3분', '3분30초', '1시간30분'
 *   - 범위 형식: '1h30m~2h', '5분~10분' (~ 는 "에서"로 변환)
 * @param options - 변환 옵션 (prefix, suffix, normalize)
 * @returns 한글 시분초 문자열
 *
 * @example
 * ```typescript
 * minsec('3m20s'); // '삼 분 이십 초'
 * minsec('5m'); // '오 분'
 * minsec('30s'); // '삼십 초'
 * minsec('1h30m'); // '일 시간 삼십 분'
 * minsec('3분30초'); // '삼 분 삼십 초'
 * minsec('1시간30분'); // '일 시간 삼십 분'
 * minsec('90s', { normalize: true }); // '일 분 삼십 초'
 * minsec('5m', { prefix: '약 ', suffix: ' 소요' }); // '약 오 분 소요'
 * minsec('1h30m~2h'); // '한 시간 삼십 분에서 두 시간'
 * ```
 */
export function minsec(input: string, options?: MinsecOptions): string {
  if (!input || input.length === 0) {
    return input;
  }

  const opts = { ...DEFAULT_OPTIONS, ...options };

  // 범위 형식 처리: ~ 를 "에서"로 변환
  if (input.includes('~')) {
    const parts = input.split('~');
    if (parts.length === 2) {
      const first = convertSingleMinsec(parts[0]?.trim() ?? '', opts);
      const second = convertSingleMinsec(parts[1]?.trim() ?? '', opts);

      if (first.matched && second.matched) {
        return `${opts.prefix}${first.result}에서 ${second.result}${opts.suffix}`;
      }
    }
  }

  // 공백 제거 및 소문자 변환
  const normalizedInput = input.replace(/\s+/g, '').toLowerCase();

  // 시, 분, 초 파싱 (영어 + 한글 지원, 소수점 초 지원, 천단위 구분자 지원)
  // 시간: h, hour, hours, 시간
  // 분: m, min, minute, minutes, 분
  // 초: s, sec, second, seconds, 초 (소수점 지원)
  const hourMatch = normalizedInput.match(/([\d,]+)(?:hours?|시간|h)/);
  const minMatch = normalizedInput.match(/([\d,]+)(?:minutes?|mins?|분|m)/);
  // 소수점 초 지원: 0.3초, 1.5초 등
  const secMatch = normalizedInput.match(/([\d,.]+)(?:seconds?|secs?|초|s)/);

  // 숫자만 있는 경우 초로 해석
  const numberOnlyMatch = normalizedInput.match(/^([\d,]+)$/);

  // 어떤 단위도 매칭되지 않고 숫자만도 아닌 경우 원본 반환
  const hasAnyMatch = hourMatch || minMatch || secMatch || numberOnlyMatch;
  if (!hasAnyMatch) {
    return input;
  }

  let hours = hourMatch ? parseInt(removeThousandSeparators(hourMatch[1] ?? '0'), 10) : 0;
  let minutes = minMatch ? parseInt(removeThousandSeparators(minMatch[1] ?? '0'), 10) : 0;

  // 초는 소수점이 있을 수 있으므로 문자열로 관리 (천단위 구분자 제거)
  let secondsStr = secMatch
    ? removeThousandSeparators(secMatch[1] ?? '0')
    : numberOnlyMatch
      ? removeThousandSeparators(numberOnlyMatch[1] ?? '0')
      : '0';
  const isDecimalSeconds = secondsStr.includes('.');

  // 정규화 옵션이 활성화된 경우 (소수점이 아닌 경우에만 적용)
  if (opts.normalize && !isDecimalSeconds) {
    let seconds = parseInt(secondsStr, 10);
    // 초 → 분 변환
    if (seconds >= 60) {
      minutes += Math.floor(seconds / 60);
      seconds = seconds % 60;
    }
    // 분 → 시간 변환
    if (minutes >= 60) {
      hours += Math.floor(minutes / 60);
      minutes = minutes % 60;
    }
    secondsStr = String(seconds);
  }

  const parts: string[] = [];

  // 단위가 명시되었거나 값이 0보다 크면 표시
  // 시간은 고유어 수사 사용 (한 시간, 두 시간, 세 시간...)
  if (hours > 0 || hourMatch) {
    const hourKorean =
      hours === 0 ? '영' : hours < 100 ? numberToNativeKorean(hours) : numberToKorean(hours);
    parts.push(hourKorean + ' 시간');
  }

  // 분, 초는 한자어 수사 사용
  if (minutes > 0 || minMatch) {
    parts.push(numberToKorean(minutes) + ' 분');
  }

  // 초 변환 (소수점 지원)
  const secondsNum = parseFloat(secondsStr);
  if (secondsNum > 0 || secMatch || numberOnlyMatch) {
    if (isDecimalSeconds) {
      parts.push(formatDecimalSeconds(secondsStr) + ' 초');
    } else {
      parts.push(numberToKorean(parseInt(secondsStr, 10)) + ' 초');
    }
  }

  const timeStr = parts.join(' ');

  return `${opts.prefix}${timeStr}${opts.suffix}`;
}
