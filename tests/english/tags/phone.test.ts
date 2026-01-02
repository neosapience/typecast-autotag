import { phone } from '../../../src/english/tags/phone';

describe('phone', () => {
  describe('basic operation', () => {
    it('converts phone number to spoken form', () => {
      expect(phone('010-2055-4783')).toBe(
        'zero one zero two zero five five four seven eight three'
      );
    });

    it('handles US phone number', () => {
      expect(phone('555-123-4567')).toBe('five five five one two three four five six seven');
    });

    it('handles area code phone number', () => {
      expect(phone('212-555-1234')).toBe('two one two five five five one two three four');
    });
  });

  describe('various formats', () => {
    it('handles dot-separated numbers', () => {
      expect(phone('555.123.4567')).toBe('five five five one two three four five six seven');
    });

    it('handles space-separated numbers', () => {
      expect(phone('555 123 4567')).toBe('five five five one two three four five six seven');
    });

    it('handles mixed delimiters', () => {
      expect(phone('555-123.4567')).toBe('five five five one two three four five six seven');
    });

    it('handles consecutive delimiters', () => {
      expect(phone('555--123')).toBe('five five five one two three');
    });
  });

  describe('toll-free and special numbers', () => {
    it('handles toll-free 800 number', () => {
      expect(phone('1-800-555-1234')).toBe('one eight zero zero five five five one two three four');
    });

    it('handles 888 number', () => {
      expect(phone('1-888-555-1234')).toBe(
        'one eight eight eight five five five one two three four'
      );
    });

    it('handles emergency number', () => {
      expect(phone('911')).toBe('nine one one');
    });

    it('handles information number', () => {
      expect(phone('411')).toBe('four one one');
    });

    it('handles short number', () => {
      expect(phone('311')).toBe('three one one');
    });
  });

  describe('international numbers', () => {
    it('handles + symbol in international number', () => {
      expect(phone('+1-800-555-1234')).toBe(
        'plus one eight zero zero five five five one two three four'
      );
    });

    it('handles country code only', () => {
      expect(phone('+1')).toBe('plus one');
    });

    it('handles UK number', () => {
      expect(phone('+44-20-7123-4567')).toBe(
        'plus four four two zero seven one two three four five six seven'
      );
    });
  });

  describe('edge cases', () => {
    it('returns empty string for empty input', () => {
      expect(phone('')).toBe('');
    });

    it('returns null for null input', () => {
      expect(phone(null as unknown as string)).toBe(null);
    });

    it('returns undefined for undefined input', () => {
      expect(phone(undefined as unknown as string)).toBe(undefined);
    });

    it('handles number without delimiters', () => {
      expect(phone('5551234567')).toBe('five five five one two three four five six seven');
    });

    it('returns original for delimiter only input', () => {
      expect(phone('---')).toBe('---');
    });

    it('returns original for spaces only', () => {
      expect(phone('   ')).toBe('   ');
    });

    it('converts * to "star"', () => {
      expect(phone('*123')).toBe('star one two three');
    });

    it('converts # to "pound"', () => {
      expect(phone('#1234')).toBe('pound one two three four');
    });

    it('handles IVR format', () => {
      expect(phone('1-800-555-1234#1')).toBe(
        'one eight zero zero five five five one two three four pound one'
      );
    });

    it('handles single digit', () => {
      expect(phone('0')).toBe('zero');
      expect(phone('1')).toBe('one');
      expect(phone('9')).toBe('nine');
    });

    it('handles consecutive star symbols', () => {
      expect(phone('**123')).toBe('star star one two three');
    });

    it('handles consecutive pound symbols', () => {
      expect(phone('##123')).toBe('pound pound one two three');
    });
  });

  describe('parentheses handling', () => {
    it('removes parentheses from area code', () => {
      expect(phone('(555)123-4567')).toBe('five five five one two three four five six seven');
    });

    it('handles parentheses with space', () => {
      expect(phone('(555) 123-4567')).toBe('five five five one two three four five six seven');
    });

    it('handles parentheses with hyphen', () => {
      expect(phone('(555)-123-4567')).toBe('five five five one two three four five six seven');
    });

    it('handles international format with parentheses', () => {
      expect(phone('+1 (555) 123-4567')).toBe(
        'plus one five five five one two three four five six seven'
      );
    });

    it('returns empty string for empty parentheses', () => {
      expect(phone('()')).toBe('');
    });
  });
});
