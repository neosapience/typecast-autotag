import { digits } from '../../../src/english/tags/digits';

describe('digits', () => {
  describe('basic operation', () => {
    it('converts numbers to individual digits', () => {
      expect(digits(123456)).toBe('one two three four five six');
    });

    it('handles string numbers', () => {
      expect(digits('789')).toBe('seven eight nine');
    });

    it('handles 0', () => {
      expect(digits('0')).toBe('zero');
    });

    it('handles number type 0', () => {
      expect(digits(0)).toBe('zero');
    });

    it('handles all digits', () => {
      expect(digits('1234567890')).toBe('one two three four five six seven eight nine zero');
    });

    it('handles leading zeros in string', () => {
      expect(digits('007')).toBe('zero zero seven');
    });
  });

  describe('custom separator', () => {
    it('allows custom separator', () => {
      expect(digits('123', ', ')).toBe('one, two, three');
    });

    it('allows empty separator', () => {
      expect(digits('123', '')).toBe('onetwothree');
    });
  });

  describe('non-digit character handling', () => {
    it('preserves minus sign', () => {
      expect(digits('-123')).toBe('- one two three');
    });

    it('converts decimal point to "point"', () => {
      expect(digits('1.5')).toBe('one point five');
    });

    it('handles mixed non-digit characters', () => {
      expect(digits('12a34')).toBe('one two a three four');
    });

    it('handles spaces in string', () => {
      expect(digits('1 2 3')).toBe('one   two   three');
    });
  });

  describe('edge cases', () => {
    it('returns empty string for empty input', () => {
      expect(digits('')).toBe('');
    });

    it('converts single digit', () => {
      expect(digits('5')).toBe('five');
    });
  });

  describe('real-world use cases', () => {
    it('handles phone number length digits', () => {
      expect(digits('01012345678')).toBe('zero one zero one two three four five six seven eight');
    });

    it('handles ID number length digits', () => {
      expect(digits('940101')).toBe('nine four zero one zero one');
    });
  });

  describe('options object support', () => {
    it('allows separator via options object', () => {
      expect(digits('123', { separator: '-' })).toBe('one-two-three');
    });

    it('allows empty separator via options object', () => {
      expect(digits('123', { separator: '' })).toBe('onetwothree');
    });
  });
});
