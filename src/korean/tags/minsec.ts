import { numberToKorean } from '../utils/number-to-korean';

/**
 * 대기시간(분초)을 한글 안내 문구로 변환
 *
 * @param input - 변환할 시간 (예: '3m20s', '5m', '30s')
 * @returns 한글 대기시간 안내 문구
 *
 * @example
 * ```typescript
 * minsec('3m20s'); // '상담사연결까지 약 삼 분 이십 초 소요예정입니다'
 * minsec('5m'); // '상담사연결까지 약 오 분 소요예정입니다'
 * minsec('30s'); // '상담사연결까지 약 삼십 초 소요예정입니다'
 * ```
 */
export function minsec(input: string): string {
  if (!input || input.length === 0) {
    return input;
  }

  // 분과 초 파싱
  const minMatch = input.match(/(\d+)m/);
  const secMatch = input.match(/(\d+)s/);

  const minutes = minMatch ? parseInt(minMatch[1], 10) : 0;
  const seconds = secMatch ? parseInt(secMatch[1], 10) : 0;

  if (minutes === 0 && seconds === 0) {
    return input;
  }

  let timeStr = '';

  if (minutes > 0) {
    timeStr += numberToKorean(minutes) + ' 분';
  }

  if (seconds > 0) {
    if (timeStr) timeStr += ' ';
    timeStr += numberToKorean(seconds) + ' 초';
  }

  return `상담사연결까지 약 ${timeStr} 소요예정입니다`;
}
