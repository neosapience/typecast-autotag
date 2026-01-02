import { duration } from '../../../src/english/tags/duration';

describe('duration', () => {
  describe('basic operation - months', () => {
    it('converts 1 month to one month', () => {
      expect(duration('1 month')).toBe('one month');
    });

    it('converts 3 months to three months', () => {
      expect(duration('3 months')).toBe('three months');
    });

    it('converts 6 months to six months', () => {
      expect(duration('6 months')).toBe('six months');
    });

    it('converts 12 months to twelve months', () => {
      expect(duration('12 months')).toBe('twelve months');
    });

    it('converts 24 months to twenty-four months', () => {
      expect(duration('24 months')).toBe('twenty-four months');
    });
  });

  describe('weeks', () => {
    it('converts 1 week to one week', () => {
      expect(duration('1 week')).toBe('one week');
    });

    it('converts 2 weeks to two weeks', () => {
      expect(duration('2 weeks')).toBe('two weeks');
    });

    it('converts 4 weeks to four weeks', () => {
      expect(duration('4 weeks')).toBe('four weeks');
    });
  });

  describe('years', () => {
    it('converts 1 year to one year', () => {
      expect(duration('1 year')).toBe('one year');
    });

    it('converts 2 years to two years', () => {
      expect(duration('2 years')).toBe('two years');
    });

    it('converts 5 years to five years', () => {
      expect(duration('5 years')).toBe('five years');
    });
  });

  describe('days', () => {
    it('converts 1 day to one day', () => {
      expect(duration('1 day')).toBe('one day');
    });

    it('converts 30 days to thirty days', () => {
      expect(duration('30 days')).toBe('thirty days');
    });

    it('converts 365 days to three hundred and sixty-five days', () => {
      expect(duration('365 days')).toBe('three hundred and sixty-five days');
    });
  });

  describe('quarters and semesters', () => {
    it('converts 1 semester to one semester', () => {
      expect(duration('1 semester')).toBe('one semester');
    });

    it('converts 2 semesters to two semesters', () => {
      expect(duration('2 semesters')).toBe('two semesters');
    });

    it('converts 1 quarter to one quarter', () => {
      expect(duration('1 quarter')).toBe('one quarter');
    });

    it('converts 4 quarters to four quarters', () => {
      expect(duration('4 quarters')).toBe('four quarters');
    });
  });

  describe('edge cases', () => {
    it('converts 0 months to zero months', () => {
      expect(duration('0 months')).toBe('zero months');
    });

    it('returns empty string for empty input', () => {
      expect(duration('')).toBe('');
    });

    it('returns original for spaces only', () => {
      expect(duration('   ')).toBe('   ');
    });

    it('converts hours to English (hours are supported)', () => {
      expect(duration('3 hours')).toBe('three hours');
    });
  });

  describe('thousand separator', () => {
    it('handles thousand separator', () => {
      expect(duration('1,000 days')).toBe('one thousand days');
    });
  });
});
