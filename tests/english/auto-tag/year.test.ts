import { autoTag, autoYear } from '../../../src/english/auto-tag';

describe('autoTag - year (year auto-tagging)', () => {
  describe('year with label', () => {
    it('converts year YYYY', () => {
      expect(autoYear('year 2024')).toContain('twenty twenty-four');
      expect(autoYear('year 2000')).toContain('two thousand');
    });

    it('converts in YYYY', () => {
      expect(autoYear('in 2024')).toContain('twenty twenty-four');
      expect(autoYear('in 1990')).toContain('nineteen ninety');
    });
  });

  describe('various years', () => {
    it('converts 1900s years', () => {
      expect(autoYear('year 1999')).toContain('nineteen ninety-nine');
      expect(autoYear('year 1950')).toContain('nineteen fifty');
    });

    it('converts 2000s years', () => {
      expect(autoYear('year 2001')).toContain('two thousand one');
      expect(autoYear('year 2010')).toContain('twenty ten');
    });
  });

  describe('year ranges', () => {
    it('converts year ranges', () => {
      const result = autoYear('2020~2024');
      expect(result).toContain('twenty twenty');
      expect(result).toContain('twenty twenty-four');
    });
  });

  describe('False Positive prevention', () => {
    it('does not convert standalone numbers', () => {
      expect(autoTag('number 2024', { enabledTags: ['year'] })).toBe('number 2024');
    });
  });
});
