import { numberToKorean } from './utils/number-to-korean';
import { month } from './tags/month';
import { day } from './tags/day';
import { date, yearMonth } from './tags/date';
import { time } from './tags/time';
import { year } from './tags/year';
import { phone } from './tags/phone';
import { money } from './tags/money';
import { order } from './tags/order';
import { point } from './tags/point';
import { piece } from './tags/piece';
import { minsec } from './tags/minsec';
import { datetime } from './tags/datetime';
import { ratio } from './tags/ratio';
import { jari } from './tags/jari';
import { numberTag } from './tags/number';
import { duration, gIbun } from './tags/duration';
import { floor } from './tags/floor';
import { account } from './tags/account';
import { weight } from './tags/weight';
import { mile } from './tags/mile';
import { area } from './tags/area';
import { serial, serialNumbersOnly } from './tags/serial';
import { bakil } from './tags/bakil';
import { roomNumber } from './tags/room-number';
import { jong } from './tags/jong';
import {
  distance,
  distanceWithContext,
  DISTANCE_CONTEXT_AFTER,
  DISTANCE_CONTEXT_BEFORE,
} from './tags/distance';
import { carNumber } from './tags/car-number';
import { flight } from './tags/flight';
import { seat } from './tags/seat';
import { lecture } from './tags/lecture';
import { fraction, fractionWithContext } from './tags/fraction';
import { temperature, temperatureRange } from './tags/temperature';
import { volume } from './tags/volume';
import { dataCapacity } from './tags/data-capacity';
import { inch } from './tags/inch';
import { address } from './tags/address';

/**
 * 주소로 인식되는 줄인지 확인하는 패턴들
 * - 도로명 주소: 대로/로/길
 * - 아파트 주소: N동, N호 패턴
 * - 행정구역: 시/구/군 + 괄호
 */
const ADDRESS_LINE_PATTERNS: RegExp[] = [
  // 도로명 주소: ~대로 + 숫자 or 괄호 (예: 테헤란대로 521, 도안대로 (12345))
  /[가-힣]{2,}대로(?:\s*\d+|\s*[(（])/,
  // 도로명 주소: ~로 + 숫자 or 괄호 (예: 엘지로 99, 남산로 (김치길))
  // "~으로"는 제외 (조사)
  /[가-힣]{2,}(?<!으)로(?:\s+\d+|\s*[(（])/,
  // 도로명 주소: ~길 + 숫자 or 괄호 (예: 엘지길 15)
  /[가-힣]{2,}길(?:\s+\d+|\s*[(（])/,
  // 한글+숫자+길 패턴 (예: 엘지로 99길, 역삼로15번길, 엘지로99길)
  /[가-힣]{2,}로?\s*\d+(?:번)?길/,
  // 아파트 동/호 패턴: N동 + 호 (예: 102동 1101호, 102동1101호)
  /\d{1,4}동\s*\d{1,4}호/,
  // N-N동 패턴 (예: 1234-131동)
  /\d{1,5}-\d{1,5}동/,
  // N동 + 괄호 (예: 102동 (가나다))
  /\d{1,4}동\s*[(（]/,
  // 번지-번지 + 호 패턴 (예: 123-45 201호)
  /\d{1,5}-\d{1,5}\s+\d{1,4}호/,
  // N호로 끝나는 패턴 (줄 끝) (예: ... 102호)
  /\d{1,4}호\s*$/,
  // 시/구/군 + 괄호 패턴 (예: 서울시 (가나다), 강남구 (가나다))
  // 단, "와트시", "킬로와트시" 등 단위는 제외 (단위 뒤에 오는 시는 제외)
  /[가-힣]{2,}(?<!와트|킬로|메가|기가|미터|리터|그램|바이트|헤르츠|옴|볼트|암페어|줄|와트)(?:시|구|군)\s*[(（]/,
];

/**
 * 주어진 줄이 주소로 인식되는지 확인
 * @param line - 확인할 줄
 * @returns 주소로 인식되면 true
 */
function isAddressLine(line: string): boolean {
  return ADDRESS_LINE_PATTERNS.some((pattern) => pattern.test(line));
}

/**
 * 제거해야 할 괄호인지 확인
 * - 행정구역명(동/읍/면/리/구)이 포함된 괄호 → 제거
 * - 순수 숫자만 포함된 괄호 (우편번호 등) → 제거
 * - 한글 건물명만 포함된 괄호 → 제거
 * - 층수 정보(층) 등 유용한 정보 → 유지
 * @param content - 괄호 안의 내용 (괄호 제외)
 * @returns 제거해야 하면 true
 */
function shouldRemoveBracketContent(content: string): boolean {
  const trimmed = content.trim();

  // 빈 괄호는 제거
  if (trimmed === '') return true;

  // 층 정보가 포함된 경우 유지 (예: 15층/25층, 3층)
  if (/\d+층/.test(trimmed)) return false;

  // 행정구역명(동/읍/면/리/구) 패턴이 포함된 경우 제거
  // 예: (엘지동, 센트럴파크), (강남구), (역삼동 래미안)
  if (/[가-힣]+(?:동|읍|면|리|구)/.test(trimmed)) return true;

  // 순수 숫자만 있는 경우 제거 (우편번호 등)
  // 예: (12394), (124124)
  if (/^\d+$/.test(trimmed)) return true;

  // 한글+숫자 조합이지만 단위가 없는 경우 제거
  // 예: (휴먼시아, 센트럴파크)
  if (/^[가-힣a-zA-Z0-9\s,]+$/.test(trimmed) && !/[가-힣]+\d*(?:층|호|동)/.test(trimmed)) {
    return true;
  }

  // 그 외의 경우 유지
  return false;
}

/**
 * 줄에서 제거해야 할 괄호만 선택적으로 제거 (후처리용)
 * @param line - 처리할 줄
 * @returns 불필요한 괄호가 제거된 줄
 */
function removeAddressBracketsPostProcess(line: string): string {
  let result = line;

  // 소괄호 선택적 제거 (전각 포함)
  result = result.replace(/\s*[(（]([^)）]*)[)）]\s*/g, (match, content: string) => {
    if (shouldRemoveBracketContent(content)) {
      return ' ';
    }
    return match;
  });

  // 대괄호 선택적 제거 (전각 포함)
  result = result.replace(/\s*[[［]([^\]］]*)[\]］]\s*/g, (match, content: string) => {
    if (shouldRemoveBracketContent(content)) {
      return ' ';
    }
    return match;
  });

  // 연속된 공백을 하나로 정리
  result = result.replace(/\s+/g, ' ').trim();
  return result;
}

/**
 * 주소로 인식되는 줄에서 불필요한 괄호를 제거하는 후처리
 * 각 줄을 검사하여 주소 패턴이 발견되면 해당 줄의 불필요한 괄호를 제거
 * @param text - 전체 텍스트
 * @returns 주소 줄의 불필요한 괄호가 제거된 텍스트
 */
function postProcessAddressLines(text: string): string {
  const lines = text.split('\n');
  const processedLines = lines.map((line) => {
    if (isAddressLine(line)) {
      return removeAddressBracketsPostProcess(line);
    }
    return line;
  });
  return processedLines.join('\n');
}

/**
 * 특수문자 단위를 발음으로 변환하는 매핑
 * 패턴 매칭으로 처리되지 않는 단독 특수문자들을 후처리로 변환
 */
const SPECIAL_UNIT_MAP: Array<[RegExp, string]> = [
  // 부피/용량 단위
  [/m³/g, '세제곱미터'],
  [/m3(?![0-9])/g, '세제곱미터'],
  [/cm³/g, '세제곱센티미터'],
  [/cm3(?![0-9])/g, '세제곱센티미터'],
  [/㎥/g, '세제곱미터'],
  // 면적 단위
  [/m²/g, '제곱미터'],
  [/m2(?![0-9])/g, '제곱미터'],
  [/㎡/g, '제곱미터'],
  // 온도 단위
  [/℃/g, '도'],
  [/℉/g, '화씨'],
  // 무게/길이 등 특수문자 단위
  [/㎏/g, '킬로그램'],
  [/㎞/g, '킬로미터'],
  [/㎝/g, '센티미터'],
  [/㎜/g, '밀리미터'],
  [/ℓ/g, '리터'],
  [/㎖/g, '밀리리터'],
  [/㏄/g, '시시'],
];

/**
 * 기술 약어를 발음으로 변환하는 매핑
 * 단어 경계를 고려하여 정확한 약어만 변환
 */
const ABBREVIATION_MAP: Array<[RegExp, string]> = [
  // 네트워크 세대
  [/\b2G\b/g, '투지'],
  [/\b3G\b/g, '쓰리지'],
  [/\b4G\b/g, '포지'],
  [/\b5G\b/g, '파이브지'],
  [/\bLTE\b/gi, '엘티이'],
  // 기술 약어
  [/\bVR\b/g, '브이알'],
  [/\bAR\b/g, '에이알'],
  [/\bTTS\b/g, '티티에스'],
  [/\bSTT\b/g, '에스티티'],
  // 개별 발음 약어
  [/\bOTP\b/gi, '오 티 피'],
  [/\bCCTV\b/gi, '씨 씨 티 비'],
];

/**
 * 시간(분) 컨텍스트 키워드 (뒤에 오는 단어들)
 * 이 키워드들이 뒤에 오면 'm'을 '분'으로 해석
 */
const TIME_CONTEXT_AFTER = [
  // 시간 경과/소요
  '후',
  '뒤',
  '내',
  '안에',
  '동안',
  '이내',
  '이상',
  '이하',
  '전',
  '경과',
  '소요',
  '걸림',
  '걸려',
  '걸리',
  '남음',
  '남은',
  '대기',
  '기다',
  '지나',
  '지난',
  '만에',
  '정각',
  '간격',
  '마다',
  '단위',
  // 범위
  '에서',
  '부터',
  '까지',
];

/**
 * 시간(분) 컨텍스트 키워드 (앞에 오는 단어들)
 * 이 키워드들이 앞에 오면 'm'을 '분'으로 해석
 */
const TIME_CONTEXT_BEFORE = [
  // 시간 관련
  '약',
  '대략',
  '최소',
  '최대',
  '평균',
  '소요시간',
  '대기시간',
  '남은시간',
  '예상시간',
  '소요',
  '대기',
  '도착',
  '예상',
  '남은',
  '잔여',
];

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
   * 주소 패턴 (괄호 안에 주소 정보가 있는 경우만)
   * - 괄호 안에 "~동," 형태의 행정구역명이 있을 때만 처리
   * - N동, N호, N층, N-M 형태 처리
   * - 아파트/건물 주소에서 많이 사용
   * 주의: 괄호가 없거나 괄호 안이 층수 정보인 경우는 기존 패턴에서 처리
   */
  address: {
    patterns: [
      // =============================================
      // 도로명주소 + 괄호(동/읍/면) 패턴 (완전한 주소 형태)
      // =============================================
      // 도로명(로/길/대로) + 번지 + 괄호(동/읍/면) (예: 엘지대로 111 (엘지동 동문굿모닝힐2차아파트))
      /[가-힣]+(?:대로|로|길)\s*\d+(?:-\d+)?\s*\(\s*[가-힣]+(?:동|읍|면)(?:\s*,\s*[^)]+|\s+[^)]+|\s*)\)/g,
      // 도로명(숫자+번길) + 번지 + 괄호(동/읍/면) (예: 엘지로999번길 10 (엘지동 한성아파트))
      /[가-힣]+(?:대로|로)\d+번?길\s*\d+(?:-\d+)?\s*\(\s*[가-힣]+(?:동|읍|면)(?:\s*,\s*[^)]+|\s+[^)]+|\s*)\)/g,
      // 도로명(숫자+가길) + 번지 + 괄호(동/읍/면) (예: 엘지로10가길 41 ( 엘지동 ))
      /[가-힣]+(?:대로|로)\d+가길\s*\d+(?:-\d+)?\s*\(\s*[가-힣]+(?:동|읍|면)(?:\s*,\s*[^)]+|\s+[^)]+|\s*)\)/g,
      // 도로명(한글+숫자+길) + 번지 + 괄호(읍/면) (예: 엘지1길 19-8, (엘지읍))
      /[가-힣]+\d+길\s*\d+(?:-\d+)?,?\s*\(\s*[가-힣]+(?:동|읍|면)(?:\s*,\s*[^)]+|\s+[^)]+|\s*)\)/g,

      // =============================================
      // 괄호 안에 "동/읍/면" 형태가 있는 주소 패턴 (콤마 유무 무관)
      // =============================================
      // 한글+숫자+동+숫자+호 + 괄호(동/읍/면) (예: 우성베스토피아 102동 1101호 ( 엘지동, 우성베스토피아 ))
      /[가-힣a-zA-Z]+[가-힣a-zA-Z0-9\s]*\d{1,4}동\s*\d{2,4}호\s*\(\s*[가-힣]+(?:동|읍|면)(?:\s*,\s*[^)]+|\s+[^)]+|\s*)\)/g,
      // N동N호 + 괄호(동/읍/면) (예: 113동2602호(엘지동, 더샵 염주센트럴파크))
      /\d{1,4}동\s*\d{2,4}호\s*\(\s*[가-힣]+(?:동|읍|면)(?:\s*,\s*[^)]+|\s+[^)]+|\s*)\)/g,
      // N-N호 + 괄호(동/읍/면) (예: 210-405호(엘지동, 엘지주공아파트))
      /\d{1,4}-\d{1,4}호\s*\(\s*[가-힣]+(?:동|읍|면)(?:\s*,\s*[^)]+|\s+[^)]+|\s*)\)/g,
      // 괄호(동/읍/면)로 시작하는 주소 + N동 N호 (예: (엘지동, 청명마을삼성아파트)439동 1006호)
      /\(\s*[가-힣]+(?:동|읍|면)(?:\s*,\s*[^)]+|\s+[^)]+|\s*)\)\s*\d{1,4}동\s*\d{2,4}호/g,
      // 숫자, + 괄호(동/읍/면) + N동 N호 (예: 33, (엘지동, 청명마을삼성아파트)439동 1006호)
      /\d+,?\s*\(\s*[가-힣]+(?:동|읍|면)(?:\s*,\s*[^)]+|\s+[^)]+|\s*)\)\s*\d{1,4}동\s*\d{2,4}호/g,
      // N층 + N-N + N호 + 괄호(동/읍/면) (예: 1층 111-2, 112호 (엘지동, 아파트))
      /\d{1,2}층\s+\d{1,4}-\d{1,4},?\s*\d{1,4}호\s*\(\s*[가-힣]+(?:동|읍|면)(?:\s*,\s*[^)]+|\s+[^)]+|\s*)\)/g,
      // N-N + 한글 + N층 (번지 + 가게명 + 층수) (예: 611-9 원조닭한마리 1층)
      /\d{1,5}-\d{1,5}\s+[가-힣]+[가-힣a-zA-Z0-9\s]*\d{1,2}층/g,
      // N동 N호 + 괄호(동/읍/면) (공백 있는 경우) (예: 1011동 24호(엘지동, 엘지아이파크))
      /\d{1,4}동\s+\d{1,4}호\s*\(\s*[가-힣]+(?:동|읍|면)(?:\s*,\s*[^)]+|\s+[^)]+|\s*)\)/g,
      // N-N + 괄호(동/읍/면) (예: 108-2004 (엘지동, 엘지센텀퍼스트))
      /\d{1,5}-\d{1,5}\s*\(\s*[가-힣]+(?:동|읍|면)(?:\s*,\s*[^)]+|\s+[^)]+|\s*)\)/g,
      // 단독 N-N 형식 (동-호수 또는 번지) (예: 102-1808, 611-9)
      // 앞뒤로 하이픈이나 숫자가 없는 경우만 매칭 (전화번호, 날짜 등 제외)
      // 대표전화번호 형식(15XX, 16XX, 18XX-XXXX) 제외
      /(?<![-\d])(?!15\d{2}-\d{4}(?![-\d]))(?!16\d{2}-\d{4}(?![-\d]))(?!18\d{2}-\d{4}(?![-\d]))\d{1,5}-\d{1,5}(?![-\d])/g,
      // N/N호 형식 (동/호수) (예: 104/4122호)
      /\d{1,4}\/\d{1,4}호/g,
      // , N동 N호 형식 (앞에 쉼표가 있는 경우) (예: , 102동 304호)
      /,\s*\d{1,4}동\s+\d{1,4}호/g,
      // 한글？한글(한글) 형식 (전각 물음표 + 괄호) (예: 국수역 국수차？주재(국수역))
      /[가-힣]+\s+[가-힣]+[？?][가-힣]+\([가-힣]+\)/g,
    ],
    converter: (match: string) => address(match),
  },

  /**
   * 전화번호 패턴
   * - 휴대폰: 010-XXXX-XXXX, 010.XXXX.XXXX, 010 XXXX XXXX
   * - 지역번호: 02-XXX-XXXX, 031-XXX-XXXX
   * - 대표번호: 1588-XXXX, 1544-XXXX, 1600-XXXX, 1666-XXXX, 1800-XXXX
   * - 긴급번호: 112, 119, 110
   */
  /**
   * 지번 패턴
   * N동 123-45, N리 123-456 등의 지번을 개별 숫자로 변환
   * 행정구역명(동/리) 뒤에 오는 지번 또는 단독 지번(숫자-숫자번지) 매칭
   */
  lotNumber: {
    patterns: [
      // 동/리 + 숫자-숫자 (지번) - "면", "읍", "구"는 단독으로 잘 오지 않으므로 제외
      /(?:[가-힣]+동|[가-힣]+리)\s+\d{1,4}[-]\d{1,4}\b/g,
      // 도로명(한글+대로/로/길) + 숫자-숫자 (도로명주소 지번) - "으로" 조사 제외
      /[가-힣]+대로\s+\d{1,4}[-]\d{1,4}\b/g,
      /[가-힣]+(?<!으)로\s+\d{1,4}[-]\d{1,4}\b/g,
      /[가-힣]+길\s+\d{1,4}[-]\d{1,4}\b/g,
      // 단독 지번 (숫자-숫자번지) - "번지" 키워드가 뒤에 오는 경우
      /\d{1,4}[-]\d{1,4}번지/g,
    ],
    converter: (match: string) => {
      // "동 123-45" -> "동 일 이 삼 다시 사 오"
      const DIGITS = ['공', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
      return match.replace(/(\d+)-(\d+)/, (_m, num1: string, num2: string) => {
        const first = num1
          .split('')
          .map((d) => DIGITS[parseInt(d)] ?? d)
          .join(' ');
        const second = num2
          .split('')
          .map((d) => DIGITS[parseInt(d)] ?? d)
          .join(' ');
        return `${first} 다시 ${second}`;
      });
    },
  },

  /**
   * 주소 번지수 패턴
   * N로 123, N길 456, N대로 789 등에서 번지수를 하나씩 읽음
   */
  addressNumber: {
    patterns: [
      // N로/길/대로 + 숫자 (번지수) - 뒤에 쉼표, 공백, 괄호, 줄끝 등이 올 수 있음
      /(?:로|길|대로)\s+\d+(?=\s*[,\s)）]|$)/g,
    ],
    converter: (match: string) => {
      // "로 123" -> "로 일 이 삼"
      const numMatch = match.match(/(\d+)$/);
      if (numMatch) {
        const prefix = match.replace(/\d+$/, '');
        const digits = numMatch[1] ?? '';
        const DIGITS = ['공', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
        const koreanDigits = digits
          .split('')
          .map((d) => DIGITS[parseInt(d, 10)] ?? d)
          .join(' ');
        return prefix + koreanDigits;
      }
      return match;
    },
  },

  /**
   * 고객번호 패턴 (다른 패턴보다 먼저 매칭)
   * 고객번호: NN-NN-NNNN-NNNN 형태를 숫자 하나씩 읽음
   */
  customerNumber: {
    patterns: [
      // 고객번호: NN-NN-NNNN-NNNN 형태
      /(?:고객번호)[:\s]*\d{2,4}[-]\d{2,4}[-]\d{2,4}[-]\d{2,4}\b/g,
      // 고객번호: 영문-숫자 조합 (GS-2024-123456 등)
      /(?:고객번호)[:\s]*[A-Z]{1,3}[-]\d{4}[-]\d{4,6}\b/g,
    ],
    converter: (match: string) => {
      const numMatch = match.match(/([A-Z\d][-A-Z\d]+)$/);
      if (numMatch) {
        const prefix = match.replace(/([A-Z\d][-A-Z\d]+)$/, '');
        const code = numMatch[1] ?? '';
        const DIGITS = ['공', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
        const parts: string[] = [];
        let currentLetters = '';
        for (const c of code) {
          if (c === '-') {
            if (currentLetters) {
              parts.push(currentLetters);
              currentLetters = '';
            }
            parts.push('다시');
          } else if (/\d/.test(c)) {
            if (currentLetters) {
              parts.push(currentLetters);
              currentLetters = '';
            }
            parts.push(DIGITS[parseInt(c, 10)] ?? c);
          } else {
            currentLetters += c;
          }
        }
        if (currentLetters) {
          parts.push(currentLetters);
        }
        return prefix + parts.join(' ');
      }
      return match;
    },
  },

  /**
   * 락커번호 패턴 (영문-숫자 조합)
   * 락커번호 A-125 형태를 개별 숫자로 읽음
   */
  lockerNumber: {
    patterns: [
      // 락커번호: A-123, B-45 등
      /(?:락커번호|사물함번호|사물함)[:\s]*[A-Z가-힣]{1,3}[-]?\d{1,4}\b/gi,
    ],
    converter: (match: string) => {
      const numMatch = match.match(/([A-Z가-힣]{1,3}[-]?\d{1,4})$/i);
      if (numMatch) {
        const prefix = match.replace(/([A-Z가-힣]{1,3}[-]?\d{1,4})$/i, '');
        const code = numMatch[1] ?? '';
        const DIGITS = ['공', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
        const parts: string[] = [];
        let currentLetters = '';
        for (const c of code) {
          if (c === '-') {
            if (currentLetters) {
              parts.push(currentLetters);
              currentLetters = '';
            }
            parts.push('다시');
          } else if (/\d/.test(c)) {
            if (currentLetters) {
              parts.push(currentLetters);
              currentLetters = '';
            }
            parts.push(DIGITS[parseInt(c, 10)] ?? c);
          } else {
            currentLetters += c;
          }
        }
        if (currentLetters) {
          parts.push(currentLetters);
        }
        return prefix + parts.join(' ');
      }
      return match;
    },
  },

  /**
   * 운송장/추적번호 패턴 (phone보다 먼저 매칭)
   * 송장번호, 운송장번호 등의 컨텍스트가 있을 때 숫자를 하나씩 읽음
   */
  trackingNumber: {
    patterns: [
      // 송장번호: NNNN-NNNN-NNNN 형태
      /(?:송장번호|운송장번호|운송장|송장|추적번호)[:\s]*\d{4}[-]\d{4}[-]\d{4}\b/g,
      // 송장번호: 12-14자리 숫자
      /(?:송장번호|운송장번호|운송장|송장|추적번호)[:\s]*\d{12,14}\b/g,
    ],
    converter: (match: string) => {
      // 숫자 부분 추출
      const numMatch = match.match(/(\d[-\d]+)$/);
      if (numMatch) {
        const prefix = match.replace(/(\d[-\d]+)$/, '');
        const digits = numMatch[1] ?? '';
        // 각 숫자를 하나씩 읽음, 하이픈은 "다시"로
        const koreanDigits = digits
          .split('')
          .map((c) => {
            if (c === '-') return ' 다시 ';
            const DIGITS = ['공', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
            return DIGITS[parseInt(c, 10)] ?? c;
          })
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
        return prefix + koreanDigits;
      }
      return match;
    },
  },

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
      // 긴급/특수번호: 명시적 목록 (지번과 혼동 방지)
      // 3자리: 110(경찰), 111(간첩), 112(경찰), 113(간첩), 114(안내), 115(전보), 116(전화고장),
      //        117(학교폭력), 118(사이버), 119(소방), 120(정부민원), 122(해양), 123(한전),
      //        125(환경), 128(안보), 129(보건), 131(기상), 132(법률구조), 181(인권), 182(경찰민원)
      // 4자리: 1330(관광), 1332(금융감독원), 1339(응급의료), 1345(출입국), 1366(여성긴급), 1388(청소년), 1393(자살예방)
      // 뒤에 -숫자가 오면 지번이므로 제외
      /\b(?:110|111|112|113|114|115|116|117|118|119|120|122|123|125|128|129|131|132|181|182|1330|1332|1339|1345|1366|1388|1393)(?![-]\d)\b/g,
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
   * - HH:MM~HH:MM 범위 형식
   * - 한글 형식: 14시30분, 오후 2시 30분, 9시 (단독)
   */
  time: {
    patterns: [
      // HH:MM~HH:MM 시간 범위 (먼저 매칭)
      /\d{1,2}:\d{2}(?::\d{2})?\s*[~-]\s*\d{1,2}:\d{2}(?::\d{2})?/g,
      // HH:MM 또는 HH:MM:SS - 날짜 뒤에 오지 않는 경우만
      /(?<!\d[-/.]\d{1,2}[-/.])(?<!\d{4}[-/.]\d{1,2}[-/.]\d{1,2}\s*)(?<!\d[-/.])(?<=^|[^\d])\d{1,2}:\d{2}(?::\d{2})?(?=$|[^\d:])/g,
      // 한글 시간: 오전/오후 N시 M분 S초
      /(?:오전|오후)\s*\d{1,2}시(?:\s*\d{1,2}분)?(?:\s*\d{1,2}초)?/g,
      // 한글 시간 (오전/오후 없이): N시M분
      /\d{1,2}시\d{1,2}분(?:\d{1,2}초)?/g,
      // 단독 N시 (뒤에 숫자나 분이 오지 않는 경우, N시간과 구분하기 위해 간 제외)
      // 앞에 "아침", "저녁", "새벽", "밤" 등이 있으면 제외 (오전/오후와 충돌)
      /(?<!아침\s*)(?<!저녁\s*)(?<!새벽\s*)(?<!밤\s*)(?<![0-9])(?:1[0-9]|2[0-3]|[0-9])시(?![0-9분간])/g,
    ],
    converter: (match: string) => {
      // 시간 범위인 경우
      if (/\d{1,2}:\d{2}.*[~-].*\d{1,2}:\d{2}/.test(match)) {
        const parts = match.split(/\s*[~-]\s*/);
        if (parts.length === 2) {
          const time1 = time(parts[0] ?? '');
          const time2 = time(parts[1] ?? '');
          return time1 + '에서 ' + time2;
        }
      }
      return time(match);
    },
  },

  /**
   * 날짜 패턴
   * - YYYYMMDD (8자리)
   * - YYYY-MM-DD, YYYY/MM/DD, YYYY.MM.DD
   * - 한글: 1994년 6월 16일
   * - datetime으로 이미 처리된 것은 제외
   * - YYYYMMDD-숫자 형태 (접수번호 등)는 제외
   */
  date: {
    patterns: [
      // YYYY-MM-DD ~ YYYY-MM-DD 날짜 범위 (먼저 매칭)
      /\b\d{4}[-/.]\d{1,2}[-/.]\d{1,2}\s*[~]\s*\d{4}[-/.]\d{1,2}[-/.]\d{1,2}\b/g,
      // YYYYMMDD 형식 (8자리 숫자, 생년월일 형태)
      // 년도 범위 제한: 1900-2099
      // 뒤에 -숫자가 오면 접수번호 등으로 간주하여 제외
      /\b(?:19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])(?!-\d)\b/g,
      // YYYY-MM-DD 형식 (시간이 뒤따르지 않는 경우만)
      /\b\d{4}[-/.]\d{1,2}[-/.]\d{1,2}(?!\s*\d{1,2}:\d{2})(?!\s*T\d)/g,
      // 한글 날짜: YYYY년 M월 D일 (생략 가능) - 월/일 뒤의 공백은 포함하지 않음
      /\d{4}년\s*(?:\d{1,2}월)?(?:\s*\d{1,2}일)?(?:생)?/g,
      // 한글 월일만: M월 D일
      /(?<!\d년\s*)\d{1,2}월\s*\d{1,2}일/g,
    ],
    converter: (match: string) => {
      // 날짜 범위인 경우
      if (/\d{4}[-/.]\d{1,2}[-/.]\d{1,2}\s*[~]\s*\d{4}[-/.]\d{1,2}[-/.]\d{1,2}/.test(match)) {
        const parts = match.split(/\s*[~]\s*/);
        if (parts.length === 2) {
          const date1 = date(parts[0] ?? '');
          const date2 = date(parts[1] ?? '');
          return date1 + ' ~ ' + date2;
        }
      }
      return date(match);
    },
  },

  /**
   * 금액 패턴
   * - 숫자 + 원 (소수점 지원)
   * - 숫자 + 만원/억원/조원/경원/천원 (한글 큰 단위)
   * - ₩숫자
   * - 천단위 구분자 지원
   * - 음수 금액: -숫자원
   * - 한글 숫자 혼합: N억 N천만원
   */
  money: {
    patterns: [
      // N원~M원 금액 범위 (먼저 매칭)
      /[\d,]+\s*원\s*[~]\s*[\d,]+\s*원/g,
      // 음수 금액: -숫자원 (공백 없이 바로 붙는 경우만, 원조/원형 등 단어 제외)
      /-[\d,]+(?:\.\d+)?원(?![조형래본점피칙할단주])(?![ \t]*[년월일시분초])/g,
      // 한글 숫자 혼합: N억 N천만원, N억원
      /\d+억\s*(?:\d+천만)?(?:\d+백만)?원/g,
      // 숫자 + 만원/억원/조원/경원/천원 (한글 큰 단위)
      /[\d,]+\s*(?:만|억|조|경|천)원(?![ \t]*[년월일시분초])/g,
      // 숫자 + 원 (천단위 구분자 및 소수점 지원, 원조/원형 등 단어 제외)
      /[\d,]+(?:\.\d+)?\s*원(?![조형래본점피칙할단주])(?![ \t]*[년월일시분초])/g,
      // 화폐 기호 + 숫자
      /[₩]\s*[\d,]+/g,
    ],
    converter: (match: string) => {
      // 금액 범위인 경우
      if (/[\d,]+\s*원\s*[~]\s*[\d,]+\s*원/.test(match)) {
        const parts = match.split(/\s*[~]\s*/);
        if (parts.length === 2) {
          const money1 = money(parts[0] ?? '');
          const money2 = money(parts[1] ?? '');
          return money1 + '에서 ' + money2;
        }
      }
      return money(match);
    },
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
   * - N번째, N등, N위, N단계
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
      // N단계
      /(?<![0-9])[\d,]+\s*단계/g,
    ],
    converter: (match: string) => order(match),
  },

  /**
   * 점수 패턴
   * - N점 (뒤에 다른 단위가 오지 않는 경우)
   * - N크레딧 (크레딧 단위)
   * - 소수점 지원
   */
  point: {
    patterns: [
      // N점 또는 N.N점 (소수점 지원)
      /\b[\d,]+(?:\.\d+)?\s*점(?!\s*[원])/g,
      // N크레딧 (크레딧 단위)
      /[\d,]+(?:\.\d+)?\s*크레딧/g,
    ],
    converter: (match: string) => point(match),
  },

  /**
   * 개수 패턴 (고유어 수사 사용)
   * - N개, N마리, N명, N대, N장, N권 등
   * 주의: \b는 한글 뒤에서 작동하지 않으므로 lookahead 사용
   * 주의: "개월"은 기간이므로 duration 태그에서 처리 (개(?!월))
   */
  piece: {
    patterns: [
      // N개, N마리, N명, N대, N장, N권, N병, N잔, N그루, N송이, N쌍, N벌, N켤레, N채, N건, N회
      // 단위 뒤에 한글이 이어져도 매칭 (예: "5개의")
      // "개월"은 제외 (duration에서 처리)
      /(?<![0-9])[\d,]+(?:\.\d+)?\s*(?:개(?!월)|마리|명|대|장|권|병|잔|그루|송이|쌍|벌|켤레|채|건|회)/g,
    ],
    converter: (match: string) => piece(match),
  },

  /**
   * 거리 컨텍스트 패턴 (m 단위 + 거리 컨텍스트 키워드)
   * - 500m 전방, 100m 이내 등
   * - minsecContext보다 먼저 처리해야 함 (m을 거리로 인식)
   */
  distanceContext: {
    patterns: [
      // 숫자 + m + 거리 컨텍스트 키워드 (뒤에)
      new RegExp(`[\\d,]+(?:\\.\\d+)?\\s*m\\s*(?:${DISTANCE_CONTEXT_AFTER.join('|')})`, 'gi'),
      // 거리 컨텍스트 키워드 (앞에) + 숫자 + m
      new RegExp(
        `(?:${DISTANCE_CONTEXT_BEFORE.join('|')})\\s*[\\d,]+(?:\\.\\d+)?\\s*m(?![a-zA-Z])`,
        'gi'
      ),
    ],
    converter: (match: string) => distanceWithContext(match),
  },

  /**
   * 시간(분) 컨텍스트 패턴 (m 단위 + 시간 컨텍스트 키워드)
   * - 5m 후, 30m 이내, 약 10m 소요 등
   * - distanceContext 다음, 일반 minsec 이전에 처리
   * 주의: NmNs 조합은 여기서 처리하지 않고 minsec에서 처리
   */
  minsecContext: {
    patterns: [
      // 숫자 + m + 시간 컨텍스트 키워드 (뒤에) - 뒤에 숫자s가 오지 않는 경우만
      // 주의: distanceContext가 먼저 처리되므로 거리 컨텍스트가 있으면 거기서 처리됨
      new RegExp(`\\b\\d+m(?!\\d)\\s*(?:${TIME_CONTEXT_AFTER.join('|')})`, 'gi'),
      // 시간 컨텍스트 키워드 (앞에) + 숫자 + m (뒤에 숫자나 영문이 오지 않는 경우)
      new RegExp(`(?:${TIME_CONTEXT_BEFORE.join('|')})\\s*\\d+m(?!\\d)(?![a-zA-Z])`, 'gi'),
    ],
    converter: (match: string) => {
      // 컨텍스트 키워드를 유지하면서 시간만 변환
      // 뒤에 오는 컨텍스트
      const afterMatch = match.match(
        new RegExp(`^(\\d+)m\\s*(${TIME_CONTEXT_AFTER.join('|')})(.*)$`, 'i')
      );
      if (afterMatch) {
        const num = parseInt(afterMatch[1] ?? '0', 10);
        const context = afterMatch[2] ?? '';
        const rest = afterMatch[3] ?? '';
        return minsec(`${num}m`) + ' ' + context + rest;
      }

      // 앞에 오는 컨텍스트
      const beforeMatch = match.match(
        new RegExp(`^(${TIME_CONTEXT_BEFORE.join('|')})\\s*(\\d+)m$`, 'i')
      );
      if (beforeMatch) {
        const context = beforeMatch[1] ?? '';
        const num = parseInt(beforeMatch[2] ?? '0', 10);
        return context + ' ' + minsec(`${num}m`);
      }

      return minsec(match);
    },
  },

  /**
   * 시분초 패턴 (지속시간)
   * - Nm, Ns, NmNs, NhNmNs
   * - N분, N초, N분N초, N시간N분
   * - 시간 범위: 1h30m~2h (~ → 에서)
   * - 소수점 지원: 0.3초, 1.5초 등
   * 주의: distanceContext가 먼저 처리되므로 거리 컨텍스트가 있으면 거리로 처리됨
   */
  minsec: {
    patterns: [
      // 밀리초 범위: 50~100ms, 1~5ms (먼저 매칭)
      /\b\d+\s*[~]\s*\d+\s*ms\b/gi,
      // 단독 밀리초: 10ms, 100ms
      /\b\d+\s*ms\b/gi,
      // 마이크로초 범위: 1~5µs, 1~5us
      /\b\d+\s*[~]\s*\d+\s*[µu]s\b/gi,
      // 단독 마이크로초: 10µs, 10us
      /\b\d+\s*[µu]s\b/gi,
      // 나노초 범위: 1~5ns
      /\b\d+\s*[~]\s*\d+\s*ns\b/gi,
      // 단독 나노초: 10ns
      /\b\d+\s*ns\b/gi,
      // 피코초 범위: 1~5ps
      /\b\d+\s*[~]\s*\d+\s*ps\b/gi,
      // 단독 피코초: 10ps
      /\b\d+\s*ps\b/gi,
      // 펨토초 범위: 1~5fs
      /\b\d+\s*[~]\s*\d+\s*fs\b/gi,
      // 단독 펨토초: 10fs
      /\b\d+\s*fs\b/gi,
      // 한글 숫자 분~시간 범위 (이미 변환된 한글, 먼저 매칭)
      /[일이삼사오육칠팔구십백천한두세네]+\s*분\s*[~]\s*[일이삼사오육칠팔구십백천한두세네]+\s*시간/g,
      // 한글 숫자 분~분 범위 (이미 변환된 한글, 먼저 매칭)
      /[일이삼사오육칠팔구십백천]+\s*분\s*[~]\s*[일이삼사오육칠팔구십백천]+\s*분/g,
      // 아라비아 숫자 분~시간 범위 (먼저 매칭)
      /\d+\s*분\s*[~]\s*\d+\s*시간/g,
      // 아라비아 숫자 분~분 범위 (먼저 매칭)
      /\d+\s*분\s*[~]\s*\d+\s*분/g,
      // 시간 범위: 1h30m~2h, 5m~10m (범위는 명확히 시간)
      /\b\d+h(?:\d+m)?(?:\d+s)?[~]\d+h(?:\d+m)?(?:\d+s)?\b/gi,
      /\b\d+m(?:\d+s)?[~]\d+m(?:\d+s)?\b/gi,
      // 영문: 1h30m20s, 1h30m, 1h (h가 포함되면 시간)
      /\b\d+h(?:\d+m)?(?:\d+s)?\b/gi,
      // 영문: NmNs 조합 (s가 포함되면 시간) - 단독 Nm보다 먼저 매칭
      /\b\d+m\d+s\b/gi,
      // 단독 Nm: 뒤에 숫자s, 영문, 특수문자(³ 등)가 없는 경우
      // distanceContext가 먼저 처리되므로 여기에 도달하면 시간으로 처리
      /\b\d+m(?!\d)(?![a-zA-Z³²])/gi,
      // 영문: Ns 단독
      /\b\d+s\b/gi,
      // 영문 풀 단어: 5minutes, 30seconds, 1hour (명확한 시간)
      /\b\d+\s*(?:hours?|minutes?|seconds?|mins?|secs?)\b/gi,
      // 한글: N시간, N분, N초 조합 (소수점 지원, 천단위 구분자 지원) - 한글은 명확
      /[\d,]+시간(?:\s*[\d,]+분)?(?:\s*[\d,.]+초)?/g,
      /(?<![\d,]시간\s*)[\d,]+분(?:\s*[\d,.]+초)?/g,
      // 소수점 초: 0.3초, 1.5초 등 (정수 초보다 먼저 매칭)
      /(?<![\d,]분\s*)[\d,]+\.\d+\s*초(?!\s*[점])/g,
      // 정수 초: 30초 등
      /(?<![\d,]분\s*)[\d,]+초(?!\s*[점])/g,
    ],
    converter: (match: string) => {
      // SI 시간 단위 매핑
      const timeUnitMap: Record<string, string> = {
        ms: '밀리초',
        µs: '마이크로초',
        us: '마이크로초',
        ns: '나노초',
        ps: '피코초',
        fs: '펨토초',
      };

      // SI 시간 단위 범위: N~Munit (한자어 수사 사용)
      const siTimeRangeMatch = match.match(/^(\d+)\s*[~]\s*(\d+)\s*([µu]?[mnpf]?s)$/i);
      if (siTimeRangeMatch) {
        const num1 = parseInt(siTimeRangeMatch[1] ?? '0', 10);
        const num2 = parseInt(siTimeRangeMatch[2] ?? '0', 10);
        const unit = siTimeRangeMatch[3]?.toLowerCase() ?? 'ms';
        const koreanUnit = timeUnitMap[unit] ?? '초';
        const koreanNum1 = numberToKorean(num1);
        const koreanNum2 = numberToKorean(num2);
        return koreanNum1 + ' ' + koreanUnit + '에서 ' + koreanNum2 + ' ' + koreanUnit;
      }
      // 단독 SI 시간 단위: Nunit (한자어 수사 사용)
      const siTimeMatch = match.match(/^(\d+)\s*([µu]?[mnpf]?s)$/i);
      if (siTimeMatch) {
        const num = parseInt(siTimeMatch[1] ?? '0', 10);
        const unit = siTimeMatch[2]?.toLowerCase() ?? 'ms';
        const koreanUnit = timeUnitMap[unit] ?? '초';
        const koreanNum = numberToKorean(num);
        return koreanNum + ' ' + koreanUnit;
      }
      // 한글 숫자 분~시간 범위인 경우 (이미 변환된 한글)
      const koreanMinHourMatch = match.match(
        /^([일이삼사오육칠팔구십백천한두세네]+\s*분)\s*[~]\s*([일이삼사오육칠팔구십백천한두세네]+\s*시간)$/
      );
      if (koreanMinHourMatch) {
        return koreanMinHourMatch[1] + '에서 ' + koreanMinHourMatch[2];
      }
      // 한글 숫자 분~분 범위인 경우 (이미 변환된 한글)
      const koreanNumRangeMatch = match.match(
        /^([일이삼사오육칠팔구십백천]+\s*분)\s*[~]\s*([일이삼사오육칠팔구십백천]+\s*분)$/
      );
      if (koreanNumRangeMatch) {
        return koreanNumRangeMatch[1] + '에서 ' + koreanNumRangeMatch[2];
      }
      // 아라비아 숫자 분~시간 범위인 경우
      const arabicMinHourMatch = match.match(/^(\d+)\s*분\s*[~]\s*(\d+)\s*시간$/);
      if (arabicMinHourMatch) {
        const min = minsec(arabicMinHourMatch[1] + '분');
        const hour = minsec(arabicMinHourMatch[2] + '시간');
        return min + '에서 ' + hour;
      }
      // 아라비아 숫자 분~분 범위인 경우
      const arabicRangeMatch = match.match(/^(\d+)\s*분\s*[~]\s*(\d+)\s*분$/);
      if (arabicRangeMatch) {
        const min1 = minsec(arabicRangeMatch[1] + '분');
        const min2 = minsec(arabicRangeMatch[2] + '분');
        return min1 + '에서 ' + min2;
      }
      // 영문 범위인 경우 (5m~10m 등)
      const engRangeMatch = match.match(/^(.+)[~](.+)$/);
      if (engRangeMatch) {
        const time1 = minsec(engRangeMatch[1] ?? '');
        const time2 = minsec(engRangeMatch[2] ?? '');
        return time1 + '에서 ' + time2;
      }
      return minsec(match);
    },
  },

  /**
   * 비율 패턴
   * - N:M 형식 (콜론 비율)
   * - N% 형식 (퍼센트)
   * - N배 형식 (배수)
   * 주의: 시간 형식(14:30)과 구분 필요 - time 패턴이 먼저 처리되어야 함
   */
  ratio: {
    patterns: [
      // 퍼센트: N%, N.N%
      /(?<![0-9])[\d,]+(?:\.\d+)?\s*%/g,
      // 배수: N배, N.N배 (뒤에 한글이 오지 않는 경우만 - "배송" 등과 구분)
      /(?<![0-9])[\d,]+(?:\.\d+)?\s*배(?![가-힣])/g,
      // 콜론 비율: N:M, N:M:O (시간 형식 제외)
      // 시간은 두 자리:두 자리 형태이므로, 한 자리 숫자 또는 세 자리 이상을 포함하면 비율로 처리
      /\b\d+\s*:\s*\d+(?:\s*:\s*\d+)*\b/g,
    ],
    converter: (match: string) => ratio(match),
  },

  /**
   * 자리 패턴
   * - N자리 (자리 수)
   * - N자리 DDDD (자리 수 + 후행 숫자)
   */
  jari: {
    patterns: [
      // N자리 + 후행 숫자
      /\d+\s*자리\s+\d+/g,
      // N자리 (단독)
      /\d+\s*자리(?!\s*\d)/g,
    ],
    converter: (match: string) => jari(match),
  },

  /**
   * 번호 패턴
   * - N번 (순서가 아닌 단순 번호)
   * 주의: 번째, 번호 등과 구분
   */
  number: {
    patterns: [
      // N번 (뒤에 째, 호가 오지 않는 경우)
      /(?<![0-9])[\d,]+\s*번(?![째호])/g,
    ],
    converter: (match: string) => numberTag(match),
  },

  /**
   * 기간 패턴
   * - N개월, N주, N주일, N년, N년간, N달, N학기, N분기, N일 (기간)
   * - N일 이내/이후/이상/이하
   * 주의: piece 태그의 "개"와 충돌하지 않도록 "개월"은 여기서 처리
   * 주의: day 태그의 "N일"과 구분 필요 - "남은 기간: N일", "N일간" 등 기간 맥락
   */
  duration: {
    patterns: [
      // N~M시간 범위 (먼저 매칭)
      /\d+\s*[~]\s*\d+\s*시간/g,
      // N~M일 범위 (일째, 일차 등 제외)
      /\d+\s*[~]\s*\d+\s*일(?![째차생간])/g,
      // N~M개월 범위
      /\d+\s*[~]\s*\d+\s*개월/g,
      // N~M주 범위
      /\d+\s*[~]\s*\d+\s*주(?![문제])/g,
      // N일 이내/이후/이상/이하
      /(?<![0-9])[\d,]+\s*일\s*(?:이내|이후|이상|이하)/g,
      // 최대/최소 N일
      /(?:최대|최소)\s*[\d,]+\s*일(?![째차생간])/g,
      // N개월 (기간)
      /(?<![0-9])[\d,]+\s*개월/g,
      // N주일, N주
      /(?<![0-9])[\d,]+\s*주일?(?![문제])/g,
      // N년간 (기간)
      /(?<![0-9])[\d,]+\s*년간/g,
      // 괄호 안의 N년 (기간): (2년), (30년) 등
      /\(\s*[\d,]+\s*년\s*\)/g,
      // N년 (1-99년, 기간으로서의 년 - 2024년 같은 년도와 구분)
      // 뒤에 간, 도, 생, 월이 오지 않고, 앞에 19/20이 오지 않는 짧은 숫자
      /(?<![0-9])(?<!19)(?<!20)[1-9]\d?\s*년(?![간도생월])/g,
      // N달 (기간)
      /(?<![0-9])[\d,]+\s*달(?![러력])/g,
      // N학기, N분기
      /(?<![0-9])[\d,]+\s*(?:학기|분기)/g,
      // N일간 (기간)
      /(?<![0-9])[\d,]+\s*일간/g,
      // N일 (기간 맥락: "남은 기간:", "기간:" 뒤에 오는 경우)
      /(?:남은\s*)?기간[:\s]+[\d,]+\s*일(?![째차생])/g,
    ],
    converter: (match: string) => {
      // 기간 범위인 경우 (N~M시간, N~M일 등) - 한자어 수사 사용
      const rangeMatch = match.match(/^(\d+)\s*[~]\s*(\d+)\s*(시간|일|개월|주)$/);
      if (rangeMatch) {
        const num1 = parseInt(rangeMatch[1] ?? '0', 10);
        const num2 = parseInt(rangeMatch[2] ?? '0', 10);
        const unit = rangeMatch[3] ?? '';

        const koreanNum1 = numberToKorean(num1);
        const koreanNum2 = numberToKorean(num2);

        return koreanNum1 + '에서 ' + koreanNum2 + ' ' + unit;
      }

      // "기간: N일" 형태에서 숫자+일만 추출해서 변환
      const durationMatch = match.match(/([\d,]+)\s*일/);
      if (durationMatch && /기간/.test(match)) {
        const prefix = match.replace(/([\d,]+)\s*일.*$/, '');
        return prefix + duration(durationMatch[0]);
      }
      return duration(match);
    },
  },

  /**
   * 층수 패턴
   * - N층, B1층, 지하N층
   */
  floor: {
    patterns: [
      // 지하N층 (한글)
      /지하\s*[\d,]+\s*층/g,
      // B1층, B2층 (영문)
      /[Bb][\d,]+\s*층/g,
      // N층 (일반)
      /(?<![0-9])[\d,]+\s*층/g,
    ],
    converter: (match: string) => floor(match, { includeSpace: false }),
  },

  /**
   * 계좌번호 패턴
   * - 은행 계좌번호 형식: NNN-NNN-NNNNNN
   * - 하이픈으로 구분된 2~6자리 숫자 그룹 3개
   */
  account: {
    patterns: [
      // 계좌번호: 2-6자리-2-6자리-4-14자리
      /\b\d{2,6}-\d{2,6}-\d{4,14}\b/g,
    ],
    converter: (match: string) => account(match),
  },

  /**
   * 무게 패턴
   * - N kg, N g, N ton, N 톤 등
   */
  weight: {
    patterns: [
      // 무게: 숫자 + kg/mg/ton/톤/킬로그램/그램/밀리그램 (kg, mg 먼저 매칭)
      /[\d,]+(?:\.\d+)?\s*(?:kg|mg|ton|톤|킬로그램|그램|밀리그램)/gi,
      // 무게: 숫자 + g (소문자 g만, 뒤에 영문자가 없는 경우만 - 5G, GB 등 제외)
      /[\d,]+(?:\.\d+)?\s*g(?![a-zA-Z])/g,
    ],
    converter: (match: string) => weight(match),
  },

  /**
   * 마일리지 패턴
   * - N마일, N mile
   */
  mile: {
    patterns: [
      // 마일리지: 숫자 + 마일/mile/miles
      /[\d,]+(?:\.\d+)?\s*(?:마일|miles?)/gi,
    ],
    converter: (match: string) => mile(match),
  },

  /**
   * 면적 패턴
   * - N㎡, N평, N m2
   */
  area: {
    patterns: [
      // 면적: 숫자 + ㎡/m2/m²/평/제곱미터/평방미터
      /[\d,]+(?:\.\d+)?\s*(?:㎡|m²|m2|평|제곱미터|평방미터)/gi,
    ],
    converter: (match: string) => area(match),
  },

  /**
   * 일련번호/코드 패턴
   * - 모델번호: XXX-NNNN-NNN
   * - 접수번호: NNNNNNNN-NNNN
   * - 계약번호: NNNN-XXX-NNNNNN
   * - 처방전 번호: XX-NNNNNNNN-NNNN
   */
  serial: {
    patterns: [
      // 일련번호 관련 키워드 + 번호: 숫자 형태
      // 승인, 인증, 확인, 거래, 결제, 주문, 예약, 접수, 계약, 등록, 회원, 고객, 증권, 보험, 처방전, 모델, 제품, 시리얼 등
      // 카드 제외 (마스킹된 경우가 많음)
      /(?:승인|인증|확인|거래|결제|주문|예약|접수|계약|등록|회원|고객|증권|보험|처방전|모델|제품|시리얼|계좌|통장|영수증|송장|운송장|택배|배송|추적|조회|참조|관리|사업자|법인|학번|사번|군번)\s*번호[:\s]+[A-Za-z0-9-]+/g,
      // 영문+숫자+하이픈 조합의 코드 (최소 하이픈 1개 포함, 숫자 포함)
      /\b[A-Za-z]{1,5}-\d{4,}-\d{2,}\b/g,
      /\b\d{8,}-\d{4,}\b/g,
    ],
    converter: (match: string) => {
      // 레이블이 있는 경우 레이블 유지하고 숫자만 변환
      if (/번호/.test(match)) {
        return serialNumbersOnly(match);
      }
      return serial(match);
    },
  },

  /**
   * 박일 패턴
   * - N박 M일 (숙박 기간)
   */
  bakil: {
    patterns: [
      // N박 M일, N박M일
      /\d+박\s*\d+일/g,
      // N박만 있는 경우
      /(?<![0-9])\d+박(?!\s*\d)/g,
    ],
    converter: (match: string) => bakil(match),
  },

  /**
   * 건물 동 번호 패턴
   * - N동 (아파트, 건물 동 번호 - 개별 숫자로 읽기)
   */
  buildingNumber: {
    patterns: [
      // N동 (2자리 이상의 숫자 + 동, 뒤에 숫자나 이/삼 등이 오지 않는 경우)
      // "서초동", "역삼동" 등 행정구역명 제외 (한글+동)
      /(?<![가-힣0-9])\d{2,}\s*동(?!\d)/g,
    ],
    converter: (match: string) => {
      // 한자어 수사로 변환 (예: 102동 → 백이동)
      const numMatch = match.match(/^(\d+)\s*(동)$/);
      if (numMatch) {
        const num = parseInt(numMatch[1] ?? '0', 10);
        const suffix = numMatch[2] ?? '';
        if (!isNaN(num) && num > 0) {
          return numberToKorean(num) + suffix;
        }
      }
      return match;
    },
  },

  /**
   * 호실 번호 패턴
   * - N호 (객실, 호실 번호 - 개별 숫자로 읽기)
   */
  roomNumber: {
    patterns: [
      // N호 (뒤에 수, 기가 오지 않는 경우 - "호수", "호기" 제외)
      // 3자리 이상의 숫자 + 호 (1205호, 302호 등)
      /(?<![0-9])\d{3,}\s*호(?![수기선실])/g,
    ],
    converter: (match: string) => roomNumber(match),
  },

  /**
   * 종류 패턴
   * - N종 (종류 수)
   */
  jong: {
    patterns: [
      // N종 (뒤에 류, 목이 오지 않는 경우 - "종류", "종목" 제외)
      /(?<![0-9])[\d,]+\s*종(?![류목])/g,
    ],
    converter: (match: string) => jong(match),
  },

  /**
   * 시간대+시간 패턴
   * - 아침/저녁/새벽/밤/낮 N시
   */
  timeOfDay: {
    patterns: [
      // 시간대 + N시 (M분) (S초)
      /(?:아침|저녁|새벽|밤|낮)\s*\d{1,2}시(?:\s*\d{1,2}분)?(?:\s*\d{1,2}초)?/g,
    ],
    converter: (match: string) => time(match),
  },

  /**
   * 거리 패턴
   * - N km, N m, N 킬로미터 등
   * - 명확한 거리 단위 (km, cm, mm, 미터, 킬로미터 등)
   */
  distance: {
    patterns: [
      // 거리: 숫자 + km/cm/mm/킬로미터/미터/센티미터/밀리미터
      /[\d,]+(?:\.\d+)?\s*(?:km|킬로미터|센티미터|밀리미터|cm|mm)/gi,
      // 한글 '미터'는 명확하므로 처리
      /[\d,]+(?:\.\d+)?\s*미터(?![법])/g,
    ],
    converter: (match: string) => distance(match),
  },

  /**
   * 년월 패턴
   * - YYYY-MM, YYYY-MM까지, YYYY-MM부터
   */
  yearMonth: {
    patterns: [
      // YYYY-MM + 접미사 (까지, 부터 등)
      /\b\d{4}-\d{2}(?:까지|부터|이후|이전)/g,
      // YYYY-MM (날짜가 아닌 경우만)
      /\b\d{4}-\d{2}(?![-/]\d)/g,
    ],
    converter: (match: string) => yearMonth(match),
  },

  /**
   * 기분 패턴
   * - N기분 (세금 납부 분기)
   */
  gIbun: {
    patterns: [
      // N기분
      /\d+\s*기분/g,
    ],
    converter: (match: string) => gIbun(match),
  },

  /**
   * 차량번호 패턴
   * - 12가 3456, 123가1234, 서울12가3456
   * - 차량번호: 12가 3456
   */
  carNumber: {
    patterns: [
      // 차량번호 레이블 + 차량번호 (차량번호에 사용되는 한글만 매칭)
      // 한국 차량번호 가운데 글자: 가나다라마바사아자허하호배 거너더러머버서어저 고노도로모보소오조 구누두루무부수우주
      // 공백은 줄바꿈을 제외한 스페이스만 허용 (줄바꿈 시 오탐 방지)
      /차량번호[:\s]*(?:[가-힣]{2})?\d{2,3}[가나다라마바사아자허하호배거너더러머버서어저고노도로모보소오조구누두루무부수우주] ?\d{4}/g,
      // 지역명(선택) + 숫자2-3자리 + 차량번호 한글1자 + 공백(선택) + 숫자4자리
      // "동", "층" 등 주소에 사용되는 글자 제외
      // 공백은 줄바꿈을 제외한 스페이스만 허용 (줄바꿈 시 오탐 방지)
      /(?:[가-힣]{2})?\d{2,3}[가나다라마바사아자허하호배거너더러머버서어저고노도로모보소오조구누두루무부수우주] ?\d{4}/g,
    ],
    converter: (match: string) => {
      // 차량번호 레이블이 있는 경우 레이블 유지
      const labelMatch = match.match(/^(차량번호[:\s]*)/);
      if (labelMatch) {
        const label = labelMatch[0];
        const carNum = match.slice(label.length);
        return label + carNumber(carNum);
      }
      return carNumber(match);
    },
  },

  /**
   * 항공편 패턴
   * - SK301, KE123, OZ751
   */
  flight: {
    patterns: [
      // 항공사코드 영문 2자리 + 편명 숫자 1-4자리
      // 출발편, 도착편, 편명 등의 레이블 뒤에 오는 경우
      /(?:출발편|도착편|편명)[:\s]*[A-Za-z]{2}\d{1,4}/g,
      // 단독 항공편 번호 (알려진 항공사 코드)
      /\b(?:KE|OZ|LJ|TW|7C|BX|ZE|RS|4V|SK|AA|UA|DL|BA|AF|LH|NH|JL|CX|SQ|EK|QR)\d{1,4}\b/g,
    ],
    converter: (match: string) => {
      // 레이블이 있는 경우 레이블 유지
      const labelMatch = match.match(/^(출발편|도착편|편명)[:\s]*/);
      if (labelMatch) {
        const label = labelMatch[0];
        const code = match.slice(label.length);
        return label + flight(code);
      }
      return flight(match);
    },
  },

  /**
   * 좌석번호 패턴
   * - 23A, 15F, 7C
   */
  seat: {
    patterns: [
      // 좌석번호 레이블 + 숫자 + 영문
      /(?:좌석번호|좌석)[:\s]*\d{1,3}[A-Za-z]/g,
    ],
    converter: (match: string) => {
      // 레이블이 있는 경우 레이블 유지
      const labelMatch = match.match(/^(좌석번호|좌석)[:\s]*/);
      if (labelMatch) {
        const label = labelMatch[0];
        const seatNum = match.slice(label.length);
        return label + seat(seatNum);
      }
      return seat(match);
    },
  },

  /**
   * 강의수 패턴
   * - 26강, 40강
   */
  lecture: {
    patterns: [
      // N강 (강의 번호/개수)
      /(?<![0-9])[\d,]+\s*강(?![의사좌])/g,
    ],
    converter: (match: string) => lecture(match),
  },

  /**
   * 분수 패턴
   * - 1/4, 2/3, 3/4
   */
  fraction: {
    patterns: [
      // N/M + 컨텍스트 (잔량, 정도 등)
      /\b\d+\s*\/\s*\d+\s*(?:잔량|정도|수준|비율|확률)/g,
      // 단독 분수 (앞뒤가 숫자가 아닌 경우, 날짜 형식 제외)
      /(?<!\d)(?<!\d[-/.])(?<!\d년\s*)\b\d+\s*\/\s*\d+\b(?![-/.]?\d)/g,
    ],
    converter: (match: string) => {
      // 컨텍스트가 있는 경우
      const contextMatch = match.match(/^(\d+)\s*\/\s*(\d+)\s*(.+)$/);
      if (contextMatch) {
        return fractionWithContext(match);
      }
      return fraction(match);
    },
  },

  /**
   * 온도 패턴
   * - 20℃, -5.3℃, 68℉, 273K
   * - 20도, 20°C
   */
  temperature: {
    patterns: [
      // 온도 범위: N℃~M℃, N도~M도
      /[+-]?[\d,]+(?:\.\d+)?\s*(?:℃|℉|°[CcFf])\s*[~-]\s*[+-]?[\d,]+(?:\.\d+)?\s*(?:℃|℉|°[CcFf])/g,
      // 단독 온도: N℃, N℉, N°C, N°F
      /[+-]?[\d,]+(?:\.\d+)?\s*(?:℃|℉|°[CcFf])/g,
      // 켈빈: NK, N켈빈 (대문자 K만)
      /[\d,]+(?:\.\d+)?\s*(?:K|켈빈)(?![a-zA-Z])/g,
      // N도 (온도 맥락: 기온, 온도, 영상, 영하 뒤에 오는 경우)
      /(?:기온|온도|영상|영하)\s*[+-]?[\d,]+(?:\.\d+)?\s*도/g,
    ],
    converter: (match: string) => {
      // 범위인 경우
      if (/[~-]/.test(match) && match.match(/\d.*[~-].*\d/)) {
        return temperatureRange(match);
      }
      // 기온/온도 컨텍스트
      const contextMatch = match.match(/^(기온|온도|영상|영하)\s*(.+)$/);
      if (contextMatch) {
        const context = contextMatch[1] ?? '';
        const temp = contextMatch[2] ?? '';
        return context + ' ' + temperature(temp);
      }
      return temperature(match);
    },
  },

  /**
   * 용량/부피 패턴
   * - 12L, 500mL, 85m³
   */
  volume: {
    patterns: [
      // 리터: NL, NmL (숫자로 시작해야 함 - LTE 등과 구분)
      /\d[\d,]*(?:\.\d+)?\s*(?:mL|ML|ml|L|ℓ)/g,
      // 세제곱미터: Nm³, Nm3
      /\d[\d,]*(?:\.\d+)?\s*(?:m³|m3|cm³|cm3)/g,
      // 시시: Ncc (뒤에 영문자가 없는 경우만 - CCTV 등 제외)
      /\d[\d,]*(?:\.\d+)?\s*(?:cc|CC)(?![a-zA-Z])/gi,
    ],
    converter: (match: string) => volume(match),
  },

  /**
   * 데이터/전력 용량 패턴
   * - 6GB, 400Kbps, 450kWh
   */
  dataCapacity: {
    patterns: [
      // 데이터 속도 범위: 100Mbps~200Mbps (먼저 매칭)
      /[\d,]+(?:\.\d+)?\s*(?:Gbps|Mbps|Kbps|gbps|mbps|kbps|bps)\s*[~]\s*[\d,]+(?:\.\d+)?\s*(?:Gbps|Mbps|Kbps|gbps|mbps|kbps|bps)/gi,
      // 데이터 용량: NGB, NMB, NTB, NKB
      /[+-]?[\d,]+(?:\.\d+)?\s*(?:TB|GB|MB|KB|tb|gb|mb|kb)/g,
      // 데이터 속도: NMbps, NKbps, NGbps
      /[\d,]+(?:\.\d+)?\s*(?:Gbps|Mbps|Kbps|gbps|mbps|kbps|bps)/gi,
      // 전력량: NkWh, NMWh, NWh
      /[+-]?[\d,]+(?:\.\d+)?\s*(?:MWh|kWh|Wh|mwh|kwh|wh)/g,
      // 전력: NkW, NMW, NW
      /[\d,]+(?:\.\d+)?\s*(?:MW|kW|W|mw|kw)(?![a-zA-Z])/g,
      // 전압: NkV, NV
      /[\d,]+(?:\.\d+)?\s*(?:kV|V|kv)(?![a-zA-Z])/g,
      // 전류: NmA, NA (뒤에 영문자나 /가 없는 경우만 - A/S 등 제외)
      /[\d,]+(?:\.\d+)?\s*(?:mA|ma)(?![a-zA-Z/])/g,
      /[\d,]+(?:\.\d+)?\s*A(?![a-zA-Z/])/g,
    ],
    converter: (match: string) => {
      // 데이터 속도 범위인 경우: 100Mbps~200Mbps
      const rangeMatch = match.match(
        /^([\d,]+(?:\.\d+)?)\s*(Gbps|Mbps|Kbps|bps)\s*[~]\s*([\d,]+(?:\.\d+)?)\s*(Gbps|Mbps|Kbps|bps)$/i
      );
      if (rangeMatch) {
        const num1 = rangeMatch[1] ?? '';
        const unit1 = rangeMatch[2] ?? '';
        const num2 = rangeMatch[3] ?? '';
        const unit2 = rangeMatch[4] ?? '';
        const converted1 = dataCapacity(num1 + unit1);
        const converted2 = dataCapacity(num2 + unit2);
        return converted1 + '에서 ' + converted2;
      }
      return dataCapacity(match);
    },
  },

  /**
   * 인치 패턴
   * - 65인치, 55인치
   */
  inch: {
    patterns: [
      // N인치
      /[\d,]+(?:\.\d+)?\s*인치/g,
    ],
    converter: (match: string) => inch(match),
  },

  /**
   * 사양 패턴 (인승, 도어, 세대, 정 등)
   * - 5인승, 4도어, 120세대, 1정
   */
  specification: {
    patterns: [
      // N인승 (차량 좌석 수)
      /[\d,]+\s*인승/g,
      // N도어 (차량 문 수)
      /[\d,]+\s*도어/g,
      // N세대 (주거 단위)
      /[\d,]+\s*세대/g,
      // N정 (약 단위)
      /[\d,]+\s*정(?![보상류확])/g,
      // N캡슐 (약 단위)
      /[\d,]+\s*캡슐/g,
      // N포 (약 단위)
      /[\d,]+\s*포(?![인함장])/g,
    ],
    converter: (match: string) => {
      // 단위 추출하여 piece로 변환
      const numMatch = match.match(/^([\d,]+)\s*(.+)$/);
      if (numMatch) {
        const numStr = numMatch[1]?.replace(/,/g, '') ?? '0';
        const unit = numMatch[2] ?? '';
        const num = parseInt(numStr, 10);
        if (!isNaN(num)) {
          return numberToKorean(num) + ' ' + unit;
        }
      }
      return match;
    },
  },

  /**
   * 포인트 (P 단위) 패턴
   * - 15,600P, 128,450P
   */
  pointP: {
    patterns: [
      // 숫자 + P (포인트)
      /[\d,]+\s*P(?![a-zA-Z])/g,
    ],
    converter: (match: string) => {
      const numMatch = match.match(/^([\d,]+)\s*P$/i);
      if (numMatch) {
        const numStr = numMatch[1]?.replace(/,/g, '') ?? '0';
        const num = parseInt(numStr, 10);
        if (!isNaN(num)) {
          return numberToKorean(num) + ' 포인트';
        }
      }
      return match;
    },
  },

  /**
   * 외화 패턴
   * - $350.00, $0.00, ¥1000
   */
  foreignCurrency: {
    patterns: [
      // 달러: $N, $N.NN
      /\$[\d,]+(?:\.\d+)?/g,
      // 엔화: ¥N, ¥N.NN
      /¥[\d,]+(?:\.\d+)?/g,
      // 유로: €N, €N.NN
      /€[\d,]+(?:\.\d+)?/g,
      // 파운드: £N, £N.NN
      /£[\d,]+(?:\.\d+)?/g,
    ],
    converter: (match: string) => {
      const currencyMatch = match.match(/^([$$¥€£])([\d,]+(?:\.\d+)?)$/);
      if (currencyMatch) {
        const symbol = currencyMatch[1];
        const numStr = currencyMatch[2]?.replace(/,/g, '') ?? '0';

        // 통화 단위 결정
        let unit: string;
        switch (symbol) {
          case '$':
            unit = '달러';
            break;
          case '¥':
            unit = '엔';
            break;
          case '€':
            unit = '유로';
            break;
          case '£':
            unit = '파운드';
            break;
          default:
            unit = '';
        }

        // 소수점 처리
        if (numStr.includes('.')) {
          const [intPart, decPart] = numStr.split('.');
          const intNum = parseInt(intPart || '0', 10);
          const intKorean = intNum === 0 ? '영' : numberToKorean(intNum);

          // 소수점 이하가 00이면 생략
          if (decPart === '00') {
            return intKorean + ' ' + unit;
          }

          const decKorean = (decPart || '')
            .split('')
            .map((d) => {
              const DIGITS = ['영', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
              return DIGITS[parseInt(d, 10)] ?? d;
            })
            .join('');
          return intKorean + ' 쩜 ' + decKorean + ' ' + unit;
        }

        const num = parseInt(numStr, 10);
        if (!isNaN(num)) {
          return (num === 0 ? '영' : numberToKorean(num)) + ' ' + unit;
        }
      }
      return match;
    },
  },

  /**
   * 터미널 패턴
   * - N터미널 (공항 터미널 번호 등)
   */
  terminal: {
    patterns: [
      // N터미널 (숫자 + 터미널)
      /(?<![0-9])\d+\s*터미널/g,
    ],
    converter: (match: string) => {
      const numMatch = match.match(/^(\d+)\s*(터미널)$/);
      if (numMatch) {
        const digits = numMatch[1] ?? '';
        const suffix = numMatch[2] ?? '';
        const DIGITS = ['영', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
        const koreanDigits = digits
          .split('')
          .map((d) => DIGITS[parseInt(d, 10)] ?? d)
          .join(' ');
        return koreanDigits + ' ' + suffix;
      }
      return match;
    },
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

  // 매칭이 없으면 후처리만 적용
  if (allMatches.length === 0) {
    let result = text;

    // 특수문자 단위를 발음으로 변환 (후처리)
    for (const [pattern, replacement] of SPECIAL_UNIT_MAP) {
      result = result.replace(pattern, replacement);
    }

    // 기술 약어를 발음으로 변환 (후처리)
    for (const [pattern, replacement] of ABBREVIATION_MAP) {
      result = result.replace(pattern, replacement);
    }

    // 주소로 인식되는 줄에서 불필요한 괄호 제거 (후처리)
    result = postProcessAddressLines(result);

    return result;
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

    // 변환된 텍스트 뒤에 다음 문자가 한글, 영문, 숫자인 경우 공백 추가
    // (TTS에서 자연스럽게 읽히도록)
    const nextChar = text[match.end];
    const convertedEndsWithSpace = match.converted.endsWith(' ');
    if (nextChar && !convertedEndsWithSpace && /[가-힣a-zA-Z0-9]/.test(nextChar)) {
      result += ' ';
    }

    currentIndex = match.end;
  }

  // 나머지 텍스트 추가
  result += text.slice(currentIndex);

  // 특수문자 단위를 발음으로 변환 (후처리)
  for (const [pattern, replacement] of SPECIAL_UNIT_MAP) {
    result = result.replace(pattern, replacement);
  }

  // 기술 약어를 발음으로 변환 (후처리)
  for (const [pattern, replacement] of ABBREVIATION_MAP) {
    result = result.replace(pattern, replacement);
  }

  // 주소로 인식되는 줄에서 불필요한 괄호 제거 (후처리)
  result = postProcessAddressLines(result);

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
export const autoRatio = (text: string): string => autoTag(text, { enabledTags: ['ratio'] });
export const autoJari = (text: string): string => autoTag(text, { enabledTags: ['jari'] });
export const autoNumber = (text: string): string => autoTag(text, { enabledTags: ['number'] });
export const autoDuration = (text: string): string => autoTag(text, { enabledTags: ['duration'] });
export const autoFloor = (text: string): string => autoTag(text, { enabledTags: ['floor'] });
export const autoAccount = (text: string): string => autoTag(text, { enabledTags: ['account'] });
export const autoWeight = (text: string): string => autoTag(text, { enabledTags: ['weight'] });
export const autoMile = (text: string): string => autoTag(text, { enabledTags: ['mile'] });
export const autoArea = (text: string): string => autoTag(text, { enabledTags: ['area'] });
export const autoSerial = (text: string): string => autoTag(text, { enabledTags: ['serial'] });
export const autoBakil = (text: string): string => autoTag(text, { enabledTags: ['bakil'] });
export const autoRoomNumber = (text: string): string =>
  autoTag(text, { enabledTags: ['roomNumber'] });
export const autoJong = (text: string): string => autoTag(text, { enabledTags: ['jong'] });
export const autoTimeOfDay = (text: string): string =>
  autoTag(text, { enabledTags: ['timeOfDay'] });
export const autoDistanceContext = (text: string): string =>
  autoTag(text, { enabledTags: ['distanceContext'] });
export const autoDistance = (text: string): string => autoTag(text, { enabledTags: ['distance'] });
export const autoMinsecContext = (text: string): string =>
  autoTag(text, { enabledTags: ['minsecContext'] });
export const autoYearMonth = (text: string): string =>
  autoTag(text, { enabledTags: ['yearMonth'] });
export const autoGIbun = (text: string): string => autoTag(text, { enabledTags: ['gIbun'] });
export const autoCarNumber = (text: string): string =>
  autoTag(text, { enabledTags: ['carNumber'] });
export const autoFlight = (text: string): string => autoTag(text, { enabledTags: ['flight'] });
export const autoSeat = (text: string): string => autoTag(text, { enabledTags: ['seat'] });
export const autoLecture = (text: string): string => autoTag(text, { enabledTags: ['lecture'] });
export const autoFraction = (text: string): string => autoTag(text, { enabledTags: ['fraction'] });
export const autoTemperature = (text: string): string =>
  autoTag(text, { enabledTags: ['temperature'] });
export const autoVolume = (text: string): string => autoTag(text, { enabledTags: ['volume'] });
export const autoDataCapacity = (text: string): string =>
  autoTag(text, { enabledTags: ['dataCapacity'] });
export const autoInch = (text: string): string => autoTag(text, { enabledTags: ['inch'] });
export const autoSpecification = (text: string): string =>
  autoTag(text, { enabledTags: ['specification'] });
export const autoPointP = (text: string): string => autoTag(text, { enabledTags: ['pointP'] });
export const autoForeignCurrency = (text: string): string =>
  autoTag(text, { enabledTags: ['foreignCurrency'] });
