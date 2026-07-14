import { date } from '../../../src/english/tags/date';

describe('date', () => {
  describe('basic operation', () => {
    it('converts birthdate to English', () => {
      expect(date(19940616)).toBe('June sixteenth, nineteen ninety-four');
    });

    it('handles 2000s birthdate', () => {
      expect(date(20001225)).toBe('December twenty-fifth, two thousand');
    });

    it('handles string input', () => {
      expect(date('19940616')).toBe('June sixteenth, nineteen ninety-four');
    });
  });

  describe('various dates', () => {
    it('handles January 1st', () => {
      expect(date('20000101')).toBe('January first, two thousand');
    });

    it('handles December 31st', () => {
      expect(date('19991231')).toBe('December thirty-first, nineteen ninety-nine');
    });
  });

  describe('dates with separators', () => {
    it('handles hyphen (-) separator', () => {
      expect(date('1994-06-16')).toBe('June sixteenth, nineteen ninety-four');
      expect(date('2000-12-25')).toBe('December twenty-fifth, two thousand');
    });

    it('handles slash (/) separator', () => {
      expect(date('1994/06/16')).toBe('June sixteenth, nineteen ninety-four');
      expect(date('2000/12/25')).toBe('December twenty-fifth, two thousand');
    });

    it('handles dot (.) separator', () => {
      expect(date('1994.06.16')).toBe('June sixteenth, nineteen ninety-four');
      expect(date('2000.12.25')).toBe('December twenty-fifth, two thousand');
    });

    it('handles separator with January 1st', () => {
      expect(date('2000-01-01')).toBe('January first, two thousand');
    });

    it('handles separator with December 31st', () => {
      expect(date('1999-12-31')).toBe('December thirty-first, nineteen ninety-nine');
    });
  });

  describe('English month name format', () => {
    it('handles "Month day, year" format', () => {
      expect(date('June 16, 1994')).toBe('June sixteenth, nineteen ninety-four');
    });

    it('handles "Month day year" format (no comma)', () => {
      expect(date('June 16 1994')).toBe('June sixteenth, nineteen ninety-four');
    });

    it('handles "day Month year" format', () => {
      expect(date('16 June 1994')).toBe('June sixteenth, nineteen ninety-four');
    });

    it('handles abbreviated month', () => {
      expect(date('Jun 16, 1994')).toBe('June sixteenth, nineteen ninety-four');
      expect(date('Dec 25, 2000')).toBe('December twenty-fifth, two thousand');
    });

    it('handles "Month year" format', () => {
      expect(date('June 1994')).toBe('June nineteen ninety-four');
    });

    it('handles various English months', () => {
      expect(date('January 1, 2000')).toBe('January first, two thousand');
      expect(date('February 14, 2000')).toBe('February fourteenth, two thousand');
      expect(date('March 3, 2000')).toBe('March third, two thousand');
      expect(date('April 4, 2000')).toBe('April fourth, two thousand');
      expect(date('May 5, 2000')).toBe('May fifth, two thousand');
      expect(date('July 7, 2000')).toBe('July seventh, two thousand');
      expect(date('August 8, 2000')).toBe('August eighth, two thousand');
      expect(date('September 9, 2000')).toBe('September ninth, two thousand');
      expect(date('October 10, 2000')).toBe('October tenth, two thousand');
      expect(date('November 11, 2000')).toBe('November eleventh, two thousand');
      expect(date('December 12, 2000')).toBe('December twelfth, two thousand');
    });
  });

  describe('US date format (MM-DD-YYYY)', () => {
    it('handles US hyphen separator', () => {
      expect(date('06-16-1994')).toBe('June sixteenth, nineteen ninety-four');
    });

    it('handles US slash separator', () => {
      expect(date('12/25/2000')).toBe('December twenty-fifth, two thousand');
    });

    it('handles US dot separator', () => {
      expect(date('01.01.2000')).toBe('January first, two thousand');
    });
  });

  describe('calendar validation', () => {
    it('returns invalid calendar dates unchanged', () => {
      expect(date('2000-00-00')).toBe('2000-00-00');
      expect(date('2024-02-30')).toBe('2024-02-30');
      expect(date('2023-02-29')).toBe('2023-02-29');
    });

    it('accepts leap day in a leap year', () => {
      expect(date('2024-02-29')).toBe('February twenty-ninth, twenty twenty-four');
    });

    it('handles single digit month and day', () => {
      expect(date('2000-1-1')).toBe('January first, two thousand');
    });
  });

  describe('edge cases', () => {
    it('returns original for non-8-digit input', () => {
      expect(date('1994061')).toBe('1994061');
      expect(date('199406161')).toBe('199406161');
    });

    it('returns original for non-numeric input', () => {
      expect(date('abcdefgh')).toBe('abcdefgh');
    });

    it('returns original for unrecognized format', () => {
      expect(date('hello world')).toBe('hello world');
    });
  });

  describe('English month case sensitivity', () => {
    it('handles uppercase month', () => {
      expect(date('JUNE 16, 1994')).toBe('June sixteenth, nineteen ninety-four');
      expect(date('DECEMBER 25, 2000')).toBe('December twenty-fifth, two thousand');
    });

    it('handles mixed case month', () => {
      expect(date('JuNe 16, 1994')).toBe('June sixteenth, nineteen ninety-four');
      expect(date('DeCeMbEr 25, 2000')).toBe('December twenty-fifth, two thousand');
    });
  });

  describe('empty string and whitespace', () => {
    it('returns empty string for empty input', () => {
      expect(date('')).toBe('');
    });

    it('returns original for spaces only', () => {
      expect(date('   ')).toBe('   ');
    });

    it('returns original for padded 8-digit number', () => {
      expect(date(' 19940616 ')).toBe(' 19940616 ');
    });

    it('returns original for padded separator format', () => {
      expect(date(' 1994-06-16 ')).toBe(' 1994-06-16 ');
    });
  });

  describe('leap year date', () => {
    it('handles Feb 29 (8-digit)', () => {
      expect(date('20000229')).toBe('February twenty-ninth, two thousand');
    });

    it('handles Feb 29 (separator)', () => {
      expect(date('2000-02-29')).toBe('February twenty-ninth, two thousand');
    });
  });

  describe('special years', () => {
    it('handles year 100', () => {
      expect(date('01000101')).toBe('January first, one hundred');
    });

    it('handles year 10', () => {
      expect(date('00100101')).toBe('January first, ten');
    });

    it('handles year 1', () => {
      expect(date('00010101')).toBe('January first, one');
    });

    it('handles year 0', () => {
      expect(date('00000101')).toBe('January first, zero');
    });

    it('returns original for 3-digit year separator format', () => {
      expect(date('100-01-01')).toBe('100-01-01');
      expect(date('10-01-01')).toBe('10-01-01');
    });
  });

  describe('number 0 and special number input', () => {
    it('returns original for number 0', () => {
      expect(date(0)).toBe('0');
    });

    it('returns original for negative number', () => {
      expect(date(-19940616)).toBe('-19940616');
    });

    it('returns original for decimal number', () => {
      expect(date(1994.0616)).toBe('1994.0616');
    });
  });

  describe('mixed separators', () => {
    it('handles mixed separators', () => {
      expect(date('1994-06/16')).toBe('June sixteenth, nineteen ninety-four');
      expect(date('1994.06-16')).toBe('June sixteenth, nineteen ninety-four');
      expect(date('1994/06.16')).toBe('June sixteenth, nineteen ninety-four');
    });
  });

  describe('ISO 8601 and timestamp format (not supported)', () => {
    it('returns original for ISO 8601 format', () => {
      expect(date('1994-06-16T00:00:00Z')).toBe('1994-06-16T00:00:00Z');
      expect(date('1994-06-16T12:30:00+09:00')).toBe('1994-06-16T12:30:00+09:00');
    });

    it('returns original for time-included format', () => {
      expect(date('1994-06-16 12:30:00')).toBe('1994-06-16 12:30:00');
    });
  });

  describe('boundary dates', () => {
    it('handles largest month and day', () => {
      expect(date('20001231')).toBe('December thirty-first, two thousand');
    });

    it('handles 2-digit month and day', () => {
      expect(date('20001010')).toBe('October tenth, two thousand');
    });
  });
});
