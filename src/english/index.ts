/**
 * English language module for Typecast Autotag
 *
 * Exports all English-specific auto-tagging and manual-tagging functions.
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
  autoNumber,
  autoDuration,
  autoFloor,
  autoAccount,
  autoWeight,
  autoMile,
  autoArea,
  autoSerial,
  autoRoomNumber,
  autoDistance,
  autoYearMonth,
  autoFlight,
  autoSeat,
  autoLecture,
  autoFraction,
  autoTemperature,
  autoVolume,
  autoDataCapacity,
  autoInch,
  autoPointP,
  autoDistanceContext,
  autoMinsecContext,
} from './auto-tag';

// Auto-tag types
export type { AutoTagOptions, MatchResult } from './auto-tag';

// Manual-tag module
export { manualTag, extractTags, manualTagSelective, SUPPORTED_TAGS } from './manual-tag';

// Individual tag converters
export { name } from './tags/name';
export { month, type MonthOptions } from './tags/month';
export { day, type DayOptions } from './tags/day';
export { date, yearMonth } from './tags/date';
export { time, type TimeOptions } from './tags/time';
export { year, type YearOptions } from './tags/year';
export { phone, type PhoneOptions } from './tags/phone';
export { money, type MoneyOptions } from './tags/money';
export { order, type OrderOptions } from './tags/order';
export { point, type PointOptions } from './tags/point';
export { piece, type PieceOptions } from './tags/piece';
export { digits, type DigitsOptions } from './tags/digits';
export { minsec, type MinsecOptions } from './tags/minsec';
export { datetime, type DatetimeOptions } from './tags/datetime';
export { ratio, type RatioOptions } from './tags/ratio';
export { numberTag, type NumberTagOptions } from './tags/number';
export { duration, type DurationOptions } from './tags/duration';
export { floor, type FloorOptions } from './tags/floor';
export { account, type AccountOptions } from './tags/account';
export { weight, type WeightOptions } from './tags/weight';
export { mile, type MileOptions } from './tags/mile';
export { area, type AreaOptions } from './tags/area';
export { serial, serialNumbersOnly, type SerialOptions } from './tags/serial';
export { roomNumber, type RoomNumberOptions } from './tags/room-number';
export {
  distance,
  distanceWithContext,
  DISTANCE_CONTEXT_AFTER,
  DISTANCE_CONTEXT_BEFORE,
  type DistanceOptions,
} from './tags/distance';
export { flight } from './tags/flight';
export { seat } from './tags/seat';
export { lecture, type LectureOptions } from './tags/lecture';
export { fraction, fractionWithContext, type FractionOptions } from './tags/fraction';
export { temperature, temperatureRange, type TemperatureOptions } from './tags/temperature';
export { volume, type VolumeOptions } from './tags/volume';
export { dataCapacity, type DataCapacityOptions } from './tags/data-capacity';
export { inch, type InchOptions } from './tags/inch';

// Utility functions
export {
  numberToEnglish,
  numberToOrdinal,
  digitToEnglish,
  digitToPhoneEnglish,
  digitToPhoneticEnglish,
  hourToEnglish,
  hourToEnglish24,
  getOrdinalSuffix,
  formatOrdinal,
} from './utils/number-to-english';
