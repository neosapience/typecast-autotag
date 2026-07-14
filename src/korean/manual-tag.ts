import { name } from './tags/name';
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
import { digits } from './tags/digits';
import { minsec } from './tags/minsec';
import { datetime } from './tags/datetime';
import { ratio } from './tags/ratio';
import { jari } from './tags/jari';
import { numberTag } from './tags/number';
import { duration } from './tags/duration';
import { floor } from './tags/floor';
import { account } from './tags/account';
import { weight } from './tags/weight';
import { mile } from './tags/mile';
import { area } from './tags/area';
import { serial } from './tags/serial';
import { bakil } from './tags/bakil';
import { roomNumber } from './tags/room-number';
import { jong } from './tags/jong';
import { distance } from './tags/distance';
import { carNumber } from './tags/car-number';
import { flight } from './tags/flight';
import { seat } from './tags/seat';
import { lecture } from './tags/lecture';
import { fraction } from './tags/fraction';
import { temperature } from './tags/temperature';
import { volume } from './tags/volume';
import { dataCapacity } from './tags/data-capacity';
import { inch } from './tags/inch';
import { address } from './tags/address';
import { assertInputWithinLimit } from '../input-guard';

/**
 * 사용 가능한 태그 함수 매핑
 */
type TagFunction = (input: string) => string;

const TAG_FUNCTIONS: Record<string, TagFunction> = {
  name: (input) => name(input),
  month: (input) => month(input),
  day: (input) => day(input),
  date: (input) => date(input),
  time: (input) => time(input),
  year: (input) => year(input),
  phone: (input) => phone(input),
  money: (input) => money(input),
  order: (input) => order(input),
  point: (input) => point(input),
  piece: (input) => piece(input),
  digits: (input) => digits(input),
  minsec: (input) => minsec(input),
  datetime: (input) => datetime(input),
  ratio: (input) => ratio(input),
  jari: (input) => jari(input),
  number: (input) => numberTag(input),
  duration: (input) => duration(input),
  floor: (input) => floor(input),
  account: (input) => account(input),
  weight: (input) => weight(input),
  mile: (input) => mile(input),
  area: (input) => area(input),
  serial: (input) => serial(input),
  bakil: (input) => bakil(input),
  roomNumber: (input) => roomNumber(input),
  jong: (input) => jong(input),
  distance: (input) => distance(input),
  carNumber: (input) => carNumber(input),
  flight: (input) => flight(input),
  seat: (input) => seat(input),
  lecture: (input) => lecture(input),
  fraction: (input) => fraction(input),
  temperature: (input) => temperature(input),
  volume: (input) => volume(input),
  dataCapacity: (input) => dataCapacity(input),
  inch: (input) => inch(input),
  address: (input) => address(input),
};

/**
 * 지원하는 태그 이름 목록
 */
export const SUPPORTED_TAGS = Object.keys(TAG_FUNCTIONS);

/**
 * 태그 매칭을 위한 정규식
 * 형식: tagName(value) - 괄호 안에는 아무 문자나 포함 가능 (1단계 중첩 괄호 지원)
 * 예: address(우성베스토피아 102동 1101호 ( 엘지동, 우성베스토피아 ))
 */
const TAG_PATTERN = new RegExp(
  `(${SUPPORTED_TAGS.join('|')})\\(([^()]*(?:\\([^)]*\\)[^()]*)*)\\)`,
  'g'
);

/**
 * 텍스트에서 태그를 파싱하여 해당 태그 함수를 적용한 결과로 대체
 *
 * @param text - 변환할 텍스트
 * @returns 태그가 변환된 텍스트
 *
 * @example
 * ```typescript
 * manualTag('안녕하세요, name(김형우) 고객님.');
 * // '안녕하세요, 김 형 우 고객님.'
 *
 * manualTag('month(12) day(25)에 방문 예정입니다.');
 * // '십이월 이십오일에 방문 예정입니다.'
 *
 * manualTag('주문번호는 phone(010-1234-5678)입니다.');
 * // '주문번호는 공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔입니다.'
 *
 * manualTag('금액은 money(10000)입니다.');
 * // '금액은 만 원입니다.'
 * ```
 */
export function manualTag(text: string): string {
  if (!text || text.length === 0) {
    return text;
  }
  assertInputWithinLimit(text, 'korean.manualTag');

  return text.replace(TAG_PATTERN, (match, tagName: string, value: string) => {
    const tagFunction = TAG_FUNCTIONS[tagName];
    if (tagFunction) {
      return tagFunction(value);
    }
    // 태그 함수를 찾지 못하면 원본 유지
    return match;
  });
}

/**
 * 텍스트에서 발견된 태그들을 추출
 *
 * @param text - 분석할 텍스트
 * @returns 발견된 태그 정보 배열 { tag, value, start, end }
 *
 * @example
 * ```typescript
 * extractTags('안녕하세요, name(김형우) 고객님.');
 * // [{ tag: 'name', value: '김형우', start: 7, end: 17 }]
 * ```
 */
export function extractTags(
  text: string
): Array<{ tag: string; value: string; start: number; end: number }> {
  if (!text || text.length === 0) {
    return [];
  }
  assertInputWithinLimit(text, 'korean.extractTags');

  const results: Array<{ tag: string; value: string; start: number; end: number }> = [];
  const pattern = new RegExp(`(${SUPPORTED_TAGS.join('|')})\\(([^)]*)\\)`, 'g');

  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    results.push({
      tag: match[1] ?? '',
      value: match[2] ?? '',
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  return results;
}

/**
 * 특정 태그만 선택적으로 변환
 *
 * @param text - 변환할 텍스트
 * @param allowedTags - 허용할 태그 이름 배열
 * @returns 선택된 태그만 변환된 텍스트
 *
 * @example
 * ```typescript
 * manualTagSelective('name(김형우) month(12)', ['name']);
 * // '김 형 우 month(12)'
 * ```
 */
export function manualTagSelective(text: string, allowedTags: string[]): string {
  if (!text || text.length === 0) {
    return text;
  }
  assertInputWithinLimit(text, 'korean.manualTagSelective');

  if (allowedTags.length === 0) {
    return text;
  }

  // 허용된 태그만 필터링
  const filteredTags = allowedTags.filter((tag) => SUPPORTED_TAGS.includes(tag));
  if (filteredTags.length === 0) {
    return text;
  }

  const pattern = new RegExp(`(${filteredTags.join('|')})\\(([^)]*)\\)`, 'g');

  return text.replace(pattern, (match, tagName: string, value: string) => {
    const tagFunction = TAG_FUNCTIONS[tagName];
    if (tagFunction) {
      return tagFunction(value);
    }
    return match;
  });
}
