import { autoTag, autoMoney } from '../../../src/english/auto-tag';

describe('autoTag - money (amount auto-tagging)', () => {
  describe('dollar with symbol', () => {
    it('converts basic amounts', () => {
      expect(autoMoney('Price: $50')).toBe('Price: fifty dollars');
      expect(autoMoney('$100')).toBe('one hundred dollars');
      expect(autoMoney('$500')).toBe('five hundred dollars');
    });

    it('converts amounts with thousand separators', () => {
      expect(autoMoney('Total: $1,000')).toBe('Total: one thousand dollars');
      expect(autoMoney('$50,000')).toBe('fifty thousand dollars');
    });

    it('converts amounts with cents', () => {
      // Money function outputs "N dollars and N cents" format
      expect(autoMoney('$19.99')).toBe('nineteen dollars and ninety-nine cents');
      expect(autoMoney('$100.50')).toBe('one hundred dollars and fifty cents');
    });
  });

  describe('currency words', () => {
    it('converts number + dollars', () => {
      expect(autoMoney('100 dollars')).toBe('one hundred dollars');
      expect(autoMoney('50 USD')).toBe('fifty dollars');
    });

    it('converts number + euros', () => {
      expect(autoMoney('50 euros')).toBe('fifty euros');
    });

    it('converts number + pounds', () => {
      expect(autoMoney('75 pounds')).toBe('seventy-five pounds');
    });
  });

  describe('currency symbols', () => {
    it('converts pound symbol', () => {
      expect(autoMoney('£100')).toBe('one hundred pounds');
    });

    it('converts euro symbol', () => {
      expect(autoMoney('€50')).toBe('fifty euros');
    });

    it('converts yen symbol', () => {
      expect(autoMoney('¥1000')).toBe('one thousand yen');
    });

    it('converts won symbol', () => {
      expect(autoMoney('₩4500')).toBe('four thousand five hundred won');
    });

    it('converts a symbol amount with a magnitude', () => {
      expect(autoMoney('$2.5 million')).toBe('two point five million dollars');
    });
  });

  describe('various amounts', () => {
    it('converts small amounts', () => {
      expect(autoMoney('$1')).toBe('one dollar');
      expect(autoMoney('$5')).toBe('five dollars');
    });

    it('converts large amounts', () => {
      expect(autoMoney('$1,000,000')).toBe('one million dollars');
      expect(autoMoney('$10,000,000')).toBe('ten million dollars');
    });

    it('converts complex amounts', () => {
      // numberToEnglish may include "and" for certain numbers
      const result = autoMoney('$12,345');
      expect(result).toContain('twelve thousand');
      expect(result).toContain('dollars');
    });
  });

  describe('multiple amounts', () => {
    it('converts all amounts', () => {
      const result = autoMoney('Regular: $50, Sale: $35');
      expect(result).toContain('fifty dollars');
      expect(result).toContain('thirty-five dollars');
    });
  });

  describe('False Positive prevention', () => {
    it('does not convert points as money', () => {
      expect(autoTag('95 points', { enabledTags: ['money'] })).toBe('95 points');
    });

    it('does not convert numbers without units', () => {
      expect(autoMoney('12345')).toBe('12345');
    });
  });

  describe('money in context', () => {
    it('correctly converts amounts in sentences', () => {
      const result = autoMoney('The price is $49.99.');
      expect(result).toContain('forty-nine dollars');
      expect(result).toContain('ninety-nine cents');
    });

    it('converts amounts in parentheses', () => {
      expect(autoMoney('($100)')).toBe('(one hundred dollars)');
    });

    it('converts money ranges', () => {
      const result = autoMoney('$50~$100');
      expect(result).toContain('fifty dollars');
      expect(result).toContain('one hundred dollars');
    });
  });
});
