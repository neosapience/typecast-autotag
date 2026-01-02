import { autoFloor } from '../../../src/english/auto-tag';

describe('autoTag - floor (floor auto-tagging)', () => {
  describe('Nth floor', () => {
    it('converts basic floors', () => {
      expect(autoFloor('1st floor')).toContain('first floor');
      expect(autoFloor('2nd floor')).toContain('second floor');
      expect(autoFloor('3rd floor')).toContain('third floor');
    });

    it('converts higher floors', () => {
      expect(autoFloor('10th floor')).toContain('tenth floor');
      expect(autoFloor('21st floor')).toContain('twenty-first floor');
    });

    it('converts floor N format', () => {
      expect(autoFloor('floor 5')).toContain('fifth');
    });
  });

  describe('basement', () => {
    it('converts B1, B2', () => {
      expect(autoFloor('B1')).toContain('basement');
      expect(autoFloor('B2')).toContain('basement');
    });

    it('converts basement level N', () => {
      expect(autoFloor('basement level 1')).toContain('basement');
      expect(autoFloor('basement level 2')).toContain('basement');
    });
  });

  describe('floors in context', () => {
    it('converts floors in sentences', () => {
      expect(autoFloor('Office is on the 5th floor')).toContain('fifth floor');
    });
  });

  describe('multiple floors', () => {
    it('converts all floors', () => {
      const result = autoFloor('From 1st floor to 10th floor');
      expect(result).toContain('first floor');
      expect(result).toContain('tenth floor');
    });
  });
});
