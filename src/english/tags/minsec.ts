import { numberToEnglish } from '../utils/number-to-english';

/**
 * Options for minsec function
 */
export interface MinsecOptions {
  /**
   * Whether to include space between components
   * @default true
   */
  includeSpace?: boolean;
}

/**
 * Convert duration to English words
 *
 * Supports various time duration formats:
 * - Hours, minutes, seconds: 1h30m, 5m30s, 2h
 * - Korean format: 1시간30분, 5분30초
 * - Standalone: 30s, 45m, 2h
 *
 * @param input - Duration string to convert
 * @param options - Options
 * @returns English duration expression
 *
 * @example
 * ```typescript
 * minsec('1h30m');      // 'one hour thirty minutes'
 * minsec('5m30s');      // 'five minutes thirty seconds'
 * minsec('2h');         // 'two hours'
 * minsec('45m');        // 'forty-five minutes'
 * minsec('30s');        // 'thirty seconds'
 * minsec('1시간30분');  // 'one hour thirty minutes'
 * minsec('5분30초');    // 'five minutes thirty seconds'
 * minsec('90분');       // 'ninety minutes'
 * ```
 */
export function minsec(input: string, _options?: MinsecOptions): string {
  if (!input || input.trim() === '') {
    return input;
  }

  const trimmed = input.trim();
  const parts: string[] = [];

  // Pattern: NhNmNs or Nh or NhNm or NmNs or Nm or Ns
  const englishMatch = trimmed.match(
    /^(\d+)h(?:(\d+)m)?(?:(\d+)s)?$|^(\d+)m(?:(\d+)s)?$|^(\d+)s$/i
  );
  if (englishMatch) {
    const hours = englishMatch[1] ? parseInt(englishMatch[1], 10) : 0;
    const minsFromHours = englishMatch[2] ? parseInt(englishMatch[2], 10) : 0;
    const secsFromHours = englishMatch[3] ? parseInt(englishMatch[3], 10) : 0;
    const minsOnly = englishMatch[4] ? parseInt(englishMatch[4], 10) : 0;
    const secsFromMins = englishMatch[5] ? parseInt(englishMatch[5], 10) : 0;
    const secsOnly = englishMatch[6] ? parseInt(englishMatch[6], 10) : 0;

    const totalHours = hours;
    const totalMins = minsFromHours || minsOnly;
    const totalSecs = secsFromHours || secsFromMins || secsOnly;

    if (totalHours > 0) {
      const hourWord = totalHours === 1 ? 'hour' : 'hours';
      parts.push(numberToEnglish(totalHours) + ' ' + hourWord);
    }

    if (totalMins > 0) {
      const minWord = totalMins === 1 ? 'minute' : 'minutes';
      parts.push(numberToEnglish(totalMins) + ' ' + minWord);
    }

    if (totalSecs > 0) {
      const secWord = totalSecs === 1 ? 'second' : 'seconds';
      parts.push(numberToEnglish(totalSecs) + ' ' + secWord);
    }

    if (parts.length > 0) {
      return parts.join(' ');
    }
  }

  // Korean pattern: N시간N분N초 or N시간 or N시간N분 or N분N초 or N분 or N초
  const koreanMatch = trimmed.match(
    /^(\d+)시간(?:\s*(\d+)분)?(?:\s*(\d+)초)?$|^(\d+)분(?:\s*(\d+)초)?$|^(\d+)초$/
  );
  if (koreanMatch) {
    const hours = koreanMatch[1] ? parseInt(koreanMatch[1], 10) : 0;
    const minsFromHours = koreanMatch[2] ? parseInt(koreanMatch[2], 10) : 0;
    const secsFromHours = koreanMatch[3] ? parseInt(koreanMatch[3], 10) : 0;
    const minsOnly = koreanMatch[4] ? parseInt(koreanMatch[4], 10) : 0;
    const secsFromMins = koreanMatch[5] ? parseInt(koreanMatch[5], 10) : 0;
    const secsOnly = koreanMatch[6] ? parseInt(koreanMatch[6], 10) : 0;

    const totalHours = hours;
    const totalMins = minsFromHours || minsOnly;
    const totalSecs = secsFromHours || secsFromMins || secsOnly;

    if (totalHours > 0) {
      const hourWord = totalHours === 1 ? 'hour' : 'hours';
      parts.push(numberToEnglish(totalHours) + ' ' + hourWord);
    }

    if (totalMins > 0) {
      const minWord = totalMins === 1 ? 'minute' : 'minutes';
      parts.push(numberToEnglish(totalMins) + ' ' + minWord);
    }

    if (totalSecs > 0) {
      const secWord = totalSecs === 1 ? 'second' : 'seconds';
      parts.push(numberToEnglish(totalSecs) + ' ' + secWord);
    }

    if (parts.length > 0) {
      return parts.join(' ');
    }
  }

  // Abbreviation pattern: N hrs, N min, N sec (without space)
  const abbrevMatch = trimmed.match(
    /^(\d+)\s*hrs?(?:\s*(\d+)\s*min)?(?:\s*(\d+)\s*sec)?$|^(\d+)\s*min(?:\s*(\d+)\s*sec)?$|^(\d+)\s*sec$/i
  );
  if (abbrevMatch) {
    const hours = abbrevMatch[1] ? parseInt(abbrevMatch[1], 10) : 0;
    const minsFromHours = abbrevMatch[2] ? parseInt(abbrevMatch[2], 10) : 0;
    const secsFromHours = abbrevMatch[3] ? parseInt(abbrevMatch[3], 10) : 0;
    const minsOnly = abbrevMatch[4] ? parseInt(abbrevMatch[4], 10) : 0;
    const secsFromMins = abbrevMatch[5] ? parseInt(abbrevMatch[5], 10) : 0;
    const secsOnly = abbrevMatch[6] ? parseInt(abbrevMatch[6], 10) : 0;

    const totalHours = hours;
    const totalMins = minsFromHours || minsOnly;
    const totalSecs = secsFromHours || secsFromMins || secsOnly;

    if (totalHours > 0) {
      const hourWord = totalHours === 1 ? 'hour' : 'hours';
      parts.push(numberToEnglish(totalHours) + ' ' + hourWord);
    }

    if (totalMins > 0) {
      const minWord = totalMins === 1 ? 'minute' : 'minutes';
      parts.push(numberToEnglish(totalMins) + ' ' + minWord);
    }

    if (totalSecs > 0) {
      const secWord = totalSecs === 1 ? 'second' : 'seconds';
      parts.push(numberToEnglish(totalSecs) + ' ' + secWord);
    }

    if (parts.length > 0) {
      return parts.join(' ');
    }
  }

  // Full word pattern: N hours, N minutes, N seconds
  const fullWordMatch = trimmed.match(
    /^(\d+)\s*hours?(?:\s+(\d+)\s*minutes?)?(?:\s+(\d+)\s*seconds?)?$|^(\d+)\s*minutes?(?:\s+(\d+)\s*seconds?)?$|^(\d+)\s*seconds?$/i
  );
  if (fullWordMatch) {
    const hours = fullWordMatch[1] ? parseInt(fullWordMatch[1], 10) : 0;
    const minsFromHours = fullWordMatch[2] ? parseInt(fullWordMatch[2], 10) : 0;
    const secsFromHours = fullWordMatch[3] ? parseInt(fullWordMatch[3], 10) : 0;
    const minsOnly = fullWordMatch[4] ? parseInt(fullWordMatch[4], 10) : 0;
    const secsFromMins = fullWordMatch[5] ? parseInt(fullWordMatch[5], 10) : 0;
    const secsOnly = fullWordMatch[6] ? parseInt(fullWordMatch[6], 10) : 0;

    const totalHours = hours;
    const totalMins = minsFromHours || minsOnly;
    const totalSecs = secsFromHours || secsFromMins || secsOnly;

    if (totalHours > 0) {
      const hourWord = totalHours === 1 ? 'hour' : 'hours';
      parts.push(numberToEnglish(totalHours) + ' ' + hourWord);
    }

    if (totalMins > 0) {
      const minWord = totalMins === 1 ? 'minute' : 'minutes';
      parts.push(numberToEnglish(totalMins) + ' ' + minWord);
    }

    if (totalSecs > 0) {
      const secWord = totalSecs === 1 ? 'second' : 'seconds';
      parts.push(numberToEnglish(totalSecs) + ' ' + secWord);
    }

    if (parts.length > 0) {
      return parts.join(' ');
    }
  }

  return input;
}
