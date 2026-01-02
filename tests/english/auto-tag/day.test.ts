import { autoTag, autoDay } from '../../../src/english/auto-tag';

describe('autoTag - day (day auto-tagging)', () => {
  describe('D-day format', () => {
    it('converts D-Day', () => {
      // D-day format is recognized
      const result = autoDay('D-Day');
      expect(result.toLowerCase()).toContain('d-day');
    });

    it('converts D-N', () => {
      // D-10 and D+5 patterns
      const result1 = autoDay('D-10');
      const result2 = autoDay('D+5');
      expect(result1).toContain('ten');
      expect(result2).toContain('five');
    });
  });

  describe('day N format', () => {
    it('converts day with number', () => {
      // "day N" pattern needs proper context
      const result = autoDay('day 1st');
      expect(result).toContain('first');
    });
  });

  describe('False Positive prevention', () => {
    it('does not convert standalone numbers', () => {
      expect(autoTag('number 15', { enabledTags: ['day'] })).toBe('number 15');
    });
  });
});
