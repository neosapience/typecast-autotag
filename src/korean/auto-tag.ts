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
import { distance } from './tags/distance';
import { carNumber } from './tags/car-number';
import { flight } from './tags/flight';
import { seat } from './tags/seat';
import { lecture } from './tags/lecture';

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
   * - 한글 형식: 14시30분, 오후 2시 30분, 9시 (단독)
   */
  time: {
    patterns: [
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
    converter: (match: string) => time(match),
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
      // YYYYMMDD 형식 (8자리 숫자, 생년월일 형태)
      // 년도 범위 제한: 1900-2099
      // 뒤에 -숫자가 오면 접수번호 등으로 간주하여 제외
      /\b(?:19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])(?!-\d)\b/g,
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
   * - 숫자 + 원 (소수점 지원)
   * - 숫자 + 만원/억원/조원/경원/천원 (한글 큰 단위)
   * - ₩숫자
   * - 천단위 구분자 지원
   * - 음수 금액: -숫자원
   * - 한글 숫자 혼합: N억 N천만원
   */
  money: {
    patterns: [
      // 음수 금액: -숫자원
      /-[\d,]+(?:\.\d+)?\s*원(?!\s*[년월일시분초])/g,
      // 한글 숫자 혼합: N억 N천만원, N억원
      /\d+억\s*(?:\d+천만)?(?:\d+백만)?원/g,
      // 숫자 + 만원/억원/조원/경원/천원 (한글 큰 단위)
      /[\d,]+\s*(?:만|억|조|경|천)원(?!\s*[년월일시분초])/g,
      // 숫자 + 원 (천단위 구분자 및 소수점 지원)
      /[\d,]+(?:\.\d+)?\s*원(?!\s*[년월일시분초])/g,
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
   * 시분초 패턴 (지속시간)
   * - Nm, Ns, NmNs, NhNmNs
   * - N분, N초, N분N초, N시간N분
   * - 시간 범위: 1h30m~2h (~ → 에서)
   * - 소수점 지원: 0.3초, 1.5초 등
   */
  minsec: {
    patterns: [
      // 시간 범위: 1h30m~2h, 5m~10m
      /\b\d+h(?:\d+m)?(?:\d+s)?~\d+h(?:\d+m)?(?:\d+s)?\b/gi,
      /\b\d+m(?:\d+s)?~\d+m(?:\d+s)?\b/gi,
      // 영문: 1h30m20s, 5m, 30s, 1h30m
      /\b\d+h(?:\d+m)?(?:\d+s)?\b/gi,
      /\b\d+m(?:\d+s)?\b/gi,
      /\b\d+s\b/gi,
      // 영문 풀 단어: 5minutes, 30seconds, 1hour
      /\b\d+\s*(?:hours?|minutes?|seconds?|mins?|secs?)\b/gi,
      // 한글: N시간, N분, N초 조합 (소수점 지원)
      /\d+시간(?:\s*\d+분)?(?:\s*[\d.]+초)?/g,
      /(?<!\d시간\s*)\d+분(?:\s*[\d.]+초)?/g,
      // 소수점 초: 0.3초, 1.5초 등 (정수 초보다 먼저 매칭)
      /(?<!\d분\s*)[\d,]+\.\d+\s*초(?!\s*[점])/g,
      // 정수 초: 30초 등
      /(?<!\d분\s*)\d+초(?!\s*[점])/g,
    ],
    converter: (match: string) => minsec(match),
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
    converter: (match: string) => floor(match),
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
      // 무게: 숫자 + kg/g/mg/ton/톤/킬로그램/그램/밀리그램
      /[\d,]+(?:\.\d+)?\s*(?:kg|g|mg|ton|톤|킬로그램|그램|밀리그램)/gi,
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
      // 모델번호, 접수번호, 계약번호, 처방전 번호, 증권번호, 보험번호 등 레이블 + 코드 형식
      /(?:모델번호|접수번호|계약번호|처방전\s*번호|주문번호|예약번호|증권번호|보험번호)[:\s]*[A-Za-z0-9-]+/g,
      // 영문+숫자+하이픈 조합의 코드 (최소 하이픈 1개 포함, 숫자 포함)
      /\b[A-Za-z]{1,5}-\d{4,}-\d{2,}\b/g,
      /\b\d{8,}-\d{4,}\b/g,
    ],
    converter: (match: string) => {
      // 레이블이 있는 경우 레이블 유지하고 숫자만 변환
      if (
        /^(?:모델번호|접수번호|계약번호|처방전\s*번호|주문번호|예약번호|증권번호|보험번호)/.test(
          match
        )
      ) {
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
   */
  distance: {
    patterns: [
      // 거리: 숫자 + km/m/cm/mm/킬로미터/미터/센티미터/밀리미터
      /[\d,]+(?:\.\d+)?\s*(?:km|킬로미터|센티미터|밀리미터|cm|mm)/gi,
      // m은 다른 단위와 충돌할 수 있으므로 따로 처리
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
      // 차량번호 레이블 + 차량번호
      /차량번호[:\s]*(?:[가-힣]{2})?\d{2,3}[가-힣]\s?\d{4}/g,
      // 지역명(선택) + 숫자2-3자리 + 한글1자 + 공백(선택) + 숫자4자리
      /(?:[가-힣]{2})?\d{2,3}[가-힣]\s?\d{4}/g,
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
export const autoDistance = (text: string): string => autoTag(text, { enabledTags: ['distance'] });
export const autoYearMonth = (text: string): string =>
  autoTag(text, { enabledTags: ['yearMonth'] });
export const autoGIbun = (text: string): string => autoTag(text, { enabledTags: ['gIbun'] });
export const autoCarNumber = (text: string): string =>
  autoTag(text, { enabledTags: ['carNumber'] });
export const autoFlight = (text: string): string => autoTag(text, { enabledTags: ['flight'] });
export const autoSeat = (text: string): string => autoTag(text, { enabledTags: ['seat'] });
export const autoLecture = (text: string): string => autoTag(text, { enabledTags: ['lecture'] });
