import { numberToEnglish, numberToOrdinal } from './utils/number-to-english';
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
import { numberTag } from './tags/number';
import { duration } from './tags/duration';
import { floor } from './tags/floor';
import { account } from './tags/account';
import { weight } from './tags/weight';
import { mile } from './tags/mile';
import { area } from './tags/area';
import { serial, serialNumbersOnly } from './tags/serial';
import { roomNumber } from './tags/room-number';
import {
  distance,
  distanceWithContext,
  DISTANCE_CONTEXT_AFTER,
  DISTANCE_CONTEXT_BEFORE,
} from './tags/distance';
import { flight } from './tags/flight';
import { seat } from './tags/seat';
import { lecture } from './tags/lecture';
import { fraction, fractionWithContext } from './tags/fraction';
import { temperature, temperatureRange } from './tags/temperature';
import { volume } from './tags/volume';
import { dataCapacity } from './tags/data-capacity';
import { inch } from './tags/inch';

/**
 * Special unit characters to pronunciation mapping
 * Post-processing for standalone special characters not handled by pattern matching
 */
const SPECIAL_UNIT_MAP: Array<[RegExp, string]> = [
  // Volume units
  [/m³/g, 'cubic meters'],
  [/m3(?![0-9])/g, 'cubic meters'],
  [/cm³/g, 'cubic centimeters'],
  [/cm3(?![0-9])/g, 'cubic centimeters'],
  [/㎥/g, 'cubic meters'],
  // Area units
  [/m²/g, 'square meters'],
  [/m2(?![0-9])/g, 'square meters'],
  [/㎡/g, 'square meters'],
  // Temperature units
  [/℃/g, 'degrees Celsius'],
  [/℉/g, 'degrees Fahrenheit'],
  // Weight/length special character units
  [/㎏/g, 'kilograms'],
  [/㎞/g, 'kilometers'],
  [/㎝/g, 'centimeters'],
  [/㎜/g, 'millimeters'],
  [/ℓ/g, 'liters'],
  [/㎖/g, 'milliliters'],
  [/㏄/g, 'cc'],
];

/**
 * Technology abbreviation to pronunciation mapping
 * Using word boundaries for accurate abbreviation matching
 */
const ABBREVIATION_MAP: Array<[RegExp, string]> = [
  // Network generations
  [/\b2G\b/g, 'two G'],
  [/\b3G\b/g, 'three G'],
  [/\b4G\b/g, 'four G'],
  [/\b5G\b/g, 'five G'],
  [/\bLTE\b/gi, 'L T E'],
  // Tech abbreviations
  [/\bVR\b/g, 'V R'],
  [/\bAR\b/g, 'A R'],
  [/\bTTS\b/g, 'T T S'],
  [/\bSTT\b/g, 'S T T'],
  // Individual pronunciation abbreviations
  [/\bOTP\b/gi, 'O T P'],
  [/\bCCTV\b/gi, 'C C T V'],
];

/**
 * Time context keywords (words that follow)
 * When these keywords follow, interpret 'm' as 'minutes'
 */
const TIME_CONTEXT_AFTER = [
  // Time passage/duration
  'later',
  'from now',
  'ago',
  'remaining',
  'left',
  'wait',
  'delay',
  'pause',
  'break',
  'until',
  // Range
  'to',
];

/**
 * Time context keywords (words that precede)
 * When these keywords precede, interpret 'm' as 'minutes'
 */
const TIME_CONTEXT_BEFORE = [
  // Time related
  'about',
  'approximately',
  'around',
  'minimum',
  'maximum',
  'average',
  'estimated',
  'wait',
  'delay',
  'in',
  'within',
  'after',
  'for',
];

/**
 * Auto-tagging options
 */
export interface AutoTagOptions {
  /**
   * Tag types to enable (default: all tags)
   * If not specified, all tags are enabled.
   */
  enabledTags?: Array<keyof typeof AUTO_TAG_PATTERNS>;
}

/**
 * Match result information
 */
export interface MatchResult {
  /** Original matched text */
  original: string;
  /** Converted text */
  converted: string;
  /** Tag type */
  tagType: string;
  /** Start index */
  start: number;
  /** End index */
  end: number;
}

/**
 * Auto tag pattern definitions
 *
 * Each pattern is carefully designed to minimize false positives.
 * - Priority: More specific patterns are matched first
 * - Pattern description: Specifies what format each pattern detects
 */
const AUTO_TAG_PATTERNS = {
  /**
   * Phone number patterns (US format)
   * - Standard: (xxx) xxx-xxxx, xxx-xxx-xxxx
   * - With country code: +1-xxx-xxx-xxxx
   * - Emergency: 911
   */
  phone: {
    patterns: [
      // US format with country code: +1-xxx-xxx-xxxx
      /\+1[-.\s]?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
      // US format with parentheses: (xxx) xxx-xxxx
      /\(\d{3}\)\s*\d{3}[-.\s]?\d{4}\b/g,
      // US format: xxx-xxx-xxxx, xxx.xxx.xxxx, xxx xxx xxxx
      /\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b/g,
      // Toll-free: 1-800-xxx-xxxx, 1-888-xxx-xxxx
      /\b1[-.\s]?8(?:00|88|77|66|55|44)[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
      // Emergency: 911
      /\b911\b/g,
    ],
    converter: (match: string) => phone(match),
  },

  /**
   * Tracking/Serial number patterns (before phone to avoid conflicts)
   * Tracking number: NNNN-NNNN-NNNN format
   * Must contain at least one digit to be considered a tracking number
   */
  trackingNumber: {
    patterns: [
      // Tracking number label + alphanumeric code (must contain digits)
      // Requires colon, "number", or "#" to be more specific
      /(?:tracking\s*(?:number|#|no\.?)|order\s*(?:number|#|no\.?))[:\s]+[A-Za-z0-9][-A-Za-z0-9]+/gi,
      // UPS/FedEx style: 1Z999AA10123456784
      /\b1Z[A-Z0-9]{16}\b/g,
      // USPS style: 9400111899223033
      /\b9[0-9]{15,21}\b/g,
    ],
    converter: (match: string) => {
      // Extract number part (the code after the label)
      const numMatch = match.match(/[:\s]+([A-Za-z0-9][-A-Za-z0-9]+)$/);
      if (numMatch) {
        const code = numMatch[1] ?? '';
        // Only convert if code contains at least one digit
        if (!/\d/.test(code)) {
          return match;
        }
        const prefix = match.replace(/[:\s]+[A-Za-z0-9][-A-Za-z0-9]+$/, '');
        const DIGITS = [
          'zero',
          'one',
          'two',
          'three',
          'four',
          'five',
          'six',
          'seven',
          'eight',
          'nine',
        ];
        const parts: string[] = [];
        for (const c of code) {
          if (c === '-') {
            parts.push(',');
          } else if (/\d/.test(c)) {
            parts.push(DIGITS[parseInt(c, 10)] ?? c);
          } else {
            parts.push(c);
          }
        }
        return prefix + ' ' + parts.join(' ');
      }
      return match;
    },
  },

  /**
   * ISO 8601 datetime patterns (check before datetime)
   * - 2024-01-15T14:30:00
   * - 2024-01-15T14:30
   * - Milliseconds and timezone support
   */
  datetime: {
    patterns: [
      // ISO 8601 format: YYYY-MM-DDTHH:MM(:SS)(.mmm)?(Z|±HH:MM)?
      /\b\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?\b/g,
      // Space-separated format: YYYY-MM-DD HH:MM(:SS)
      /\b\d{4}[-/.]\d{1,2}[-/.]\d{1,2}\s+\d{1,2}:\d{2}(?::\d{2})?\b/g,
    ],
    converter: (match: string) => datetime(match),
  },

  /**
   * Time patterns
   * - HH:MM, HH:MM:SS format
   * - HH:MM~HH:MM range format
   * - AM/PM format: 2:30 PM, 10:00 AM
   */
  time: {
    patterns: [
      // Time range: HH:MM~HH:MM (match first)
      /\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|am|pm)?\s*[-~to]+\s*\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|am|pm)?/gi,
      // HH:MM AM/PM format
      /\b\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|am|pm|a\.m\.|p\.m\.)\b/gi,
      // HH:MM or HH:MM:SS - not following a date
      /(?<!\d[-/.]\d{1,2}[-/.])(?<!\d{4}[-/.]\d{1,2}[-/.]\d{1,2}\s*)(?<!\d[-/.])(?<=^|[^\d])\d{1,2}:\d{2}(?::\d{2})?(?=$|[^\d:])/g,
    ],
    converter: (match: string) => {
      // Time range
      if (/\d{1,2}:\d{2}.*[-~to]+.*\d{1,2}:\d{2}/i.test(match)) {
        const parts = match.split(/\s*[-~]+\s*|\s+to\s+/i);
        if (parts.length === 2) {
          const time1 = time(parts[0] ?? '');
          const time2 = time(parts[1] ?? '');
          return time1 + ' to ' + time2;
        }
      }
      return time(match);
    },
  },

  /**
   * Date patterns
   * - YYYY-MM-DD, MM/DD/YYYY
   * - English: January 15, 2024, Jan 15, 2024
   * - Ordinal: 15th of January, 2024
   * - Month + ordinal day (no year): December 25th
   */
  date: {
    patterns: [
      // Date range: YYYY-MM-DD ~ YYYY-MM-DD (match first)
      /\b\d{4}[-/.]\d{1,2}[-/.]\d{1,2}\s*[-~to]+\s*\d{4}[-/.]\d{1,2}[-/.]\d{1,2}\b/gi,
      // YYYYMMDD format (8 digits, birthdate format)
      // Year range: 1900-2099
      /\b(?:19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])(?!-\d)\b/g,
      // English month names: January 15, 2024 or Jan 15, 2024
      /\b(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+\d{1,2}(?:st|nd|rd|th)?[,\s]+\d{4}\b/gi,
      // Ordinal format: 15th of January, 2024
      /\b\d{1,2}(?:st|nd|rd|th)\s+(?:of\s+)?(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?[,\s]+\d{4}\b/gi,
      // Month + ordinal day (no year): December 25th, January 1st
      /\b(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+\d{1,2}(?:st|nd|rd|th)\b/gi,
      // Ordinal day + of + month (no year): 25th of December, 1st of January
      /\b\d{1,2}(?:st|nd|rd|th)\s+of\s+(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\b/gi,
      // US format: MM/DD/YYYY
      /\b(?:0?[1-9]|1[0-2])\/(?:0?[1-9]|[12]\d|3[01])\/\d{4}\b/g,
      // ISO format: YYYY-MM-DD (not followed by time)
      /\b\d{4}[-/.]\d{1,2}[-/.]\d{1,2}(?!\s*\d{1,2}:\d{2})(?!\s*T\d)/g,
    ],
    converter: (match: string) => {
      // Date range
      if (/\d{4}[-/.]\d{1,2}[-/.]\d{1,2}\s*[-~to]+\s*\d{4}[-/.]\d{1,2}[-/.]\d{1,2}/i.test(match)) {
        const parts = match.split(/\s*[-~]+\s*|\s+to\s+/i);
        if (parts.length === 2) {
          const date1 = date(parts[0] ?? '');
          const date2 = date(parts[1] ?? '');
          return date1 + ' to ' + date2;
        }
      }
      // Month + ordinal day (no year): December 25th → December twenty-fifth
      const monthDayMatch = match.match(
        /^(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+(\d{1,2})(?:st|nd|rd|th)$/i
      );
      if (monthDayMatch) {
        const monthName = monthDayMatch[1] ?? '';
        const dayNum = parseInt(monthDayMatch[2] ?? '0', 10);
        return monthName + ' ' + numberToOrdinal(dayNum);
      }
      // Ordinal day + of + month (no year): 25th of December → the twenty-fifth of December
      const dayOfMonthMatch = match.match(
        /^(\d{1,2})(?:st|nd|rd|th)\s+of\s+(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?$/i
      );
      if (dayOfMonthMatch) {
        const dayNum = parseInt(dayOfMonthMatch[1] ?? '0', 10);
        const monthName = dayOfMonthMatch[2] ?? '';
        return 'the ' + numberToOrdinal(dayNum) + ' of ' + monthName;
      }
      return date(match);
    },
  },

  /**
   * Money patterns
   * - $100, $1,000.00
   * - 100 dollars, 50 USD
   * - £50, €30
   */
  money: {
    patterns: [
      // Money range: $100~$200 (match first)
      /\$[\d,]+(?:\.\d+)?\s*[-~to]+\s*\$[\d,]+(?:\.\d+)?/gi,
      // Dollar with symbol: $100, $1,000.00
      /\$[\d,]+(?:\.\d+)?/g,
      // Pound: £100
      /£[\d,]+(?:\.\d+)?/g,
      // Euro: €100
      /€[\d,]+(?:\.\d+)?/g,
      // Yen: ¥100
      /¥[\d,]+(?:\.\d+)?/g,
      // Number + currency word: 100 dollars, 50 USD, 30 euros
      /[\d,]+(?:\.\d+)?\s*(?:dollars?|USD|pounds?|GBP|euros?|EUR|yen|JPY|cents?)\b/gi,
    ],
    converter: (match: string) => {
      // Money range
      if (/\$[\d,]+(?:\.\d+)?\s*[-~to]+\s*\$[\d,]+(?:\.\d+)?/i.test(match)) {
        const parts = match.split(/\s*[-~]+\s*|\s+to\s+/i);
        if (parts.length === 2) {
          const money1 = money(parts[0] ?? '');
          const money2 = money(parts[1] ?? '');
          return money1 + ' to ' + money2;
        }
      }
      return money(match);
    },
  },

  /**
   * Year patterns
   * - YYYY, year YYYY
   */
  year: {
    patterns: [
      // Year with label: year 2024, in 2024
      /\b(?:year|in)\s*(?:19|20)\d{2}\b/gi,
      // Year range: 2020~2024
      /\b(?:19|20)\d{2}\s*[-~to]+\s*(?:19|20)\d{2}\b/gi,
    ],
    converter: (match: string) => year(match),
  },

  /**
   * Month patterns
   * - January, Feb, etc.
   */
  month: {
    patterns: [
      // Standalone month names
      /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\b(?!\s+\d)/gi,
    ],
    converter: (match: string) => month(match),
  },

  /**
   * Day patterns
   * - D-day format
   * - Ordinal: 1st, 2nd, 3rd (as standalone day)
   */
  day: {
    patterns: [
      // D-day format
      /\b[Dd]-?[Dd]ay\b/gi,
      /\b[Dd]\s*[-+]\s*[\d,]+\b/g,
      // Day N, the Nth
      /\b(?:day|the)\s+\d+(?:st|nd|rd|th)?\b/gi,
    ],
    converter: (match: string) => day(match),
  },

  /**
   * Order patterns
   * - 1st, 2nd, 3rd, etc.
   * - first, second, third (as ordinals)
   */
  order: {
    patterns: [
      // Nth place/rank/position
      /\b\d+(?:st|nd|rd|th)\s+(?:place|rank|position|grade|level|round)\b/gi,
      // Ordinal numbers with context: the 1st, came 2nd
      /\b(?:the|came|finished|ranked)\s+\d+(?:st|nd|rd|th)\b/gi,
    ],
    converter: (match: string) => order(match),
  },

  /**
   * Point patterns
   * - N points
   * - N credits
   */
  point: {
    patterns: [
      // N points, N.N points
      /\b[\d,]+(?:\.\d+)?\s*points?\b/gi,
      // N credits
      /[\d,]+(?:\.\d+)?\s*credits?\b/gi,
      // Score: N
      /\bscore[:\s]+[\d,]+(?:\.\d+)?\b/gi,
    ],
    converter: (match: string) => {
      // Handle "Score: N" format
      const scoreMatch = match.match(/^score[:\s]+([\d,]+(?:\.\d+)?)/i);
      if (scoreMatch) {
        const numStr = scoreMatch[1] ?? '';
        const converted = point(numStr + ' points');
        // Replace "points" with empty string since it's just a score value
        return 'score ' + converted.replace(/\s*points?$/, '');
      }
      return point(match);
    },
  },

  /**
   * Piece/quantity patterns
   * - N items, N pieces, N people, N units
   */
  piece: {
    patterns: [
      // Quantity + unit words
      /\b[\d,]+\s*(?:items?|pieces?|people|persons?|units?|bottles?|cups?|glasses?|boxes?|bags?|packs?|pairs?|sets?|sheets?)\b/gi,
    ],
    converter: (match: string) => piece(match),
  },

  /**
   * Distance context pattern (m unit + distance context keywords)
   * - 500m ahead, within 100m, etc.
   */
  distanceContext: {
    patterns: [
      // Number + m + distance context keyword (after)
      new RegExp(`[\\d,]+(?:\\.\\d+)?\\s*m\\s*(?:${DISTANCE_CONTEXT_AFTER.join('|')})`, 'gi'),
      // Distance context keyword (before) + number + m
      new RegExp(
        `(?:${DISTANCE_CONTEXT_BEFORE.join('|')})\\s*[\\d,]+(?:\\.\\d+)?\\s*m(?![a-zA-Z])`,
        'gi'
      ),
    ],
    converter: (match: string) => distanceWithContext(match),
  },

  /**
   * Time (minutes) context pattern (m unit + time context keywords)
   * - 5m later, about 30m, within 10m
   */
  minsecContext: {
    patterns: [
      // Number + m + time context keyword (after) - only when not followed by numbers
      new RegExp(`\\b\\d+m(?!\\d)\\s*(?:${TIME_CONTEXT_AFTER.join('|')})`, 'gi'),
      // Time context keyword (before) + number + m
      new RegExp(`(?:${TIME_CONTEXT_BEFORE.join('|')})\\s*\\d+m(?!\\d)(?![a-zA-Z])`, 'gi'),
    ],
    converter: (match: string) => {
      // Context keyword after
      const afterMatch = match.match(
        new RegExp(`^(\\d+)m\\s*(${TIME_CONTEXT_AFTER.join('|')})(.*)$`, 'i')
      );
      if (afterMatch) {
        const num = parseInt(afterMatch[1] ?? '0', 10);
        const context = afterMatch[2] ?? '';
        const rest = afterMatch[3] ?? '';
        return minsec(`${num}m`) + ' ' + context + rest;
      }

      // Context keyword before
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
   * Minutes/seconds patterns (duration)
   * - Nm, Ns, NmNs, NhNmNs
   * - N minutes, N seconds, N hours
   * - Time range: 1h30m~2h (~ → to)
   */
  minsec: {
    patterns: [
      // Milliseconds range: 50~100ms (match first)
      /\b\d+\s*[-~to]+\s*\d+\s*ms\b/gi,
      // Standalone milliseconds: 10ms, 100ms
      /\b\d+\s*ms\b/gi,
      // Microseconds range: 1~5µs, 1~5us
      /\b\d+\s*[-~to]+\s*\d+\s*[µu]s\b/gi,
      // Standalone microseconds: 10µs, 10us
      /\b\d+\s*[µu]s\b/gi,
      // Nanoseconds range: 1~5ns
      /\b\d+\s*[-~to]+\s*\d+\s*ns\b/gi,
      // Standalone nanoseconds: 10ns
      /\b\d+\s*ns\b/gi,
      // Time range: 1h30m~2h, 5m~10m
      /\b\d+h(?:\d+m)?(?:\d+s)?[-~to]+\d+h(?:\d+m)?(?:\d+s)?\b/gi,
      /\b\d+m(?:\d+s)?[-~to]+\d+m(?:\d+s)?\b/gi,
      // English: 1h30m20s, 1h30m, 1h
      /\b\d+h(?:\d+m)?(?:\d+s)?\b/gi,
      // English: NmNs combination
      /\b\d+m\d+s\b/gi,
      // Standalone Nm: when not followed by numbers, letters, or special chars
      /\b\d+m(?!\d)(?![a-zA-Z³²])/gi,
      // English: Ns standalone
      /\b\d+s\b/gi,
      // English full words: 5 minutes, 30 seconds, 1 hour
      /\b\d+\s*(?:hours?|minutes?|seconds?|mins?|secs?|hrs?)\b/gi,
    ],
    converter: (match: string) => {
      // SI time unit mapping
      const timeUnitMap: Record<string, string> = {
        ms: 'milliseconds',
        µs: 'microseconds',
        us: 'microseconds',
        ns: 'nanoseconds',
        ps: 'picoseconds',
        fs: 'femtoseconds',
      };

      // SI time unit range: N~Munit
      const siTimeRangeMatch = match.match(/^(\d+)\s*[-~to]+\s*(\d+)\s*([µu]?[mnpf]?s)$/i);
      if (siTimeRangeMatch) {
        const num1 = parseInt(siTimeRangeMatch[1] ?? '0', 10);
        const num2 = parseInt(siTimeRangeMatch[2] ?? '0', 10);
        const unit = siTimeRangeMatch[3]?.toLowerCase() ?? 'ms';
        const englishUnit = timeUnitMap[unit] ?? 'seconds';
        return numberToEnglish(num1) + ' to ' + numberToEnglish(num2) + ' ' + englishUnit;
      }

      // Standalone SI time unit: Nunit
      const siTimeMatch = match.match(/^(\d+)\s*([µu]?[mnpf]?s)$/i);
      if (siTimeMatch) {
        const num = parseInt(siTimeMatch[1] ?? '0', 10);
        const unit = siTimeMatch[2]?.toLowerCase() ?? 'ms';
        const englishUnit = timeUnitMap[unit] ?? 'seconds';
        return numberToEnglish(num) + ' ' + englishUnit;
      }

      // English range (5m~10m, etc.) - use (?:[-~]|\s+to\s+) to avoid matching 't' in words like 'minutes'
      const engRangeMatch = match.match(/^(.+?)(?:[-~]|\s+to\s+)(.+)$/i);
      if (engRangeMatch) {
        const time1 = minsec(engRangeMatch[1]?.trim() ?? '');
        const time2 = minsec(engRangeMatch[2]?.trim() ?? '');
        return time1 + ' to ' + time2;
      }

      return minsec(match);
    },
  },

  /**
   * Ratio patterns
   * - N:M format (colon ratio)
   * - N% format (percentage)
   * - N times/fold format
   */
  ratio: {
    patterns: [
      // Percentage: N%, N.N%
      /\b[\d,]+(?:\.\d+)?\s*%/g,
      // Times/fold: N times, N.N times, Nx
      /\b[\d,]+(?:\.\d+)?\s*(?:times|fold|x)\b/gi,
      // Colon ratio: N:M, N:M:O
      /\b\d+\s*:\s*\d+(?:\s*:\s*\d+)*\b/g,
    ],
    converter: (match: string) => ratio(match),
  },

  /**
   * Number patterns
   * - Number N, #N
   */
  number: {
    patterns: [
      // Number/No. + N (with word boundary) - limit to 4 digits to avoid converting IDs/references
      /\b(?:number|no\.)\s*\d{1,4}\b/gi,
      // #N (hash + number, no word boundary before #) - limit to 4 digits
      /#\d{1,4}\b/g,
    ],
    converter: (match: string) => numberTag(match),
  },

  /**
   * Duration patterns
   * - N months, N weeks, N years
   * - N days (as duration)
   */
  duration: {
    patterns: [
      // Duration range: N~M hours, N~M days
      /\b\d+\s*[-~to]+\s*\d+\s*(?:hours?|days?|weeks?|months?|years?|semesters?|quarters?)\b/gi,
      // N days/weeks/months/years + later/ago/long
      /\b[\d,]+\s*(?:days?|weeks?|months?|years?|semesters?|quarters?)\s*(?:later|ago|long)\b/gi,
      // For N days/weeks/months/years
      /\bfor\s+[\d,]+\s*(?:days?|weeks?|months?|years?|semesters?|quarters?)\b/gi,
      // N-day/week/month/year (adjective form)
      /\b[\d,]+[-](?:day|week|month|year|semester|quarter)\b/gi,
      // Standalone: N months, N weeks, N years, semesters, quarters (not N days which could be date)
      /\b[\d,]+\s*(?:months?|weeks?|years?|semesters?|quarters?)\b/gi,
    ],
    converter: (match: string) => {
      // Duration range: N~M units
      const rangeMatch = match.match(
        /^(\d+)\s*[-~to]+\s*(\d+)\s*(hours?|days?|weeks?|months?|years?)$/i
      );
      if (rangeMatch) {
        const num1 = parseInt(rangeMatch[1] ?? '0', 10);
        const num2 = parseInt(rangeMatch[2] ?? '0', 10);
        const unit = rangeMatch[3] ?? '';
        return numberToEnglish(num1) + ' to ' + numberToEnglish(num2) + ' ' + unit;
      }

      return duration(match);
    },
  },

  /**
   * Floor patterns
   * - Nth floor, B1, basement level N
   */
  floor: {
    patterns: [
      // Basement: B1, B2, basement level N
      /\b(?:basement\s*(?:level\s*)?\d+|[Bb]\d+)\b/gi,
      // Nth floor
      /\b\d+(?:st|nd|rd|th)?\s*floor\b/gi,
      // Floor N
      /\bfloor\s*\d+\b/gi,
    ],
    converter: (match: string) => floor(match),
  },

  /**
   * Account number patterns
   * - Bank account format: NNN-NNN-NNNNNN
   */
  account: {
    patterns: [
      // Account number: 2-6 digits - 2-6 digits - 4-14 digits
      /\b\d{2,6}-\d{2,6}-\d{4,14}\b/g,
    ],
    converter: (match: string) => account(match),
  },

  /**
   * Weight patterns
   * - N kg, N g, N lb, N oz, N ton
   */
  weight: {
    patterns: [
      // Weight: number + kg/mg/lb/oz/ton (kg, mg first)
      /[\d,]+(?:\.\d+)?\s*(?:kg|mg|lbs?|oz|tons?|kilograms?|grams?|milligrams?|ounces?|pounds?)/gi,
      // Weight: number + g (lowercase only, not followed by letters)
      /[\d,]+(?:\.\d+)?\s*g(?![a-zA-Z])/g,
    ],
    converter: (match: string) => weight(match),
  },

  /**
   * Mile patterns
   * - N miles
   */
  mile: {
    patterns: [
      // Miles: number + mile/miles
      /[\d,]+(?:\.\d+)?\s*miles?\b/gi,
    ],
    converter: (match: string) => mile(match),
  },

  /**
   * Area patterns
   * - N sq ft, N sq m, N m²
   */
  area: {
    patterns: [
      // Area: number + sq ft/sq m/m²/acres
      /[\d,]+(?:\.\d+)?\s*(?:sq\.?\s*(?:ft|feet|m|meters?)|㎡|m²|m2|acres?|hectares?)/gi,
    ],
    converter: (match: string) => area(match),
  },

  /**
   * Serial/code patterns
   * - Model number: XXX-NNNN-NNN
   * - Order number: NNNNNNNN-NNNN
   * Must require "number", "#", "no.", or ":" to avoid false positives
   */
  serial: {
    patterns: [
      // Serial number label + explicit "number/#/no." + code (must contain digits)
      /(?:serial|model|product|confirmation|reference|invoice)\s*(?:number|#|no\.?)[:\s]+[A-Za-z0-9][-A-Za-z0-9]+/gi,
      // With colon: serial: XXX, model: XXX, etc. (must contain digits)
      /(?:serial|model|product|confirmation|reference|invoice)\s*:[:\s]*[A-Za-z0-9][-A-Za-z0-9]+/gi,
      // Alphanumeric+hyphen code (at least 1 hyphen, must contain numbers)
      /\b[A-Za-z]{1,5}-\d{4,}-\d{2,}\b/g,
      /\b\d{8,}-\d{4,}\b/g,
    ],
    converter: (match: string) => {
      // Only convert if the code contains at least one digit
      const codeMatch = match.match(/[:\s]+([A-Za-z0-9][-A-Za-z0-9]+)$/);
      if (codeMatch) {
        const code = codeMatch[1] ?? '';
        if (!/\d/.test(code)) {
          return match; // No digits, don't convert
        }
      }
      // If label present, keep label and convert number only
      if (/(?:number|#|no\.?)/i.test(match)) {
        return serialNumbersOnly(match);
      }
      return serial(match);
    },
  },

  /**
   * Room number patterns
   * - Room N, Room NNN
   */
  roomNumber: {
    patterns: [
      // Room + 3+ digit number
      /\broom\s*#?\s*\d{3,}\b/gi,
      // Suite + number
      /\bsuite\s*#?\s*\d+\b/gi,
    ],
    converter: (match: string) => roomNumber(match),
  },

  /**
   * Distance patterns
   * - N km, N m, N cm, N mm
   */
  distance: {
    patterns: [
      // Distance: number + km/cm/mm/kilometers/meters/centimeters/millimeters
      /[\d,]+(?:\.\d+)?\s*(?:km|kilometers?|centimeters?|millimeters?|cm|mm)/gi,
      // Meters (when clear it's distance)
      /[\d,]+(?:\.\d+)?\s*meters?\b/gi,
    ],
    converter: (match: string) => distance(match),
  },

  /**
   * Year-month patterns
   * - YYYY-MM
   */
  yearMonth: {
    patterns: [
      // YYYY-MM (not followed by day)
      /\b\d{4}-\d{2}(?![-/]\d)/g,
    ],
    converter: (match: string) => yearMonth(match),
  },

  /**
   * Flight patterns
   * - AA123, KE001, BA2490
   */
  flight: {
    patterns: [
      // Flight label + code
      /(?:flight|departing|arriving)[:\s]+[A-Za-z]{2}\d{1,4}/gi,
      // Known airline codes + number
      /\b(?:KE|OZ|LJ|TW|7C|BX|ZE|RS|4V|SK|AA|UA|DL|BA|AF|LH|NH|JL|CX|SQ|EK|QR)\d{1,4}\b/g,
    ],
    converter: (match: string) => {
      // If label present, keep label
      const labelMatch = match.match(/^(flight|departing|arriving)[:\s]*/i);
      if (labelMatch) {
        const label = labelMatch[0];
        const code = match.slice(label.length);
        return label + flight(code);
      }
      return flight(match);
    },
  },

  /**
   * Seat patterns
   * - 23A, 15F, 7C
   */
  seat: {
    patterns: [
      // Seat label + number + letter
      /(?:seat)[:\s]*\d{1,3}[A-Za-z]/gi,
    ],
    converter: (match: string) => {
      // Keep label
      const labelMatch = match.match(/^(seat)[:\s]*/i);
      if (labelMatch) {
        const label = labelMatch[0];
        const seatNum = match.slice(label.length);
        return label + seat(seatNum);
      }
      return seat(match);
    },
  },

  /**
   * Lecture/chapter patterns
   * - Lesson 5, Chapter 3
   */
  lecture: {
    patterns: [
      // Lesson/Chapter/Episode + N
      /\b(?:lesson|chapter|episode|part|unit|section|lecture)\s*#?\s*[\d,]+\b/gi,
    ],
    converter: (match: string) => lecture(match),
  },

  /**
   * Fraction patterns
   * - 1/4, 2/3, 3/4
   */
  fraction: {
    patterns: [
      // Fraction + context (remaining, level, etc.)
      /\b\d+\s*\/\s*\d+\s*(?:remaining|level|full|capacity)\b/gi,
      // Standalone fraction (not part of date)
      /(?<!\d)(?<!\d[-/.])(?<!\d\s+)\b\d+\s*\/\s*\d+\b(?![-/.]?\d)/g,
    ],
    converter: (match: string) => {
      // Context present
      const contextMatch = match.match(/^(\d+)\s*\/\s*(\d+)\s*(.+)$/);
      if (contextMatch) {
        return fractionWithContext(match);
      }
      return fraction(match);
    },
  },

  /**
   * Temperature patterns
   * - 20°C, -5.3°C, 68°F, 273K
   */
  temperature: {
    patterns: [
      // Temperature range: N°C~M°C
      /[+-]?[\d,]+(?:\.\d+)?\s*(?:°[CcFf]|℃|℉)\s*[-~to]+\s*[+-]?[\d,]+(?:\.\d+)?\s*(?:°[CcFf]|℃|℉)/gi,
      // Standalone: N°C, N°F
      /[+-]?[\d,]+(?:\.\d+)?\s*(?:°[CcFf]|℃|℉)/g,
      // Kelvin: NK
      /[\d,]+(?:\.\d+)?\s*K(?![a-zA-Z])/g,
      // N degrees (with temperature context)
      /(?:temperature|temp)[:\s]+[+-]?[\d,]+(?:\.\d+)?\s*degrees?\b/gi,
    ],
    converter: (match: string) => {
      // Range
      if (/[-~to]+/i.test(match) && match.match(/\d.*[-~to]+.*\d/i)) {
        return temperatureRange(match);
      }
      // Temperature context
      const contextMatch = match.match(/^(temperature|temp)[:\s]+(.+)$/i);
      if (contextMatch) {
        const context = contextMatch[1] ?? '';
        const temp = contextMatch[2] ?? '';
        return context + ' ' + temperature(temp);
      }
      return temperature(match);
    },
  },

  /**
   * Volume patterns
   * - 12L, 500mL, 2 liters
   */
  volume: {
    patterns: [
      // Liters: NL, NmL (must start with number)
      /\d[\d,]*(?:\.\d+)?\s*(?:mL|ML|ml|L|ℓ|liters?|litres?)/gi,
      // Cubic meters: Nm³, Nm3
      /\d[\d,]*(?:\.\d+)?\s*(?:m³|m3|cm³|cm3)/g,
      // CC: Ncc (not followed by letters - exclude CCTV)
      /\d[\d,]*(?:\.\d+)?\s*(?:cc|CC)(?![a-zA-Z])/gi,
      // Gallons
      /\d[\d,]*(?:\.\d+)?\s*(?:gallons?|gal)\b/gi,
      // Fluid ounces
      /\d[\d,]*(?:\.\d+)?\s*(?:fl\.?\s*oz|fluid\s*ounces?)\b/gi,
    ],
    converter: (match: string) => volume(match),
  },

  /**
   * Data/power capacity patterns
   * - 6GB, 400Kbps, 450kWh
   */
  dataCapacity: {
    patterns: [
      // Data speed range: 100Mbps~200Mbps (match first)
      /[\d,]+(?:\.\d+)?\s*(?:Gbps|Mbps|Kbps|gbps|mbps|kbps|bps)\s*[-~to]+\s*[\d,]+(?:\.\d+)?\s*(?:Gbps|Mbps|Kbps|gbps|mbps|kbps|bps)/gi,
      // Data capacity: NGB, NMB, NTB, NKB
      /[+-]?[\d,]+(?:\.\d+)?\s*(?:TB|GB|MB|KB|tb|gb|mb|kb)/g,
      // Data speed: NMbps, NKbps, NGbps
      /[\d,]+(?:\.\d+)?\s*(?:Gbps|Mbps|Kbps|gbps|mbps|kbps|bps)/gi,
      // Power: NkWh, NMWh, NWh
      /[+-]?[\d,]+(?:\.\d+)?\s*(?:MWh|kWh|Wh|mwh|kwh|wh)/g,
      // Power: NkW, NMW, NW
      /[\d,]+(?:\.\d+)?\s*(?:MW|kW|W|mw|kw)(?![a-zA-Z])/g,
      // Voltage: NkV, NV
      /[\d,]+(?:\.\d+)?\s*(?:kV|V|kv)(?![a-zA-Z])/g,
      // Current: NmA, NA (not followed by letters or /)
      /[\d,]+(?:\.\d+)?\s*(?:mA|ma)(?![a-zA-Z/])/g,
      /[\d,]+(?:\.\d+)?\s*A(?![a-zA-Z/])/g,
    ],
    converter: (match: string) => {
      // Data speed range: 100Mbps~200Mbps
      const rangeMatch = match.match(
        /^([\d,]+(?:\.\d+)?)\s*(Gbps|Mbps|Kbps|bps)\s*[-~to]+\s*([\d,]+(?:\.\d+)?)\s*(Gbps|Mbps|Kbps|bps)$/i
      );
      if (rangeMatch) {
        const num1 = rangeMatch[1] ?? '';
        const unit1 = rangeMatch[2] ?? '';
        const num2 = rangeMatch[3] ?? '';
        const unit2 = rangeMatch[4] ?? '';
        const converted1 = dataCapacity(num1 + unit1);
        const converted2 = dataCapacity(num2 + unit2);
        return converted1 + ' to ' + converted2;
      }
      return dataCapacity(match);
    },
  },

  /**
   * Inch patterns
   * - 65 inches, 55"
   */
  inch: {
    patterns: [
      // N inches, N inch, N"
      /[\d,]+(?:\.\d+)?\s*(?:inches|inch|″|")/gi,
    ],
    converter: (match: string) => inch(match),
  },

  /**
   * Point (P unit) patterns
   * - 15,600P, 128,450 points
   */
  pointP: {
    patterns: [
      // Number + P (points)
      /[\d,]+\s*P(?![a-zA-Z])/g,
    ],
    converter: (match: string) => {
      const numMatch = match.match(/^([\d,]+)\s*P$/i);
      if (numMatch) {
        const numStr = numMatch[1]?.replace(/,/g, '') ?? '0';
        const num = parseInt(numStr, 10);
        if (!isNaN(num)) {
          return numberToEnglish(num) + ' points';
        }
      }
      return match;
    },
  },

  /**
   * Card ending digits patterns
   * - Ending in NNNN, ends in NNNN, last 4 digits NNNN
   */
  cardEnding: {
    patterns: [
      // Ending in NNNN, ends in NNNN
      /\b(?:ending|ends)\s+in\s+\d{4}\b/gi,
      // Last 4 digits: NNNN
      /\blast\s+(?:4|four)\s+digits[:\s]+\d{4}\b/gi,
    ],
    converter: (match: string) => {
      const numMatch = match.match(/(\d{4})$/);
      if (numMatch) {
        const digits = numMatch[1] ?? '';
        const prefix = match.replace(/\d{4}$/, '');
        const DIGITS = [
          'zero',
          'one',
          'two',
          'three',
          'four',
          'five',
          'six',
          'seven',
          'eight',
          'nine',
        ];
        const converted = digits
          .split('')
          .map((d) => DIGITS[parseInt(d, 10)] ?? d)
          .join(' ');
        return prefix + converted;
      }
      return match;
    },
  },

  /**
   * Simple digit context patterns
   * - press N, dial N, enter N, type N, option N, choice N
   */
  simpleDigitContext: {
    patterns: [
      // press/dial/enter/type + single digit
      /\b(?:press|dial|enter|type|hit)\s+\d\b/gi,
      // option/choice + digit
      /\b(?:option|choice)\s+\d\b/gi,
      // step N (single digit)
      /\bstep\s+\d\b/gi,
    ],
    converter: (match: string) => {
      const numMatch = match.match(/(\d)$/);
      if (numMatch) {
        const digit = numMatch[1] ?? '';
        const prefix = match.replace(/\d$/, '');
        const DIGITS = [
          'zero',
          'one',
          'two',
          'three',
          'four',
          'five',
          'six',
          'seven',
          'eight',
          'nine',
        ];
        return prefix + (DIGITS[parseInt(digit, 10)] ?? digit);
      }
      return match;
    },
  },
} as const;

/**
 * All supported tag types
 */
export const SUPPORTED_AUTO_TAGS = Object.keys(AUTO_TAG_PATTERNS) as Array<
  keyof typeof AUTO_TAG_PATTERNS
>;

/**
 * Automatically recognize patterns in text and convert to tagged result
 *
 * @param text - Text to convert
 * @param options - Auto-tagging options
 * @returns Text with auto-tagging applied
 *
 * @example
 * ```typescript
 * autoTag('Call me at 555-123-4567 tomorrow.');
 * // 'Call me at five five five, one two three, four five six seven tomorrow.'
 *
 * autoTag('The meeting is at 2:30 PM.');
 * // 'The meeting is at two thirty PM.'
 *
 * autoTag('Total is $50.00.');
 * // 'Total is fifty dollars.'
 *
 * autoTag('2024-01-15T14:30 meeting');
 * // 'January fifteenth, twenty twenty-four, two thirty PM meeting'
 * ```
 */
export function autoTag(text: string, options?: AutoTagOptions): string {
  if (!text || text.length === 0) {
    return text;
  }

  const enabledTags = options?.enabledTags ?? SUPPORTED_AUTO_TAGS;

  // Collect match results
  const allMatches: MatchResult[] = [];

  for (const tagType of enabledTags) {
    const tagConfig = AUTO_TAG_PATTERNS[tagType];
    if (!tagConfig) continue;

    for (const pattern of tagConfig.patterns) {
      // Reset regex (reset lastIndex)
      const regex = new RegExp(pattern.source, pattern.flags);

      let match: RegExpExecArray | null;
      while ((match = regex.exec(text)) !== null) {
        const original = match[0];
        const converted = tagConfig.converter(original);

        // Only add if conversion actually happened
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

  // If no matches, apply only post-processing
  if (allMatches.length === 0) {
    let result = text;

    // Convert special unit characters to pronunciation (post-processing)
    for (const [pattern, replacement] of SPECIAL_UNIT_MAP) {
      result = result.replace(pattern, replacement);
    }

    // Convert tech abbreviations to pronunciation (post-processing)
    for (const [pattern, replacement] of ABBREVIATION_MAP) {
      result = result.replace(pattern, replacement);
    }

    return result;
  }

  // Sort by start position, longer matches first
  allMatches.sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    return b.original.length - a.original.length;
  });

  // Remove overlapping matches
  const finalMatches: MatchResult[] = [];
  let lastEnd = -1;

  for (const match of allMatches) {
    if (match.start >= lastEnd) {
      finalMatches.push(match);
      lastEnd = match.end;
    }
  }

  // Convert text
  let result = '';
  let currentIndex = 0;

  for (const match of finalMatches) {
    // Add text before match
    result += text.slice(currentIndex, match.start);
    // Add converted text
    result += match.converted;

    currentIndex = match.end;
  }

  // Add remaining text
  result += text.slice(currentIndex);

  // Convert special unit characters to pronunciation (post-processing)
  for (const [pattern, replacement] of SPECIAL_UNIT_MAP) {
    result = result.replace(pattern, replacement);
  }

  // Convert tech abbreviations to pronunciation (post-processing)
  for (const [pattern, replacement] of ABBREVIATION_MAP) {
    result = result.replace(pattern, replacement);
  }

  return result;
}

/**
 * Extract auto-recognized tag information from text (without conversion)
 *
 * @param text - Text to analyze
 * @param options - Auto-tagging options
 * @returns Array of recognized pattern information
 *
 * @example
 * ```typescript
 * extractAutoTags('Phone number is 555-123-4567.');
 * // [
 * //   { original: '555-123-4567', tagType: 'phone', start: 16, end: 28 }
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

  // Sort and remove duplicates
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
 * Apply both auto-tags and manual tags
 *
 * Priority:
 * 1. Manual tags (manual-tag format) are processed first
 * 2. Then auto-tags are applied
 *
 * @param text - Text to convert
 * @param autoTagOptions - Auto-tagging options
 * @returns Text with tagging applied
 *
 * @example
 * ```typescript
 * autoTagWithManual('name(John) called at 555-123-4567.');
 * // 'J O H N called at five five five, one two three, four five six seven.'
 * ```
 */
export function autoTagWithManual(text: string, autoTagOptions?: AutoTagOptions): string {
  // To apply manualTag first, import is needed but to prevent circular reference
  // this function only applies autoTag
  // Guide to import from manual-tag.ts to use this
  return autoTag(text, autoTagOptions);
}

// Convenience functions for individual tag auto-conversion
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
export const autoNumber = (text: string): string => autoTag(text, { enabledTags: ['number'] });
export const autoDuration = (text: string): string => autoTag(text, { enabledTags: ['duration'] });
export const autoFloor = (text: string): string => autoTag(text, { enabledTags: ['floor'] });
export const autoAccount = (text: string): string => autoTag(text, { enabledTags: ['account'] });
export const autoWeight = (text: string): string => autoTag(text, { enabledTags: ['weight'] });
export const autoMile = (text: string): string => autoTag(text, { enabledTags: ['mile'] });
export const autoArea = (text: string): string => autoTag(text, { enabledTags: ['area'] });
export const autoSerial = (text: string): string => autoTag(text, { enabledTags: ['serial'] });
export const autoRoomNumber = (text: string): string =>
  autoTag(text, { enabledTags: ['roomNumber'] });
export const autoDistanceContext = (text: string): string =>
  autoTag(text, { enabledTags: ['distanceContext'] });
export const autoDistance = (text: string): string => autoTag(text, { enabledTags: ['distance'] });
export const autoMinsecContext = (text: string): string =>
  autoTag(text, { enabledTags: ['minsecContext'] });
export const autoYearMonth = (text: string): string =>
  autoTag(text, { enabledTags: ['yearMonth'] });
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
export const autoPointP = (text: string): string => autoTag(text, { enabledTags: ['pointP'] });
