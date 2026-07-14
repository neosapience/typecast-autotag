import { numberToKorean, digitToKorean } from '../utils/number-to-korean';

/**
 * dataCapacity 함수의 옵션
 */
export interface DataCapacityOptions {
  /**
   * 숫자와 단위 사이 공백 포함 여부
   * @default true
   */
  includeSpace?: boolean;
}

/**
 * 데이터/전력 단위 매핑
 */
const DATA_UNITS: Record<string, string> = {
  // 데이터 용량
  b: '바이트',
  B: '바이트',
  kb: '킬로바이트',
  KB: '킬로바이트',
  mb: '메가바이트',
  MB: '메가바이트',
  gb: '기가바이트',
  GB: '기가바이트',
  tb: '테라바이트',
  TB: '테라바이트',
  // 데이터 속도
  bps: '비피에스',
  Bps: '비피에스',
  kbps: '킬로비피에스',
  Kbps: '킬로비피에스',
  mbps: '메가비피에스',
  Mbps: '메가비피에스',
  gbps: '기가비피에스',
  Gbps: '기가비피에스',
  // 전력량
  wh: '와트시',
  Wh: '와트시',
  kwh: '킬로와트시',
  kWh: '킬로와트시',
  KWH: '킬로와트시',
  mwh: '메가와트시',
  MWh: '메가와트시',
  // 전력
  w: '와트',
  W: '와트',
  kw: '킬로와트',
  kW: '킬로와트',
  KW: '킬로와트',
  mw: '메가와트',
  MW: '메가와트',
  tw: '테라와트',
  TW: '테라와트',
  // 전압
  v: '볼트',
  V: '볼트',
  kv: '킬로볼트',
  kV: '킬로볼트',
  // 전류
  a: '암페어',
  A: '암페어',
  ma: '밀리암페어',
  mA: '밀리암페어',
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
 * 데이터/전력 용량을 한글로 변환
 *
 * 다양한 데이터/전력 표기를 지원합니다:
 * - 데이터 용량: 6GB, 500MB, 1TB
 * - 데이터 속도: 400Kbps, 100Mbps
 * - 전력량: 450kWh, 1.5MWh
 * - 전력: 60W, 2.5kW
 *
 * @param input - 변환할 용량 (문자열)
 * @param options - 옵션 (공백 포함 여부)
 * @returns 한글 용량 표현
 *
 * @example
 * ```typescript
 * dataCapacity('6GB');       // '육 기가바이트'
 * dataCapacity('400Kbps');   // '사백 킬로비피에스'
 * dataCapacity('450kWh');    // '사백오십 킬로와트시'
 * dataCapacity('+70kWh');    // '플러스 칠십 킬로와트시'
 * ```
 */
export function dataCapacity(input: string, options?: DataCapacityOptions): string {
  const includeSpace = options?.includeSpace ?? true;
  const space = includeSpace ? ' ' : '';

  const trimmed = input.trim();
  if (trimmed === '') return input;

  // 데이터 단위 패턴 매칭 (더 긴 단위부터 먼저 매칭)
  const unitPattern = Object.keys(DATA_UNITS)
    .sort((a, b) => b.length - a.length)
    .join('|');

  const match = trimmed.match(new RegExp(`^([+-]?[\\d,]+(?:\\.\\d+)?)\\s*(${unitPattern})$`, 'i'));

  if (match) {
    let numStr = (match[1] ?? '').replace(/,/g, '');
    const parsedUnit = match[2] ?? '';

    // + 또는 - 처리
    let prefix = '';
    if (numStr.startsWith('+')) {
      prefix = '플러스 ';
      numStr = numStr.slice(1);
    } else if (numStr.startsWith('-')) {
      prefix = '마이너스 ';
      numStr = numStr.slice(1);
    }

    // 단위 찾기 (대소문자 고려)
    let targetUnit = parsedUnit;
    for (const [key, value] of Object.entries(DATA_UNITS)) {
      if (key === parsedUnit || key.toLowerCase() === parsedUnit.toLowerCase()) {
        targetUnit = value;
        break;
      }
    }

    const koreanNum = numberToKoreanWithDecimal(numStr);
    return prefix + koreanNum + space + targetUnit;
  }

  return input;
}
