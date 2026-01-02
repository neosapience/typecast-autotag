import { order } from '../../../src/english/tags/order';

describe('order', () => {
  describe('basic operation - ordinal expression', () => {
    it('converts 1 to first', () => {
      expect(order(1)).toBe('first');
    });

    it('converts 2 to second', () => {
      expect(order(2)).toBe('second');
    });

    it('converts 3 to third', () => {
      expect(order(3)).toBe('third');
    });

    it('converts 4 to fourth', () => {
      expect(order(4)).toBe('fourth');
    });

    it('converts 5 to fifth', () => {
      expect(order(5)).toBe('fifth');
    });

    it('converts 6 to sixth', () => {
      expect(order(6)).toBe('sixth');
    });

    it('converts 7 to seventh', () => {
      expect(order(7)).toBe('seventh');
    });

    it('converts 8 to eighth', () => {
      expect(order(8)).toBe('eighth');
    });

    it('converts 9 to ninth', () => {
      expect(order(9)).toBe('ninth');
    });

    it('converts 10 to tenth', () => {
      expect(order(10)).toBe('tenth');
    });
  });

  describe('teens and tens', () => {
    it('converts 11 to eleventh', () => {
      expect(order(11)).toBe('eleventh');
    });

    it('converts 12 to twelfth', () => {
      expect(order(12)).toBe('twelfth');
    });

    it('converts 13 to thirteenth', () => {
      expect(order(13)).toBe('thirteenth');
    });

    it('converts 15 to fifteenth', () => {
      expect(order(15)).toBe('fifteenth');
    });

    it('converts 20 to twentieth', () => {
      expect(order(20)).toBe('twentieth');
    });

    it('converts 21 to twenty-first', () => {
      expect(order(21)).toBe('twenty-first');
    });

    it('converts 22 to twenty-second', () => {
      expect(order(22)).toBe('twenty-second');
    });

    it('converts 23 to twenty-third', () => {
      expect(order(23)).toBe('twenty-third');
    });

    it('converts 30 to thirtieth', () => {
      expect(order(30)).toBe('thirtieth');
    });

    it('converts 31 to thirty-first', () => {
      expect(order(31)).toBe('thirty-first');
    });
  });

  describe('larger ordinals', () => {
    it('converts 40 to fortieth', () => {
      expect(order(40)).toBe('fortieth');
    });

    it('converts 50 to fiftieth', () => {
      expect(order(50)).toBe('fiftieth');
    });

    it('converts 99 to ninety-ninth', () => {
      expect(order(99)).toBe('ninety-ninth');
    });

    it('converts 100 to one hundredth', () => {
      expect(order(100)).toBe('one hundredth');
    });

    it('converts 101 to one hundred first', () => {
      expect(order(101)).toBe('one hundred first');
    });

    it('converts 1000 to one thousandth', () => {
      expect(order(1000)).toBe('one thousandth');
    });
  });

  describe('edge cases', () => {
    it('converts 0 to zeroth', () => {
      expect(order(0)).toBe('zeroth');
    });

    it('returns empty string for empty input', () => {
      expect(order('')).toBe('');
    });
  });

  describe('string input', () => {
    it('converts "1st" to first', () => {
      expect(order('1st')).toBe('first');
    });

    it('converts "2nd" to second', () => {
      expect(order('2nd')).toBe('second');
    });

    it('converts "3rd" to third', () => {
      expect(order('3rd')).toBe('third');
    });

    it('converts "4th" to fourth', () => {
      expect(order('4th')).toBe('fourth');
    });

    it('handles thousand separator', () => {
      expect(order('1,000th')).toBe('one thousandth');
    });

    it('converts "0th" to zeroth', () => {
      expect(order('0th')).toBe('zeroth');
    });

    it('converts number only string', () => {
      expect(order('123')).toBe('one hundred twenty-third');
    });

    it('returns original for non-numeric string', () => {
      expect(order('abc')).toBe('abc');
    });
  });
});
