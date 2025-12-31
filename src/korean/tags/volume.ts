import { numberToKorean, digitToKorean } from '../utils/number-to-korean';

/**
 * volume 함수의 옵션
 */
export interface VolumeOptions {
  /**
   * 숫자와 단위 사이 공백 포함 여부
   * @default true
   */
  includeSpace?: boolean;
}

/**
 * 용량/부피 단위 매핑
 */
const VOLUME_UNITS: Record<string, string> = {
  // 리터
  l: '리터',
  L: '리터',
  ℓ: '리터',
  리터: '리터',
  // 밀리리터
  ml: '밀리리터',
  mL: '밀리리터',
  ML: '밀리리터',
  밀리리터: '밀리리터',
  // 세제곱미터
  'm³': '세제곱미터',
  m3: '세제곱미터',
  세제곱미터: '세제곱미터',
  입방미터: '세제곱미터',
  // 세제곱센티미터
  'cm³': '세제곱센티미터',
  cm3: '세제곱센티미터',
  cc: '시시',
  CC: '시시',
  // 갤런
  gal: '갤런',
  갤런: '갤런',
};

/**
 * 소수를 한글로 변환
 */
function numberToKoreanWithDecimal(numStr: string): string {
  if (numStr.includes('.')) {
    const [intPart, decPart] = numStr.split('.');
    const intNum = parseInt(intPart || '0', 10);
    const intKorean = intNum === 0 ? '영' : numberToKorean(intNum);
    const decKorean = (decPart || '')
      .split('')
      .map((d) => digitToKorean(d))
      .join('');
    return intKorean + ' 쩜 ' + decKorean;
  }

  const num = parseInt(numStr, 10);
  if (isNaN(num)) return numStr;
  return num === 0 ? '영' : numberToKorean(num);
}

/**
 * 용량/부피를 한글로 변환
 *
 * 다양한 용량 표기를 지원합니다:
 * - 리터: 12L, 1.5L, 500mL
 * - 세제곱미터: 85m³
 * - 시시: 1000cc
 *
 * @param input - 변환할 용량 (문자열)
 * @param options - 옵션 (공백 포함 여부)
 * @returns 한글 용량 표현
 *
 * @example
 * ```typescript
 * volume('12L');       // '십이 리터'
 * volume('1.5L');      // '일 쩜 오 리터'
 * volume('500mL');     // '오백 밀리리터'
 * volume('85m³');      // '팔십오 세제곱미터'
 * volume('1000cc');    // '천 시시'
 * ```
 */
export function volume(input: string, options?: VolumeOptions): string {
  const includeSpace = options?.includeSpace ?? true;
  const space = includeSpace ? ' ' : '';

  const trimmed = input.trim();
  if (trimmed === '') return input;

  // 용량 단위 패턴 매칭 (더 긴 단위부터 먼저 매칭)
  const unitPattern = Object.keys(VOLUME_UNITS)
    .sort((a, b) => b.length - a.length)
    .join('|');

  const match = trimmed.match(new RegExp(`^([\\d,]+(?:\\.\\d+)?)\\s*(${unitPattern})$`, 'i'));

  if (match) {
    const numStr = (match[1] ?? '').replace(/,/g, '');
    const parsedUnit = match[2] ?? '';

    // 단위 찾기 (대소문자 무시)
    const lowerUnit = parsedUnit.toLowerCase();
    let targetUnit = parsedUnit;
    for (const [key, value] of Object.entries(VOLUME_UNITS)) {
      if (key.toLowerCase() === lowerUnit) {
        targetUnit = value;
        break;
      }
    }

    const koreanNum = numberToKoreanWithDecimal(numStr);
    return koreanNum + space + targetUnit;
  }

  return input;
}
