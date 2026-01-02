import { autoTag, autoPhone } from '../../../src/english/auto-tag';

describe('autoTag - phone (phone number auto-tagging)', () => {
  describe('US phone number format', () => {
    it('converts xxx-xxx-xxxx format', () => {
      expect(autoPhone('Phone: 555-123-4567')).toContain('five five five');
      expect(autoPhone('Phone: 555-123-4567')).toContain('one two three');
      expect(autoPhone('Phone: 555-123-4567')).toContain('four five six seven');
    });

    it('converts (xxx) xxx-xxxx format', () => {
      const result = autoPhone('Call (555) 123-4567');
      expect(result).toContain('five five five');
      expect(result).toContain('one two three');
    });

    it('converts xxx.xxx.xxxx format', () => {
      expect(autoPhone('Contact: 555.123.4567')).toContain('five five five');
    });

    it('converts space-separated phone numbers', () => {
      expect(autoPhone('555 123 4567 please call')).toContain('five five five');
    });
  });

  describe('toll-free numbers', () => {
    it('converts 1-800 numbers', () => {
      expect(autoPhone('1-800-555-1234')).toContain('one');
      expect(autoPhone('1-800-555-1234')).toContain('eight zero zero');
    });

    it('converts 1-888 numbers', () => {
      expect(autoPhone('1-888-555-4321')).toContain('eight eight eight');
    });
  });

  describe('emergency numbers', () => {
    it('converts 911', () => {
      expect(autoPhone('Call 911 immediately')).toBe('Call nine one one immediately');
    });
  });

  describe('multiple phone numbers', () => {
    it('converts all phone numbers', () => {
      const result = autoPhone('Main: 555-111-2222, Fax: 555-333-4444');
      expect(result).toContain('one one one');
      expect(result).toContain('three three three');
    });
  });

  describe('False Positive prevention', () => {
    it('does not convert regular numbers', () => {
      // 4-digit numbers are not phone numbers
      expect(autoPhone('Order number 1234')).toBe('Order number 1234');
    });

    it('does not convert years', () => {
      expect(autoTag('year 2024', { enabledTags: ['phone'] })).toBe('year 2024');
    });

    it('does not treat dates as phone numbers', () => {
      expect(autoTag('2024-01-15', { enabledTags: ['phone'] })).toBe('2024-01-15');
    });

    it('does not treat times as phone numbers', () => {
      expect(autoTag('14:30', { enabledTags: ['phone'] })).toBe('14:30');
    });
  });

  describe('phone numbers in context', () => {
    it('converts phone numbers in middle of sentence', () => {
      expect(autoPhone('John (555-123-4567) called back.')).toContain('five five five');
    });
  });
});
