import { autoPiece } from '../../../src/english/auto-tag';

describe('autoTag - piece (quantity auto-tagging)', () => {
  describe('items', () => {
    it('converts basic items', () => {
      expect(autoPiece('5 items')).toBe('five items');
      expect(autoPiece('10 items')).toBe('ten items');
    });

    it('correctly converts items in sentences', () => {
      expect(autoPiece('Cart has 5 items')).toBe('Cart has five items');
    });
  });

  describe('pieces', () => {
    it('converts pieces', () => {
      expect(autoPiece('3 pieces')).toBe('three pieces');
    });
  });

  describe('people', () => {
    it('converts people', () => {
      expect(autoPiece('2 people')).toBe('two people');
    });
  });

  describe('units', () => {
    it('converts units', () => {
      expect(autoPiece('100 units')).toBe('one hundred units');
    });
  });

  describe('various quantity words', () => {
    it('converts bottles', () => {
      expect(autoPiece('3 bottles')).toBe('three bottles');
    });

    it('converts boxes', () => {
      expect(autoPiece('2 boxes')).toBe('two boxes');
    });

    it('converts pairs', () => {
      expect(autoPiece('4 pairs')).toBe('four pairs');
    });

    it('converts sets', () => {
      expect(autoPiece('2 sets')).toBe('two sets');
    });
  });

  describe('multiple quantities', () => {
    it('converts all quantities', () => {
      const result = autoPiece('5 items and 3 bottles');
      expect(result).toContain('five items');
      expect(result).toContain('three bottles');
    });
  });

  describe('False Positive prevention', () => {
    it('does not convert numbers without quantity words', () => {
      expect(autoPiece('number 12345')).toBe('number 12345');
    });
  });
});
