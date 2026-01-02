import { day } from '../../../src/english/tags/day';

describe('day', () => {
  describe('basic operation', () => {
    it('converts 25 to twenty-fifth', () => {
      expect(day(25)).toBe('twenty-fifth');
    });

    it('converts 1 to first', () => {
      expect(day(1)).toBe('first');
    });

    it('converts 15 to fifteenth', () => {
      expect(day(15)).toBe('fifteenth');
    });

    it('converts 31 to thirty-first', () => {
      expect(day(31)).toBe('thirty-first');
    });

    it('converts 10 to tenth', () => {
      expect(day(10)).toBe('tenth');
    });

    it('converts 2 to second', () => {
      expect(day(2)).toBe('second');
    });

    it('converts 3 to third', () => {
      expect(day(3)).toBe('third');
    });
  });

  describe('string input (number only)', () => {
    it('handles string numbers', () => {
      expect(day('25')).toBe('twenty-fifth');
    });

    it('converts "1" to first', () => {
      expect(day('1')).toBe('first');
    });
  });

  describe('ordinal suffix input', () => {
    it('converts "25th" to twenty-fifth', () => {
      expect(day('25th')).toBe('twenty-fifth');
    });

    it('converts "1st" to first', () => {
      expect(day('1st')).toBe('first');
    });

    it('converts "2nd" to second', () => {
      expect(day('2nd')).toBe('second');
    });

    it('converts "3rd" to third', () => {
      expect(day('3rd')).toBe('third');
    });

    it('converts "100th" to one hundredth', () => {
      expect(day('100th')).toBe('one hundredth');
    });
  });

  describe('duration/day count expressions (over 31 days)', () => {
    it('converts 365 to three hundred sixty-fifth', () => {
      expect(day(365)).toBe('three hundred sixty-fifth');
    });

    it('converts 100 to one hundredth', () => {
      expect(day(100)).toBe('one hundredth');
    });

    it('converts 1000 to one thousandth', () => {
      expect(day(1000)).toBe('one thousandth');
    });

    it('converts "365th" string correctly', () => {
      expect(day('365th')).toBe('three hundred sixty-fifth');
    });
  });

  describe('0 day handling', () => {
    it('converts 0 to zero', () => {
      // Zero is not ordinal in the current implementation
      expect(day(0)).toBe('zero');
    });

    it('converts "0th" to zero', () => {
      expect(day('0th')).toBe('zero');
    });
  });

  describe('D-day format', () => {
    it('converts "D-3418" with D minus format', () => {
      expect(day('D-3418')).toBe('D minus three thousand four hundred and eighteen');
    });

    it('converts "D-1" with D minus format', () => {
      expect(day('D-1')).toBe('D minus one');
    });

    it('converts "D-100" with D minus format', () => {
      expect(day('D-100')).toBe('D minus one hundred');
    });

    it('converts "D+100" with D plus format', () => {
      expect(day('D+100')).toBe('D plus one hundred');
    });

    it('converts "D-0" with D minus format', () => {
      expect(day('D-0')).toBe('D minus zero');
    });

    it('converts "D+0" with D plus format', () => {
      expect(day('D+0')).toBe('D plus zero');
    });

    it('handles lowercase "d-100"', () => {
      expect(day('d-100')).toBe('D minus one hundred');
    });

    it('handles space in "D - 100"', () => {
      expect(day('D - 100')).toBe('D minus one hundred');
    });

    it('handles space in "D + 50"', () => {
      expect(day('D + 50')).toBe('D plus fifty');
    });

    it('converts "D-Day" without number to D-day', () => {
      expect(day('D-Day')).toBe('D-day');
    });

    it('handles lowercase "D-day"', () => {
      expect(day('D-day')).toBe('D-day');
    });

    it('handles all lowercase "d-day"', () => {
      expect(day('d-day')).toBe('D-day');
    });
  });

  describe('thousand separator', () => {
    it('converts "1,000" to one thousandth', () => {
      expect(day('1,000')).toBe('one thousandth');
    });

    it('converts "10,000" to ten thousandth', () => {
      expect(day('10,000')).toBe('ten thousandth');
    });

    it('converts "1,234,567" correctly', () => {
      expect(day('1,234,567')).toBe(
        'one million two hundred and thirty-four thousand five hundred sixty-seventh'
      );
    });
  });

  describe('leading zeros', () => {
    it('converts "01" to first', () => {
      expect(day('01')).toBe('first');
    });

    it('converts "007" to seventh', () => {
      expect(day('007')).toBe('seventh');
    });

    it('converts "00" to zero', () => {
      expect(day('00')).toBe('zero');
    });
  });

  describe('edge cases', () => {
    it('returns original for negative number', () => {
      expect(day(-1)).toBe('-1');
    });

    it('returns original for invalid string', () => {
      expect(day('abc')).toBe('abc');
    });

    it('returns empty string for empty input', () => {
      expect(day('')).toBe('');
    });

    it('returns original for mixed invalid string', () => {
      expect(day('abc123')).toBe('abc123');
    });
  });
});
