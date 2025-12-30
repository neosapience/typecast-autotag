import { date } from './date';
import { time, TimeOptions } from './time';

/**
 * datetime 함수의 옵션
 */
export interface DatetimeOptions {
  /**
   * 날짜와 시간 사이 구분자
   * @default ' '
   */
  separator?: string;

  /**
   * 24시간제 사용 여부 (time 옵션)
   * @default false
   */
  use24Hour?: boolean;
}

interface ParsedDatetime {
  datePart: string;
  timePart: string;
}

/**
 * 날짜시간 문자열을 날짜와 시간으로 분리
 */
function parseDatetime(str: string): ParsedDatetime | null {
  // ISO 8601 형식: 2024-01-15T14:30:00, 2024-01-15T14:30
  const isoMatch = str.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}(?::\d{2})?)$/);
  if (isoMatch) {
    return {
      datePart: isoMatch[1] ?? '',
      timePart: isoMatch[2] ?? '',
    };
  }

  // 공백으로 구분된 형식: 2024-01-15 14:30, 2024/01/15 14:30:00
  const spaceMatch = str.match(/^(\d{4}[-/.]\d{1,2}[-/.]\d{1,2})\s+(\d{1,2}:\d{2}(?::\d{2})?)$/);
  if (spaceMatch) {
    return {
      datePart: spaceMatch[1] ?? '',
      timePart: spaceMatch[2] ?? '',
    };
  }

  // 한글 형식: 2024년 1월 15일 14시 30분
  const koreanMatch = str.match(
    /^(\d{4}년\s*\d{1,2}월\s*\d{1,2}일)\s+(\d{1,2}시(?:\s*\d{1,2}분)?(?:\s*\d{1,2}초)?)$/
  );
  if (koreanMatch) {
    return {
      datePart: koreanMatch[1] ?? '',
      timePart: koreanMatch[2] ?? '',
    };
  }

  // 한글 + 오전/오후 형식: 2024년 1월 15일 오후 2시 30분
  const koreanAmPmMatch = str.match(
    /^(\d{4}년\s*\d{1,2}월\s*\d{1,2}일)\s+((?:오전|오후)\s*\d{1,2}시(?:\s*\d{1,2}분)?(?:\s*\d{1,2}초)?)$/
  );
  if (koreanAmPmMatch) {
    return {
      datePart: koreanAmPmMatch[1] ?? '',
      timePart: koreanAmPmMatch[2] ?? '',
    };
  }

  // YYYYMMDD HHMMSS 형식
  const numericMatch = str.match(/^(\d{8})\s+(\d{4}|\d{6})$/);
  if (numericMatch) {
    const timePart = numericMatch[2] ?? '';
    // HHMM → HH:MM, HHMMSS → HH:MM:SS로 변환
    let formattedTime = '';
    if (timePart.length === 4) {
      formattedTime = timePart.substring(0, 2) + ':' + timePart.substring(2, 4);
    } else if (timePart.length === 6) {
      formattedTime =
        timePart.substring(0, 2) + ':' + timePart.substring(2, 4) + ':' + timePart.substring(4, 6);
    }
    return {
      datePart: numericMatch[1] ?? '',
      timePart: formattedTime,
    };
  }

  return null;
}

/**
 * 날짜와 시간을 함께 한글로 변환
 *
 * 날짜는 date 태그의 형식을, 시간은 time 태그의 형식을 따릅니다.
 * 단, datetime에서는 "일생" 대신 "일"로 끝납니다.
 *
 * @param input - 변환할 날짜시간 (문자열)
 * @param options - 옵션 (구분자, 24시간제)
 * @returns 한글 날짜시간 표현
 *
 * @example
 * ```typescript
 * datetime('2024-01-15T14:30'); // '이천이십사년 일 월 십오 일 오후 두 시 삼십 분'
 * datetime('2024-01-15 14:30'); // '이천이십사년 일 월 십오 일 오후 두 시 삼십 분'
 * datetime('2024년 1월 15일 14시 30분'); // '이천이십사년 일 월 십오 일 열네 시 삼십 분'
 * datetime('2024-06-10T09:05', { use24Hour: true }); // '이천이십사년 유 월 십 일 아홉 시 오 분'
 * ```
 */
export function datetime(input: string, options?: DatetimeOptions): string {
  if (!input || input.trim() === '') {
    return input;
  }

  const trimmed = input.trim();
  const parsed = parseDatetime(trimmed);

  if (!parsed) {
    return input;
  }

  const { datePart, timePart } = parsed;
  const separator = options?.separator ?? ' ';

  // date 함수 결과에서 '생' 제거 (datetime에서는 생년월일이 아니므로)
  let dateResult = date(datePart);
  dateResult = dateResult.replace(/일생$/, '일');

  // time 함수 호출
  const timeOptions: TimeOptions = {
    use24Hour: options?.use24Hour ?? false,
  };
  const timeResult = time(timePart, timeOptions);

  // 둘 다 변환에 실패하면 원본 반환
  if (dateResult === datePart && timeResult === timePart) {
    return input;
  }

  return dateResult + separator + timeResult;
}
