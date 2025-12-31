import { numberToKorean, numberToNativeKorean } from '../utils/number-to-korean';

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

  // 시, 분, 초 파싱 (영어 + 한글 지원)
  const hourMatch = normalizedInput.match(/(\d+)(?:hours?|시간|h)/);
  const minMatch = normalizedInput.match(/(\d+)(?:minutes?|mins?|분|m)/);
  const secMatch = normalizedInput.match(/(\d+)(?:seconds?|secs?|초|s)/);
  const numberOnlyMatch = normalizedInput.match(/^(\d+)$/);

  let hours = hourMatch ? parseInt(hourMatch[1] ?? '0', 10) : 0;
  let minutes = minMatch ? parseInt(minMatch[1] ?? '0', 10) : 0;
  let seconds = secMatch
    ? parseInt(secMatch[1] ?? '0', 10)
    : numberOnlyMatch
      ? parseInt(numberOnlyMatch[1] ?? '0', 10)
      : 0;

  const hasAnyMatch = hourMatch || minMatch || secMatch || numberOnlyMatch;
  if (!hasAnyMatch) {
    return { result: input, matched: false };
  }

  if (opts.normalize) {
    if (seconds >= 60) {
      minutes += Math.floor(seconds / 60);
      seconds = seconds % 60;
    }
    if (minutes >= 60) {
      hours += Math.floor(minutes / 60);
      minutes = minutes % 60;
    }
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

  if (seconds > 0 || secMatch || numberOnlyMatch) {
    parts.push(numberToKorean(seconds) + ' 초');
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

  // 시, 분, 초 파싱 (영어 + 한글 지원)
  // 시간: h, hour, hours, 시간
  // 분: m, min, minute, minutes, 분
  // 초: s, sec, second, seconds, 초
  const hourMatch = normalizedInput.match(/(\d+)(?:hours?|시간|h)/);
  const minMatch = normalizedInput.match(/(\d+)(?:minutes?|mins?|분|m)/);
  const secMatch = normalizedInput.match(/(\d+)(?:seconds?|secs?|초|s)/);

  // 숫자만 있는 경우 초로 해석
  const numberOnlyMatch = normalizedInput.match(/^(\d+)$/);

  let hours = hourMatch ? parseInt(hourMatch[1] ?? '0', 10) : 0;
  let minutes = minMatch ? parseInt(minMatch[1] ?? '0', 10) : 0;
  let seconds = secMatch
    ? parseInt(secMatch[1] ?? '0', 10)
    : numberOnlyMatch
      ? parseInt(numberOnlyMatch[1] ?? '0', 10)
      : 0;

  // 어떤 단위도 매칭되지 않고 숫자만도 아닌 경우 원본 반환
  const hasAnyMatch = hourMatch || minMatch || secMatch || numberOnlyMatch;
  if (!hasAnyMatch) {
    return input;
  }

  // 정규화 옵션이 활성화된 경우
  if (opts.normalize) {
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

  if (seconds > 0 || secMatch || numberOnlyMatch) {
    parts.push(numberToKorean(seconds) + ' 초');
  }

  const timeStr = parts.join(' ');

  return `${opts.prefix}${timeStr}${opts.suffix}`;
}
