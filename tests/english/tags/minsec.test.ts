import { minsec } from '../../../src/english/tags/minsec';

describe('minsec', () => {
  describe('basic operation', () => {
    it('converts minutes and seconds to English', () => {
      expect(minsec('3m20s')).toBe('three minutes twenty seconds');
    });

    it('handles minutes only', () => {
      expect(minsec('5m')).toBe('five minutes');
    });

    it('handles seconds only', () => {
      expect(minsec('30s')).toBe('thirty seconds');
    });

    it('handles 1 minute (singular)', () => {
      expect(minsec('1m')).toBe('one minute');
    });

    it('handles 1 second (singular)', () => {
      expect(minsec('1s')).toBe('one second');
    });
  });

  describe('hour support', () => {
    it('handles hours only', () => {
      expect(minsec('2h')).toBe('two hours');
    });

    it('handles 1 hour (singular)', () => {
      expect(minsec('1h')).toBe('one hour');
    });

    it('handles hours and minutes', () => {
      expect(minsec('1h30m')).toBe('one hour thirty minutes');
    });

    it('handles hours, minutes, and seconds', () => {
      expect(minsec('1h30m45s')).toBe('one hour thirty minutes forty-five seconds');
    });

    it('handles hours and seconds only', () => {
      expect(minsec('2h15s')).toBe('two hours fifteen seconds');
    });
  });

  describe('English word format support', () => {
    it('handles hour format', () => {
      expect(minsec('3 hour')).toBe('three hours');
    });

    it('handles hours format', () => {
      expect(minsec('2 hours')).toBe('two hours');
    });

    it('handles minute format', () => {
      expect(minsec('5 minute')).toBe('five minutes');
    });

    it('handles minutes format', () => {
      expect(minsec('5 minutes')).toBe('five minutes');
    });

    it('handles min format', () => {
      expect(minsec('5min')).toBe('five minutes');
    });

    it('handles second format', () => {
      expect(minsec('30 second')).toBe('thirty seconds');
    });

    it('handles seconds format', () => {
      expect(minsec('30 seconds')).toBe('thirty seconds');
    });

    it('handles sec format', () => {
      expect(minsec('30sec')).toBe('thirty seconds');
    });

    it('handles hr format', () => {
      expect(minsec('2hr')).toBe('two hours');
    });

    it('handles hrs format', () => {
      expect(minsec('2hrs')).toBe('two hours');
    });
  });

  describe('various times', () => {
    it('handles 1 minute 1 second', () => {
      expect(minsec('1m1s')).toBe('one minute one second');
    });

    it('handles 10 minutes 10 seconds', () => {
      expect(minsec('10m10s')).toBe('ten minutes ten seconds');
    });

    it('handles large numbers', () => {
      expect(minsec('60m59s')).toBe('sixty minutes fifty-nine seconds');
    });
  });

  describe('case and whitespace handling', () => {
    it('recognizes uppercase', () => {
      expect(minsec('3M20S')).toBe('three minutes twenty seconds');
    });

    it('recognizes mixed case', () => {
      expect(minsec('1H30m45S')).toBe('one hour thirty minutes forty-five seconds');
    });
  });

  describe('normalize option', () => {
    it('does not normalize by default', () => {
      expect(minsec('90s')).toBe('ninety seconds');
    });

    it('shows as-is when normalize is disabled', () => {
      expect(minsec('90s', { normalize: false })).toBe('ninety seconds');
    });
  });

  describe('edge cases', () => {
    it('returns empty string for empty input', () => {
      expect(minsec('')).toBe('');
    });

    it('returns original for non-minsec format', () => {
      expect(minsec('abc')).toBe('abc');
    });

    it('returns original for unsupported compound format', () => {
      // Compound formats without spaces are not supported
      expect(minsec('3minute2seconds')).toBe('3minute2seconds');
    });

    it('returns original for unsupported formats with whitespace in abbreviated', () => {
      // Whitespace between abbreviated units is not supported
      expect(minsec('3m 20s')).toBe('3m 20s');
    });

    it('returns original for number only', () => {
      expect(minsec('123')).toBe('123');
    });

    it('returns original for zero only', () => {
      expect(minsec('0')).toBe('0');
    });

    it('returns original for unsupported zero formats', () => {
      expect(minsec('0m0s')).toBe('0m0s');
      expect(minsec('0h0m0s')).toBe('0h0m0s');
    });

    it('returns original for decimal formats', () => {
      expect(minsec('0.3s')).toBe('0.3s');
      expect(minsec('1.5s')).toBe('1.5s');
    });
  });
});
