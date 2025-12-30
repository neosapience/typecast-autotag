import { hourToNativeKorean, numberToKorean } from '../utils/number-to-korean';

/**
 * time 함수의 옵션
 */
export interface TimeOptions {
  /**
   * 24시간제 사용 여부
   * false: 12시간제 (오전/오후 표시)
   * true: 24시간제
   * @default false
   */
  use24Hour?: boolean;

  /**
   * 초 단위 포함 여부
   * @default false (입력에 초가 있으면 자동 포함)
   */
  includeSeconds?: boolean;
}

interface ParsedTime {
  hours: number;
  minutes: number;
  seconds?: number;
}

/**
 * 다양한 형식의 시간 문자열을 파싱
 */
function parseTime(str: string): ParsedTime | null {
  // HH:MM:SS 또는 HH:MM 형식
  const colonMatch = str.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (colonMatch) {
    return {
      hours: parseInt(colonMatch[1] ?? '0', 10),
      minutes: parseInt(colonMatch[2] ?? '0', 10),
      seconds: colonMatch[3] ? parseInt(colonMatch[3], 10) : undefined,
    };
  }

  // 한글 형식: "14시30분", "오후 2시 30분", "3시", "15시 30분 45초"
  const koreanMatch = str.match(
    /^(오전|오후)?\s*(\d{1,2})시\s*(?:(\d{1,2})분)?\s*(?:(\d{1,2})초)?$/
  );
  if (koreanMatch) {
    let hours = parseInt(koreanMatch[2] ?? '0', 10);
    const ampm = koreanMatch[1];

    // 오전/오후 처리
    if (ampm === '오후' && hours < 12) {
      hours += 12;
    } else if (ampm === '오전' && hours === 12) {
      hours = 0;
    }

    return {
      hours,
      minutes: koreanMatch[3] ? parseInt(koreanMatch[3], 10) : 0,
      seconds: koreanMatch[4] ? parseInt(koreanMatch[4], 10) : undefined,
    };
  }

  // HHMM 형식 (4자리 숫자)
  if (/^\d{4}$/.test(str)) {
    return {
      hours: parseInt(str.substring(0, 2), 10),
      minutes: parseInt(str.substring(2, 4), 10),
    };
  }

  // HHMMSS 형식 (6자리 숫자)
  if (/^\d{6}$/.test(str)) {
    return {
      hours: parseInt(str.substring(0, 2), 10),
      minutes: parseInt(str.substring(2, 4), 10),
      seconds: parseInt(str.substring(4, 6), 10),
    };
  }

  return null;
}

/**
 * 시각을 한글로 변환
 *
 * 한국어에서 시(時)는 고유어 수사를 사용하고, 분/초는 한자어 수사를 사용합니다:
 * - 시: 한 시, 두 시, 세 시, ..., 열두 시
 * - 분/초: 일 분, 이 분, 삼십 분, ...
 *
 * @param input - 변환할 시간 (문자열)
 * @param options - 옵션 (24시간제, 초 포함 여부)
 * @returns 한글 시각 표현
 *
 * @example
 * ```typescript
 * time('14:30'); // '오후 두 시 삼십 분'
 * time('09:05'); // '오전 아홉 시 오 분'
 * time('12:00'); // '오후 열두 시'
 * time('00:00'); // '오전 열두 시'
 * time('14:30', { use24Hour: true }); // '열네 시 삼십 분'
 * time('14:30:45'); // '오후 두 시 삼십 분 사십오 초'
 * time('3시'); // '세 시'
 * time('오후 3시 30분'); // '오후 세 시 삼십 분'
 * ```
 */
export function time(input: string, options?: TimeOptions): string {
  if (!input || input.trim() === '') {
    return input;
  }

  const trimmed = input.trim();
  const parsed = parseTime(trimmed);

  if (!parsed) {
    return input;
  }

  const { hours, minutes, seconds } = parsed;
  const use24Hour = options?.use24Hour ?? false;

  // 유효성 검사
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return input;
  }
  if (seconds !== undefined && (seconds < 0 || seconds > 59)) {
    return input;
  }

  const parts: string[] = [];

  if (use24Hour) {
    // 24시간제: 열네 시, 스물세 시 등
    // 24시간제에서도 시는 고유어를 사용
    const hourStr = hourToNativeKorean(hours);
    // 12시 이상인 경우 추가 처리
    if (hours >= 13) {
      // 13-23시: 열세 시, 열네 시, ..., 스물세 시
      const hour24Readings: Record<number, string> = {
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
      parts.push((hour24Readings[hours] ?? hourStr) + ' 시');
    } else {
      parts.push(hourStr + ' 시');
    }
  } else {
    // 12시간제: 오전/오후 + 고유어 시
    const isPM = hours >= 12;
    const ampm = isPM ? '오후' : '오전';
    const hourStr = hourToNativeKorean(hours);
    parts.push(ampm + ' ' + hourStr + ' 시');
  }

  // 분 처리
  if (minutes > 0 || seconds !== undefined) {
    parts.push(numberToKorean(minutes) + ' 분');
  }

  // 초 처리
  if (seconds !== undefined && seconds > 0) {
    parts.push(numberToKorean(seconds) + ' 초');
  }

  return parts.join(' ');
}
