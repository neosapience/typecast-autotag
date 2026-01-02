import { name } from '../../../src/english/tags/name';

describe('name', () => {
  describe('basic operation', () => {
    it('returns name as-is', () => {
      expect(name('John')).toBe('John');
    });

    it('handles two character name', () => {
      expect(name('Jo')).toBe('Jo');
    });

    it('handles long name', () => {
      expect(name('Elizabeth')).toBe('Elizabeth');
    });
  });

  describe('custom separator', () => {
    // Custom separator is not implemented - returns as-is
    it('returns name as-is regardless of separator', () => {
      expect(name('John', ', ')).toBe('John');
    });

    it('returns name as-is with empty separator', () => {
      expect(name('John', '')).toBe('John');
    });
  });

  describe('whitespace handling', () => {
    it('trims leading and trailing spaces', () => {
      expect(name(' John ')).toBe('John');
    });

    it('preserves internal spaces', () => {
      expect(name('J ohn')).toBe('J ohn');
    });

    it('returns empty string for spaces only', () => {
      expect(name('   ')).toBe('');
    });
  });

  describe('mixed content handling', () => {
    it('handles numbers in name (with space)', () => {
      expect(name('John3')).toBe('John 3');
    });

    it('handles special characters (with space)', () => {
      expect(name('John!')).toBe('John !');
    });
  });

  describe('edge cases', () => {
    it('returns empty string for empty input', () => {
      expect(name('')).toBe('');
    });

    it('returns single character as is', () => {
      expect(name('A')).toBe('A');
    });

    it('returns single number as is', () => {
      expect(name('1')).toBe('1');
    });
  });
});
