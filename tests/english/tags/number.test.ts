import { numberTag } from '../../../src/english/tags/number';

describe('numberTag', () => {
  describe('basic operation - number expression', () => {
    it('converts 1 to one', () => {
      expect(numberTag(1)).toBe('one');
    });

    it('converts 2 to two', () => {
      expect(numberTag(2)).toBe('two');
    });

    it('converts 3 to three', () => {
      expect(numberTag(3)).toBe('three');
    });

    it('converts 4 to four', () => {
      expect(numberTag(4)).toBe('four');
    });

    it('converts 5 to five', () => {
      expect(numberTag(5)).toBe('five');
    });

    it('converts 10 to ten', () => {
      expect(numberTag(10)).toBe('ten');
    });
  });

  describe('larger numbers', () => {
    it('converts 11 to eleven', () => {
      expect(numberTag(11)).toBe('eleven');
    });

    it('converts 15 to fifteen', () => {
      expect(numberTag(15)).toBe('fifteen');
    });

    it('converts 20 to twenty', () => {
      expect(numberTag(20)).toBe('twenty');
    });

    it('converts 100 to one hundred', () => {
      expect(numberTag(100)).toBe('one hundred');
    });

    it('converts 1000 to one thousand', () => {
      expect(numberTag(1000)).toBe('one thousand');
    });
  });

  describe('edge cases', () => {
    it('converts 0 to zero', () => {
      expect(numberTag(0)).toBe('zero');
    });

    it('converts negative to minus prefix', () => {
      expect(numberTag(-1)).toBe('minus one');
    });

    it('converts -5 to minus five', () => {
      expect(numberTag(-5)).toBe('minus five');
    });

    it('returns "not a number" for NaN', () => {
      expect(numberTag(NaN)).toBe('not a number');
    });

    it('returns "infinity" for Infinity', () => {
      expect(numberTag(Infinity)).toBe('infinity');
    });

    it('returns "minus infinity" for -Infinity', () => {
      expect(numberTag(-Infinity)).toBe('minus infinity');
    });

    it('returns empty string for empty input', () => {
      expect(numberTag('')).toBe('');
    });
  });

  describe('string input', () => {
    it('converts "1" to one', () => {
      expect(numberTag('1')).toBe('one');
    });

    it('converts "10" to ten', () => {
      expect(numberTag('10')).toBe('ten');
    });

    it('handles thousand separator', () => {
      expect(numberTag('1,000')).toBe('one thousand');
    });

    it('converts "0" to zero', () => {
      expect(numberTag('0')).toBe('zero');
    });

    it('converts "-1" to minus one', () => {
      expect(numberTag('-1')).toBe('minus one');
    });

    it('converts number only string', () => {
      expect(numberTag('123')).toBe('one hundred and twenty-three');
    });

    it('returns original for non-numeric string', () => {
      expect(numberTag('abc')).toBe('abc');
    });
  });

  describe('Number N format', () => {
    it('converts "Number 5" to Number five', () => {
      expect(numberTag('Number 5')).toBe('Number five');
    });

    it('converts "No. 1" to Number one', () => {
      expect(numberTag('No. 1')).toBe('Number one');
    });

    it('converts "#42" to number forty-two', () => {
      expect(numberTag('#42')).toBe('number forty-two');
    });
  });

  describe('options - suffix', () => {
    it('allows changing suffix', () => {
      expect(numberTag(2, { suffix: '' })).toBe('two');
    });

    it('allows empty suffix', () => {
      expect(numberTag(1, { suffix: '' })).toBe('one');
    });
  });
});
