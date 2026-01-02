import { numberToEnglish } from '../utils/number-to-english';

/**
 * Options for time function
 */
export interface TimeOptions {
  /**
   * Whether to use 24-hour format
   * false: 12-hour format (AM/PM)
   * true: 24-hour format
   * @default false
   */
  use24Hour?: boolean;

  /**
   * Whether to include seconds
   * @default false (auto-included if input has seconds)
   */
  includeSeconds?: boolean;
}

interface ParsedTime {
  hours: number;
  minutes: number;
  seconds?: number;
}

/**
 * Parse various time string formats
 */
function parseTime(str: string): ParsedTime | null {
  // HH:MM:SS or HH:MM format
  const colonMatch = str.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (colonMatch) {
    return {
      hours: parseInt(colonMatch[1] ?? '0', 10),
      minutes: parseInt(colonMatch[2] ?? '0', 10),
      seconds: colonMatch[3] ? parseInt(colonMatch[3], 10) : undefined,
    };
  }

  // Korean format: "14시30분", "오후 2시 30분", "3시"
  const koreanMatch = str.match(
    /^(오전|오후)?\s*(\d{1,2})시\s*(?:(\d{1,2})분)?\s*(?:(\d{1,2})초)?$/
  );
  if (koreanMatch) {
    let hours = parseInt(koreanMatch[2] ?? '0', 10);
    const ampm = koreanMatch[1];

    if (ampm === '오후' && hours < 12) {
      hours += 12;
    } else if (ampm === '오전' && hours === 12) {
      hours = 0;
    }

    return {
      hours,
      minutes: koreanMatch[3] ? parseInt(koreanMatch[3], 10) : 0,
      seconds: koreanMatch[4] ? parseInt(koreanMatch[4], 10) : undefined,
    };
  }

  // English format: "2:30 PM", "14:30", "3 o'clock"
  const englishMatch = str.match(/^(\d{1,2})(?::(\d{2}))?(?::(\d{2}))?\s*([AaPp][Mm])?$/);
  if (englishMatch) {
    let hours = parseInt(englishMatch[1] ?? '0', 10);
    const ampm = englishMatch[4]?.toLowerCase();

    if (ampm === 'pm' && hours < 12) {
      hours += 12;
    } else if (ampm === 'am' && hours === 12) {
      hours = 0;
    }

    return {
      hours,
      minutes: englishMatch[2] ? parseInt(englishMatch[2], 10) : 0,
      seconds: englishMatch[3] ? parseInt(englishMatch[3], 10) : undefined,
    };
  }

  // HHMM format (4 digits)
  if (/^\d{4}$/.test(str)) {
    return {
      hours: parseInt(str.substring(0, 2), 10),
      minutes: parseInt(str.substring(2, 4), 10),
    };
  }

  // HHMMSS format (6 digits)
  if (/^\d{6}$/.test(str)) {
    return {
      hours: parseInt(str.substring(0, 2), 10),
      minutes: parseInt(str.substring(2, 4), 10),
      seconds: parseInt(str.substring(4, 6), 10),
    };
  }

  return null;
}

/**
 * Convert time to English words
 *
 * English time reading conventions:
 * - 12-hour format: "two thirty PM", "nine oh five AM"
 * - 24-hour format: "fourteen thirty", "oh nine oh five"
 *
 * @param input - Time string to convert
 * @param options - Options (24-hour format, include seconds)
 * @returns English time expression
 *
 * @example
 * ```typescript
 * time('14:30');       // 'two thirty PM'
 * time('09:05');       // 'nine oh five AM'
 * time('12:00');       // 'twelve PM'
 * time('00:00');       // 'twelve AM'
 * time('00:00', { use24Hour: true }); // 'zero hundred'
 * time('14:30', { use24Hour: true }); // 'fourteen thirty'
 * time('14:30:45');    // 'two thirty and forty-five seconds PM'
 * ```
 */
export function time(input: string, options?: TimeOptions): string {
  if (!input || input.trim() === '') {
    return input;
  }

  const trimmed = input.trim();
  const parsed = parseTime(trimmed);

  if (!parsed) {
    return input;
  }

  const { hours, minutes, seconds } = parsed;
  const use24Hour = options?.use24Hour ?? false;

  // Validation
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return input;
  }
  if (seconds !== undefined && (seconds < 0 || seconds > 59)) {
    return input;
  }

  const parts: string[] = [];
  const includeSeconds = options?.includeSeconds ?? false;
  const hasSeconds = seconds !== undefined;

  if (use24Hour) {
    // 24-hour format: "fourteen thirty", "oh nine oh five"
    const hourStr = hours < 10 ? 'oh ' + numberToEnglish(hours) : numberToEnglish(hours);

    if (minutes === 0 && !hasSeconds) {
      parts.push(hourStr + ' hundred');
    } else {
      const minStr = minutes < 10 ? 'oh ' + numberToEnglish(minutes) : numberToEnglish(minutes);
      parts.push(hourStr + ' ' + minStr);
    }

    // Seconds
    if (hasSeconds && seconds > 0) {
      parts.push('and ' + numberToEnglish(seconds) + (seconds === 1 ? ' second' : ' seconds'));
    } else if (includeSeconds) {
      parts.push('and zero seconds');
    }
  } else {
    // 12-hour format
    const isPM = hours >= 12;
    const ampm = isPM ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;

    const hourStr = numberToEnglish(hour12);

    if (minutes === 0 && !hasSeconds && !includeSeconds) {
      // Just the hour: "twelve PM"
      parts.push(hourStr + ' ' + ampm);
    } else {
      // Hour and minutes: "two thirty"
      const minStr = minutes < 10 ? 'oh ' + numberToEnglish(minutes) : numberToEnglish(minutes);

      if (minutes === 0) {
        parts.push(hourStr);
      } else {
        parts.push(hourStr + ' ' + minStr);
      }

      // Seconds
      if (hasSeconds && seconds > 0) {
        parts.push('and ' + numberToEnglish(seconds) + (seconds === 1 ? ' second' : ' seconds'));
      } else if (includeSeconds) {
        parts.push('and zero seconds');
      }

      parts.push(ampm);
    }
  }

  return parts.join(' ');
}
