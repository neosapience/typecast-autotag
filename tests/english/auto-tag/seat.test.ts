import { autoSeat } from '../../../src/english/auto-tag';

describe('autoTag - seat (seat number auto-tagging)', () => {
  describe('seat with label', () => {
    it('converts seat NX', () => {
      const result = autoSeat('seat 23A');
      expect(result).toContain('seat');
      expect(result).toContain('twenty-three');
      expect(result).toContain('A');
    });

    it('converts seat: NX', () => {
      const result = autoSeat('seat: 15F');
      expect(result).toContain('seat:');
      expect(result).toContain('fifteen');
      expect(result).toContain('F');
    });
  });

  describe('various seat numbers', () => {
    it('converts single digit row', () => {
      const result = autoSeat('seat 7C');
      expect(result).toContain('seven');
    });

    it('converts double digit row', () => {
      const result = autoSeat('seat 42B');
      expect(result).toContain('forty-two');
    });
  });

  describe('seats in context', () => {
    it('converts seats in sentences', () => {
      const result = autoSeat('Your seat 12A is ready');
      expect(result).toContain('twelve');
    });
  });
});
