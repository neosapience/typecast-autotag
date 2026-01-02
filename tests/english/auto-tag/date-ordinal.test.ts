import { autoDate } from '../../../src/english/auto-tag';

describe('autoTag - date ordinal (month + ordinal day without year)', () => {
  describe('Month + ordinal day', () => {
    it('converts December 25th', () => {
      expect(autoDate('Christmas is on December 25th.')).toBe(
        'Christmas is on December twenty-fifth.'
      );
    });

    it('converts January 1st', () => {
      expect(autoDate('January 1st')).toBe('January first');
    });

    it('converts February 2nd', () => {
      expect(autoDate('February 2nd')).toBe('February second');
    });

    it('converts March 3rd', () => {
      expect(autoDate('March 3rd')).toBe('March third');
    });

    it('converts April 4th', () => {
      expect(autoDate('April 4th')).toBe('April fourth');
    });

    it('converts May 31st', () => {
      expect(autoDate('on May 31st')).toBe('on May thirty-first');
    });
  });

  describe('Abbreviated month + ordinal day', () => {
    it('converts Dec 25th', () => {
      expect(autoDate('Dec 25th')).toBe('Dec twenty-fifth');
    });

    it('converts Jan 1st', () => {
      expect(autoDate('Jan 1st')).toBe('Jan first');
    });
  });

  describe('Ordinal day + of + month', () => {
    it('converts 25th of December', () => {
      expect(autoDate('the 25th of December')).toBe('the the twenty-fifth of December');
    });

    it('converts 1st of January', () => {
      expect(autoDate('on 1st of January')).toBe('on the first of January');
    });
  });

  describe('Does not interfere with existing date patterns', () => {
    it('still converts full dates with year', () => {
      expect(autoDate('December 25, 2024')).toContain('December');
      expect(autoDate('December 25, 2024')).toContain('twenty-fifth');
      expect(autoDate('December 25, 2024')).toContain('twenty twenty-four');
    });

    it('still converts ISO dates', () => {
      const result = autoDate('2024-12-25');
      expect(result).toContain('December');
      expect(result).toContain('twenty-fifth');
    });
  });
});
