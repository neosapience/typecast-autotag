import { assertInputWithinLimit } from '../input-guard';
import { isValidCalendarDate } from '../utils/date-validation';

const DIGITS = ['ゼロ', 'いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう'];
const LARGE_UNITS = ['', 'まん', 'おく', 'ちょう', 'けい'];
const NUMBER = '[+-]?(?:\\d{1,3}(?:,\\d{3})+|\\d+)(?:\\.\\d+)?';
const RANGE_SEPARATOR = '\\s*(?:-|~|〜|～|–|—)\\s*';
const UNIT =
  '(?:Mbps|GHz|kWh|TB|GB|MB|kg|mg|km|cm|mm|mL|ml|℃|°C|時間|週間|日間|か月|ヶ月|カ月|箇月|ページ|ドル|ユーロ|ポンド|人|個|件|台|本|枚|冊|回|階|時|分|秒|日|年|円|L|m|g)';

function readSmallGroup(value: number): string {
  if (value === 0) return '';

  const thousands = Math.floor(value / 1000);
  const hundreds = Math.floor((value % 1000) / 100);
  const tens = Math.floor((value % 100) / 10);
  const ones = value % 10;
  let result = '';

  if (thousands === 1) result += 'せん';
  else if (thousands === 3) result += 'さんぜん';
  else if (thousands === 8) result += 'はっせん';
  else if (thousands > 0) result += `${DIGITS[thousands]}せん`;

  if (hundreds === 1) result += 'ひゃく';
  else if (hundreds === 3) result += 'さんびゃく';
  else if (hundreds === 6) result += 'ろっぴゃく';
  else if (hundreds === 8) result += 'はっぴゃく';
  else if (hundreds > 0) result += `${DIGITS[hundreds]}ひゃく`;

  if (tens === 1) result += 'じゅう';
  else if (tens > 1) result += `${DIGITS[tens]}じゅう`;
  if (ones > 0) result += DIGITS[ones];

  return result;
}

export function digitsToJapanese(input: string): string {
  return input
    .split(/[-‐‑‒–—]/)
    .map((group) =>
      group
        .split('')
        .map((digit) => DIGITS[Number(digit)] ?? digit)
        .join('・')
    )
    .join('、');
}

export function numberToJapanese(input: string | number | bigint): string {
  const raw = String(input).replace(/,/g, '').trim();
  if (!/^[+-]?\d+(?:\.\d+)?$/.test(raw)) return String(input);

  const negative = raw.startsWith('-');
  const unsigned = raw.replace(/^[+-]/, '');
  const [integerPart = '0', decimalPart] = unsigned.split('.');
  if (integerPart.length > 1 && integerPart.startsWith('0')) {
    const leading = integerPart
      .split('')
      .map((digit) => DIGITS[Number(digit)])
      .join('');
    return `${negative ? 'マイナス' : ''}${leading}${
      decimalPart
        ? `てん${decimalPart
            .split('')
            .map((digit) => DIGITS[Number(digit)])
            .join('')}`
        : ''
    }`;
  }

  if (/^0+$/.test(integerPart) && !decimalPart) return 'ゼロ';

  const groupCount = Math.ceil(integerPart.length / 4);
  if (groupCount > LARGE_UNITS.length) {
    return `${negative ? 'マイナス' : ''}${integerPart
      .split('')
      .map((digit) => DIGITS[Number(digit)])
      .join('')}`;
  }

  let result = '';
  const padded = integerPart.padStart(groupCount * 4, '0');
  for (let index = 0; index < groupCount; index += 1) {
    const group = Number(padded.slice(index * 4, index * 4 + 4));
    const unitIndex = groupCount - index - 1;
    if (group > 0) result += `${readSmallGroup(group)}${LARGE_UNITS[unitIndex]}`;
  }
  if (decimalPart) {
    result += `てん${decimalPart
      .split('')
      .map((digit) => DIGITS[Number(digit)])
      .join('')}`;
  }
  return `${negative ? 'マイナス' : ''}${result}`;
}

function integerValue(input: string): number | undefined {
  const normalized = input.replace(/,/g, '');
  if (!/^\d+$/.test(normalized)) return undefined;
  const value = Number(normalized);
  return Number.isSafeInteger(value) ? value : undefined;
}

function dayReading(day: number): string {
  const irregular: Record<number, string> = {
    1: 'ついたち',
    2: 'ふつか',
    3: 'みっか',
    4: 'よっか',
    5: 'いつか',
    6: 'むいか',
    7: 'なのか',
    8: 'ようか',
    9: 'ここのか',
    10: 'とおか',
    14: 'じゅうよっか',
    20: 'はつか',
    24: 'にじゅうよっか',
  };
  return irregular[day] ?? `${numberToJapanese(day)}にち`;
}

function monthReading(month: number): string {
  if (month === 4) return 'しがつ';
  if (month === 7) return 'しちがつ';
  if (month === 9) return 'くがつ';
  return `${numberToJapanese(month)}がつ`;
}

function yearReading(year: number | string): string {
  return `${numberToJapanese(year).replace(/よん$/, 'よ')}ねん`;
}

function hourReading(hour: number): string {
  if (hour === 0) return 'れいじ';
  return `${numberToJapanese(hour)
    .replace(/よん$/, 'よ')
    .replace(/なな$/, 'しち')
    .replace(/きゅう$/, 'く')}じ`;
}

function minuteReading(minute: number): string {
  const endings: Record<number, string> = {
    1: 'いっぷん',
    2: 'にふん',
    3: 'さんぷん',
    4: 'よんぷん',
    5: 'ごふん',
    6: 'ろっぷん',
    7: 'ななふん',
    8: 'はっぷん',
    9: 'きゅうふん',
  };
  if (minute === 0) return '';
  const tens = Math.floor(minute / 10);
  const remainder = minute % 10;
  if (remainder === 0) return `${tens === 1 ? '' : DIGITS[tens]}じゅっぷん`;
  return `${tens > 0 ? `${tens === 1 ? '' : DIGITS[tens]}じゅう` : ''}${endings[remainder]}`;
}

function formatTime(hour: number, minute: number, second?: number): string | undefined {
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59 || (second !== undefined && second > 59)) {
    return undefined;
  }
  return `${hourReading(hour)}${minuteReading(minute)}${
    second !== undefined ? `${numberToJapanese(second)}びょう` : ''
  }`;
}

function formatDate(year: number | undefined, month: number, day: number): string | undefined {
  if (!isValidCalendarDate(year, month, day)) return undefined;
  return `${year === undefined ? '' : yearReading(year)}${monthReading(month)}${dayReading(day)}`;
}

function phoneReading(input: string): string {
  return input
    .replace(/^\+81[- ]?/, '81-')
    .split('-')
    .map((part) =>
      part
        .replace(/\D/g, '')
        .split('')
        .map((digit) => DIGITS[Number(digit)])
        .join('・')
    )
    .join('、');
}

function counterReading(value: number, unit: string): string {
  const reading = numberToJapanese(value);
  if (unit === '人') {
    if (value === 1) return 'ひとり';
    if (value === 2) return 'ふたり';
    return `${reading.replace(/よん$/, 'よ')}にん`;
  }
  if (unit === '個') {
    return `${reading
      .replace(/いち$/, 'いっ')
      .replace(/ろく$/, 'ろっ')
      .replace(/はち$/, 'はっ')
      .replace(/じゅう$/, 'じゅっ')
      .replace(/ひゃく$/, 'ひゃっ')}こ`;
  }
  if (unit === '本') {
    if (/さん$/.test(reading)) return `${reading.replace(/さん$/, 'さんぼん')}`;
    if (/(?:いち|ろく|はち|じゅう|ひゃく)$/.test(reading)) {
      return `${reading
        .replace(/いち$/, 'いっ')
        .replace(/ろく$/, 'ろっ')
        .replace(/はち$/, 'はっ')
        .replace(/じゅう$/, 'じゅっ')
        .replace(/ひゃく$/, 'ひゃっ')}ぽん`;
    }
    return `${reading}ほん`;
  }
  if (unit === '回' || unit === '階') {
    if (unit === '階' && /さん$/.test(reading)) return `${reading}がい`;
    return `${reading
      .replace(/いち$/, 'いっ')
      .replace(/ろく$/, 'ろっ')
      .replace(/はち$/, 'はっ')
      .replace(/じゅう$/, 'じゅっ')
      .replace(/ひゃく$/, 'ひゃっ')}かい`;
  }
  if (unit === '冊') {
    return `${reading
      .replace(/いち$/, 'いっ')
      .replace(/はち$/, 'はっ')
      .replace(/じゅう$/, 'じゅっ')
      .replace(/ひゃく$/, 'ひゃっ')}さつ`;
  }
  if (unit === '件') {
    return `${reading
      .replace(/いち$/, 'いっ')
      .replace(/ろく$/, 'ろっ')
      .replace(/はち$/, 'はっ')
      .replace(/じゅう$/, 'じゅっ')
      .replace(/ひゃく$/, 'ひゃっ')}けん`;
  }
  return `${reading}${{ 件: 'けん', 台: 'だい', 枚: 'まい', ページ: 'ページ' }[unit] ?? unit}`;
}

const UNIT_READINGS: Record<string, string> = {
  km: 'キロメートル',
  m: 'メートル',
  cm: 'センチメートル',
  mm: 'ミリメートル',
  kg: 'キログラム',
  g: 'グラム',
  mg: 'ミリグラム',
  L: 'リットル',
  mL: 'ミリリットル',
  ml: 'ミリリットル',
  GB: 'ギガバイト',
  MB: 'メガバイト',
  TB: 'テラバイト',
  Mbps: 'メガビット毎秒',
  GHz: 'ギガヘルツ',
  kWh: 'キロワット時',
  '℃': 'ど',
  '°C': 'ど',
  時間: 'じかん',
  秒: 'びょう',
  件: 'けん',
  台: 'だい',
  枚: 'まい',
  ページ: 'ページ',
  ドル: 'ドル',
  ユーロ: 'ユーロ',
  ポンド: 'ポンド',
};

export function readUnit(number: string, unit: string): string {
  const value = integerValue(number);
  if (value !== undefined) {
    if (['人', '個', '本', '回', '階', '冊', '件', '台', '枚', 'ページ'].includes(unit)) {
      return counterReading(value, unit);
    }
    if (unit === '時') return hourReading(value);
    if (unit === '分' && value <= 59) return minuteReading(value);
    if (unit === '日') return dayReading(value);
    if (unit === '日間') return `${dayReading(value)}かん`;
    if (unit === '年') return yearReading(value);
    if (unit === '円') return `${numberToJapanese(value).replace(/よん$/, 'よ')}えん`;
    if (['か月', 'ヶ月', 'カ月', '箇月'].includes(unit)) {
      return `${numberToJapanese(value)
        .replace(/いち$/, 'いっ')
        .replace(/ろく$/, 'ろっ')
        .replace(/はち$/, 'はっ')
        .replace(/じゅう$/, 'じゅっ')}かげつ`;
    }
    if (unit === '週間') {
      return `${numberToJapanese(value)
        .replace(/いち$/, 'いっ')
        .replace(/はち$/, 'はっ')
        .replace(/じゅう$/, 'じゅっ')}しゅうかん`;
    }
  }
  return `${numberToJapanese(number)}${UNIT_READINGS[unit] ?? unit}`;
}

function currencyReading(amount: string, currency: string): string {
  const normalized = amount.replace(/,/g, '');
  if (currency === '円' || currency === '¥' || currency === '￥') {
    return `${numberToJapanese(normalized).replace(/よん$/, 'よ')}えん`;
  }
  if (currency === '$' || currency === 'ドル' || currency === '米ドル') {
    const [dollars = '0', cents] = normalized.split('.');
    return `${numberToJapanese(dollars)}ドル${
      cents && Number(cents) > 0
        ? `${numberToJapanese(cents.padEnd(2, '0').slice(0, 2))}セント`
        : ''
    }`;
  }
  const spoken = currency === '€' || currency === 'ユーロ' ? 'ユーロ' : 'ポンド';
  return `${numberToJapanese(normalized)}${spoken}`;
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

export type JapaneseAutoTag = (typeof SUPPORTED_AUTO_TAGS)[number];

export interface AutoTagOptions {
  enabledTags?: JapaneseAutoTag[];
}

export interface MatchResult {
  original: string;
  converted: string;
  tagType: JapaneseAutoTag;
  start: number;
  end: number;
}

interface Rule {
  tagType: JapaneseAutoTag;
  pattern: RegExp;
  convert: (match: RegExpExecArray) => string;
}

const RULES: Rule[] = [
  {
    tagType: 'phone',
    pattern: /(?:\+81[- ]?0?\d{1,4}|0\d{1,4})-\d{1,4}-\d{3,4}/g,
    convert: (match) => phoneReading(match[0]),
  },
  {
    tagType: 'postalCode',
    pattern: /〒?\d{3}-\d{4}/g,
    convert: (match) => `郵便番号${phoneReading(match[0].replace('〒', ''))}`,
  },
  {
    tagType: 'serial',
    pattern:
      /((?:(?:注文|予約|確認|製品|シリアル)番号|(?:認証|確認)コード|ワンタイムパスワード)(?:は|が|：|:)?\s*)([A-Z0-9]+(?:[-‐‑‒–—][A-Z0-9]+)*)/gi,
    convert: (match) => `${match[1]}${digitsToJapanese((match[2] ?? '').toUpperCase())}`,
  },
  {
    tagType: 'account',
    pattern:
      /((?:口座番号|会員番号|顧客番号)(?:は|が|：|:)?\s*)([A-Z0-9]+(?:[-‐‑‒–—][A-Z0-9]+)*)/gi,
    convert: (match) => `${match[1]}${digitsToJapanese((match[2] ?? '').toUpperCase())}`,
  },
  {
    tagType: 'flight',
    pattern: /((?:便名|フライト)(?:は|が|：|:)?\s*)([A-Z]{2,3}-?\d{1,4})/gi,
    convert: (match) => `${match[1]}${digitsToJapanese((match[2] ?? '').toUpperCase())}`,
  },
  {
    tagType: 'scripture',
    pattern:
      /(?:創世記|出エジプト記|詩篇|詩編|箴言|マタイ(?:による福音書)?|マルコ(?:による福音書)?|ルカ(?:による福音書)?|ヨハネ(?:による福音書)?|使徒言行録|ローマ(?:人への手紙)?)\s*\d{1,3}:\d{1,3}/g,
    convert: (match) =>
      match[0].replace(
        /(\d{1,3}):(\d{1,3})$/,
        (_, chapter: string, verse: string) =>
          `${numberToJapanese(chapter)}しょう${numberToJapanese(verse)}せつ`
      ),
  },
  {
    tagType: 'datetime',
    pattern: /\d{4}[-/]\d{1,2}[-/]\d{1,2}[T ]\d{1,2}:\d{2}(?::\d{2})?/g,
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
    pattern: /\d{4}年\d{1,2}月\d{1,2}日|\d{1,2}月\d{1,2}日|\d{4}[-/]\d{1,2}[-/]\d{1,2}/g,
    convert: (match): string => {
      const japanese = match[0].match(/^(?:(\d{4})年)?(\d{1,2})月(\d{1,2})日$/);
      const iso = match[0].match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
      const parts = japanese ?? iso;
      if (!parts) return match[0];
      const year = parts[1] ? Number(parts[1]) : undefined;
      return formatDate(year, Number(parts[2]), Number(parts[3])) ?? match[0];
    },
  },
  {
    tagType: 'range',
    pattern: new RegExp(`\\d{1,2}:\\d{2}${RANGE_SEPARATOR}\\d{1,2}:\\d{2}`, 'g'),
    convert: (match): string => {
      const parts = match[0].split(/\s*(?:-|~|〜|～|–|—)\s*/);
      const read = (value: string): string | undefined => {
        const [hour, minute] = value.split(':').map(Number);
        return formatTime(hour ?? -1, minute ?? -1);
      };
      const from = read(parts[0] ?? '');
      const to = read(parts[1] ?? '');
      return from && to ? `${from}から${to}` : match[0];
    },
  },
  {
    tagType: 'range',
    pattern: new RegExp(`(${NUMBER})${RANGE_SEPARATOR}(${NUMBER})(${UNIT})`, 'g'),
    convert: (match): string => {
      const from = match[1] ?? '';
      const to = match[2] ?? '';
      const unit = match[3] ?? '';
      if (unit === '時' && [from, to].some((value) => Number(value) > 23)) return match[0];
      return `${readUnit(from, unit)}から${readUnit(to, unit)}`;
    },
  },
  {
    tagType: 'time',
    pattern: /\d{1,2}:\d{2}(?::\d{2})?|\d{1,2}時(?:\d{1,2}分)?/g,
    convert: (match): string => {
      const colon = match[0].match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
      const japanese = match[0].match(/^(\d{1,2})時(?:(\d{1,2})分)?$/);
      const parts = colon ?? japanese;
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
      `(?:[¥￥$€£]\\s*${NUMBER}|${NUMBER}\\s*(?:円|米ドル|ドル|ユーロ|ポンド))`,
      'g'
    ),
    convert: (match): string => {
      const prefix = match[0].match(/^([¥￥$€£])\s*(.+)$/);
      const suffix = match[0].match(/^(.+?)\s*(円|米ドル|ドル|ユーロ|ポンド)$/);
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
      /(?:スコア|得点)(?:は|が|：|:)?\s*\d+\s*[-:]\s*\d+|\d+\s*[-:]\s*\d+(?=\s*(?:で|の)?(?:勝利|勝ち|敗戦|負け|引き分け|終了))/g,
    convert: (match) =>
      match[0].replace(
        /(\d+)\s*[-:]\s*(\d+)/,
        (_, left: string, right: string) =>
          `${numberToJapanese(left)}たい${numberToJapanese(right)}`
      ),
  },
  {
    tagType: 'ratio',
    pattern: /(?:比率|割合)(?:は|が|：|:)?\s*\d+(?:\.\d+)?\s*:\s*\d+(?:\.\d+)?/g,
    convert: (match) =>
      match[0].replace(
        /(\d+(?:\.\d+)?)\s*:\s*(\d+(?:\.\d+)?)/,
        (_, left: string, right: string) =>
          `${numberToJapanese(left)}たい${numberToJapanese(right)}`
      ),
  },
  {
    tagType: 'percentage',
    pattern: new RegExp(`${NUMBER}\\s*(?:%|％)`, 'g'),
    convert: (match) => `${numberToJapanese(match[0].replace(/\s*(?:%|％)$/, ''))}パーセント`,
  },
  {
    tagType: 'fraction',
    pattern: /\d+\s*\/\s*\d+/g,
    convert: (match): string => {
      const [numerator = '', denominator = ''] = match[0].split(/\s*\/\s*/);
      return `${numberToJapanese(denominator)}ぶんの${numberToJapanese(numerator)}`;
    },
  },
  {
    tagType: 'order',
    pattern: /第\d+(?:章|話|回|位|番|号)|No\.\s*\d+/gi,
    convert: (match): string => {
      const no = match[0].match(/^No\.\s*(\d+)$/i);
      if (no) return `ナンバー${numberToJapanese(no[1] ?? '')}`;
      const parts = match[0].match(/^第(\d+)(章|話|回|位|番|号)$/);
      const suffixes: Record<string, string> = {
        章: 'しょう',
        話: 'わ',
        回: 'かい',
        位: 'い',
        番: 'ばん',
        号: 'ごう',
      };
      return parts
        ? `だい${numberToJapanese(parts[1] ?? '')}${suffixes[parts[2] ?? '']}`
        : match[0];
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
    convert: (match) => match[0].replace('@', ' アットマーク ').replace(/\./g, ' ドット '),
  },
  {
    tagType: 'direction',
    pattern: /([一-龠々ぁ-んァ-ヶー]+)→([一-龠々ぁ-んァ-ヶー]+)/g,
    convert: (match) => `${match[1]}から${match[2]}`,
  },
  {
    tagType: 'number',
    pattern: new RegExp(NUMBER, 'g'),
    convert: (match) => numberToJapanese(match[0]),
  },
];

function findMatches(text: string, enabledTags?: JapaneseAutoTag[]): MatchResult[] {
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
  assertInputWithinLimit(text, 'japanese.autoTag');
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
  assertInputWithinLimit(text, 'japanese.extractAutoTags');
  return findMatches(text, options?.enabledTags).map(
    ({ converted: _converted, ...match }) => match
  );
}

const SPECIAL_MANUAL_TAGS = ['name', 'digits'] as const;
export const SUPPORTED_TAGS = [...SUPPORTED_AUTO_TAGS, ...SPECIAL_MANUAL_TAGS];
const MANUAL_TAG_PATTERN = new RegExp(`(${SUPPORTED_TAGS.join('|')})\\(([^)]*)\\)`, 'g');

function convertManualTag(tag: string, value: string): string {
  if (tag === 'name') return value;
  if (tag === 'digits') return digitsToJapanese(value.replace(/[^\d-]/g, ''));
  if (tag === 'score') {
    return value.replace(
      /(\d+)\s*[-:]\s*(\d+)/,
      (_, left: string, right: string) => `${numberToJapanese(left)}たい${numberToJapanese(right)}`
    );
  }
  return autoTag(value, { enabledTags: [tag as JapaneseAutoTag] });
}

export function manualTag(text: string): string {
  if (!text) return text;
  assertInputWithinLimit(text, 'japanese.manualTag');
  return text.replace(MANUAL_TAG_PATTERN, (_match, tag: string, value: string) =>
    convertManualTag(tag, value)
  );
}

export function extractTags(
  text: string
): Array<{ tag: string; value: string; start: number; end: number }> {
  if (!text) return [];
  assertInputWithinLimit(text, 'japanese.extractTags');
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
  assertInputWithinLimit(text, 'japanese.manualTagSelective');
  const allowed = new Set(allowedTags.filter((tag) => SUPPORTED_TAGS.includes(tag as never)));
  return text.replace(MANUAL_TAG_PATTERN, (match, tag: string, value: string) =>
    allowed.has(tag) ? convertManualTag(tag, value) : match
  );
}

export function autoTagWithManual(text: string, options?: AutoTagOptions): string {
  return autoTag(manualTag(text), options);
}
