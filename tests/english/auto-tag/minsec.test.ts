import { autoTag, autoMinsec } from '../../../src/english/auto-tag';

describe('autoTag - minsec (minutes/seconds auto-tagging)', () => {
  describe('shorthand format', () => {
    it('converts NmNs format', () => {
      expect(autoMinsec('3m20s')).toBe('three minutes twenty seconds');
      expect(autoMinsec('5m30s')).toBe('five minutes thirty seconds');
    });

    it('converts Nm format', () => {
      expect(autoMinsec('5m')).toBe('five minutes');
      expect(autoMinsec('30m')).toBe('thirty minutes');
    });

    it('converts Ns format', () => {
      expect(autoMinsec('30s')).toBe('thirty seconds');
      expect(autoMinsec('45s')).toBe('forty-five seconds');
    });

    it('converts NhNmNs format', () => {
      expect(autoMinsec('1h30m20s')).toBe('one hour thirty minutes twenty seconds');
      expect(autoMinsec('2h15m')).toBe('two hours fifteen minutes');
    });

    it('converts Nh format', () => {
      expect(autoMinsec('2h')).toBe('two hours');
    });
  });

  describe('full word format', () => {
    it('converts minutes/seconds', () => {
      expect(autoMinsec('5 minutes')).toBe('five minutes');
      expect(autoMinsec('30 seconds')).toBe('thirty seconds');
    });

    it('converts hour', () => {
      expect(autoMinsec('1 hour')).toBe('one hour');
      expect(autoMinsec('2 hours')).toBe('two hours');
    });

    it('converts min/sec abbreviations', () => {
      expect(autoMinsec('5min')).toBe('five minutes');
      expect(autoMinsec('30sec')).toBe('thirty seconds');
    });
  });

  describe('multiple times', () => {
    it('converts all times', () => {
      const result = autoMinsec('Wait 5m, process 30s');
      expect(result).toContain('five minutes');
      expect(result).toContain('thirty seconds');
    });
  });

  describe('False Positive prevention', () => {
    it('does not convert numbers without units', () => {
      expect(autoMinsec('Number 5')).toBe('Number 5');
    });

    it('does not convert month in date as minutes', () => {
      // 5m should not be interpreted as May
      expect(autoTag('2024-05-15', { enabledTags: ['minsec'] })).toBe('2024-05-15');
    });
  });

  describe('times in context', () => {
    it('converts times in sentences', () => {
      expect(autoMinsec('Wait time is about 5 minutes')).toBe('Wait time is about five minutes');
    });

    it('converts times in parentheses', () => {
      expect(autoMinsec('(3 minutes 20 seconds)')).toContain('three minutes');
    });
  });
});
