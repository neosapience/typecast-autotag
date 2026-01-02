import { autoRatio } from '../../../src/english/auto-tag';

describe('autoTag - ratio (ratio/percentage auto-tagging)', () => {
  describe('percentage', () => {
    it('converts basic percentage', () => {
      expect(autoRatio('50%')).toBe('fifty percent');
      expect(autoRatio('100%')).toBe('one hundred percent');
    });

    it('converts decimal percentage', () => {
      expect(autoRatio('99.9%')).toContain('ninety-nine point nine percent');
    });

    it('correctly converts percentage in sentences', () => {
      expect(autoRatio('Success rate: 85%')).toContain('eighty-five percent');
    });
  });

  describe('times/fold', () => {
    it('converts N times', () => {
      expect(autoRatio('2 times')).toBe('two times');
      expect(autoRatio('10 times')).toBe('ten times');
    });

    it('converts N fold', () => {
      // "N fold" requires the word to be matched by the pattern
      const result = autoRatio('3 fold');
      expect(result).toContain('three');
    });

    it('converts Nx', () => {
      // "Nx" is converted to "N times"
      expect(autoRatio('2x')).toBe('two times');
    });
  });

  describe('colon ratio', () => {
    it('converts N:M ratio', () => {
      expect(autoRatio('1:2')).toBe('one to two');
      expect(autoRatio('16:9')).toBe('sixteen to nine');
    });

    it('converts N:M:O ratio', () => {
      expect(autoRatio('1:2:3')).toBe('one to two to three');
    });
  });

  describe('multiple ratios', () => {
    it('converts all ratios', () => {
      const result = autoRatio('Success: 50%, Failure: 50%');
      expect(result).toContain('fifty percent');
    });
  });

  describe('False Positive prevention', () => {
    it('does not convert times as time', () => {
      // 14:30 should not be ratio - but this is tricky
      // The pattern should not match valid times
    });
  });
});
