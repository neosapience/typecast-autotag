import { floor } from '../../../src/english/tags/floor';

describe('floor', () => {
  describe('basic operation - regular floors', () => {
    it('converts 1st floor to first floor', () => {
      expect(floor('1st floor')).toBe('first floor');
    });

    it('converts 3rd floor to third floor', () => {
      expect(floor('3rd floor')).toBe('third floor');
    });

    it('converts 5th floor to fifth floor', () => {
      expect(floor('5th floor')).toBe('fifth floor');
    });

    it('converts 10th floor to tenth floor', () => {
      expect(floor('10th floor')).toBe('tenth floor');
    });

    it('converts 15th floor to fifteenth floor', () => {
      expect(floor('15th floor')).toBe('fifteenth floor');
    });

    it('converts 20th floor to twentieth floor', () => {
      expect(floor('20th floor')).toBe('twentieth floor');
    });

    it('converts 100th floor to one hundredth floor', () => {
      expect(floor('100th floor')).toBe('one hundredth floor');
    });
  });

  describe('basement floors - B format', () => {
    it('converts B1 to basement one', () => {
      expect(floor('B1')).toBe('basement one');
    });

    it('converts B2 to basement two', () => {
      expect(floor('B2')).toBe('basement two');
    });

    it('converts B3 to basement three', () => {
      expect(floor('B3')).toBe('basement three');
    });

    it('converts lowercase b1 to basement one', () => {
      expect(floor('b1')).toBe('basement one');
    });
  });

  describe('basement floors - spelled out', () => {
    it('converts basement 1 to basement one', () => {
      expect(floor('basement 1')).toBe('basement one');
    });

    it('converts basement 2 to basement two', () => {
      expect(floor('basement 2')).toBe('basement two');
    });
  });

  describe('number input', () => {
    it('converts number 3 to third floor', () => {
      expect(floor(3)).toBe('third floor');
    });

    it('converts number 10 to tenth floor', () => {
      expect(floor(10)).toBe('tenth floor');
    });

    it('converts negative -1 to basement one', () => {
      expect(floor(-1)).toBe('basement one');
    });

    it('converts negative -2 to basement two', () => {
      expect(floor(-2)).toBe('basement two');
    });

    it('converts 0 to ground floor', () => {
      expect(floor(0)).toBe('ground floor');
    });
  });

  describe('simple floor number', () => {
    it('converts floor 1 to first floor', () => {
      expect(floor('floor 1')).toBe('first floor');
    });

    it('converts floor 5 to fifth floor', () => {
      expect(floor('floor 5')).toBe('fifth floor');
    });
  });

  describe('edge cases', () => {
    it('returns empty string for empty input', () => {
      expect(floor('')).toBe('');
    });

    it('returns original for spaces only', () => {
      expect(floor('   ')).toBe('   ');
    });

    it('returns original for unrecognized format', () => {
      expect(floor('some text')).toBe('some text');
    });

    it('returns NaN for NaN input', () => {
      expect(floor(NaN)).toBe('NaN');
    });

    it('returns Infinity for Infinity input', () => {
      expect(floor(Infinity)).toBe('Infinity');
    });
  });

  describe('unsupported formats', () => {
    it('returns original for thousand separator', () => {
      // Currently does not support thousand separator in floor numbers
      expect(floor('1,000th floor')).toBe('1,000th floor');
    });

    it('returns original for level format', () => {
      // Currently does not support "level N" format
      expect(floor('level 1')).toBe('level 1');
      expect(floor('level 5')).toBe('level 5');
    });
  });
});
