import { autoTag, autoMonth } from '../../../src/english/auto-tag';

describe('autoTag - month (month auto-tagging)', () => {
  describe('full month names', () => {
    it('keeps January as-is', () => {
      // Month names are already in English, so just verification
      expect(autoMonth('January')).toBe('January');
    });

    it('keeps December as-is', () => {
      expect(autoMonth('December')).toBe('December');
    });
  });

  describe('months in context', () => {
    it('handles months in sentences', () => {
      expect(autoMonth('Meeting in January')).toBe('Meeting in January');
    });
  });

  describe('False Positive prevention', () => {
    it('does not match month when followed by date', () => {
      // "January 15" should be handled by date tag, not month
      expect(autoTag('January 15, 2024', { enabledTags: ['month'] })).toBe('January 15, 2024');
    });
  });
});
