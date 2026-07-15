import { assertInputWithinLimit } from '../input-guard';
import { isValidCalendarDate } from '../utils/date-validation';

const DIGITS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
const SMALL_UNITS = ['千', '百', '十', ''];
const LARGE_UNITS = ['', '万', '亿', '兆', '京'];
const NUMBER = '[+-]?(?:\\d{1,3}(?:,\\d{3})+|\\d+)(?:\\.\\d+)?';
const RANGE_SEPARATOR = '\\s*(?:-|~|〜|～|–|—|至|到)\\s*';
const UNIT =
  '(?:Mbps|GHz|kWh|TB|GB|MB|kg|mg|km|cm|mm|mL|ml|℃|°C|小时|小時|分钟|分鐘|秒钟|秒鐘|星期|个月|個月|人民币|人民幣|美元|欧元|歐元|英镑|英鎊|页|頁|人|个|個|件|台|本|张|張|次|层|層|点|點|时|時|分|秒|天|日|周|月|年|元|L|m|g)';

function readSmallGroup(value: number): string {
  const digits = String(value).padStart(4, '0');
  let result = '';
  let pendingZero = false;

  for (let index = 0; index < digits.length; index += 1) {
    const digit = Number(digits[index]);
    if (digit === 0) {
      if (result) pendingZero = true;
      continue;
    }
    if (pendingZero) result += '零';
    result += `${DIGITS[digit]}${SMALL_UNITS[index]}`;
    pendingZero = false;
  }
  return result;
}

export function digitsToChinese(input: string): string {
  return input
    .split(/[-‐‑‒–—]/)
    .map((group) =>
      group
        .split('')
        .map((digit) => DIGITS[Number(digit)] ?? digit)
        .join('·')
    )
    .join('、');
}

export function numberToChinese(input: string | number | bigint): string {
  const original = String(input);
  const raw = original.replace(/,/g, '').trim();
  if (!/^[+-]?\d+(?:\.\d+)?$/.test(raw)) return original;

  const negative = raw.startsWith('-');
  const unsigned = raw.replace(/^[+-]/, '');
  const [integerPart = '0', decimalPart] = unsigned.split('.');
  const prefix = negative ? '负' : '';

  if (integerPart.length > 1 && integerPart.startsWith('0')) {
    const integer = integerPart
      .split('')
      .map((digit) => DIGITS[Number(digit)])
      .join('');
    const decimal = decimalPart
      ? `点${decimalPart
          .split('')
          .map((digit) => DIGITS[Number(digit)])
          .join('')}`
      : '';
    return `${prefix}${integer}${decimal}`;
  }

  const groupCount = Math.ceil(integerPart.length / 4);
  if (groupCount > LARGE_UNITS.length) {
    return `${prefix}${integerPart
      .split('')
      .map((digit) => DIGITS[Number(digit)])
      .join('')}${
      decimalPart
        ? `点${decimalPart
            .split('')
            .map((digit) => DIGITS[Number(digit)])
            .join('')}`
        : ''
    }`;
  }

  let result = '';
  let skippedGroup = false;
  const padded = integerPart.padStart(groupCount * 4, '0');
  for (let index = 0; index < groupCount; index += 1) {
    const group = Number(padded.slice(index * 4, index * 4 + 4));
    const unitIndex = groupCount - index - 1;
    if (group === 0) {
      if (result) skippedGroup = true;
      continue;
    }
    if (result && (skippedGroup || group < 1000)) result += '零';
    result += `${readSmallGroup(group)}${LARGE_UNITS[unitIndex]}`;
    skippedGroup = false;
  }
  result = (result || '零').replace(/^一十/, '十');
  if (decimalPart) {
    result += `点${decimalPart
      .split('')
      .map((digit) => DIGITS[Number(digit)])
      .join('')}`;
  }
  return `${prefix}${result}`;
}

function integerValue(input: string): number | undefined {
  const normalized = input.replace(/,/g, '');
  if (!/^\d+$/.test(normalized)) return undefined;
  const value = Number(normalized);
  return Number.isSafeInteger(value) ? value : undefined;
}

function yearReading(year: number | string): string {
  return `${String(year)
    .split('')
    .map((digit) => DIGITS[Number(digit)] ?? digit)
    .join('')}年`;
}

function formatDate(year: number | undefined, month: number, day: number): string | undefined {
  if (!isValidCalendarDate(year, month, day)) return undefined;
  return `${year === undefined ? '' : yearReading(year)}${numberToChinese(month)}月${numberToChinese(day)}日`;
}

function formatTime(hour: number, minute: number, second?: number): string | undefined {
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59 || (second !== undefined && second > 59)) {
    return undefined;
  }
  return `${numberToChinese(hour)}点${minute === 0 ? '' : `${numberToChinese(minute)}分`}${
    second === undefined ? '' : `${numberToChinese(second)}秒`
  }`;
}

function phoneReading(input: string): string {
  const digits = input.replace(/\D/g, '');
  let groups: string[];
  if (digits.startsWith('86') && digits.length === 13) {
    groups = [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 9), digits.slice(9)];
  } else if (digits.length === 11 && digits.startsWith('1')) {
    groups = [digits.slice(0, 3), digits.slice(3, 7), digits.slice(7)];
  } else if (digits.length === 10 && /^(?:400|800)/.test(digits)) {
    groups = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6)];
  } else if (digits.length === 10 && digits.startsWith('09')) {
    groups = [digits.slice(0, 4), digits.slice(4, 7), digits.slice(7)];
  } else {
    groups = input
      .split('-')
      .map((part) => part.replace(/\D/g, ''))
      .filter(Boolean);
  }
  return groups.map((group) => digitsToChinese(group)).join('、');
}

function quantityReading(value: number): string {
  return value === 2 ? '两' : numberToChinese(value);
}

const UNIT_READINGS: Record<string, string> = {
  km: '公里',
  m: '米',
  cm: '厘米',
  mm: '毫米',
  kg: '千克',
  g: '克',
  mg: '毫克',
  L: '升',
  mL: '毫升',
  ml: '毫升',
  GB: '吉字节',
  MB: '兆字节',
  TB: '太字节',
  Mbps: '兆比特每秒',
  GHz: '吉赫兹',
  kWh: '千瓦时',
  '℃': '摄氏度',
  '°C': '摄氏度',
};

export function readUnit(number: string, unit: string): string {
  const value = integerValue(number);
  if (value !== undefined) {
    if (
      ['人', '个', '個', '件', '台', '本', '张', '張', '次', '层', '層', '页', '頁'].includes(unit)
    ) {
      return `${quantityReading(value)}${unit}`;
    }
    if (['点', '點', '时', '時'].includes(unit) && value <= 23)
      return `${numberToChinese(value)}点`;
    if (unit === '小时' || unit === '小時') return `${quantityReading(value)}小时`;
    if (unit === '分钟' || unit === '分鐘') return `${quantityReading(value)}分钟`;
    if (unit === '秒钟' || unit === '秒鐘') return `${quantityReading(value)}秒钟`;
    if (unit === '天') return `${quantityReading(value)}天`;
    if (unit === '年') return `${quantityReading(value)}年`;
    if (unit === '个月' || unit === '個月') return `${quantityReading(value)}个月`;
    if (unit === '周' || unit === '星期') return `${quantityReading(value)}${unit}`;
  }
  return `${numberToChinese(number)}${UNIT_READINGS[unit] ?? unit}`;
}

function currencyReading(amount: string, currency: string): string {
  const normalized = amount.replace(/,/g, '');
  const names: Record<string, string> = {
    '¥': '元',
    '￥': '元',
    元: '元',
    人民币: '元',
    人民幣: '元',
    新台币: '新台币',
    新台幣: '新台币',
    新臺幣: '新台币',
    NT$: '新台币',
    $: '美元',
    美元: '美元',
    '€': '欧元',
    欧元: '欧元',
    歐元: '欧元',
    '£': '英镑',
    英镑: '英镑',
    英鎊: '英镑',
  };
  return `${numberToChinese(normalized)}${names[currency] ?? currency}`;
}

export const SUPPORTED_AUTO_TAGS = [
  'phone',
  'postalCode',
  'serial',
  'account',
  'flight',
  'scripture',
  'datetime',
  'date',
  'time',
  'range',
  'money',
  'score',
  'ratio',
  'percentage',
  'fraction',
  'order',
  'unit',
  'email',
  'direction',
  'number',
] as const;

export type ChineseAutoTag = (typeof SUPPORTED_AUTO_TAGS)[number];

export interface AutoTagOptions {
  enabledTags?: ChineseAutoTag[];
}

export interface MatchResult {
  original: string;
  converted: string;
  tagType: ChineseAutoTag;
  start: number;
  end: number;
}

interface Rule {
  tagType: ChineseAutoTag;
  pattern: RegExp;
  convert: (match: RegExpExecArray) => string;
}

const RULES: Rule[] = [
  {
    tagType: 'phone',
    pattern:
      /(?<!\d)(?:(?:\+86[- ]?)?1[3-9]\d(?:[- ]?\d{4}){2}|(?:400|800)-?\d{3}-?\d{4}|09\d{2}-?\d{3}-?\d{3}|0[2-8]-\d{3,4}-\d{4}|0\d{2,3}-\d{7,8})(?!\d)/g,
    convert: (match) => phoneReading(match[0]),
  },
  {
    tagType: 'postalCode',
    pattern:
      /(?:邮政编码|邮编|郵政編碼|郵編|郵遞區號)(?:是|为|為|：|:)?\s*(?:\d{3}-?\d{3}|\d{5}|\d{3})(?!\d)/g,
    convert: (match) =>
      match[0].replace(/\d{3}-?\d{3}|\d{5}|\d{3}/, (digits) => digitsToChinese(digits)),
  },
  {
    tagType: 'serial',
    pattern:
      /((?:(?:订单|訂單|预约|預約|确认|確認|产品|產品)(?:编号|編號)|序列号|序列號|序号|序號|验证码|驗證碼|确认码|確認碼)(?:是|为|為|：|:)?\s*)([A-Z0-9]+(?:[-‐‑‒–—][A-Z0-9]+)*)/gi,
    convert: (match) => `${match[1]}${digitsToChinese((match[2] ?? '').toUpperCase())}`,
  },
  {
    tagType: 'account',
    pattern:
      /((?:账号|帳號|银行账号|銀行帳號|会员编号|會員編號|客户编号|客戶編號)(?:是|为|為|：|:)?\s*)([A-Z0-9]+(?:[-‐‑‒–—][A-Z0-9]+)*)/gi,
    convert: (match) => `${match[1]}${digitsToChinese((match[2] ?? '').toUpperCase())}`,
  },
  {
    tagType: 'flight',
    pattern: /((?:航班|班机|班機)(?:号|號)?(?:是|为|為|：|:)?\s*)([A-Z]{2,3}-?\d{1,4})/gi,
    convert: (match) => `${match[1]}${digitsToChinese((match[2] ?? '').toUpperCase())}`,
  },
  {
    tagType: 'scripture',
    pattern:
      /(?:创世记|創世記|出埃及记|出埃及記|诗篇|詩篇|箴言|马太福音|馬太福音|马可福音|馬可福音|路加福音|约翰福音|約翰福音|使徒行传|使徒行傳|罗马书|羅馬書)\s*\d{1,3}:\d{1,3}/g,
    convert: (match) =>
      match[0].replace(
        /(\d{1,3}):(\d{1,3})$/,
        (_, chapter: string, verse: string) =>
          `${numberToChinese(chapter)}章${numberToChinese(verse)}节`
      ),
  },
  {
    tagType: 'datetime',
    pattern: /(?<!\d)\d{4}[-/]\d{1,2}[-/]\d{1,2}[T ]\d{1,2}:\d{2}(?::\d{2})?(?!\d)/g,
    convert: (match): string => {
      const parts = match[0].match(
        /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})[T ](\d{1,2}):(\d{2})(?::(\d{2}))?$/
      );
      if (!parts) return match[0];
      const date = formatDate(Number(parts[1]), Number(parts[2]), Number(parts[3]));
      const time = formatTime(
        Number(parts[4]),
        Number(parts[5]),
        parts[6] ? Number(parts[6]) : undefined
      );
      return date && time ? `${date}${time}` : match[0];
    },
  },
  {
    tagType: 'date',
    pattern:
      /(?<!\d)(?:\d{4}年\d{1,2}月\d{1,2}日|\d{1,2}月\d{1,2}日|\d{4}[-/]\d{1,2}[-/]\d{1,2})(?!\d)/g,
    convert: (match): string => {
      const chinese = match[0].match(/^(?:(\d{4})年)?(\d{1,2})月(\d{1,2})日$/);
      const iso = match[0].match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
      const parts = chinese ?? iso;
      if (!parts) return match[0];
      return (
        formatDate(parts[1] ? Number(parts[1]) : undefined, Number(parts[2]), Number(parts[3])) ??
        match[0]
      );
    },
  },
  {
    tagType: 'range',
    pattern: new RegExp(`(?<!\\d)\\d{1,2}:\\d{2}${RANGE_SEPARATOR}\\d{1,2}:\\d{2}(?!\\d)`, 'g'),
    convert: (match): string => {
      const parts = match[0].split(/\s*(?:-|~|〜|～|–|—|至|到)\s*/);
      const read = (value: string): string | undefined => {
        const [hour, minute] = value.split(':').map(Number);
        return formatTime(hour ?? -1, minute ?? -1);
      };
      const from = read(parts[0] ?? '');
      const to = read(parts[1] ?? '');
      return from && to ? `${from}到${to}` : match[0];
    },
  },
  {
    tagType: 'range',
    pattern: new RegExp(`(${NUMBER})${RANGE_SEPARATOR}(${NUMBER})(${UNIT})`, 'g'),
    convert: (match): string => {
      const from = match[1] ?? '';
      const to = match[2] ?? '';
      const unit = match[3] ?? '';
      if (['点', '點', '时', '時'].includes(unit) && [from, to].some((item) => Number(item) > 23)) {
        return match[0];
      }
      return `${readUnit(from, unit)}到${readUnit(to, unit)}`;
    },
  },
  {
    tagType: 'time',
    pattern: /(?<!\d)(?:\d{1,2}:\d{2}(?::\d{2})?|\d{1,2}(?:点|點|时|時)(?:\d{1,2}分)?)(?!\d)/g,
    convert: (match): string => {
      const colon = match[0].match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
      const chinese = match[0].match(/^(\d{1,2})(?:点|點|时|時)(?:(\d{1,2})分)?$/);
      const parts = colon ?? chinese;
      if (!parts) return match[0];
      return (
        formatTime(
          Number(parts[1]),
          Number(parts[2] ?? 0),
          parts[3] ? Number(parts[3]) : undefined
        ) ?? match[0]
      );
    },
  },
  {
    tagType: 'money',
    pattern: new RegExp(
      `(?:(?:NT\\$|[¥￥$€£])\\s*${NUMBER}|${NUMBER}\\s*(?:人民币|人民幣|新台币|新台幣|新臺幣|美元|欧元|歐元|英镑|英鎊|元))`,
      'g'
    ),
    convert: (match): string => {
      const prefix = match[0].match(/^(NT\$|[¥￥$€£])\s*(.+)$/);
      const suffix = match[0].match(
        /^(.+?)\s*(人民币|人民幣|新台币|新台幣|新臺幣|美元|欧元|歐元|英镑|英鎊|元)$/
      );
      return prefix
        ? currencyReading(prefix[2] ?? '', prefix[1] ?? '')
        : suffix
          ? currencyReading(suffix[1] ?? '', suffix[2] ?? '')
          : match[0];
    },
  },
  {
    tagType: 'score',
    pattern:
      /(?:比分|比數|得分)(?:是|为|為|：|:)?\s*\d+\s*[-:比]\s*\d+|\d+\s*[-:]\s*\d+(?=\s*(?:获胜|獲勝|胜|勝|失利|落败|落敗|战平|戰平|结束|結束))/g,
    convert: (match) =>
      match[0].replace(
        /(\d+)\s*[-:比]\s*(\d+)/,
        (_, left: string, right: string) => `${numberToChinese(left)}比${numberToChinese(right)}`
      ),
  },
  {
    tagType: 'ratio',
    pattern: /(?:比例|比率)(?:是|为|為|：|:)?\s*\d+(?:\.\d+)?\s*[:比]\s*\d+(?:\.\d+)?/g,
    convert: (match) =>
      match[0].replace(
        /(\d+(?:\.\d+)?)\s*[:比]\s*(\d+(?:\.\d+)?)/,
        (_, left: string, right: string) => `${numberToChinese(left)}比${numberToChinese(right)}`
      ),
  },
  {
    tagType: 'percentage',
    pattern: new RegExp(`${NUMBER}\\s*(?:%|％)`, 'g'),
    convert: (match) => `百分之${numberToChinese(match[0].replace(/\s*(?:%|％)$/, ''))}`,
  },
  {
    tagType: 'fraction',
    pattern: /\d+\s*\/\s*\d+/g,
    convert: (match): string => {
      const [numerator = '', denominator = ''] = match[0].split(/\s*\/\s*/);
      return `${numberToChinese(denominator)}分之${numberToChinese(numerator)}`;
    },
  },
  {
    tagType: 'order',
    pattern: /第\d+(?:章|集|期|位|名|页|頁|号|號|回)|No\.\s*\d+/gi,
    convert: (match): string => {
      const no = match[0].match(/^No\.\s*(\d+)$/i);
      if (no) return `编号${numberToChinese(no[1] ?? '')}`;
      return match[0].replace(/\d+/, (value) => numberToChinese(value));
    },
  },
  {
    tagType: 'unit',
    pattern: new RegExp(`(${NUMBER})(${UNIT})`, 'g'),
    convert: (match) => readUnit(match[1] ?? '', match[2] ?? ''),
  },
  {
    tagType: 'email',
    pattern: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,
    convert: (match) => match[0].replace('@', ' 艾特 ').replace(/\./g, ' 点 '),
  },
  {
    tagType: 'direction',
    pattern: /([\u3400-\u9fff]+)→([\u3400-\u9fff]+)/g,
    convert: (match) => `${match[1]}到${match[2]}`,
  },
  {
    tagType: 'number',
    pattern: new RegExp(NUMBER, 'g'),
    convert: (match) => numberToChinese(match[0]),
  },
];

function findMatches(text: string, enabledTags?: ChineseAutoTag[]): MatchResult[] {
  const enabled = enabledTags ? new Set(enabledTags) : undefined;
  if (enabled && enabled.size === 0) return [];

  const candidates: Array<MatchResult & { priority: number }> = [];
  RULES.forEach((rule, priority) => {
    if (enabled && !enabled.has(rule.tagType)) return;
    rule.pattern.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = rule.pattern.exec(text)) !== null) {
      candidates.push({
        original: match[0],
        converted: rule.convert(match),
        tagType: rule.tagType,
        start: match.index,
        end: match.index + match[0].length,
        priority,
      });
    }
  });

  candidates.sort((left, right) => left.start - right.start || left.priority - right.priority);
  const selected: MatchResult[] = [];
  let cursor = 0;
  for (const candidate of candidates) {
    if (candidate.start < cursor) continue;
    selected.push({
      original: candidate.original,
      converted: candidate.converted,
      tagType: candidate.tagType,
      start: candidate.start,
      end: candidate.end,
    });
    cursor = candidate.end;
  }
  return selected;
}

export function autoTag(text: string, options?: AutoTagOptions): string {
  if (!text) return text;
  assertInputWithinLimit(text, 'chinese.autoTag');
  const matches = findMatches(text, options?.enabledTags);
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
  assertInputWithinLimit(text, 'chinese.extractAutoTags');
  return findMatches(text, options?.enabledTags).map(
    ({ converted: _converted, ...match }) => match
  );
}

const SPECIAL_MANUAL_TAGS = ['name', 'digits'] as const;
export const SUPPORTED_TAGS = [...SUPPORTED_AUTO_TAGS, ...SPECIAL_MANUAL_TAGS];
const MANUAL_TAG_PATTERN = new RegExp(`(${SUPPORTED_TAGS.join('|')})\\(([^)]*)\\)`, 'g');

function convertManualTag(tag: string, value: string): string {
  if (tag === 'name') return value;
  if (tag === 'digits') return digitsToChinese(value.replace(/[^\d-]/g, ''));
  if (tag === 'score') {
    return value.replace(
      /(\d+)\s*[-:比]\s*(\d+)/,
      (_, left: string, right: string) => `${numberToChinese(left)}比${numberToChinese(right)}`
    );
  }
  return autoTag(value, { enabledTags: [tag as ChineseAutoTag] });
}

export function manualTag(text: string): string {
  if (!text) return text;
  assertInputWithinLimit(text, 'chinese.manualTag');
  return text.replace(MANUAL_TAG_PATTERN, (_match, tag: string, value: string) =>
    convertManualTag(tag, value)
  );
}

export function extractTags(
  text: string
): Array<{ tag: string; value: string; start: number; end: number }> {
  if (!text) return [];
  assertInputWithinLimit(text, 'chinese.extractTags');
  const pattern = new RegExp(MANUAL_TAG_PATTERN.source, 'g');
  const results: Array<{ tag: string; value: string; start: number; end: number }> = [];
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

export function manualTagSelective(text: string, allowedTags: string[]): string {
  if (!text || allowedTags.length === 0) return text;
  assertInputWithinLimit(text, 'chinese.manualTagSelective');
  const allowed = new Set(allowedTags.filter((tag) => SUPPORTED_TAGS.includes(tag as never)));
  return text.replace(MANUAL_TAG_PATTERN, (match, tag: string, value: string) =>
    allowed.has(tag) ? convertManualTag(tag, value) : match
  );
}

export function autoTagWithManual(text: string, options?: AutoTagOptions): string {
  return autoTag(manualTag(text), options);
}
