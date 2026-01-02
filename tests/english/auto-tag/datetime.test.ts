import { autoTag, autoDatetime } from '../../../src/english/auto-tag';

describe('autoTag - datetime (datetime auto-tagging)', () => {
  describe('ISO 8601 format', () => {
    it('converts 2024-01-15T14:30', () => {
      const result = autoDatetime('2024-01-15T14:30');
      expect(result).toContain('January');
      expect(result).toContain('fifteen');
      expect(result).toContain('two thirty PM');
    });

    it('converts 2024-01-15T14:30:45', () => {
      const result = autoDatetime('2024-01-15T14:30:45');
      expect(result).toContain('January');
      expect(result).toContain('two thirty');
    });

    it('converts datetime with timezone', () => {
      const result = autoDatetime('2024-01-15T14:30:00Z');
      expect(result).toContain('January');
      expect(result).toContain('two thirty PM');
    });
  });

  describe('space-separated format', () => {
    it('converts 2024-01-15 14:30', () => {
      const result = autoDatetime('2024-01-15 14:30');
      expect(result).toContain('January');
      expect(result).toContain('two thirty PM');
    });
  });

  describe('datetime in context', () => {
    it('converts datetime in sentences', () => {
      const result = autoDatetime('Meeting scheduled for 2024-01-15T14:30');
      expect(result).toContain('January');
      expect(result).toContain('two thirty PM');
    });
  });

  describe('priority over date and time', () => {
    it('datetime is processed as a unit, not date + time separately', () => {
      // datetime should take priority over date + time
      const result = autoTag('2024-01-15T14:30');

      // Should be processed as datetime all at once
      expect(result).toContain('January');
      expect(result).toContain('two thirty PM');
    });
  });
});
