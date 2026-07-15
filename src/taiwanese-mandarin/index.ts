import { assertInputWithinLimit } from '../input-guard';
import * as chinese from '../chinese';

const TAIWAN_READINGS: Record<string, string> = {
  新台币: '新臺幣',
  人民币: '人民幣',
  兆比特每秒: '百萬位元每秒',
  太字节: '太位元組',
  吉字节: '吉位元組',
  兆字节: '兆位元組',
  吉赫兹: '吉赫茲',
  千瓦时: '千瓦時',
  摄氏度: '攝氏度',
  千克: '公斤',
  厘米: '公分',
  毫米: '公釐',
  毫克: '毫克',
  毫升: '毫升',
  小时: '小時',
  分钟: '分鐘',
  秒钟: '秒鐘',
  个月: '個月',
  编号: '編號',
  艾特: '小老鼠',
  美元: '美元',
  欧元: '歐元',
  英镑: '英鎊',
  万: '萬',
  亿: '億',
  负: '負',
  点: '點',
  两: '兩',
  页: '頁',
  个: '個',
  张: '張',
  层: '層',
  节: '節',
  克: '公克',
  米: '公尺',
  升: '公升',
};

const TAIWAN_READING_PATTERN = new RegExp(
  Object.keys(TAIWAN_READINGS)
    .sort((left, right) => right.length - left.length)
    .join('|'),
  'g'
);

function toTaiwaneseMandarin(text: string): string {
  return text.replace(TAIWAN_READING_PATTERN, (value) => TAIWAN_READINGS[value] ?? value);
}

export const SUPPORTED_AUTO_TAGS = chinese.SUPPORTED_AUTO_TAGS;
export const SUPPORTED_TAGS = chinese.SUPPORTED_TAGS;
export type TaiwaneseMandarinAutoTag = chinese.ChineseAutoTag;

export interface AutoTagOptions {
  enabledTags?: TaiwaneseMandarinAutoTag[];
}

export interface MatchResult {
  original: string;
  converted: string;
  tagType: TaiwaneseMandarinAutoTag;
  start: number;
  end: number;
}

export function digitsToTaiwaneseMandarin(input: string): string {
  return toTaiwaneseMandarin(chinese.digitsToChinese(input));
}

export function numberToTaiwaneseMandarin(input: string | number | bigint): string {
  return toTaiwaneseMandarin(chinese.numberToChinese(input));
}

export function readUnit(number: string, unit: string): string {
  return toTaiwaneseMandarin(chinese.readUnit(number, unit));
}

function findMatches(text: string, options?: AutoTagOptions): MatchResult[] {
  // ponytail: re-run one shared rule per match; expose Chinese conversions only if 10k-char inputs become hot-path.
  return chinese.extractAutoTags(text, options).map((match) => ({
    ...match,
    converted: toTaiwaneseMandarin(
      chinese.autoTag(match.original, { enabledTags: [match.tagType] })
    ),
  }));
}

export function autoTag(text: string, options?: AutoTagOptions): string {
  if (!text) return text;
  assertInputWithinLimit(text, 'taiwaneseMandarin.autoTag');
  const matches = findMatches(text, options);
  if (matches.length === 0) return text;

  let cursor = 0;
  let result = '';
  for (const match of matches) {
    result += text.slice(cursor, match.start) + match.converted;
    cursor = match.end;
  }
  return result + text.slice(cursor);
}

export function extractAutoTags(
  text: string,
  options?: AutoTagOptions
): Array<Omit<MatchResult, 'converted'>> {
  if (!text) return [];
  assertInputWithinLimit(text, 'taiwaneseMandarin.extractAutoTags');
  return findMatches(text, options).map(({ converted: _converted, ...match }) => match);
}

const MANUAL_TAG_PATTERN = new RegExp(`(${SUPPORTED_TAGS.join('|')})\\(([^)]*)\\)`, 'g');

function convertManualTag(match: string, tag: string): string {
  const converted = chinese.manualTag(match);
  return tag === 'name' ? converted : toTaiwaneseMandarin(converted);
}

export function manualTag(text: string): string {
  if (!text) return text;
  assertInputWithinLimit(text, 'taiwaneseMandarin.manualTag');
  return text.replace(MANUAL_TAG_PATTERN, convertManualTag);
}

export function extractTags(
  text: string
): Array<{ tag: string; value: string; start: number; end: number }> {
  if (!text) return [];
  assertInputWithinLimit(text, 'taiwaneseMandarin.extractTags');
  return chinese.extractTags(text);
}

export function manualTagSelective(text: string, allowedTags: string[]): string {
  if (!text || allowedTags.length === 0) return text;
  assertInputWithinLimit(text, 'taiwaneseMandarin.manualTagSelective');
  const allowed = new Set(allowedTags);
  return text.replace(MANUAL_TAG_PATTERN, (match, tag: string) =>
    allowed.has(tag) ? convertManualTag(match, tag) : match
  );
}

export function autoTagWithManual(text: string, options?: AutoTagOptions): string {
  return autoTag(manualTag(text), options);
}
