import { month } from '../../../src/english/tags/month';

describe('month', () => {
  describe('1-12 month full test', () => {
    const expected: [number, string][] = [
      [1, 'January'],
      [2, 'February'],
      [3, 'March'],
      [4, 'April'],
      [5, 'May'],
      [6, 'June'],
      [7, 'July'],
      [8, 'August'],
      [9, 'September'],
      [10, 'October'],
      [11, 'November'],
      [12, 'December'],
    ];

    expected.forEach(([num, name]) => {
      it(`converts ${num} to ${name}`, () => {
        expect(month(num)).toBe(name);
      });
    });
  });

  describe('string input', () => {
    it('handles string numbers', () => {
      expect(month('12')).toBe('December');
      expect(month('1')).toBe('January');
    });

    it('handles padded string numbers', () => {
      expect(month(' 6 ')).toBe('June');
      expect(month(' 10')).toBe('October');
    });
  });

  describe('edge cases', () => {
    it('returns original for out of range months', () => {
      expect(month(0)).toBe('0');
      expect(month(13)).toBe('13');
      expect(month(-1)).toBe('-1');
      expect(month(100)).toBe('100');
    });

    it('returns original for invalid string', () => {
      expect(month('abc')).toBe('abc');
      expect(month('')).toBe('');
      expect(month('  ')).toBe('  ');
    });

    it('uses integer part of decimal', () => {
      expect(month(6.7)).toBe('June');
      expect(month(10.9)).toBe('October');
      expect(month(1.5)).toBe('January');
    });
  });
});
