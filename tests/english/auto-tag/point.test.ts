import { autoTag, autoPoint } from '../../../src/english/auto-tag';

describe('autoTag - point (score auto-tagging)', () => {
  describe('points', () => {
    it('converts basic points', () => {
      expect(autoPoint('95 points')).toBe('ninety-five points');
      expect(autoPoint('100 points')).toBe('one hundred points');
    });

    it('converts decimal points', () => {
      expect(autoPoint('9.5 points')).toContain('nine point five points');
    });

    it('correctly converts points in sentences', () => {
      expect(autoPoint('Final score: 85 points')).toContain('eighty-five points');
    });
  });

  describe('credits', () => {
    it('converts credits', () => {
      expect(autoPoint('10 credits')).toBe('ten credits');
      expect(autoPoint('150 credits')).toBe('one hundred and fifty credits');
    });
  });

  describe('score label', () => {
    it('converts score with label', () => {
      expect(autoPoint('Score: 95')).toContain('ninety-five');
    });
  });

  describe('multiple scores', () => {
    it('converts all scores', () => {
      const result = autoPoint('Round 1: 45 points, Round 2: 55 points');
      expect(result).toContain('forty-five points');
      expect(result).toContain('fifty-five points');
    });
  });

  describe('False Positive prevention', () => {
    it('does not convert money as points', () => {
      expect(autoTag('$50', { enabledTags: ['point'] })).toBe('$50');
    });

    it('does not convert quantities as points', () => {
      expect(autoTag('10 items', { enabledTags: ['point'] })).toBe('10 items');
    });
  });
});
