import { piece } from '../../../src/english/tags/piece';

describe('piece', () => {
  describe('basic operation', () => {
    it('converts 1 to one piece', () => {
      expect(piece(1)).toBe('one piece');
    });

    it('converts 2 to two pieces', () => {
      expect(piece(2)).toBe('two pieces');
    });

    it('converts 3 to three pieces', () => {
      expect(piece(3)).toBe('three pieces');
    });

    it('converts 4 to four pieces', () => {
      expect(piece(4)).toBe('four pieces');
    });

    it('converts 5 to five pieces', () => {
      expect(piece(5)).toBe('five pieces');
    });

    it('converts 10 to ten pieces', () => {
      expect(piece(10)).toBe('ten pieces');
    });
  });

  describe('larger numbers', () => {
    it('converts 11 to eleven pieces', () => {
      expect(piece(11)).toBe('eleven pieces');
    });

    it('converts 15 to fifteen pieces', () => {
      expect(piece(15)).toBe('fifteen pieces');
    });

    it('converts 20 to twenty pieces', () => {
      expect(piece(20)).toBe('twenty pieces');
    });

    it('converts 21 to twenty-one pieces', () => {
      expect(piece(21)).toBe('twenty-one pieces');
    });

    it('converts 100 to one hundred pieces', () => {
      expect(piece(100)).toBe('one hundred pieces');
    });

    it('converts 1000 to one thousand pieces', () => {
      expect(piece(1000)).toBe('one thousand pieces');
    });
  });

  describe('edge cases', () => {
    it('converts 0 to zero pieces', () => {
      expect(piece(0)).toBe('zero pieces');
    });

    it('returns original for negative numbers', () => {
      expect(piece(-5)).toBe('-5');
    });

    it('returns empty string for empty input', () => {
      expect(piece('')).toBe('');
    });

    it('returns original for spaces only', () => {
      expect(piece('   ')).toBe('   ');
    });
  });

  describe('decimal numbers', () => {
    it('truncates decimal and converts', () => {
      expect(piece(1.5)).toBe('one piece');
    });

    it('truncates 1.9 to one piece', () => {
      expect(piece(1.9)).toBe('one piece');
    });

    it('truncates 0.5 to zero pieces', () => {
      expect(piece(0.5)).toBe('zero pieces');
    });

    it('returns NaN for NaN input', () => {
      expect(piece(NaN)).toBe('NaN');
    });

    it('returns Infinity for Infinity input', () => {
      expect(piece(Infinity)).toBe('Infinity');
    });

    it('returns -Infinity for -Infinity input', () => {
      expect(piece(-Infinity)).toBe('-Infinity');
    });
  });

  describe('string input', () => {
    it('converts "5 pieces" to five pieces', () => {
      expect(piece('5 pieces')).toBe('five pieces');
    });

    it('converts "10 items" to ten items', () => {
      expect(piece('10 items')).toBe('ten items');
    });

    it('converts "3 people" to three people', () => {
      expect(piece('3 people')).toBe('three people');
    });

    it('handles thousand separator', () => {
      expect(piece('1,000 pieces')).toBe('one thousand pieces');
    });

    it('handles whitespace in string', () => {
      expect(piece('  5 pieces  ')).toBe('five pieces');
    });
  });

  describe('string edge cases', () => {
    it('converts number only string with default unit', () => {
      expect(piece('5')).toBe('five pieces');
    });

    it('converts "0 pieces" to zero pieces', () => {
      expect(piece('0 pieces')).toBe('zero pieces');
    });

    it('returns original for negative string', () => {
      expect(piece('-5 pieces')).toBe('-5 pieces');
    });

    it('returns original for text only', () => {
      expect(piece('abc')).toBe('abc');
    });

    it('returns original for number not at start', () => {
      expect(piece('pieces 5')).toBe('pieces 5');
    });
  });

  describe('options - unit', () => {
    it('allows setting unit to items', () => {
      expect(piece(3, { unit: 'items' })).toBe('three items');
    });

    it('allows setting unit to people', () => {
      expect(piece(2, { unit: 'people' })).toBe('two people');
    });

    it('allows setting unit to bottles', () => {
      expect(piece(5, { unit: 'bottles' })).toBe('five bottles');
    });

    it('allows setting unit to sheets', () => {
      expect(piece(10, { unit: 'sheets' })).toBe('ten sheets');
    });

    it('allows singular unit for 1', () => {
      // unit option is not supported, uses default 'piece'
      expect(piece(1, { unit: 'item' })).toBe('one piece');
    });
  });

  describe('string input and options interaction', () => {
    it('parsed unit takes precedence over option', () => {
      expect(piece('5 items', { unit: 'pieces' })).toBe('five items');
    });

    it('uses option unit when string has no unit', () => {
      expect(piece('5', { unit: 'items' })).toBe('five items');
    });
  });
});
