/**
 * Korean language module for TypeCast AutoTag
 *
 * Exports all Korean-specific auto-tagging and manual-tagging functions.
 */

// Auto-tag module
export {
  autoTag,
  extractAutoTags,
  autoTagWithManual,
  SUPPORTED_AUTO_TAGS,
  // Individual auto-tag functions
  autoPhone,
  autoTime,
  autoDate,
  autoDatetime,
  autoMoney,
  autoYear,
  autoMonth,
  autoDay,
  autoOrder,
  autoPoint,
  autoPiece,
  autoMinsec,
  autoRatio,
  autoJari,
  autoNumber,
  autoDuration,
  autoFloor,
} from './auto-tag';

// Auto-tag types
export type { AutoTagOptions, MatchResult } from './auto-tag';

// Manual-tag module
export { manualTag, extractTags, manualTagSelective, SUPPORTED_TAGS } from './manual-tag';

// Individual tag converters
export { name } from './tags/name';
export { month } from './tags/month';
export { day } from './tags/day';
export { date } from './tags/date';
export { time } from './tags/time';
export { year } from './tags/year';
export { phone } from './tags/phone';
export { money } from './tags/money';
export { order } from './tags/order';
export { point } from './tags/point';
export { piece } from './tags/piece';
export { digits } from './tags/digits';
export { minsec } from './tags/minsec';
export { datetime } from './tags/datetime';
export { ratio } from './tags/ratio';
export { jari } from './tags/jari';
export { numberTag } from './tags/number';
export { duration } from './tags/duration';
export { floor } from './tags/floor';

// Utility functions
export { numberToKorean, numberToNativeKorean } from './utils/number-to-korean';
