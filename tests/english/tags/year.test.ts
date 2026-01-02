import { year } from '../../../src/english/tags/year';

describe('year', () => {
  describe('basic operation', () => {
    it('converts 2024 to twenty twenty-four', () => {
      expect(year(2024)).toBe('twenty twenty-four');
    });

    it('converts 1994 to nineteen ninety-four', () => {
      expect(year(1994)).toBe('nineteen ninety-four');
    });

    it('converts 2000 to two thousand', () => {
      expect(year(2000)).toBe('two thousand');
    });

    it('converts 1900 to nineteen hundred', () => {
      expect(year(1900)).toBe('nineteen hundred');
    });

    it('converts 2010 to twenty ten', () => {
      expect(year(2010)).toBe('twenty ten');
    });

    it('converts 2001 to two thousand one', () => {
      expect(year(2001)).toBe('two thousand one');
    });

    it('converts 2009 to two thousand nine', () => {
      expect(year(2009)).toBe('two thousand nine');
    });
  });

  describe('string input', () => {
    it('converts "2024" to twenty twenty-four', () => {
      expect(year('2024')).toBe('twenty twenty-four');
    });

    it('handles whitespace in string', () => {
      expect(year('  2024  ')).toBe('twenty twenty-four');
    });

    it('handles thousand separator', () => {
      expect(year('2,024')).toBe('twenty twenty-four');
    });
  });

  describe('special years', () => {
    it('converts 1066 to ten sixty-six', () => {
      expect(year(1066)).toBe('ten sixty-six');
    });

    it('converts 1776 to seventeen seventy-six', () => {
      expect(year(1776)).toBe('seventeen seventy-six');
    });

    it('converts 1812 to eighteen twelve', () => {
      expect(year(1812)).toBe('eighteen twelve');
    });

    it('converts 1999 to nineteen ninety-nine', () => {
      expect(year(1999)).toBe('nineteen ninety-nine');
    });

    it('converts 2020 to twenty twenty', () => {
      expect(year(2020)).toBe('twenty twenty');
    });
  });

  describe('edge cases', () => {
    it('converts 0 to zero', () => {
      expect(year(0)).toBe('zero');
    });

    it('returns original for negative year', () => {
      expect(year(-2024)).toBe('-2024');
    });

    it('returns empty string for empty input', () => {
      expect(year('')).toBe('');
    });

    it('returns original for invalid format', () => {
      expect(year('abc')).toBe('abc');
    });

    it('truncates decimal year', () => {
      expect(year(2024.9)).toBe('twenty twenty-four');
      expect(year(2024.1)).toBe('twenty twenty-four');
    });

    it('returns Infinity for Infinity input', () => {
      expect(year(Infinity)).toBe('Infinity');
      expect(year(-Infinity)).toBe('-Infinity');
    });

    it('returns NaN for NaN input', () => {
      expect(year(NaN)).toBe('NaN');
    });

    it('returns original for spaces only', () => {
      expect(year('   ')).toBe('   ');
    });

    it('returns original for negative string', () => {
      expect(year('-2024')).toBe('-2024');
    });
  });

  describe('various years', () => {
    it('converts 100 to one hundred', () => {
      expect(year(100)).toBe('one hundred');
    });

    it('converts 1 to one', () => {
      expect(year(1)).toBe('one');
    });

    it('converts 10000 to ten thousand', () => {
      expect(year(10000)).toBe('ten thousand');
    });
  });
});
