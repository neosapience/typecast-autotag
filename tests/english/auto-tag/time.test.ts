import { autoTime } from '../../../src/english/auto-tag';

describe('autoTag - time (time auto-tagging)', () => {
  describe('HH:MM format', () => {
    it('converts 14:30', () => {
      expect(autoTime('Meeting at 14:30.')).toContain('two thirty PM');
    });

    it('converts 09:05', () => {
      expect(autoTime('Morning 09:05')).toContain('nine oh five AM');
    });

    it('converts 00:00 (midnight)', () => {
      expect(autoTime('Midnight 00:00')).toContain('twelve AM');
    });

    it('converts 12:00 (noon)', () => {
      expect(autoTime('Lunch 12:00')).toContain('twelve PM');
    });

    it('converts 23:59', () => {
      expect(autoTime('Deadline 23:59')).toContain('eleven fifty-nine PM');
    });
  });

  describe('HH:MM:SS format', () => {
    it('converts 14:30:45', () => {
      expect(autoTime('Start: 14:30:45')).toContain('two thirty');
      expect(autoTime('Start: 14:30:45')).toContain('forty-five');
    });

    it('converts 09:00:00', () => {
      expect(autoTime('Check-in: 09:00:00')).toContain('nine AM');
    });
  });

  describe('AM/PM format', () => {
    it('converts 2:30 PM', () => {
      expect(autoTime('At 2:30 PM')).toContain('two thirty PM');
    });

    it('converts 9:05 AM', () => {
      expect(autoTime('At 9:05 AM')).toContain('nine oh five AM');
    });

    it('converts 12:00 AM (midnight)', () => {
      expect(autoTime('At 12:00 AM')).toContain('twelve AM');
    });

    it('converts 12:00 PM (noon)', () => {
      expect(autoTime('At 12:00 PM')).toContain('twelve PM');
    });
  });

  describe('multiple times', () => {
    it('converts all times', () => {
      const result = autoTime('Start 09:00 AM, End 06:00 PM');
      expect(result).toContain('nine AM');
      expect(result).toContain('six PM');
    });
  });

  describe('False Positive prevention', () => {
    it('does not convert version numbers as times', () => {
      // "1:2" format with single digit minute is not time
      expect(autoTime('Version 1:2')).toBe('Version 1:2');
    });

    it('does not convert IP address ports as times', () => {
      // Port numbers above 59 are not times
      expect(autoTime('192.168.1.1:8080')).toBe('192.168.1.1:8080');
    });
  });

  describe('times in context', () => {
    it('converts times in parentheses', () => {
      expect(autoTime('Meeting (2:30 PM)')).toContain('two thirty PM');
    });

    it('converts times at end of sentence', () => {
      expect(autoTime('Closing time is 6:00 PM')).toContain('six PM');
    });
  });
});
