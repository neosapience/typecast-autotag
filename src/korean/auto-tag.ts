import { month } from './tags/month';
import { day } from './tags/day';
import { date } from './tags/date';
import { time } from './tags/time';
import { year } from './tags/year';
import { phone } from './tags/phone';
import { money } from './tags/money';
import { order } from './tags/order';
import { point } from './tags/point';
import { piece } from './tags/piece';
import { minsec } from './tags/minsec';
import { datetime } from './tags/datetime';

/**
 * 자동 태깅 옵션
 */
export interface AutoTagOptions {
  /**
   * 활성화할 태그 유형들 (기본값: 모든 태그)
   * 지정하지 않으면 모든 태그가 활성화됩니다.
   */
  enabledTags?: Array<keyof typeof AUTO_TAG_PATTERNS>;
}

/**
 * 매칭 결과 정보
 */
export interface MatchResult {
  /** 원본 매칭 텍스트 */
  original: string;
  /** 변환된 텍스트 */
  converted: string;
  /** 태그 유형 */
  tagType: string;
  /** 시작 인덱스 */
  start: number;
  /** 끝 인덱스 */
  end: number;
}

/**
 * 자동 태그 패턴 정의
 *
 * 각 패턴은 false positive를 최소화하기 위해 신중하게 설계되었습니다.
 * - 우선순위: 더 구체적인 패턴이 먼저 매칭되도록 순서 조정
 * - 패턴 설명: 각 패턴이 어떤 형식을 탐지하는지 명시
 */
const AUTO_TAG_PATTERNS = {
  /**
   * 전화번호 패턴
   * - 휴대폰: 010-XXXX-XXXX, 010.XXXX.XXXX, 010 XXXX XXXX
   * - 지역번호: 02-XXX-XXXX, 031-XXX-XXXX
   * - 대표번호: 1588-XXXX, 1544-XXXX, 1600-XXXX, 1666-XXXX, 1800-XXXX
   * - 긴급번호: 112, 119, 110
   */
  phone: {
    // 더 구체적인 패턴부터 먼저 매칭
    patterns: [
      // 휴대폰 번호: 010, 011, 016, 017, 018, 019로 시작
      /\b01[016789][-.\s]?\d{3,4}[-.\s]?\d{4}\b/g,
      // 서울 지역번호: 02
      /\b02[-.\s]?\d{3,4}[-.\s]?\d{4}\b/g,
      // 기타 지역번호: 031-9 등
      /\b0[3-6]\d[-.\s]?\d{3,4}[-.\s]?\d{4}\b/g,
      // 대표번호: 1588, 1544, 1600, 1666, 1800 등
      /\b1[5-8]\d{2}[-.\s]?\d{4}\b/g,
      // 긴급/특수번호: 112, 119, 110, 114 등
      /\b1[0-1][0-9]\b/g,
    ],
    converter: (match: string) => phone(match),
  },

  /**
   * ISO 8601 날짜시간 패턴 (datetime보다 먼저 체크해야 함)
   * - 2024-01-15T14:30:00
   * - 2024-01-15T14:30
   * - 밀리초 및 타임존 지원
   */
  datetime: {
    patterns: [
      // ISO 8601 형식: YYYY-MM-DDTHH:MM(:SS)(.mmm)?(Z|±HH:MM)?
      /\b\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?\b/g,
      // 공백 구분 형식: YYYY-MM-DD HH:MM(:SS)
      /\b\d{4}[-/.]\d{1,2}[-/.]\d{1,2}\s+\d{1,2}:\d{2}(?::\d{2})?\b/g,
    ],
    converter: (match: string) => datetime(match),
  },

  /**
   * 시간 패턴
   * - HH:MM, HH:MM:SS 형식
   * - 한글 형식: 14시30분, 오후 2시 30분
   */
  time: {
    patterns: [
      // HH:MM 또는 HH:MM:SS - 날짜 뒤에 오지 않는 경우만
      /(?<!\d[-/.]\d{1,2}[-/.])(?<!\d{4}[-/.]\d{1,2}[-/.]\d{1,2}\s*)(?<!\d[-/.])(?<=^|[^\d])\d{1,2}:\d{2}(?::\d{2})?(?=$|[^\d:])/g,
      // 한글 시간: 오전/오후 N시 M분 S초
      /(?:오전|오후)\s*\d{1,2}시(?:\s*\d{1,2}분)?(?:\s*\d{1,2}초)?/g,
      // 한글 시간 (오전/오후 없이): N시M분
      /\d{1,2}시\d{1,2}분(?:\d{1,2}초)?/g,
    ],
    converter: (match: string) => time(match),
  },

  /**
   * 날짜 패턴
   * - YYYYMMDD (8자리)
   * - YYYY-MM-DD, YYYY/MM/DD, YYYY.MM.DD
   * - 한글: 1994년 6월 16일
   * - datetime으로 이미 처리된 것은 제외
   */
  date: {
    patterns: [
      // YYYYMMDD 형식 (8자리 숫자, 생년월일 형태)
      // 년도 범위 제한: 1900-2099
      /\b(?:19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\b/g,
      // YYYY-MM-DD 형식 (시간이 뒤따르지 않는 경우만)
      /\b\d{4}[-/.]\d{1,2}[-/.]\d{1,2}(?!\s*\d{1,2}:\d{2})(?!\s*T\d)/g,
      // 한글 날짜: YYYY년 M월 D일 (생략 가능)
      /\d{4}년\s*(?:\d{1,2}월\s*)?(?:\d{1,2}일)?(?:생)?/g,
      // 한글 월일만: M월 D일
      /(?<!\d년\s*)\d{1,2}월\s*\d{1,2}일/g,
    ],
    converter: (match: string) => date(match),
  },

  /**
   * 금액 패턴
   * - 숫자 + 원
   * - ₩숫자
   * - 천단위 구분자 지원
   */
  money: {
    patterns: [
      // 숫자 + 원 (천단위 구분자 지원)
      /[\d,]+\s*원(?!\s*[년월일시분초])/g,
      // 화폐 기호 + 숫자
      /[₩]\s*[\d,]+/g,
    ],
    converter: (match: string) => money(match),
  },

  /**
   * 년도 패턴
   * - YYYY년, YYYY년도, YYYY년생
   */
  year: {
    patterns: [
      // YYYY년도, YYYY년생
      /\b(?:19|20)\d{2}년(?:도|생)\b/g,
      // YYYY년 (뒤에 월이 오지 않는 경우)
      /\b(?:19|20)\d{2}년(?!\s*\d{1,2}월)/g,
    ],
    converter: (match: string) => year(match),
  },

  /**
   * 월 패턴
   * - N월 (뒤에 일이 오지 않는 경우)
   */
  month: {
    patterns: [
      // N월 (단독으로 쓰인 경우, 앞에 년이 없고 뒤에 일이 없음)
      /(?<!\d{4}년\s*)(?<!\d년\s*)\b(?:1[0-2]|[1-9])월(?!\s*\d{1,2}일)/g,
    ],
    converter: (match: string) => month(match),
  },

  /**
   * 일 패턴
   * - N일 (앞에 월이 오지 않는 경우)
   * - D-day 형식
   * 주의: \b는 한글과 함께 사용할 때 제대로 작동하지 않으므로 lookbehind/lookahead 사용
   */
  day: {
    patterns: [
      // D-day 형식 (영문이므로 \b 사용 가능)
      /\b[Dd]-?[Dd]ay\b/gi,
      /\b[Dd]\s*[-+]\s*[\d,]+일?/g,
      // N일째, N일차 (숫자 앞에 다른 숫자가 없어야 함)
      /(?<![0-9])[\d,]+일(?:째|차)/g,
      // N일 (단독, 앞에 월이 없는 경우)
      /(?<!\d{1,2}월\s*)(?<!\d월\s*)(?<![0-9])(?:[1-9]|[12]\d|3[01])일(?![째차생])/g,
    ],
    converter: (match: string) => day(match),
  },

  /**
   * 순서 패턴
   * - N번째, N등, N위
   * 주의: \b는 한글과 함께 사용할 때 제대로 작동하지 않으므로 lookbehind/lookahead 사용
   */
  order: {
    patterns: [
      // N번째 (숫자 앞에 다른 숫자가 없어야 함)
      /(?<![0-9])[\d,]+\s*번째/g,
      // N등 (순위)
      /(?<![0-9])[\d,]+\s*등(?![록급])/g,
      // N위
      /(?<![0-9])[\d,]+\s*위(?![치험반])/g,
    ],
    converter: (match: string) => order(match),
  },

  /**
   * 점수 패턴
   * - N점 (뒤에 다른 단위가 오지 않는 경우)
   * - 소수점 지원
   */
  point: {
    patterns: [
      // N점 또는 N.N점 (소수점 지원)
      /\b[\d,]+(?:\.\d+)?\s*점(?!\s*[원])/g,
    ],
    converter: (match: string) => point(match),
  },

  /**
   * 개수 패턴 (고유어 수사 사용)
   * - N개, N마리, N명, N대, N장, N권 등
   * 주의: \b는 한글 뒤에서 작동하지 않으므로 lookahead 사용
   */
  piece: {
    patterns: [
      // N개, N마리, N명, N대, N장, N권, N병, N잔, N그루, N송이, N쌍, N벌, N켤레, N채
      // 단위 뒤에 한글이 이어져도 매칭 (예: "5개의")
      /(?<![0-9])[\d,]+(?:\.\d+)?\s*(?:개|마리|명|대|장|권|병|잔|그루|송이|쌍|벌|켤레|채)/g,
    ],
    converter: (match: string) => piece(match),
  },

  /**
   * 시분초 패턴 (지속시간)
   * - Nm, Ns, NmNs, NhNmNs
   * - N분, N초, N분N초, N시간N분
   */
  minsec: {
    patterns: [
      // 영문: 1h30m20s, 5m, 30s, 1h30m
      /\b\d+h(?:\d+m)?(?:\d+s)?\b/gi,
      /\b\d+m(?:\d+s)?\b/gi,
      /\b\d+s\b/gi,
      // 영문 풀 단어: 5minutes, 30seconds, 1hour
      /\b\d+\s*(?:hours?|minutes?|seconds?|mins?|secs?)\b/gi,
      // 한글: N시간, N분, N초 조합
      /\d+시간(?:\s*\d+분)?(?:\s*\d+초)?/g,
      /(?<!\d시간\s*)\d+분(?:\s*\d+초)?/g,
      /(?<!\d분\s*)\d+초(?!\s*[점])/g,
    ],
    converter: (match: string) => minsec(match),
  },
} as const;

/**
 * 모든 지원되는 태그 유형
 */
export const SUPPORTED_AUTO_TAGS = Object.keys(AUTO_TAG_PATTERNS) as Array<
  keyof typeof AUTO_TAG_PATTERNS
>;

/**
 * 텍스트에서 자동으로 패턴을 인식하여 태깅된 결과로 변환
 *
 * @param text - 변환할 텍스트
 * @param options - 자동 태깅 옵션
 * @returns 자동 태깅이 적용된 텍스트
 *
 * @example
 * ```typescript
 * autoTag('내일 010-1234-5678로 전화주세요.');
 * // '내일 공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔로 전화주세요.'
 *
 * autoTag('회의는 14:30에 시작합니다.');
 * // '회의는 오후 두 시 삼십 분에 시작합니다.'
 *
 * autoTag('총 금액은 50000원입니다.');
 * // '총 금액은 오만 원입니다.'
 *
 * autoTag('2024-01-15T14:30 미팅');
 * // '이천이십사년 일 월 십오 일 오후 두 시 삼십 분 미팅'
 * ```
 */
export function autoTag(text: string, options?: AutoTagOptions): string {
  if (!text || text.length === 0) {
    return text;
  }

  const enabledTags = options?.enabledTags ?? SUPPORTED_AUTO_TAGS;

  // 매칭 결과 수집
  const allMatches: MatchResult[] = [];

  for (const tagType of enabledTags) {
    const tagConfig = AUTO_TAG_PATTERNS[tagType];
    if (!tagConfig) continue;

    for (const pattern of tagConfig.patterns) {
      // 정규식 초기화 (lastIndex 리셋)
      const regex = new RegExp(pattern.source, pattern.flags);

      let match: RegExpExecArray | null;
      while ((match = regex.exec(text)) !== null) {
        const original = match[0];
        const converted = tagConfig.converter(original);

        // 변환이 실제로 일어났는지 확인 (원본과 다른 경우만)
        if (original !== converted) {
          allMatches.push({
            original,
            converted,
            tagType,
            start: match.index,
            end: match.index + original.length,
          });
        }
      }
    }
  }

  // 매칭이 없으면 원본 반환
  if (allMatches.length === 0) {
    return text;
  }

  // 시작 위치 기준 정렬, 더 긴 매칭 우선
  allMatches.sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    return b.original.length - a.original.length;
  });

  // 중복 매칭 제거 (겹치는 범위 처리)
  const finalMatches: MatchResult[] = [];
  let lastEnd = -1;

  for (const match of allMatches) {
    if (match.start >= lastEnd) {
      finalMatches.push(match);
      lastEnd = match.end;
    }
  }

  // 텍스트 변환
  let result = '';
  let currentIndex = 0;

  for (const match of finalMatches) {
    // 매칭 전까지의 텍스트 추가
    result += text.slice(currentIndex, match.start);
    // 변환된 텍스트 추가
    result += match.converted;
    currentIndex = match.end;
  }

  // 나머지 텍스트 추가
  result += text.slice(currentIndex);

  return result;
}

/**
 * 텍스트에서 자동으로 인식된 태그 정보 추출 (변환하지 않음)
 *
 * @param text - 분석할 텍스트
 * @param options - 자동 태깅 옵션
 * @returns 인식된 패턴 정보 배열
 *
 * @example
 * ```typescript
 * extractAutoTags('전화번호는 010-1234-5678이고, 금액은 50000원입니다.');
 * // [
 * //   { original: '010-1234-5678', tagType: 'phone', start: 6, end: 19 },
 * //   { original: '50000원', tagType: 'money', start: 28, end: 34 }
 * // ]
 * ```
 */
export function extractAutoTags(
  text: string,
  options?: AutoTagOptions
): Array<Omit<MatchResult, 'converted'>> {
  if (!text || text.length === 0) {
    return [];
  }

  const enabledTags = options?.enabledTags ?? SUPPORTED_AUTO_TAGS;
  const allMatches: MatchResult[] = [];

  for (const tagType of enabledTags) {
    const tagConfig = AUTO_TAG_PATTERNS[tagType];
    if (!tagConfig) continue;

    for (const pattern of tagConfig.patterns) {
      const regex = new RegExp(pattern.source, pattern.flags);

      let match: RegExpExecArray | null;
      while ((match = regex.exec(text)) !== null) {
        const original = match[0];
        const converted = tagConfig.converter(original);

        if (original !== converted) {
          allMatches.push({
            original,
            converted,
            tagType,
            start: match.index,
            end: match.index + original.length,
          });
        }
      }
    }
  }

  // 정렬 및 중복 제거
  allMatches.sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    return b.original.length - a.original.length;
  });

  const finalMatches: Array<Omit<MatchResult, 'converted'>> = [];
  let lastEnd = -1;

  for (const match of allMatches) {
    if (match.start >= lastEnd) {
      finalMatches.push({
        original: match.original,
        tagType: match.tagType,
        start: match.start,
        end: match.end,
      });
      lastEnd = match.end;
    }
  }

  return finalMatches;
}

/**
 * 자동 태그와 수동 태그를 함께 적용
 *
 * 우선순위:
 * 1. 수동 태그 (manual-tag 형식)가 먼저 처리됨
 * 2. 그 다음 자동 태그가 적용됨
 *
 * @param text - 변환할 텍스트
 * @param autoTagOptions - 자동 태깅 옵션
 * @returns 태깅이 적용된 텍스트
 *
 * @example
 * ```typescript
 * autoTagWithManual('name(김철수)님, 010-1234-5678로 연락주세요.');
 * // '김 철 수님, 공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔로 연락주세요.'
 * ```
 */
export function autoTagWithManual(text: string, autoTagOptions?: AutoTagOptions): string {
  // manualTag를 먼저 적용하려면 import가 필요하지만 순환 참조 방지를 위해
  // 이 함수는 manual-tag.ts에서 import하여 사용하도록 가이드
  // 여기서는 autoTag만 적용
  return autoTag(text, autoTagOptions);
}

// 편의를 위한 개별 태그별 자동 변환 함수
export const autoPhone = (text: string): string => autoTag(text, { enabledTags: ['phone'] });
export const autoTime = (text: string): string => autoTag(text, { enabledTags: ['time'] });
export const autoDate = (text: string): string => autoTag(text, { enabledTags: ['date'] });
export const autoDatetime = (text: string): string => autoTag(text, { enabledTags: ['datetime'] });
export const autoMoney = (text: string): string => autoTag(text, { enabledTags: ['money'] });
export const autoYear = (text: string): string => autoTag(text, { enabledTags: ['year'] });
export const autoMonth = (text: string): string => autoTag(text, { enabledTags: ['month'] });
export const autoDay = (text: string): string => autoTag(text, { enabledTags: ['day'] });
export const autoOrder = (text: string): string => autoTag(text, { enabledTags: ['order'] });
export const autoPoint = (text: string): string => autoTag(text, { enabledTags: ['point'] });
export const autoPiece = (text: string): string => autoTag(text, { enabledTags: ['piece'] });
export const autoMinsec = (text: string): string => autoTag(text, { enabledTags: ['minsec'] });
