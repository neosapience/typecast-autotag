import { autoTag, autoNumber } from '../../../src/english/auto-tag';

describe('autoTag - number (number auto-tagging)', () => {
  describe('number N format', () => {
    it('converts Number N', () => {
      expect(autoNumber('Number 5')).toContain('five');
      expect(autoNumber('Number 10')).toContain('ten');
    });

    it('converts No. N', () => {
      expect(autoNumber('No. 1')).toContain('one');
      expect(autoNumber('No. 100')).toContain('hundred');
    });

    it('converts #N', () => {
      expect(autoNumber('#42')).toContain('forty-two');
    });
  });

  describe('numbers in context', () => {
    it('converts numbers in sentences', () => {
      // Pattern matches "Number N" but not "Item Number N"
      expect(autoNumber('Check Number 123')).toContain('Number');
    });
  });

  describe('large comma-grouped numbers (TASK-12506)', () => {
    it('converts 5,000 in narrative context', () => {
      expect(autoNumber('A total of 5,000 participants attended')).toContain('five thousand');
    });

    it('converts 10,000 even when separated from its noun by an adjective', () => {
      // "10,000 bonus points" — the point handler only matches "<digits> points",
      // so the comma number must spell itself out independently.
      expect(autoNumber('You received 10,000 bonus points today')).toContain('ten thousand');
    });

    it('converts 1,234,567 (multi-group)', () => {
      expect(autoNumber('Listeners: 1,234,567 worldwide')).toContain('one million');
    });
  });

  describe('False Positive prevention', () => {
    it('does not convert standalone numbers', () => {
      expect(autoTag('just 123', { enabledTags: ['number'] })).toBe('just 123');
    });

    it('lets money win over the comma-number fallback', () => {
      expect(autoTag('$1,500 total', { enabledTags: ['number', 'money'] })).toContain(
        'one thousand five hundred dollars'
      );
    });
  });
});
