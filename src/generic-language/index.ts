import { ToWords as ArabicToWords } from 'to-words/ar-SA';
import { ToWords as BengaliToWords } from 'to-words/bn-BD';
import { ToWords as BulgarianToWords } from 'to-words/bg-BG';
import { ToWords as CzechToWords } from 'to-words/cs-CZ';
import { ToWords as DanishToWords } from 'to-words/da-DK';
import { ToWords as GermanToWords } from 'to-words/de-DE';
import { ToWords as GreekToWords } from 'to-words/el-GR';
import { ToWords as FinnishToWords } from 'to-words/fi-FI';
import { ToWords as FrenchToWords } from 'to-words/fr-FR';
import { ToWords as HindiToWords } from 'to-words/hi-IN';
import { ToWords as CroatianToWords } from 'to-words/hr-HR';
import { ToWords as HungarianToWords } from 'to-words/hu-HU';
import { ToWords as IndonesianToWords } from 'to-words/id-ID';
import { ToWords as ItalianToWords } from 'to-words/it-IT';
import { ToWords as MalayToWords } from 'to-words/ms-MY';
import { ToWords as TraditionalChineseToWords } from 'to-words/zh-TW';
import { ToWords as DutchToWords } from 'to-words/nl-NL';
import { ToWords as NorwegianToWords } from 'to-words/nb-NO';
import { ToWords as PunjabiToWords } from 'to-words/pa-IN';
import { ToWords as PolishToWords } from 'to-words/pl-PL';
import { ToWords as PortugueseToWords } from 'to-words/pt-PT';
import { ToWords as RomanianToWords } from 'to-words/ro-RO';
import { ToWords as RussianToWords } from 'to-words/ru-RU';
import { ToWords as SlovakToWords } from 'to-words/sk-SK';
import { ToWords as SpanishToWords } from 'to-words/es-ES';
import { ToWords as SwedishToWords } from 'to-words/sv-SE';
import { ToWords as TamilToWords } from 'to-words/ta-IN';
import { ToWords as TagalogToWords } from 'to-words/fil-PH';
import { ToWords as ThaiToWords } from 'to-words/th-TH';
import { ToWords as TurkishToWords } from 'to-words/tr-TR';
import { ToWords as UkrainianToWords } from 'to-words/uk-UA';
import { ToWords as VietnameseToWords } from 'to-words/vi-VN';
import { ToWords as CantoneseToWords } from 'to-words/yue-HK';
import { assertInputWithinLimit } from '../input-guard';

export const TTS_LANGUAGE_LOCALES = {
  ara: 'ar-SA',
  ben: 'bn-BD',
  bul: 'bg-BG',
  ces: 'cs-CZ',
  dan: 'da-DK',
  deu: 'de-DE',
  ell: 'el-GR',
  eng: 'en-US',
  fin: 'fi-FI',
  fra: 'fr-FR',
  hin: 'hi-IN',
  hrv: 'hr-HR',
  hun: 'hu-HU',
  ind: 'id-ID',
  ita: 'it-IT',
  jpn: 'ja-JP',
  kor: 'ko-KR',
  msa: 'ms-MY',
  nan: 'zh-TW',
  nld: 'nl-NL',
  nor: 'nb-NO',
  pan: 'pa-IN',
  pol: 'pl-PL',
  por: 'pt-PT',
  ron: 'ro-RO',
  rus: 'ru-RU',
  slk: 'sk-SK',
  spa: 'es-ES',
  swe: 'sv-SE',
  tam: 'ta-IN',
  tgl: 'fil-PH',
  tha: 'th-TH',
  tur: 'tr-TR',
  ukr: 'uk-UA',
  vie: 'vi-VN',
  yue: 'yue-HK',
  zho: 'zh-CN',
} as const;

export type TtsLanguage = keyof typeof TTS_LANGUAGE_LOCALES;
export type GenericTtsLanguage = Exclude<TtsLanguage, 'eng' | 'jpn' | 'kor' | 'zho'>;

export const SUPPORTED_TTS_LANGUAGES = Object.freeze(
  Object.keys(TTS_LANGUAGE_LOCALES) as TtsLanguage[]
);

const NUMBER_CONVERTERS = {
  ara: new ArabicToWords(),
  ben: new BengaliToWords(),
  bul: new BulgarianToWords(),
  ces: new CzechToWords(),
  dan: new DanishToWords(),
  deu: new GermanToWords(),
  ell: new GreekToWords(),
  fin: new FinnishToWords(),
  fra: new FrenchToWords(),
  hin: new HindiToWords(),
  hrv: new CroatianToWords(),
  hun: new HungarianToWords(),
  ind: new IndonesianToWords(),
  ita: new ItalianToWords(),
  msa: new MalayToWords(),
  nan: new TraditionalChineseToWords(),
  nld: new DutchToWords(),
  nor: new NorwegianToWords(),
  pan: new PunjabiToWords(),
  pol: new PolishToWords(),
  por: new PortugueseToWords(),
  ron: new RomanianToWords(),
  rus: new RussianToWords(),
  slk: new SlovakToWords(),
  spa: new SpanishToWords(),
  swe: new SwedishToWords(),
  tam: new TamilToWords(),
  tgl: new TagalogToWords(),
  tha: new ThaiToWords(),
  tur: new TurkishToWords(),
  ukr: new UkrainianToWords(),
  vie: new VietnameseToWords(),
  yue: new CantoneseToWords(),
} satisfies Record<GenericTtsLanguage, { convert: (value: string) => string }>;

export const GENERIC_TTS_LANGUAGES = Object.freeze(
  Object.keys(NUMBER_CONVERTERS) as GenericTtsLanguage[]
);

export const SUPPORTED_AUTO_TAGS = [
  'phone',
  'datetime',
  'date',
  'time',
  'money',
  'percentage',
  'range',
  'unit',
  'serial',
  'number',
] as const;
export const SUPPORTED_TAGS = [...SUPPORTED_AUTO_TAGS, 'name', 'digits', 'account'] as const;

type GenericAutoTag = (typeof SUPPORTED_AUTO_TAGS)[number];

interface MatchResult {
  original: string;
  converted: string;
  tagType: GenericAutoTag;
  start: number;
  end: number;
}

interface Rule {
  tagType: GenericAutoTag;
  pattern: RegExp;
  convert: (value: string, language: GenericTtsLanguage) => string;
}

const DIGIT = '\\p{Nd}';
const NUMBER = `[+\\-−]?${DIGIT}+(?:[,.٬٫'’\u00a0\u202f]${DIGIT}+)*`;

const DECIMAL_SEPARATORS = Object.fromEntries(
  GENERIC_TTS_LANGUAGES.map((language) => [
    language,
    new Intl.NumberFormat(TTS_LANGUAGE_LOCALES[language]).format(1.1).includes(',') ? ',' : '.',
  ])
) as Record<GenericTtsLanguage, ',' | '.'>;

const DIGIT_ZERO_CODE_POINTS = [0x30, 0x660, 0x6f0, 0x966, 0x9e6, 0xa66, 0xbe6, 0xe50, 0xff10];

function normalizeDigits(value: string): string {
  return [...value]
    .map((character) => {
      const codePoint = character.codePointAt(0);
      const zero = DIGIT_ZERO_CODE_POINTS.find(
        (candidate) =>
          codePoint !== undefined && codePoint >= candidate && codePoint <= candidate + 9
      );
      return zero === undefined || codePoint === undefined ? character : String(codePoint - zero);
    })
    .join('');
}

function normalizeNumber(value: string, language: GenericTtsLanguage): string {
  let normalized = normalizeDigits(value)
    .replace(/^−/, '-')
    .replace(/[’'\s\u00a0\u202f]/g, '')
    .trim();
  normalized = normalized.replace(/٬/g, '').replace(/٫/g, '.');

  const comma = normalized.lastIndexOf(',');
  const dot = normalized.lastIndexOf('.');
  if (comma >= 0 && dot >= 0) {
    const decimalSeparator = comma > dot ? ',' : '.';
    const groupingSeparator = decimalSeparator === ',' ? /\./g : /,/g;
    return normalized.replace(groupingSeparator, '').replace(decimalSeparator, '.');
  }

  const separator = comma >= 0 ? ',' : dot >= 0 ? '.' : undefined;
  if (!separator) return normalized;

  const parts = normalized.split(separator);
  const preferredDecimalSeparator = DECIMAL_SEPARATORS[language];
  if (separator !== preferredDecimalSeparator) {
    const looksGrouped = parts.length > 2 || parts[parts.length - 1]?.length === 3;
    return looksGrouped ? parts.join('') : `${parts[0]}.${parts[1]}`;
  }

  if (parts.length > 2 && parts.slice(1).every((part) => part.length === 3)) {
    return parts.join('');
  }
  return `${parts.slice(0, -1).join('')}.${parts[parts.length - 1]}`;
}

function normalizeWords(words: string, language: GenericTtsLanguage): string {
  const compact = words.replace(/\s+/g, ' ').trim();
  return language === 'nan' || language === 'yue'
    ? compact.replace(/\s+/g, '')
    : compact.toLocaleLowerCase(TTS_LANGUAGE_LOCALES[language]);
}

const DECIMAL_WORDS = Object.fromEntries(
  GENERIC_TTS_LANGUAGES.map((language) => {
    const one = normalizeWords(NUMBER_CONVERTERS[language].convert('1'), language);
    const sample = normalizeWords(NUMBER_CONVERTERS[language].convert('1.1'), language);
    const separator =
      sample.startsWith(one) && sample.endsWith(one)
        ? sample.slice(one.length, sample.length - one.length).trim()
        : '';
    return [language, separator];
  })
) as Record<GenericTtsLanguage, string>;

export function numberToWords(value: string, language: GenericTtsLanguage): string {
  const normalized = normalizeNumber(value, language);
  if (!/^[+-]?\d+(?:\.\d+)?$/.test(normalized)) return value;

  if (/^[+-]?0\d+/.test(normalized)) return digitsToWords(normalized, language);

  try {
    const [integer, fraction] = normalized.split('.');
    if (fraction !== undefined && DECIMAL_WORDS[language]) {
      const integerWords = numberToWords(integer ?? '0', language);
      const fractionWords = /^0/.test(fraction)
        ? digitsToWords(fraction, language)
        : numberToWords(fraction, language);
      return normalizeWords(
        `${integerWords} ${DECIMAL_WORDS[language]} ${fractionWords}`,
        language
      );
    }
    return normalizeWords(NUMBER_CONVERTERS[language].convert(normalized), language);
  } catch {
    return value;
  }
}

function digitsToWords(value: string, language: GenericTtsLanguage): string {
  return [...value]
    .map((character) =>
      /\p{Nd}/u.test(character) ? numberToWords(character, language) : character
    )
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function phoneToWords(value: string, language: GenericTtsLanguage): string {
  const prefix = value.trim().startsWith('+') ? '+ ' : '';
  const groups = value.match(/\p{Nd}+/gu) ?? [];
  return prefix + groups.map((group) => digitsToWords(group, language)).join(', ');
}

function identifierToWords(value: string, language: GenericTtsLanguage): string {
  return [...value]
    .map((character) => {
      if (/\p{Nd}/u.test(character)) return numberToWords(character, language);
      if (/[-‐‑‒–—−]/.test(character)) return ',';
      return character;
    })
    .join(' ')
    .replace(/\s+,\s+/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();
}

const DATE_PATTERN = `${DIGIT}{1,4}\\s*[-‐‑‒–—−/.]\\s*${DIGIT}{1,2}\\s*[-‐‑‒–—−/.]\\s*${DIGIT}{1,4}`;
const TIME_PATTERN = `(?:${DIGIT}{1,2}:${DIGIT}{2}(?::${DIGIT}{2})?|${DIGIT}{1,2}\\s*[hH]\\s*${DIGIT}{2})`;
const DATETIME_PATTERN = `${DATE_PATTERN}(?:T|\\s+)${TIME_PATTERN}`;
const RANGE_PATTERN = `${NUMBER}\\s*[-‐‑‒–—−~〜/:]\\s*${NUMBER}`;
const CURRENCY_SYMBOL = '[$€£¥₹₽₩₺]';
const MONEY_PATTERN = `(?:[-−]?${CURRENCY_SYMBOL}\\s*${NUMBER}|${NUMBER}\\s*${CURRENCY_SYMBOL})`;
const UNIT =
  '(?:ms|sec|min|hrs?|kg|mg|km|cm|mm|ml|gb|tb|mb|kb|kw|mw|gw|kwh|mbps|gbps|khz|mhz|ghz|°[cf]|[smhdglw]|cc|㎡|㎢)';
const UNIT_PATTERN = `(?:${NUMBER}\\s*${UNIT})(?:\\s*${NUMBER}\\s*${UNIT})*`;
const GROUPED_NUMBER_PATTERN = `[+\\-−]?${DIGIT}{1,3}(?:\\s+${DIGIT}{3})+(?:[,.٬٫]${DIGIT}+)?`;
const SERIAL_PATTERN =
  `(?<![\\p{L}\\p{N}_@])(?:` +
  `\\p{L}{1,10}\\p{Nd}[\\p{L}\\p{N}‐‑‒–—-]*|` +
  `\\p{L}{1,10}[-‐‑‒–—](?=[\\p{L}\\p{N}‐‑‒–—-]*\\p{Nd})[\\p{L}\\p{N}]+(?:[-‐‑‒–—][\\p{L}\\p{N}]+)*|` +
  `\\p{Nd}{2,4}[-‐‑‒–—]\\p{L}{1,10}(?:[-‐‑‒–—][\\p{L}\\p{N}]+)*` +
  `)(?![\\p{L}\\p{N}_@])`;

const DATE_PART_ORDER = Object.fromEntries(
  GENERIC_TTS_LANGUAGES.map((language) => {
    const parts = new Intl.DateTimeFormat(TTS_LANGUAGE_LOCALES[language], {
      calendar: 'gregory',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      timeZone: 'UTC',
    })
      .formatToParts(new Date(Date.UTC(2006, 10, 22)))
      .filter((part) => part.type === 'day' || part.type === 'month' || part.type === 'year')
      .map((part) => part.type);
    return [language, parts];
  })
) as Record<GenericTtsLanguage, Array<'day' | 'month' | 'year'>>;

function partToWords(value: string, language: GenericTtsLanguage): string {
  const normalized = normalizeDigits(value).replace(/^0+(?=\d)/, '');
  return numberToWords(normalized, language);
}

function dateToWords(value: string, language: GenericTtsLanguage): string {
  const rawParts = value.split(/\s*[-‐‑‒–—−/.]\s*/u).map(normalizeDigits);
  if (rawParts.length !== 3) return value;

  let year: number;
  let month: number;
  let day: number;
  const [first = '', second = '', third = ''] = rawParts;
  if (first.length === 4) {
    [year, month, day] = [Number(first), Number(second), Number(third)];
  } else if (third.length === 4) {
    year = Number(third);
    const monthFirst =
      Number(first) <= 12 && (Number(second) > 12 || DATE_PART_ORDER[language][0] === 'month');
    [month, day] = monthFirst ? [Number(first), Number(second)] : [Number(second), Number(first)];
  } else {
    return value;
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(TTS_LANGUAGE_LOCALES[language], {
    calendar: 'gregory',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
    .formatToParts(date)
    .map((part) =>
      (part.type === 'year' || part.type === 'month' || part.type === 'day') &&
      /\p{Nd}/u.test(part.value)
        ? partToWords(part.value, language)
        : part.value
    )
    .join('');
}

function timeToWords(value: string, language: GenericTtsLanguage): string {
  const normalizedTime = value.replace(/\s*[hH]\s*/u, ':');
  const [rawHour = '', rawMinute = '', rawSecond] = normalizedTime.split(':').map(normalizeDigits);
  const hour = Number(rawHour);
  const minute = Number(rawMinute);
  const second = rawSecond === undefined ? undefined : Number(rawSecond);
  if (
    !Number.isInteger(hour) ||
    !Number.isInteger(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59 ||
    (second !== undefined && (!Number.isInteger(second) || second < 0 || second > 59))
  ) {
    return value;
  }

  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
  };
  if (second !== undefined) options.second = '2-digit';

  return new Intl.DateTimeFormat(TTS_LANGUAGE_LOCALES[language], options)
    .formatToParts(new Date(Date.UTC(2024, 0, 1, hour, minute, second ?? 0)))
    .map((part) =>
      (part.type === 'hour' || part.type === 'minute' || part.type === 'second') &&
      /\p{Nd}/u.test(part.value)
        ? partToWords(part.value, language)
        : part.value
    )
    .join('');
}

function datetimeToWords(value: string, language: GenericTtsLanguage): string {
  const match = new RegExp(`^(${DATE_PATTERN})(?:T|\\s+)(${TIME_PATTERN})$`, 'u').exec(value);
  if (!match) return value;

  const date = match[1] ?? '';
  const time = match[2] ?? '';
  const convertedDate = dateToWords(date, language);
  const convertedTime = timeToWords(time, language);
  return convertedDate === date || convertedTime === time
    ? value
    : `${convertedDate}, ${convertedTime}`;
}

const CURRENCY_CODES = {
  $: 'USD',
  '€': 'EUR',
  '£': 'GBP',
  '¥': 'JPY',
  '₹': 'INR',
  '₽': 'RUB',
  '₩': 'KRW',
  '₺': 'TRY',
} as const;

function moneyToWords(value: string, language: GenericTtsLanguage): string {
  const symbol = value.match(new RegExp(CURRENCY_SYMBOL, 'u'))?.[0] as
    keyof typeof CURRENCY_CODES | undefined;
  const numeric = value.match(new RegExp(NUMBER, 'u'))?.[0];
  if (!symbol || !numeric) return value;
  const normalized = normalizeNumber(numeric, language);
  const amount = Number(normalized) * (/^\s*[-−]/u.test(value) ? -1 : 1);
  if (!Number.isFinite(amount)) return value;
  const fraction = normalized.split('.')[1];
  const fractionDigits = fraction && /[1-9]/.test(fraction) ? fraction.length : 0;

  return new Intl.NumberFormat(TTS_LANGUAGE_LOCALES[language], {
    style: 'currency',
    currency: CURRENCY_CODES[symbol],
    currencyDisplay: 'name',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })
    .format(amount)
    .replace(new RegExp(NUMBER, 'gu'), (number) => numberToWords(number, language));
}

function numbersToWords(value: string, language: GenericTtsLanguage): string {
  return value.replace(new RegExp(NUMBER, 'gu'), (number) => numberToWords(number, language));
}

const RULES: Rule[] = [
  {
    tagType: 'datetime',
    pattern: new RegExp(DATETIME_PATTERN, 'gu'),
    convert: datetimeToWords,
  },
  {
    tagType: 'date',
    pattern: new RegExp(DATE_PATTERN, 'gu'),
    convert: dateToWords,
  },
  {
    tagType: 'time',
    pattern: new RegExp(TIME_PATTERN, 'gu'),
    convert: timeToWords,
  },
  {
    tagType: 'phone',
    pattern: new RegExp(
      `(?:(?:\\+${DIGIT}{1,3}[-.\\s]?)?(?:\\(${DIGIT}{1,4}\\)|${DIGIT}{2,4})[-.\\s]${DIGIT}{2,4}[-.\\s]${DIGIT}{3,4}|\\+${DIGIT}{1,3}[-.\\s]?${DIGIT}{1,4}[-.\\s]${DIGIT}{3,10})`,
      'gu'
    ),
    convert: phoneToWords,
  },
  {
    tagType: 'money',
    pattern: new RegExp(MONEY_PATTERN, 'gu'),
    convert: moneyToWords,
  },
  {
    tagType: 'percentage',
    pattern: new RegExp(`(?:${NUMBER}\\s*[%％٪]|[%％٪]\\s*${NUMBER})`, 'gu'),
    convert: (value, language): string => {
      const numeric = value.match(new RegExp(NUMBER, 'u'))?.[0];
      if (!numeric) return value;
      const converted = numberToWords(numeric, language);
      return /^\s*[%％٪]/u.test(value) ? `%${converted}` : `${converted}%`;
    },
  },
  {
    tagType: 'unit',
    pattern: new RegExp(UNIT_PATTERN, 'giu'),
    convert: numbersToWords,
  },
  {
    tagType: 'serial',
    pattern: new RegExp(SERIAL_PATTERN, 'gu'),
    convert: identifierToWords,
  },
  {
    tagType: 'range',
    pattern: new RegExp(RANGE_PATTERN, 'gu'),
    convert: numbersToWords,
  },
  {
    tagType: 'number',
    pattern: new RegExp(GROUPED_NUMBER_PATTERN, 'gu'),
    convert: numberToWords,
  },
  {
    tagType: 'number',
    pattern: new RegExp(NUMBER, 'gu'),
    convert: numberToWords,
  },
];

function isStandalone(text: string, start: number, end: number, original: string): boolean {
  const before = text.slice(0, start);
  const after = text.slice(end);
  if (/[\p{L}\p{N}_]$/u.test(before) || /^[\p{L}\p{N}_]/u.test(after)) return false;
  if (/^[-−]/u.test(original) && /\p{Nd}$/u.test(before)) return false;
  if (
    /\p{Nd}[-‐‑‒–—−~〜/:.]$/u.test(before.slice(-2)) ||
    /^[-‐‑‒–—−~〜/:.]\p{Nd}/u.test(after.slice(0, 2))
  )
    return false;
  return true;
}

function findMatches(
  text: string,
  language: GenericTtsLanguage,
  enabledTags?: string[]
): MatchResult[] {
  const enabled = enabledTags ? new Set(enabledTags) : undefined;
  if (enabled?.size === 0) return [];

  const candidates: Array<MatchResult & { priority: number }> = [];
  const protectedDatetimes: Array<{ start: number; end: number }> = [];
  RULES.forEach((rule, priority) => {
    if (enabled && !enabled.has(rule.tagType)) return;
    rule.pattern.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = rule.pattern.exec(text)) !== null) {
      const start = match.index;
      const end = start + match[0].length;
      if (!isStandalone(text, start, end, match[0])) continue;
      const converted = rule.convert(match[0], language);
      if (converted === match[0]) {
        if (rule.tagType === 'datetime') protectedDatetimes.push({ start, end });
        continue;
      }
      if (protectedDatetimes.some((range) => start >= range.start && end <= range.end)) continue;
      candidates.push({
        original: match[0],
        converted,
        tagType: rule.tagType,
        start,
        end,
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

function autoTag(
  text: string,
  language: GenericTtsLanguage,
  options?: { enabledTags?: string[] }
): string {
  if (!text) return text;
  assertInputWithinLimit(text, `genericLanguage(${language}).autoTag`);
  const matches = findMatches(text, language, options?.enabledTags);
  if (matches.length === 0) return text;

  let cursor = 0;
  let result = '';
  for (const match of matches) {
    result += text.slice(cursor, match.start) + match.converted;
    cursor = match.end;
  }
  return result + text.slice(cursor);
}

function extractAutoTags(
  text: string,
  language: GenericTtsLanguage,
  options?: { enabledTags?: string[] }
): Array<Omit<MatchResult, 'converted'>> {
  if (!text) return [];
  assertInputWithinLimit(text, `genericLanguage(${language}).extractAutoTags`);
  return findMatches(text, language, options?.enabledTags).map(
    ({ converted: _converted, ...match }) => match
  );
}

const MANUAL_TAG_PATTERN = new RegExp(`(${SUPPORTED_TAGS.join('|')})\\(([^)]*)\\)`, 'g');

type GenericLanguageModule = {
  autoTag: (text: string, options?: { enabledTags?: string[] }) => string;
  extractAutoTags: (
    text: string,
    options?: { enabledTags?: string[] }
  ) => Array<Omit<MatchResult, 'converted'>>;
  manualTag: (text: string) => string;
  extractTags: (text: string) => Array<{ tag: string; value: string; start: number; end: number }>;
  manualTagSelective: (text: string, allowedTags: string[]) => string;
  supportedAutoTags: readonly string[];
  supportedManualTags: readonly string[];
};

function convertManualTag(tag: string, value: string, language: GenericTtsLanguage): string {
  if (tag === 'name') return value;
  if (tag === 'digits') return digitsToWords(value, language);
  if (tag === 'phone') return phoneToWords(value, language);
  if (tag === 'serial' || tag === 'account') return identifierToWords(value, language);
  return autoTag(value, language, { enabledTags: [tag] });
}

function manualTag(text: string, language: GenericTtsLanguage): string {
  if (!text) return text;
  assertInputWithinLimit(text, `genericLanguage(${language}).manualTag`);
  return text.replace(MANUAL_TAG_PATTERN, (_match, tag: string, value: string) =>
    convertManualTag(tag, value, language)
  );
}

function extractTags(
  text: string,
  language: GenericTtsLanguage
): Array<{ tag: string; value: string; start: number; end: number }> {
  if (!text) return [];
  assertInputWithinLimit(text, `genericLanguage(${language}).extractTags`);
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

function manualTagSelective(
  text: string,
  allowedTags: string[],
  language: GenericTtsLanguage
): string {
  if (!text || allowedTags.length === 0) return text;
  assertInputWithinLimit(text, `genericLanguage(${language}).manualTagSelective`);
  const allowed = new Set(allowedTags.filter((tag) => SUPPORTED_TAGS.includes(tag as never)));
  return text.replace(MANUAL_TAG_PATTERN, (match, tag: string, value: string) =>
    allowed.has(tag) ? convertManualTag(tag, value, language) : match
  );
}

export function createGenericLanguageModule(language: GenericTtsLanguage): GenericLanguageModule {
  return {
    autoTag: (text: string, options?: { enabledTags?: string[] }): string =>
      autoTag(text, language, options),
    extractAutoTags: (
      text: string,
      options?: { enabledTags?: string[] }
    ): Array<Omit<MatchResult, 'converted'>> => extractAutoTags(text, language, options),
    manualTag: (text: string): string => manualTag(text, language),
    extractTags: (
      text: string
    ): Array<{ tag: string; value: string; start: number; end: number }> =>
      extractTags(text, language),
    manualTagSelective: (text: string, allowedTags: string[]): string =>
      manualTagSelective(text, allowedTags, language),
    supportedAutoTags: SUPPORTED_AUTO_TAGS,
    supportedManualTags: SUPPORTED_TAGS,
  };
}
