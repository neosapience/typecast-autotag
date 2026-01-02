import { autoTag } from '../../../src/english/auto-tag';

/**
 * False Positive prevention tests
 *
 * The most important aspect of auto-tagging is preventing false positives.
 * This test file verifies cases where auto-tagging should NOT be applied.
 */
describe('False Positive prevention', () => {
  describe('regular text should not be converted', () => {
    it('preserves English sentences', () => {
      expect(autoTag('Hello, how are you today?')).toBe('Hello, how are you today?');
    });

    it('preserves simple text', () => {
      expect(autoTag('Good morning everyone.')).toBe('Good morning everyone.');
    });

    it('does not convert simple numbers', () => {
      expect(autoTag('Number 12345')).toBe('Number 12345');
      expect(autoTag('Code: ABC123')).toBe('Code: ABC123');
    });
  });

  describe('similar but different pattern distinction', () => {
    it('4-digit numbers are not phone numbers', () => {
      expect(autoTag('Order number: 1234', { enabledTags: ['phone'] })).toBe('Order number: 1234');
    });

    it('5-digit or less numbers are not phone numbers', () => {
      expect(autoTag('PIN: 12345', { enabledTags: ['phone'] })).toBe('PIN: 12345');
    });

    it('invalid times with colons are not converted', () => {
      // Invalid times (25 hours, 61 minutes, etc.)
      expect(autoTag('25:00', { enabledTags: ['time'] })).toBe('25:00');
      expect(autoTag('12:61', { enabledTags: ['time'] })).toBe('12:61');
    });
  });

  describe('context-based distinction', () => {
    it('IP addresses are not converted as phone numbers', () => {
      expect(autoTag('Server: 192.168.1.1', { enabledTags: ['phone'] })).toBe(
        'Server: 192.168.1.1'
      );
    });

    it('version numbers are not converted as times', () => {
      // v2.3.1 like version numbers
      expect(autoTag('Version v2.3.1', { enabledTags: ['time'] })).toBe('Version v2.3.1');
    });

    it('MAC addresses are not converted', () => {
      expect(autoTag('MAC: 00:1A:2B:3C:4D:5E', { enabledTags: ['time'] })).toBe(
        'MAC: 00:1A:2B:3C:4D:5E'
      );
    });
  });

  describe('unit confusion prevention', () => {
    it('non-dollar units are not converted as money', () => {
      expect(autoTag('50 points', { enabledTags: ['money'] })).toBe('50 points');
      expect(autoTag('100 items', { enabledTags: ['money'] })).toBe('100 items');
    });

    it('non-point units are not converted as points', () => {
      expect(autoTag('$50', { enabledTags: ['point'] })).toBe('$50');
      expect(autoTag('10 people', { enabledTags: ['point'] })).toBe('10 people');
    });

    it('numbers without order suffix are not converted as order', () => {
      expect(autoTag('number 5', { enabledTags: ['order'] })).toBe('number 5');
      expect(autoTag('5 people', { enabledTags: ['order'] })).toBe('5 people');
    });
  });

  describe('date/time distinction', () => {
    it('datetime format converts both date and time together', () => {
      // datetime should take priority - both date and time should be converted
      const result = autoTag('2024-01-15T14:30');
      expect(result).toContain('two thirty PM'); // time also converted
      expect(result).toContain('fifteen'); // date also converted
    });

    it('date followed by space + time should be processed as datetime', () => {
      const result = autoTag('2024-01-15 14:30');
      // Should be processed as datetime all at once
      expect(result).toContain('January');
      expect(result).toContain('two thirty PM');
    });
  });

  describe('name/text string distinction', () => {
    it('regular words are not converted as names', () => {
      // Auto-tagging does not support names (too high false positive risk)
      expect(autoTag('Hello')).toBe('Hello');
      expect(autoTag('Thank you')).toBe('Thank you');
    });
  });

  describe('accuracy in complex patterns', () => {
    it('only correct parts are converted in sentences', () => {
      const text = 'Order 1234, Phone 555-123-4567';
      const result = autoTag(text, { enabledTags: ['phone'] });

      // Phone number should be converted while order number stays as-is
      expect(result).toContain('Order 1234');
      expect(result).toContain('five five five');
    });

    it('distinguishes dates from regular numbers', () => {
      const text = 'Date: 2024-01-15, Code: 2024';
      const result = autoTag(text, { enabledTags: ['date'] });

      expect(result).toContain('January'); // date converted
      expect(result).toContain('Code: 2024'); // regular number preserved
    });
  });

  describe('boundary conditions', () => {
    it('correctly handles patterns at start of string', () => {
      expect(autoTag('555-123-4567 is the number', { enabledTags: ['phone'] })).toContain(
        'five five five'
      );
    });

    it('correctly handles patterns at end of string', () => {
      expect(autoTag('Phone number: 555-123-4567', { enabledTags: ['phone'] })).toContain(
        'five five five'
      );
    });

    it('correctly handles patterns in parentheses', () => {
      expect(autoTag('(555-123-4567)', { enabledTags: ['phone'] })).toContain('five five five');
    });
  });
});
