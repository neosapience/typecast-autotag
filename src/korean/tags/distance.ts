import { numberToKorean, digitToKorean } from '../utils/number-to-korean';

/**
 * distance 함수의 옵션
 */
export interface DistanceOptions {
  /**
   * 숫자와 단위 사이 공백 포함 여부
   * @default true
   */
  includeSpace?: boolean;
}

/**
 * 천단위 구분자 제거
 */
function removeThousandSeparators(str: string): string {
  return str.replace(/,/g, '');
}

/**
 * 거리 단위 매핑
 */
const DISTANCE_UNITS: Record<string, string> = {
  km: '킬로미터',
  m: '미터',
  cm: '센티미터',
  mm: '밀리미터',
  킬로미터: '킬로미터',
  미터: '미터',
  센티미터: '센티미터',
  밀리미터: '밀리미터',
};

/**
 * 거리 컨텍스트 키워드 (뒤에 오는 단어들)
 * 이 키워드들이 뒤에 오면 'm'을 '미터'로 해석
 */
export const DISTANCE_CONTEXT_AFTER = [
  // 위치/방향
  '전방',
  '후방',
  '앞',
  '뒤',
  '이내',
  '밖',
  '반경',
  '지점',
  '부근',
  '근처',
  '정도',
  '이상',
  '이하',
  '미만',
  '초과',
  '내외',
  '안팎',
  // 치수/측정
  '높이',
  '깊이',
  '폭',
  '너비',
  '길이',
  '두께',
  '직경',
  '반지름',
  // 이동/방향
  '직진',
  '좌회전',
  '우회전',
  '진입',
  '진행',
  '이동',
  '도보',
  '걸어서',
  // 스포츠/경기
  '달리기',
  '수영',
  '경주',
  '경기',
  '레이스',
  '코스',
  '트랙',
  '구간',
  // 기타
  '거리',
  '떨어진',
  '떨어져',
  '위치',
  '상공',
  '지하',
  '해발',
  '수심',
];

/**
 * 거리 컨텍스트 키워드 (앞에 오는 단어들)
 * 이 키워드들이 앞에 오면 'm'을 '미터'로 해석
 */
export const DISTANCE_CONTEXT_BEFORE = [
  // 측정/거리 관련
  '거리',
  '반경',
  '높이',
  '깊이',
  '폭',
  '너비',
  '길이',
  '두께',
  '직경',
  '반지름',
  '호스',
  '주행거리',
  '이동거리',
  '남은거리',
  '총거리',
  '총',
  '약',
  '대략',
  '최대',
  '최소',
  // 스포츠 종목 (100m, 200m, 400m, 800m, 1500m 등)
  '자유형',
  '배영',
  '평영',
  '접영',
  '혼영',
  '계영',
  '허들',
  '릴레이',
  '마라톤',
  '단거리',
  '중거리',
  '장거리',
];

/**
 * 거리를 한글로 변환
 *
 * 거리 표현에서는 한자어 수사를 사용합니다:
 * - 35,000km → 삼만오천 킬로미터
 * - 10km → 십 킬로미터
 *
 * @param input - 변환할 거리 (문자열)
 * @param options - 옵션 (공백 포함 여부)
 * @returns 한글 거리 표현
 *
 * @example
 * ```typescript
 * distance('35,000km');  // '삼만오천 킬로미터'
 * distance('10km');      // '십 킬로미터'
 * distance('500m');      // '오백 미터'
 * distance('1.5km');     // '일 쩜 오 킬로미터'
 * ```
 */
export function distance(input: string, options?: DistanceOptions): string {
  const includeSpace = options?.includeSpace ?? true;
  const space = includeSpace ? ' ' : '';

  const trimmed = input.trim();
  if (trimmed === '') return input;

  // 거리 단위 패턴 매칭 (더 긴 단위부터 먼저 매칭)
  const unitPattern = Object.keys(DISTANCE_UNITS)
    .sort((a, b) => b.length - a.length)
    .join('|');

  const match = trimmed.match(new RegExp(`^([\\d,]+(?:\\.\\d+)?)\\s*(${unitPattern})$`, 'i'));
  if (match) {
    const numStr = removeThousandSeparators(match[1] ?? '');
    const parsedUnit = match[2]?.toLowerCase() ?? '';
    const targetUnit = DISTANCE_UNITS[parsedUnit] ?? parsedUnit;

    // 소수점 처리
    if (numStr.includes('.')) {
      const [intPart, decPart] = numStr.split('.');
      const intNum = parseInt(intPart ?? '0', 10);
      const intKorean = intNum === 0 ? '영' : numberToKorean(intNum);
      const decKorean = (decPart ?? '')
        .split('')
        .map((d) => digitToKorean(d))
        .join(' ');
      return intKorean + ' 쩜 ' + decKorean + space + targetUnit;
    }

    const num = parseInt(numStr, 10);

    if (isNaN(num) || num < 0) {
      return input;
    }

    if (num === 0) {
      return '영' + space + targetUnit;
    }

    return numberToKorean(num) + space + targetUnit;
  }

  return input;
}

/**
 * 컨텍스트가 포함된 거리 표현을 한글로 변환
 * 예: "500m 전방" → "오백 미터 전방"
 *
 * @param input - 변환할 거리 (컨텍스트 포함 문자열)
 * @param options - 옵션 (공백 포함 여부)
 * @returns 한글 거리 표현
 */
export function distanceWithContext(input: string, options?: DistanceOptions): string {
  const includeSpace = options?.includeSpace ?? true;
  const space = includeSpace ? ' ' : '';

  const trimmed = input.trim();
  if (trimmed === '') return input;

  // 컨텍스트 키워드 패턴 (뒤에 오는 경우)
  const afterContextPattern = DISTANCE_CONTEXT_AFTER.join('|');

  // 숫자 + m + 컨텍스트 패턴
  const matchWithContext = trimmed.match(
    new RegExp(`^([\\d,]+(?:\\.\\d+)?)\\s*m\\s*(${afterContextPattern})(.*)$`, 'i')
  );

  if (matchWithContext) {
    const numStr = removeThousandSeparators(matchWithContext[1] ?? '');
    const context = matchWithContext[2] ?? '';
    const rest = matchWithContext[3] ?? '';

    // 소수점 처리
    if (numStr.includes('.')) {
      const [intPart, decPart] = numStr.split('.');
      const intNum = parseInt(intPart ?? '0', 10);
      const intKorean = intNum === 0 ? '영' : numberToKorean(intNum);
      const decKorean = (decPart ?? '')
        .split('')
        .map((d) => digitToKorean(d))
        .join(' ');
      return intKorean + ' 쩜 ' + decKorean + space + '미터 ' + context + rest;
    }

    const num = parseInt(numStr, 10);

    if (isNaN(num) || num < 0) {
      return input;
    }

    if (num === 0) {
      return '영' + space + '미터 ' + context + rest;
    }

    return numberToKorean(num) + space + '미터 ' + context + rest;
  }

  // 일반 거리 변환으로 폴백
  return distance(input, options);
}
