import { time } from '../../../src/english/tags/time';

describe('time', () => {
  describe('12-hour format (default)', () => {
    it('converts 14:30 to two thirty PM', () => {
      expect(time('14:30')).toBe('two thirty PM');
    });

    it('converts 09:05 to nine oh five AM', () => {
      expect(time('09:05')).toBe('nine oh five AM');
    });

    it('converts 12:00 to twelve PM (noon)', () => {
      expect(time('12:00')).toBe('twelve PM');
    });

    it('converts 00:00 to twelve AM (midnight)', () => {
      expect(time('00:00')).toBe('twelve AM');
    });

    it('converts 23:59 to eleven fifty-nine PM', () => {
      expect(time('23:59')).toBe('eleven fifty-nine PM');
    });

    it('converts 01:00 to one AM', () => {
      expect(time('01:00')).toBe('one AM');
    });

    it('converts 13:00 to one PM', () => {
      expect(time('13:00')).toBe('one PM');
    });
  });

  describe('24-hour format', () => {
    it('converts 00:00 to oh zero hundred', () => {
      expect(time('00:00', { use24Hour: true })).toBe('oh zero hundred');
    });

    it('converts 00:30 to oh zero thirty', () => {
      expect(time('00:30', { use24Hour: true })).toBe('oh zero thirty');
    });

    it('converts 09:05 to oh nine oh five', () => {
      expect(time('09:05', { use24Hour: true })).toBe('oh nine oh five');
    });

    it('converts 13:00 to thirteen hundred', () => {
      expect(time('13:00', { use24Hour: true })).toBe('thirteen hundred');
    });

    it('converts 14:30 to fourteen thirty', () => {
      expect(time('14:30', { use24Hour: true })).toBe('fourteen thirty');
    });

    it('converts 23:00 to twenty-three hundred', () => {
      expect(time('23:00', { use24Hour: true })).toBe('twenty-three hundred');
    });
  });

  describe('seconds included', () => {
    it('converts 14:30:45 to two thirty and forty-five seconds PM', () => {
      expect(time('14:30:45')).toBe('two thirty and forty-five seconds PM');
    });

    it('converts 09:05:10 to nine oh five and ten seconds AM', () => {
      expect(time('09:05:10')).toBe('nine oh five and ten seconds AM');
    });

    it('converts 00:00:00 to twelve AM (0 min 0 sec omitted)', () => {
      expect(time('00:00:00')).toBe('twelve AM');
    });

    it('converts 14:00:30 with seconds (minutes 0)', () => {
      expect(time('14:00:30')).toBe('two and thirty seconds PM');
    });
  });

  describe('numeric format input', () => {
    it('converts 4-digit "1430" to two thirty PM', () => {
      expect(time('1430')).toBe('two thirty PM');
    });

    it('converts 6-digit "143045" correctly', () => {
      expect(time('143045')).toBe('two thirty and forty-five seconds PM');
    });

    it('converts 4-digit "0905" to nine oh five AM', () => {
      expect(time('0905')).toBe('nine oh five AM');
    });
  });

  describe('single digit hours', () => {
    it('converts 9:30 to nine thirty AM', () => {
      expect(time('9:30')).toBe('nine thirty AM');
    });

    it('converts 1:05 to one oh five AM', () => {
      expect(time('1:05')).toBe('one oh five AM');
    });
  });

  describe('edge cases', () => {
    it('returns empty string for empty input', () => {
      expect(time('')).toBe('');
    });

    it('returns original for spaces only', () => {
      expect(time('   ')).toBe('   ');
    });

    it('returns original for invalid format', () => {
      expect(time('abc')).toBe('abc');
    });

    it('returns original for invalid time (25 hours)', () => {
      expect(time('25:00')).toBe('25:00');
    });

    it('returns original for invalid time (24 hours)', () => {
      expect(time('24:00')).toBe('24:00');
    });

    it('returns original for invalid minutes (60)', () => {
      expect(time('12:60')).toBe('12:60');
    });

    it('returns original for invalid seconds (60)', () => {
      expect(time('12:30:60')).toBe('12:30:60');
    });

    it('returns original for negative time', () => {
      expect(time('-1:00')).toBe('-1:00');
    });
  });

  describe('hour conversion verification', () => {
    it('converts 1:00 to one AM', () => {
      expect(time('01:00')).toBe('one AM');
    });

    it('converts 2:00 to two AM', () => {
      expect(time('02:00')).toBe('two AM');
    });

    it('converts 3:00 to three AM', () => {
      expect(time('03:00')).toBe('three AM');
    });

    it('converts 4:00 to four AM', () => {
      expect(time('04:00')).toBe('four AM');
    });

    it('converts 5:00 to five AM', () => {
      expect(time('05:00')).toBe('five AM');
    });

    it('converts 6:00 to six AM', () => {
      expect(time('06:00')).toBe('six AM');
    });

    it('converts 7:00 to seven AM', () => {
      expect(time('07:00')).toBe('seven AM');
    });

    it('converts 8:00 to eight AM', () => {
      expect(time('08:00')).toBe('eight AM');
    });

    it('converts 9:00 to nine AM', () => {
      expect(time('09:00')).toBe('nine AM');
    });

    it('converts 10:00 to ten AM', () => {
      expect(time('10:00')).toBe('ten AM');
    });

    it('converts 11:00 to eleven AM', () => {
      expect(time('11:00')).toBe('eleven AM');
    });

    it('converts 12:00 to twelve PM', () => {
      expect(time('12:00')).toBe('twelve PM');
    });
  });
});
