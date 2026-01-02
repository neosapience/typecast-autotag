import { date as dateTag } from './date';
import { time as timeTag } from './time';

/**
 * Options for datetime function
 */
export interface DatetimeOptions {
  /**
   * Whether to use 24-hour format for time
   * @default false
   */
  use24Hour?: boolean;
}

/**
 * Convert datetime to English words
 *
 * @param input - Datetime string to convert
 * @param options - Options (24-hour format)
 * @returns English datetime expression
 *
 * @example
 * ```typescript
 * datetime('2024-01-15T14:30:00'); // 'January fifteenth, twenty twenty-four at two thirty PM'
 * datetime('2024-01-15 14:30');     // 'January fifteenth, twenty twenty-four at two thirty PM'
 * datetime('2024-01-15T09:05', { use24Hour: true }); // 'January fifteenth, twenty twenty-four at oh nine oh five'
 * ```
 */
export function datetime(input: string, options?: DatetimeOptions): string {
  if (!input || input.trim() === '') {
    return input;
  }

  const trimmed = input.trim();

  // ISO 8601 format: YYYY-MM-DDTHH:MM(:SS)(.mmm)?(Z|±HH:MM)?
  const isoMatch = trimmed.match(
    /^(\d{4}-\d{2}-\d{2})[T\s](\d{2}:\d{2}(?::\d{2})?)(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?$/
  );

  if (isoMatch) {
    const datePart = isoMatch[1] ?? '';
    const timePart = isoMatch[2] ?? '';

    const dateStr = dateTag(datePart);
    const timeStr = timeTag(timePart, { use24Hour: options?.use24Hour });

    return dateStr + ' at ' + timeStr;
  }

  // Space-separated format: YYYY-MM-DD HH:MM(:SS)
  const spaceMatch = trimmed.match(
    /^(\d{4}[-/.]\d{1,2}[-/.]\d{1,2})\s+(\d{1,2}:\d{2}(?::\d{2})?)$/
  );

  if (spaceMatch) {
    const datePart = spaceMatch[1] ?? '';
    const timePart = spaceMatch[2] ?? '';

    const dateStr = dateTag(datePart);
    const timeStr = timeTag(timePart, { use24Hour: options?.use24Hour });

    return dateStr + ' at ' + timeStr;
  }

  return input;
}
