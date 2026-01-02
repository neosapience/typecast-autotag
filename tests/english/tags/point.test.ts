import { point } from '../../../src/english/tags/point';

describe('point', () => {
  describe('basic operation', () => {
    it('converts 95 to ninety-five points', () => {
      expect(point(95)).toBe('ninety-five points');
    });

    it('converts 100 to one hundred points', () => {
      expect(point(100)).toBe('one hundred points');
    });

    it('converts 0 to zero points', () => {
      expect(point(0)).toBe('zero points');
    });

    it('converts 50 to fifty points', () => {
      expect(point(50)).toBe('fifty points');
    });

    it('converts 1 to one point (singular)', () => {
      expect(point(1)).toBe('one point');
    });
  });

  describe('decimal handling', () => {
    it('converts 4.5 to four point five points', () => {
      expect(point(4.5)).toBe('four point five points');
    });

    it('converts 3.14 to three point one four points', () => {
      expect(point(3.14)).toBe('three point one four points');
    });

    it('converts 0.5 to zero point five points', () => {
      expect(point(0.5)).toBe('zero point five points');
    });

    it('converts 99.99 to ninety-nine point nine nine points', () => {
      expect(point(99.99)).toBe('ninety-nine point nine nine points');
    });
  });

  describe('negative handling', () => {
    it('converts -5 to minus five points', () => {
      expect(point(-5)).toBe('minus five points');
    });

    it('converts -10.5 to minus ten point five points', () => {
      expect(point(-10.5)).toBe('minus ten point five points');
    });
  });

  describe('string input', () => {
    it('converts "85 points" to eighty-five points', () => {
      expect(point('85 points')).toBe('eighty-five points');
    });

    it('converts "100" to one hundred points', () => {
      expect(point('100')).toBe('one hundred points');
    });

    it('converts "4.5 points" correctly', () => {
      expect(point('4.5 points')).toBe('four point five points');
    });

    it('handles thousand separator', () => {
      expect(point('1,000 points')).toBe('one thousand points');
    });

    it('handles whitespace in string', () => {
      expect(point('  95 points  ')).toBe('ninety-five points');
    });
  });

  describe('options - unit', () => {
    it('allows setting unit to grade', () => {
      expect(point(90, { unit: 'grade' })).toBe('ninety grade');
    });

    it('allows setting unit to percent', () => {
      expect(point(85, { unit: 'percent' })).toBe('eighty-five percent');
    });
  });

  describe('edge cases', () => {
    it('returns empty string for empty input', () => {
      expect(point('')).toBe('');
    });

    it('returns NaN for NaN input', () => {
      expect(point(NaN)).toBe('NaN');
    });

    it('returns original for spaces only', () => {
      expect(point('   ')).toBe('   ');
    });
  });

  describe('Infinity handling', () => {
    it('returns Infinity string', () => {
      expect(point(Infinity)).toBe('Infinity');
    });

    it('returns -Infinity string', () => {
      expect(point(-Infinity)).toBe('-Infinity');
    });
  });

  describe('unsupported string formats', () => {
    it('returns original for negative string', () => {
      expect(point('-5')).toBe('-5');
    });

    it('returns original for negative string with unit', () => {
      expect(point('-100 points')).toBe('-100 points');
    });

    it('returns original for + sign string', () => {
      expect(point('+5')).toBe('+5');
    });

    it('returns original for . only string', () => {
      expect(point('.5')).toBe('.5');
    });

    it('handles trailing dot', () => {
      expect(point('1.')).toBe('one .');
    });

    it('handles invalid format like "1.2.3"', () => {
      expect(point('1.2.3')).toBe('one point two .3');
    });
  });

  describe('large numbers', () => {
    it('converts one billion points', () => {
      expect(point(1000000000)).toBe('one billion points');
    });

    it('converts one million points', () => {
      expect(point(1000000)).toBe('one million points');
    });
  });

  describe('leading zeros', () => {
    it('converts "007" to seven points', () => {
      expect(point('007')).toBe('seven points');
    });

    it('converts "00" to zero points', () => {
      expect(point('00')).toBe('zero points');
    });
  });

  describe('special cases', () => {
    it('returns original for "-" only', () => {
      expect(point('-')).toBe('-');
    });

    it('returns original for "+" only', () => {
      expect(point('+')).toBe('+');
    });

    it('returns original for "." only', () => {
      expect(point('.')).toBe('.');
    });

    it('returns original for non-numeric string', () => {
      expect(point('abc')).toBe('abc');
    });

    it('returns original for text before number', () => {
      expect(point('score95')).toBe('score95');
    });
  });

  describe('credits handling', () => {
    it('converts "150000 credits" correctly', () => {
      expect(point('150000 credits')).toBe('one hundred and fifty thousand credits');
    });

    it('converts "100 credits" correctly', () => {
      expect(point('100 credits')).toBe('one hundred credits');
    });

    it('converts "1000 credits" correctly', () => {
      expect(point('1000 credits')).toBe('one thousand credits');
    });

    it('handles thousand separator in credits', () => {
      expect(point('1,000,000 credits')).toBe('one million credits');
    });

    it('handles decimal credits', () => {
      expect(point('10.5 credits')).toBe('ten point five credits');
    });
  });
});
