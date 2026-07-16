/**
 * Typecast Autotag - Multilingual Auto-Tagging Library
 *
 * Automatically recognizes patterns like phone numbers, dates, times, and amounts
 * in text and converts them to TTS-friendly formats.
 *
 * @example
 * ```typescript
 * import { autoTag, manualTag } from '@neosapience/typecast-autotag';
 *
 * // Default Korean usage
 * autoTag('전화번호는 010-1234-5678입니다.');
 * // => '전화번호는 공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔입니다.'
 *
 * manualTag('안녕하세요, name(김철수)님.');
 * // => '안녕하세요, 김 철 수님.'
 *
 * // Explicit language specification
 * autoTag('전화번호는 010-1234-5678입니다.', { language: 'ko' });
 * ```
 */

// ============================================================================
// Korean module import (default language)
// ============================================================================
import * as koreanModule from './korean';

// Extract functions with prefixed aliases for internal use
const {
  autoTag: koAutoTag,
  extractAutoTags: koExtractAutoTags,
  manualTag: koManualTag,
  extractTags: koExtractTags,
  manualTagSelective: koManualTagSelective,
  SUPPORTED_AUTO_TAGS: KO_SUPPORTED_AUTO_TAGS,
  SUPPORTED_TAGS: KO_SUPPORTED_TAGS,
} = koreanModule;

// ============================================================================
// English module import
// ============================================================================
import * as englishModule from './english';
import * as japaneseModule from './japanese';
import * as chineseModule from './chinese';
import * as taiwaneseMandarinModule from './taiwanese-mandarin';
import { createGenericLanguageModule, GENERIC_TTS_LANGUAGES } from './generic-language';
import type { GenericTtsLanguage, TtsLanguage } from './generic-language';
export { MAX_INPUT_LENGTH } from './input-guard';
export { SUPPORTED_TTS_LANGUAGES } from './generic-language';

const {
  autoTag: enAutoTag,
  extractAutoTags: enExtractAutoTags,
  manualTag: enManualTag,
  extractTags: enExtractTags,
  manualTagSelective: enManualTagSelective,
  SUPPORTED_AUTO_TAGS: EN_SUPPORTED_AUTO_TAGS,
  SUPPORTED_TAGS: EN_SUPPORTED_TAGS,
} = englishModule;

const {
  autoTag: jaAutoTag,
  extractAutoTags: jaExtractAutoTags,
  manualTag: jaManualTag,
  extractTags: jaExtractTags,
  manualTagSelective: jaManualTagSelective,
  SUPPORTED_AUTO_TAGS: JA_SUPPORTED_AUTO_TAGS,
  SUPPORTED_TAGS: JA_SUPPORTED_TAGS,
} = japaneseModule;

const {
  autoTag: zhAutoTag,
  extractAutoTags: zhExtractAutoTags,
  manualTag: zhManualTag,
  extractTags: zhExtractTags,
  manualTagSelective: zhManualTagSelective,
  SUPPORTED_AUTO_TAGS: ZH_SUPPORTED_AUTO_TAGS,
  SUPPORTED_TAGS: ZH_SUPPORTED_TAGS,
} = chineseModule;

const {
  autoTag: zhTwAutoTag,
  extractAutoTags: zhTwExtractAutoTags,
  manualTag: zhTwManualTag,
  extractTags: zhTwExtractTags,
  manualTagSelective: zhTwManualTagSelective,
  SUPPORTED_AUTO_TAGS: ZH_TW_SUPPORTED_AUTO_TAGS,
  SUPPORTED_TAGS: ZH_TW_SUPPORTED_TAGS,
} = taiwaneseMandarinModule;

// Type imports
import type { AutoTagOptions as KoAutoTagOptions, MatchResult as KoMatchResult } from './korean';
import type { AutoTagOptions as EnAutoTagOptions, MatchResult as EnMatchResult } from './english';
import type { AutoTagOptions as JaAutoTagOptions, MatchResult as JaMatchResult } from './japanese';
import type { AutoTagOptions as ZhAutoTagOptions, MatchResult as ZhMatchResult } from './chinese';
import type {
  AutoTagOptions as ZhTwAutoTagOptions,
  MatchResult as ZhTwMatchResult,
} from './taiwanese-mandarin';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Supported language codes
 */
export type SupportedLanguage = TtsLanguage | 'ko' | 'en' | 'ja' | 'zh' | 'zh-TW';

/**
 * Auto-tagging options
 */
export interface AutoTagOptions {
  /**
   * Language to use (default: 'ko')
   */
  language?: SupportedLanguage;
  /**
   * Tag types to enable (default: all tags)
   */
  enabledTags?: string[];
}

/**
 * Manual-tagging options
 */
export interface ManualTagOptions {
  /**
   * Language to use (default: 'ko')
   */
  language?: SupportedLanguage;
}

/**
 * Selective manual-tagging options
 */
export interface ManualTagSelectiveOptions extends ManualTagOptions {
  /**
   * List of allowed tags
   */
  allowedTags: string[];
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
 * Extracted tag information
 */
export interface ExtractedTag {
  /** Tag name */
  tag: string;
  /** Tag value */
  value: string;
  /** Start index */
  start: number;
  /** End index */
  end: number;
}

// ============================================================================
// Language Module Registry
// ============================================================================

interface LanguageModule {
  autoTag: (text: string, options?: KoAutoTagOptions) => string;
  extractAutoTags: (
    text: string,
    options?: KoAutoTagOptions
  ) => Array<Omit<MatchResult, 'converted'>>;
  manualTag: (text: string) => string;
  extractTags: (text: string) => ExtractedTag[];
  manualTagSelective: (text: string, allowedTags: string[]) => string;
  supportedAutoTags: readonly string[];
  supportedManualTags: readonly string[];
}

const genericLanguageModules = Object.fromEntries(
  GENERIC_TTS_LANGUAGES.map((language) => [language, createGenericLanguageModule(language)])
) as Record<GenericTtsLanguage, LanguageModule>;

const languageModules = {
  ko: {
    autoTag: koAutoTag,
    extractAutoTags: koExtractAutoTags,
    manualTag: koManualTag,
    extractTags: koExtractTags,
    manualTagSelective: koManualTagSelective,
    supportedAutoTags: KO_SUPPORTED_AUTO_TAGS,
    supportedManualTags: KO_SUPPORTED_TAGS,
  },
  en: {
    autoTag: enAutoTag as LanguageModule['autoTag'],
    extractAutoTags: enExtractAutoTags as LanguageModule['extractAutoTags'],
    manualTag: enManualTag,
    extractTags: enExtractTags,
    manualTagSelective: enManualTagSelective,
    supportedAutoTags: EN_SUPPORTED_AUTO_TAGS,
    supportedManualTags: EN_SUPPORTED_TAGS,
  },
  ja: {
    autoTag: jaAutoTag as LanguageModule['autoTag'],
    extractAutoTags: jaExtractAutoTags as LanguageModule['extractAutoTags'],
    manualTag: jaManualTag,
    extractTags: jaExtractTags,
    manualTagSelective: jaManualTagSelective,
    supportedAutoTags: JA_SUPPORTED_AUTO_TAGS,
    supportedManualTags: JA_SUPPORTED_TAGS,
  },
  zh: {
    autoTag: zhAutoTag as LanguageModule['autoTag'],
    extractAutoTags: zhExtractAutoTags as LanguageModule['extractAutoTags'],
    manualTag: zhManualTag,
    extractTags: zhExtractTags,
    manualTagSelective: zhManualTagSelective,
    supportedAutoTags: ZH_SUPPORTED_AUTO_TAGS,
    supportedManualTags: ZH_SUPPORTED_TAGS,
  },
  'zh-TW': {
    autoTag: zhTwAutoTag as LanguageModule['autoTag'],
    extractAutoTags: zhTwExtractAutoTags as LanguageModule['extractAutoTags'],
    manualTag: zhTwManualTag,
    extractTags: zhTwExtractTags,
    manualTagSelective: zhTwManualTagSelective,
    supportedAutoTags: ZH_TW_SUPPORTED_AUTO_TAGS,
    supportedManualTags: ZH_TW_SUPPORTED_TAGS,
  },
  ...genericLanguageModules,
} as unknown as Record<SupportedLanguage, LanguageModule>;

languageModules.kor = languageModules.ko;
languageModules.eng = languageModules.en;
languageModules.jpn = languageModules.ja;
languageModules.zho = languageModules.zh;
languageModules.nan = languageModules['zh-TW'];
languageModules.yue = languageModules['zh-TW'];

// ============================================================================
// Default Language Configuration
// ============================================================================

let defaultLanguage: SupportedLanguage = 'ko';

/**
 * Sets the default language.
 *
 * @param language - Language code to set
 *
 * @example
 * ```typescript
 * setDefaultLanguage('ko');
 * ```
 */
export function setDefaultLanguage(language: SupportedLanguage): void {
  if (!languageModules[language]) {
    throw new Error(`Unsupported language: ${language}`);
  }
  defaultLanguage = language;
}

/**
 * Returns the current default language.
 *
 * @returns Current default language code
 */
export function getDefaultLanguage(): SupportedLanguage {
  return defaultLanguage;
}

/**
 * Returns a list of all supported languages.
 *
 * @returns Array of supported language codes
 */
export function getSupportedLanguages(): SupportedLanguage[] {
  return Object.keys(languageModules) as SupportedLanguage[];
}

// ============================================================================
// Main API Functions
// ============================================================================

/**
 * Automatically recognizes patterns in text and converts them to tagged results.
 *
 * Recognizes phone numbers, dates, times, amounts, ordinals, etc.
 * and converts them to TTS-friendly formats.
 *
 * @param text - Text to convert
 * @param options - Auto-tagging options (language, enabled tags, etc.)
 * @returns Text with auto-tagging applied
 *
 * @example
 * ```typescript
 * // Default usage (Korean)
 * autoTag('내일 010-1234-5678로 전화주세요.');
 * // => '내일 공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔로 전화주세요.'
 *
 * autoTag('회의는 14:30에 시작합니다.');
 * // => '회의는 오후 두 시 삼십 분에 시작합니다.'
 *
 * autoTag('총 금액은 50000원입니다.');
 * // => '총 금액은 오만 원입니다.'
 *
 * // Enable specific tags only
 * autoTag('010-1234-5678, 50000원', { enabledTags: ['phone'] });
 * // => '공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔, 50000원'
 *
 * // Explicit language specification
 * autoTag('전화번호는 010-1234-5678입니다.', { language: 'ko' });
 * ```
 */
export function autoTag(text: string, options?: AutoTagOptions): string {
  const language = options?.language ?? defaultLanguage;
  const module = languageModules[language];

  if (!module) {
    throw new Error(`Unsupported language: ${language}`);
  }

  return module.autoTag(text, {
    enabledTags: options?.enabledTags as KoAutoTagOptions['enabledTags'],
  });
}

/**
 * Extracts auto-recognized tag information from text. (Does not convert)
 *
 * @param text - Text to analyze
 * @param options - Auto-tagging options
 * @returns Array of recognized pattern information
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
  const language = options?.language ?? defaultLanguage;
  const module = languageModules[language];

  if (!module) {
    throw new Error(`Unsupported language: ${language}`);
  }

  return module.extractAutoTags(text, {
    enabledTags: options?.enabledTags as KoAutoTagOptions['enabledTags'],
  });
}

/**
 * Parses manual tags in text and replaces them with tag function results.
 *
 * @param text - Text to convert
 * @param options - Manual-tagging options
 * @returns Text with tags converted
 *
 * @example
 * ```typescript
 * manualTag('안녕하세요, name(김철수) 고객님.');
 * // => '안녕하세요, 김 철 수 고객님.'
 *
 * manualTag('month(12) day(25)에 방문 예정입니다.');
 * // => '십이월 이십오일에 방문 예정입니다.'
 *
 * manualTag('금액은 money(10000)입니다.');
 * // => '금액은 만 원입니다.'
 * ```
 */
export function manualTag(text: string, options?: ManualTagOptions): string {
  const language = options?.language ?? defaultLanguage;
  const module = languageModules[language];

  if (!module) {
    throw new Error(`Unsupported language: ${language}`);
  }

  return module.manualTag(text);
}

/**
 * Extracts manual tags found in text.
 *
 * @param text - Text to analyze
 * @param options - Manual-tagging options
 * @returns Array of found tag information
 *
 * @example
 * ```typescript
 * extractTags('안녕하세요, name(김철수) 고객님.');
 * // [{ tag: 'name', value: '김철수', start: 7, end: 17 }]
 * ```
 */
export function extractTags(text: string, options?: ManualTagOptions): ExtractedTag[] {
  const language = options?.language ?? defaultLanguage;
  const module = languageModules[language];

  if (!module) {
    throw new Error(`Unsupported language: ${language}`);
  }

  return module.extractTags(text);
}

/**
 * Selectively converts only specific tags.
 *
 * @param text - Text to convert
 * @param options - Selective manual-tagging options
 * @returns Text with only selected tags converted
 *
 * @example
 * ```typescript
 * manualTagSelective('name(김철수) month(12)', { allowedTags: ['name'] });
 * // => '김 철 수 month(12)'
 * ```
 */
export function manualTagSelective(text: string, options: ManualTagSelectiveOptions): string {
  const language = options?.language ?? defaultLanguage;
  const module = languageModules[language];

  if (!module) {
    throw new Error(`Unsupported language: ${language}`);
  }

  return module.manualTagSelective(text, options.allowedTags);
}

/**
 * Applies both auto-tags and manual-tags together.
 *
 * Priority:
 * 1. Manual tags are processed first
 * 2. Then auto-tags are applied
 *
 * @param text - Text to convert
 * @param options - Auto-tagging options
 * @returns Text with tagging applied
 *
 * @example
 * ```typescript
 * autoTagWithManual('name(김철수)님, 010-1234-5678로 연락주세요.');
 * // => '김 철 수님, 공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔로 연락주세요.'
 * ```
 */
export function autoTagWithManual(text: string, options?: AutoTagOptions): string {
  const language = options?.language ?? defaultLanguage;
  const module = languageModules[language];

  if (!module) {
    throw new Error(`Unsupported language: ${language}`);
  }

  // Apply manual tags first
  const manualTagged = module.manualTag(text);
  // Then apply auto-tags
  return module.autoTag(manualTagged, {
    enabledTags: options?.enabledTags as KoAutoTagOptions['enabledTags'],
  });
}

/**
 * Returns the list of supported auto-tags for a specific language.
 *
 * @param language - Language code (default: current default language)
 * @returns Array of supported auto-tag names
 */
export function getSupportedAutoTags(language?: SupportedLanguage): string[] {
  const lang = language ?? defaultLanguage;
  const module = languageModules[lang];

  if (!module) {
    throw new Error(`Unsupported language: ${lang}`);
  }

  return [...module.supportedAutoTags];
}

/**
 * Returns the list of supported manual-tags for a specific language.
 *
 * @param language - Language code (default: current default language)
 * @returns Array of supported manual-tag names
 */
export function getSupportedManualTags(language?: SupportedLanguage): string[] {
  const lang = language ?? defaultLanguage;
  const module = languageModules[lang];

  if (!module) {
    throw new Error(`Unsupported language: ${lang}`);
  }

  return [...module.supportedManualTags];
}

// ============================================================================
// Language module re-exports (for direct access)
// ============================================================================

export { koreanModule as korean };
export { englishModule as english };
export { japaneseModule as japanese };
export { chineseModule as chinese };
export { taiwaneseMandarinModule as taiwaneseMandarin };

// ============================================================================
// Type re-exports
// ============================================================================

export type {
  KoAutoTagOptions,
  KoMatchResult,
  EnAutoTagOptions,
  EnMatchResult,
  JaAutoTagOptions,
  JaMatchResult,
  ZhAutoTagOptions,
  ZhMatchResult,
  ZhTwAutoTagOptions,
  ZhTwMatchResult,
};
