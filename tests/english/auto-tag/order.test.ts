import { autoTag, autoOrder } from '../../../src/english/auto-tag';

describe('autoTag - order (ordinal auto-tagging)', () => {
  describe('ordinal with place/rank', () => {
    it('converts Nth place', () => {
      expect(autoOrder('1st place')).toContain('first place');
      expect(autoOrder('2nd place')).toContain('second place');
      expect(autoOrder('3rd place')).toContain('third place');
    });

    it('converts Nth rank', () => {
      expect(autoOrder('1st rank')).toContain('first rank');
    });

    it('converts Nth position', () => {
      expect(autoOrder('5th position')).toContain('fifth position');
    });
  });

  describe('ordinal with context', () => {
    it('converts "the Nth"', () => {
      expect(autoOrder('the 1st')).toContain('first');
      expect(autoOrder('the 2nd')).toContain('second');
    });

    it('converts "came Nth"', () => {
      expect(autoOrder('came 3rd')).toContain('third');
    });

    it('converts "finished Nth"', () => {
      expect(autoOrder('finished 4th')).toContain('fourth');
    });
  });

  describe('various ordinals', () => {
    it('converts various ordinal numbers', () => {
      expect(autoOrder('10th place')).toContain('tenth place');
      expect(autoOrder('11th place')).toContain('eleventh place');
      expect(autoOrder('12th place')).toContain('twelfth place');
      expect(autoOrder('13th place')).toContain('thirteenth place');
      expect(autoOrder('21st place')).toContain('twenty-first place');
    });
  });

  describe('False Positive prevention', () => {
    it('does not convert ordinals without context', () => {
      // Standalone ordinals without place/rank/position context
      expect(autoTag('the number 5', { enabledTags: ['order'] })).toBe('the number 5');
    });
  });
});
