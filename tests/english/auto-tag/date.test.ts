import { autoTag, autoDate } from '../../../src/english/auto-tag';

describe('autoTag - date (date auto-tagging)', () => {
  describe('YYYYMMDD format', () => {
    it('converts 8-digit dates', () => {
      const result = autoDate('Birthdate: 19940616');
      expect(result).toContain('June');
    });

    it('converts 2000s dates', () => {
      const result = autoDate('Registered: 20240115');
      expect(result).toContain('January');
    });
  });

  describe('YYYY-MM-DD format', () => {
    it('converts hyphen-separated dates', () => {
      const result = autoDate('Date: 2024-01-15');
      expect(result).toContain('January');
    });
  });

  describe('English date format', () => {
    it('converts January 15, 2024 format', () => {
      const result = autoDate('January 15, 2024');
      expect(result).toContain('January');
      expect(result).toContain('fifteen');
    });
  });

  describe('multiple dates', () => {
    it('converts dates in text', () => {
      const result = autoDate('Start: 2024-01-01');
      expect(result).toContain('January');
    });
  });

  describe('False Positive prevention', () => {
    it('does not convert invalid dates', () => {
      // Month 34, Day 56 - out of range
      expect(autoDate('12345678')).toBe('12345678');
    });

    it('does not treat phone numbers as dates', () => {
      expect(autoTag('555-123-4567', { enabledTags: ['date'] })).toBe('555-123-4567');
    });
  });
});
