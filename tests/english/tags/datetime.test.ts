import { datetime } from '../../../src/english/tags/datetime';

describe('datetime', () => {
  describe('ISO 8601 format', () => {
    it('converts 2024-01-15T14:30', () => {
      expect(datetime('2024-01-15T14:30')).toBe(
        'January fifteenth, twenty twenty-four at two thirty PM'
      );
    });

    it('converts 2024-06-10T09:05', () => {
      expect(datetime('2024-06-10T09:05')).toBe(
        'June tenth, twenty twenty-four at nine oh five AM'
      );
    });

    it('converts 2024-10-01T12:00', () => {
      expect(datetime('2024-10-01T12:00')).toBe('October first, twenty twenty-four at twelve PM');
    });

    it('handles seconds included', () => {
      expect(datetime('2024-01-15T14:30:45')).toBe(
        'January fifteenth, twenty twenty-four at two thirty and forty-five seconds PM'
      );
    });
  });

  describe('space-separated format', () => {
    it('converts 2024-01-15 14:30', () => {
      expect(datetime('2024-01-15 14:30')).toBe(
        'January fifteenth, twenty twenty-four at two thirty PM'
      );
    });

    it('converts 2024/06/10 09:05:30', () => {
      expect(datetime('2024/06/10 09:05:30')).toBe(
        'June tenth, twenty twenty-four at nine oh five and thirty seconds AM'
      );
    });

    it('converts 2024.12.25 18:00', () => {
      expect(datetime('2024.12.25 18:00')).toBe(
        'December twenty-fifth, twenty twenty-four at six PM'
      );
    });
  });

  describe('24-hour option', () => {
    it('converts to 24-hour format', () => {
      expect(datetime('2024-01-15T14:30', { use24Hour: true })).toBe(
        'January fifteenth, twenty twenty-four at fourteen thirty'
      );
    });

    it('converts 23:00 in 24-hour format', () => {
      expect(datetime('2024-01-15T23:00', { use24Hour: true })).toBe(
        'January fifteenth, twenty twenty-four at twenty-three hundred'
      );
    });
  });

  describe('edge cases', () => {
    it('returns empty string for empty input', () => {
      expect(datetime('')).toBe('');
    });

    it('returns original for spaces only', () => {
      expect(datetime('   ')).toBe('   ');
    });

    it('returns original for invalid format', () => {
      expect(datetime('abc')).toBe('abc');
    });

    it('returns original for date only', () => {
      expect(datetime('2024-01-15')).toBe('2024-01-15');
    });

    it('returns original for time only', () => {
      expect(datetime('14:30')).toBe('14:30');
    });
  });

  describe('separator option', () => {
    it('default separator is at', () => {
      const result = datetime('2024-01-15T14:30');
      expect(result).toBe('January fifteenth, twenty twenty-four at two thirty PM');
    });

    // Note: separator option may not be fully implemented
    it('uses default separator regardless of option', () => {
      // Current implementation does not support custom separator
      expect(datetime('2024-01-15T14:30', { separator: ', ' })).toBe(
        'January fifteenth, twenty twenty-four at two thirty PM'
      );
    });
  });

  describe('midnight and noon', () => {
    it('converts midnight (00:00)', () => {
      expect(datetime('2024-01-15T00:00')).toBe(
        'January fifteenth, twenty twenty-four at twelve AM'
      );
    });

    it('converts noon (12:00)', () => {
      expect(datetime('2024-01-15T12:00')).toBe(
        'January fifteenth, twenty twenty-four at twelve PM'
      );
    });

    it('converts midnight in 24-hour format', () => {
      expect(datetime('2024-01-15T00:00', { use24Hour: true })).toBe(
        'January fifteenth, twenty twenty-four at oh zero hundred'
      );
    });
  });

  describe('boundary value tests', () => {
    it('converts 23:59:59', () => {
      expect(datetime('2024-12-31T23:59:59')).toBe(
        'December thirty-first, twenty twenty-four at eleven fifty-nine and fifty-nine seconds PM'
      );
    });

    it('omits seconds when 0', () => {
      const result = datetime('2024-01-15T14:30:00');
      expect(result).not.toContain('seconds');
      expect(result).toBe('January fifteenth, twenty twenty-four at two thirty PM');
    });

    it('handles 0 minutes and 0 seconds', () => {
      expect(datetime('2024-01-15T14:00:00')).toBe(
        'January fifteenth, twenty twenty-four at two PM'
      );
    });
  });

  describe('invalid input', () => {
    it('keeps an invalid time unchanged', () => {
      expect(datetime('2024-01-15T25:00')).toBe('2024-01-15T25:00');
    });

    it('keeps invalid minutes unchanged', () => {
      expect(datetime('2024-01-15T14:60')).toBe('2024-01-15T14:60');
    });

    it('keeps invalid seconds unchanged', () => {
      expect(datetime('2024-01-15T14:30:60')).toBe('2024-01-15T14:30:60');
    });

    it('keeps an invalid calendar date unchanged', () => {
      expect(datetime('2024-02-30T14:30')).toBe('2024-02-30T14:30');
    });
  });

  describe('ISO 8601 extended format', () => {
    it('handles milliseconds', () => {
      expect(datetime('2024-01-15T14:30:45.123')).toBe(
        'January fifteenth, twenty twenty-four at two thirty and forty-five seconds PM'
      );
    });

    it('handles timezone Z', () => {
      expect(datetime('2024-01-15T14:30:00Z')).toBe(
        'January fifteenth, twenty twenty-four at two thirty PM'
      );
    });

    it('handles timezone +09:00', () => {
      expect(datetime('2024-01-15T14:30:00+09:00')).toBe(
        'January fifteenth, twenty twenty-four at two thirty PM'
      );
    });

    it('handles timezone -05:00', () => {
      expect(datetime('2024-06-10T09:05:30-05:00')).toBe(
        'June tenth, twenty twenty-four at nine oh five and thirty seconds AM'
      );
    });

    it('handles milliseconds and timezone together', () => {
      expect(datetime('2024-01-15T14:30:45.123Z')).toBe(
        'January fifteenth, twenty twenty-four at two thirty and forty-five seconds PM'
      );
    });
  });
});
