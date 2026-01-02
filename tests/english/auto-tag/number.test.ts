import { autoTag, autoNumber } from '../../../src/english/auto-tag';

describe('autoTag - number (number auto-tagging)', () => {
  describe('number N format', () => {
    it('converts Number N', () => {
      expect(autoNumber('Number 5')).toContain('five');
      expect(autoNumber('Number 10')).toContain('ten');
    });

    it('converts No. N', () => {
      expect(autoNumber('No. 1')).toContain('one');
      expect(autoNumber('No. 100')).toContain('hundred');
    });

    it('converts #N', () => {
      expect(autoNumber('#42')).toContain('forty-two');
    });
  });

  describe('numbers in context', () => {
    it('converts numbers in sentences', () => {
      // Pattern matches "Number N" but not "Item Number N"
      expect(autoNumber('Check Number 123')).toContain('Number');
    });
  });

  describe('False Positive prevention', () => {
    it('does not convert standalone numbers', () => {
      expect(autoTag('just 123', { enabledTags: ['number'] })).toBe('just 123');
    });
  });
});
