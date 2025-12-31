import { numberToKorean, digitToKorean } from '../utils/number-to-korean';

/**
 * temperature 함수의 옵션
 */
export interface TemperatureOptions {
  /**
   * 숫자와 단위 사이 공백 포함 여부
   * @default true
   */
  includeSpace?: boolean;
}

/**
 * 온도 단위 타입 판별
 */
function getTempType(unit: string): 'celsius' | 'fahrenheit' | 'kelvin' {
  const lowerUnit = unit.toLowerCase();
  if (lowerUnit === 'f' || lowerUnit === '°f' || unit === '℉') {
    return 'fahrenheit';
  }
  if (lowerUnit === 'k' || lowerUnit === '켈빈') {
    return 'kelvin';
  }
  return 'celsius';
}

/**
 * 소수를 한글로 변환
 */
function numberToKoreanWithDecimal(numStr: string): string {
  if (numStr.includes('.')) {
    const [intPart, decPart] = numStr.split('.');
    const intNum = parseInt(intPart || '0', 10);
    const intKorean = intNum === 0 ? '영' : numberToKorean(Math.abs(intNum));
    const decKorean = (decPart || '')
      .split('')
      .map((d) => digitToKorean(d))
      .join('');
    return intKorean + ' 쩜 ' + decKorean;
  }

  const num = parseInt(numStr, 10);
  if (isNaN(num)) return numStr;
  return num === 0 ? '영' : numberToKorean(Math.abs(num));
}

/**
 * 온도를 한글로 변환
 *
 * 다양한 온도 표기를 지원합니다:
 * - 섭씨: 20℃, 20°C, 20도
 * - 화씨: 68℉, 68°F
 * - 켈빈: 273K
 * - 음수 온도: -5℃ → 영하 오 도
 *
 * @param input - 변환할 온도 (문자열)
 * @param options - 옵션 (공백 포함 여부)
 * @returns 한글 온도 표현
 *
 * @example
 * ```typescript
 * temperature('20℃');      // '이십 도'
 * temperature('-5℃');      // '영하 오 도'
 * temperature('20°C');     // '이십 도'
 * temperature('68℉');      // '육십팔 화씨'
 * temperature('273K');     // '이백칠십삼 켈빈'
 * temperature('20.5℃');    // '이십 쩜 오 도'
 * temperature('20도');     // '이십 도'
 * ```
 */
export function temperature(input: string, options?: TemperatureOptions): string {
  const includeSpace = options?.includeSpace ?? true;
  const space = includeSpace ? ' ' : '';

  const trimmed = input.trim();
  if (trimmed === '') return input;

  // 온도 패턴: [+-]?숫자[.소수] + 단위
  // 단위: ℃, ℉, °C, °F, K, 도, 켈빈
  const match = trimmed.match(/^([+-]?[\d,]+(?:\.\d+)?)\s*(℃|℉|°[CcFf]|[CcFfKk]|도|켈빈)$/);

  if (match) {
    let numStr = match[1]?.replace(/,/g, '') ?? '';
    const unit = match[2] ?? '';

    // 음수 처리
    const isNegative = numStr.startsWith('-');
    if (isNegative) {
      numStr = numStr.slice(1);
    }

    const tempType = getTempType(unit);
    const koreanNum = numberToKoreanWithDecimal(numStr);

    // 단위 결정
    let targetUnit: string;
    if (tempType === 'fahrenheit') {
      targetUnit = '화씨';
    } else if (tempType === 'kelvin') {
      targetUnit = '켈빈';
    } else {
      targetUnit = '도';
    }

    // 음수는 "영하"로 표현 (섭씨/화씨만)
    if (isNegative && tempType !== 'kelvin') {
      return '영하' + space + koreanNum + space + targetUnit;
    }

    return koreanNum + space + targetUnit;
  }

  return input;
}

/**
 * 온도 범위를 한글로 변환
 * 예: "20℃~22℃" → "이십 도에서 이십이 도"
 *
 * @param input - 변환할 온도 범위 (문자열)
 * @param options - 옵션 (공백 포함 여부)
 * @returns 한글 온도 범위 표현
 */
export function temperatureRange(input: string, options?: TemperatureOptions): string {
  const trimmed = input.trim();
  if (trimmed === '') return input;

  // 온도 범위 패턴: N도~M도, N℃~M℃ 등
  const rangeMatch = trimmed.match(
    /^([+-]?[\d,]+(?:\.\d+)?)\s*(℃|℉|°[CcFf]|[Kk]|도|켈빈)?\s*[~-]\s*([+-]?[\d,]+(?:\.\d+)?)\s*(℃|℉|°[CcFf]|[Kk]|도|켈빈)?$/
  );

  if (rangeMatch) {
    const num1 = rangeMatch[1] ?? '';
    const unit1 = rangeMatch[2] ?? rangeMatch[4] ?? '도';
    const num2 = rangeMatch[3] ?? '';
    const unit2 = rangeMatch[4] ?? unit1;

    const temp1 = temperature(num1 + unit1, options);
    const temp2 = temperature(num2 + unit2, options);

    return temp1 + '에서 ' + temp2;
  }

  return temperature(input, options);
}
