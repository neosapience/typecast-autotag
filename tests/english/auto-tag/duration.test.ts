import { autoTag, autoDuration } from '../../../src/english/auto-tag';

describe('autoTag - duration (duration auto-tagging)', () => {
  describe('months', () => {
    it('converts basic months', () => {
      expect(autoDuration('3 months')).toBe('three months');
      expect(autoDuration('6 months')).toBe('six months');
    });

    it('correctly converts months in sentences', () => {
      expect(autoDuration('Premium subscription 3 months')).toBe(
        'Premium subscription three months'
      );
    });

    it('converts multiple month durations', () => {
      const result = autoDuration('3 months or 6 months subscription available');
      expect(result).toContain('three months');
      expect(result).toContain('six months');
    });
  });

  describe('weeks', () => {
    it('converts basic weeks', () => {
      expect(autoDuration('2 weeks')).toBe('two weeks');
      expect(autoDuration('4 weeks')).toBe('four weeks');
    });

    it('correctly converts weeks in sentences', () => {
      expect(autoDuration('Delivery takes 2 weeks')).toBe('Delivery takes two weeks');
    });
  });

  describe('years', () => {
    it('converts years', () => {
      expect(autoDuration('1 year')).toBe('one year');
      expect(autoDuration('5 years')).toBe('five years');
    });

    it('correctly converts years in sentences', () => {
      expect(autoDuration('Warranty for 10 years')).toBe('Warranty for ten years');
    });
  });

  describe('semesters/quarters', () => {
    it('converts semesters', () => {
      expect(autoDuration('1 semester')).toBe('one semester');
      expect(autoDuration('2 semesters')).toBe('two semesters');
    });

    it('converts quarters', () => {
      expect(autoDuration('1 quarter')).toBe('one quarter');
      expect(autoDuration('4 quarters')).toBe('four quarters');
    });
  });

  describe('for N duration', () => {
    it('converts "for N days"', () => {
      expect(autoDuration('for 3 days')).toBe('for three days');
    });

    it('converts "for N weeks"', () => {
      expect(autoDuration('for 2 weeks')).toBe('for two weeks');
    });
  });

  describe('False Positive prevention', () => {
    it('does not convert numbers without units', () => {
      expect(autoDuration('12345')).toBe('12345');
    });
  });

  describe('integration test', () => {
    it('correctly handles months with full tags', () => {
      const result = autoTag('Premium subscription 3 months');
      expect(result).toBe('Premium subscription three months');
    });
  });
});
