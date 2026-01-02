import { autoTag } from '../../../src/english/auto-tag';

describe('autoTag - cardEnding (card last 4 digits)', () => {
  describe('Ending in NNNN pattern', () => {
    it('converts "Ending in 5678"', () => {
      const result = autoTag('Ending in 5678', { enabledTags: ['cardEnding'] });
      expect(result).toBe('Ending in five six seven eight');
    });

    it('converts "ending in 1234"', () => {
      const result = autoTag('ending in 1234', { enabledTags: ['cardEnding'] });
      expect(result).toBe('ending in one two three four');
    });

    it('converts "ends in 9999"', () => {
      const result = autoTag('ends in 9999', { enabledTags: ['cardEnding'] });
      expect(result).toBe('ends in nine nine nine nine');
    });

    it('converts "Your card ending in 0000"', () => {
      const result = autoTag('Your card ending in 0000', { enabledTags: ['cardEnding'] });
      expect(result).toBe('Your card ending in zero zero zero zero');
    });
  });

  describe('Last 4 digits pattern', () => {
    it('converts "last 4 digits: 5678"', () => {
      const result = autoTag('last 4 digits: 5678', { enabledTags: ['cardEnding'] });
      expect(result).toBe('last 4 digits: five six seven eight');
    });

    it('converts "last four digits 1234"', () => {
      const result = autoTag('last four digits 1234', { enabledTags: ['cardEnding'] });
      expect(result).toBe('last four digits one two three four');
    });
  });

  describe('In context', () => {
    it('converts card ending in full sentence', () => {
      const result = autoTag('Order #1: Ending in 5678');
      expect(result).toContain('Ending in five six seven eight');
      expect(result).toContain('number one');
    });
  });

  describe('False positive prevention', () => {
    it('does not convert "ending in" without 4 digits', () => {
      expect(autoTag('ending in disaster', { enabledTags: ['cardEnding'] })).toBe(
        'ending in disaster'
      );
    });

    it('does not convert numbers that are not 4 digits', () => {
      expect(autoTag('ending in 123', { enabledTags: ['cardEnding'] })).toBe('ending in 123');
      expect(autoTag('ending in 12345', { enabledTags: ['cardEnding'] })).toBe('ending in 12345');
    });
  });
});
