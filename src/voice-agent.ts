import { autoTag, manualTag, extractTags, getSupportedLanguages, korean, english } from './index';
import type { AutoTagOptions, SupportedLanguage } from './index';
import { combineTags } from './auto-with-manual';
import { assertInputWithinLimit } from './input-guard';
import { protectedRanges } from './utils/protected-text';
import { isValidCalendarDate } from './utils/date-validation';

export interface VoiceAgentOptions extends AutoTagOptions {
  /** Required per call/session; never reads the process-wide default language. */
  language: SupportedLanguage;
  /** Omit to preserve ambiguous slash dates for clarification by the agent. */
  dateOrder?: 'mdy' | 'dmy';
  /** Literal, case-sensitive pronunciation overrides; values are not reparsed. */
  pronunciations?: Record<string, string>;
}

const SLASH_DATE = /\b(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?\b/g;
export interface VoiceAgent {
  normalize(text: string): string;
  push(chunk: string): string;
  flush(): string;
  reset(): void;
}

/** One instance per conversation. reset() discards pending speech on interruption. */
export function createVoiceAgent(options: VoiceAgentOptions): VoiceAgent {
  if (!getSupportedLanguages().includes(options.language)) {
    throw new Error(`Unsupported language: ${options.language}`);
  }
  const language = options.language;
  const dateOrder = options.dateOrder;
  if (dateOrder !== undefined && dateOrder !== 'mdy' && dateOrder !== 'dmy') {
    throw new Error('dateOrder must be mdy or dmy');
  }
  const autoOptions = { language, enabledTags: options.enabledTags?.slice() };
  const pronunciations = { ...options.pronunciations };
  const terms = Object.keys(pronunciations).sort((a, b) => b.length - a.length);
  if (terms.some((term) => !term || typeof pronunciations[term] !== 'string')) {
    throw new Error('Pronunciations require non-empty terms and string replacements');
  }
  const termPattern = terms.length
    ? new RegExp(terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g')
    : null;
  let pending = '';

  function readDate(value: string): string {
    const parts = value.split('/').map(Number);
    if (!dateOrder) return value;
    const month = parts[dateOrder === 'mdy' ? 0 : 1]!;
    const day = parts[dateOrder === 'mdy' ? 1 : 0]!;
    const year = parts[2];
    if (!isValidCalendarDate(year, month, day)) return value;
    if (year !== undefined) {
      return manualTag(`date(${year}-${month}-${day})`, { language });
    }
    if (language === 'ko' || language === 'kor') return korean.date(`${month}월 ${day}일`);
    if (language === 'en' || language === 'eng') return english.date(`${month}월 ${day}일`);
    // shortcut: yearless slash dates only have dedicated ko/en readers; supply ISO dates otherwise.
    return value;
  }

  function readPlain(text: string): string {
    // Explicitly labelled identifiers are strings, including their leading zeroes.
    const identifiers =
      language === 'ko' || language === 'kor'
        ? /((?:인증번호|예약번호|주문번호|계좌번호|계약번호)(?:는|은)?\s*[:：]?\s*)([A-Z0-9]+(?:-[A-Z0-9]+)*)/gi
        : language === 'en' || language === 'eng'
          ? /((?:verification code|reservation number|order number|account number)(?: is)?\s*[:#]?\s*)([A-Z0-9]+(?:-[A-Z0-9]+)*)/gi
          : null;
    const spans: Array<{ start: number; end: number; value: string }> = [];
    if (termPattern) {
      termPattern.lastIndex = 0;
      let term: RegExpExecArray | null;
      while ((term = termPattern.exec(text)) !== null) {
        const start = term.index;
        const end = start + term[0].length;
        if (/^[A-Za-z0-9]/.test(term[0]) && /[A-Za-z0-9]/.test(text[start - 1] ?? '')) continue;
        if (/[A-Za-z0-9]$/.test(term[0]) && /[A-Za-z0-9]/.test(text[end] ?? '')) continue;
        spans.push({ start, end, value: pronunciations[term[0]]! });
      }
    }
    if (identifiers) {
      let identifier: RegExpExecArray | null;
      while ((identifier = identifiers.exec(text)) !== null) {
        const value = identifier[2]!;
        if (!/\d/.test(value)) continue;
        const tag = /^\d+$/.test(value) ? 'digits' : 'serial';
        spans.push({
          start: identifier.index,
          end: identifier.index + identifier[0].length,
          value: identifier[1]! + manualTag(`${tag}(${value})`, { language }),
        });
      }
    }
    SLASH_DATE.lastIndex = 0;
    let date: RegExpExecArray | null;
    while ((date = SLASH_DATE.exec(text)) !== null) {
      if (
        /[\d/.-]/.test(text[date.index - 1] ?? '') ||
        /^(?:[\d/]|[.-]\d)/.test(text.slice(date.index + date[0].length))
      )
        continue;
      spans.push({ start: date.index, end: date.index + date[0].length, value: readDate(date[0]) });
    }
    spans.sort((a, b) => a.start - b.start || b.end - a.end);
    let result = '';
    let cursor = 0;
    for (const span of spans) {
      if (span.start < cursor) continue;
      result += autoTag(text.slice(cursor, span.start), autoOptions) + span.value;
      cursor = span.end;
    }
    return result + autoTag(text.slice(cursor), autoOptions);
  }

  function normalize(text: string): string {
    assertInputWithinLimit(text, 'voiceAgent.normalize');
    return combineTags(
      text,
      readPlain,
      (part) => manualTag(part, { language }),
      (part) => extractTags(part, { language })
    );
  }

  function push(chunk: string): string {
    const next = pending + chunk;
    assertInputWithinLimit(next, 'voiceAgent.push');
    const protectedSpans = protectedRanges(next);
    // Dictionary terms may contain sentence punctuation or span multiple chunks.
    if (termPattern) {
      termPattern.lastIndex = 0;
      let term: RegExpExecArray | null;
      while ((term = termPattern.exec(next)) !== null) {
        protectedSpans.push({ start: term.index, end: term.index + term[0].length });
      }
    }
    for (const term of terms) {
      for (let length = Math.min(next.length, term.length - 1); length > 0; length--) {
        if (next.endsWith(term.slice(0, length))) {
          protectedSpans.push({ start: next.length - length, end: next.length });
          break;
        }
      }
    }
    protectedSpans.sort((a, b) => a.start - b.start);
    let protectedIndex = 0;
    let depth = 0;
    let boundary = 0;
    for (let i = 0; i < next.length; i++) {
      while (protectedSpans[protectedIndex] && protectedSpans[protectedIndex]!.end <= i)
        protectedIndex++;
      const protectedSpan = protectedSpans[protectedIndex];
      if (protectedSpan && i >= protectedSpan.start) {
        i = protectedSpan.end - 1;
        continue;
      }
      const char = next[i]!;
      if (char === '(') depth++;
      if (char === ')') depth = Math.max(0, depth - 1);
      if (depth) continue;
      const following = next[i + 1];
      if (!/[.!?。！？\n]/.test(char)) continue;
      if (!/[。！？\n]/.test(char) && (!following || !/\s/.test(following))) continue;
      if (
        char === '.' &&
        /(?:\b(?:Mr|Mrs|Ms|Dr|Prof|Sr|Jr|St|vs|etc|ext)|\b[A-Za-z])\.$/i.test(next.slice(0, i + 1))
      )
        continue;
      boundary = i + 1;
      while (/\s/.test(next[boundary] ?? '') && boundary < next.length) boundary++;
    }
    const output = boundary ? normalize(next.slice(0, boundary)) : '';
    pending = next.slice(boundary);
    return output;
  }

  return {
    normalize,
    push,
    flush(): string {
      const output = normalize(pending);
      pending = '';
      return output;
    },
    reset(): void {
      pending = '';
    },
  };
}
