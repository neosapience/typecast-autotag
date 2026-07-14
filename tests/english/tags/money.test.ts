import { money } from '../../../src/english/tags/money';

describe('money', () => {
  describe('basic operation - dollars', () => {
    it('converts 1000 to one thousand dollars', () => {
      expect(money(1000)).toBe('one thousand dollars');
    });

    it('converts 10000 to ten thousand dollars', () => {
      expect(money(10000)).toBe('ten thousand dollars');
    });

    it('converts 15000 to fifteen thousand dollars', () => {
      expect(money(15000)).toBe('fifteen thousand dollars');
    });

    it('converts 50000 to fifty thousand dollars', () => {
      expect(money(50000)).toBe('fifty thousand dollars');
    });

    it('converts 100000 to one hundred thousand dollars', () => {
      expect(money(100000)).toBe('one hundred thousand dollars');
    });

    it('converts 1000000 to one million dollars', () => {
      expect(money(1000000)).toBe('one million dollars');
    });
  });

  describe('various amounts', () => {
    it('converts 500 to five hundred dollars', () => {
      expect(money(500)).toBe('five hundred dollars');
    });

    it('converts 3500 to three thousand five hundred dollars', () => {
      expect(money(3500)).toBe('three thousand five hundred dollars');
    });

    it('converts 12345 correctly', () => {
      expect(money(12345)).toBe('twelve thousand three hundred and forty-five dollars');
    });

    it('converts numbers with zeros correctly', () => {
      expect(money(10001)).toBe('ten thousand one dollars');
    });

    it('converts 1 to one dollar (singular)', () => {
      expect(money(1)).toBe('one dollar');
    });
  });

  describe('large numbers', () => {
    it('converts one billion', () => {
      expect(money(1000000000)).toBe('one billion dollars');
    });

    it('converts one trillion', () => {
      expect(money(1000000000000)).toBe('one trillion dollars');
    });
  });

  describe('edge cases', () => {
    it('converts 0 to zero dollars', () => {
      expect(money(0)).toBe('zero dollars');
    });

    it('converts negative to minus prefix', () => {
      expect(money(-1000)).toBe('minus one thousand dollars');
    });

    it('returns empty string for empty input', () => {
      expect(money('')).toBe('');
    });

    it('returns NaN for NaN input', () => {
      expect(money(NaN)).toBe('NaN');
    });

    it('returns Infinity for Infinity input', () => {
      expect(money(Infinity)).toBe('Infinity');
    });

    it('returns -Infinity for -Infinity input', () => {
      expect(money(-Infinity)).toBe('-Infinity');
    });

    it('returns original for non-numeric string', () => {
      expect(money('abc')).toBe('abc');
    });

    it('returns original for text before number', () => {
      expect(money('about $5000')).toBe('about $5000');
    });
  });

  describe('string input', () => {
    it('converts "$10000" correctly', () => {
      expect(money('$10000')).toBe('ten thousand dollars');
    });

    it('converts "10,000" with thousand separator', () => {
      expect(money('10,000')).toBe('ten thousand dollars');
    });

    it('converts "$5,500" correctly', () => {
      expect(money('$5,500')).toBe('five thousand five hundred dollars');
    });

    it('handles whitespace in string', () => {
      expect(money('  5000  ')).toBe('five thousand dollars');
    });

    it('converts "0" to zero dollars', () => {
      expect(money('0')).toBe('zero dollars');
    });

    it('preserves the euro currency', () => {
      expect(money('€100')).toBe('one hundred euros');
    });

    it('preserves the pound currency', () => {
      expect(money('£100')).toBe('one hundred pounds');
    });

    it('preserves the yen currency', () => {
      expect(money('¥100')).toBe('one hundred yen');
    });

    it('preserves subunits and large-number magnitudes', () => {
      expect(money('£1.01')).toBe('one pound and one penny');
      expect(money('$2.5 million')).toBe('two point five million dollars');
    });
  });

  describe('options - unit', () => {
    it('allows setting unit to pounds', () => {
      expect(money(100, { unit: 'pounds' })).toBe('one hundred pounds');
    });

    it('allows setting unit to euros', () => {
      expect(money(1000, { unit: 'euros' })).toBe('one thousand euros');
    });

    it('allows setting unit to yen', () => {
      expect(money(50, { unit: 'yen' })).toBe('fifty yen');
    });
  });

  describe('decimal amounts (cents)', () => {
    it('converts 0.99 to ninety-nine cents', () => {
      expect(money(0.99)).toBe('ninety-nine cents');
    });

    it('converts 1.50 to one dollar and fifty cents', () => {
      expect(money(1.5)).toBe('one dollar and fifty cents');
    });

    it('converts 10.25 to ten dollars and twenty-five cents', () => {
      expect(money(10.25)).toBe('ten dollars and twenty-five cents');
    });

    it('converts 0.01 to one cent', () => {
      expect(money(0.01)).toBe('one cent');
    });

    it('converts 100.50 to one hundred dollars and fifty cents', () => {
      expect(money(100.5)).toBe('one hundred dollars and fifty cents');
    });

    it('converts string "0.99" correctly', () => {
      expect(money('0.99')).toBe('ninety-nine cents');
    });

    it('converts "$1.99" correctly', () => {
      expect(money('$1.99')).toBe('one dollar and ninety-nine cents');
    });
  });
});
