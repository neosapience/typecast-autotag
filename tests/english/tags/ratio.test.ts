import { ratio } from '../../../src/english/tags/ratio';

describe('ratio', () => {
  describe('colon ratio - basic', () => {
    it('converts 1:1 to one to one', () => {
      expect(ratio('1:1')).toBe('one to one');
    });

    it('converts 7:3 to seven to three', () => {
      expect(ratio('7:3')).toBe('seven to three');
    });

    it('converts 1:2:3 to one to two to three', () => {
      expect(ratio('1:2:3')).toBe('one to two to three');
    });

    it('converts 10:90 to ten to ninety', () => {
      expect(ratio('10:90')).toBe('ten to ninety');
    });

    it('converts 50:50 to fifty to fifty', () => {
      expect(ratio('50:50')).toBe('fifty to fifty');
    });
  });

  describe('colon ratio - with spaces', () => {
    it('converts 1 : 1 to one to one', () => {
      expect(ratio('1 : 1')).toBe('one to one');
    });

    it('converts 7 :3 to seven to three', () => {
      expect(ratio('7 :3')).toBe('seven to three');
    });

    it('converts 1: 2: 3 to one to two to three', () => {
      expect(ratio('1: 2: 3')).toBe('one to two to three');
    });
  });

  describe('percent', () => {
    it('converts 15% to fifteen percent', () => {
      expect(ratio('15%')).toBe('fifteen percent');
    });

    it('converts 100% to one hundred percent', () => {
      expect(ratio('100%')).toBe('one hundred percent');
    });

    it('converts 0% to zero percent', () => {
      expect(ratio('0%')).toBe('zero percent');
    });

    it('converts 50% to fifty percent', () => {
      expect(ratio('50%')).toBe('fifty percent');
    });

    it('converts 1% to one percent', () => {
      expect(ratio('1%')).toBe('one percent');
    });
  });

  describe('percent - decimal', () => {
    it('converts 3.5% to three point five percent', () => {
      expect(ratio('3.5%')).toBe('three point five percent');
    });

    it('converts 0.1% to zero point one percent', () => {
      expect(ratio('0.1%')).toBe('zero point one percent');
    });

    it('converts 99.99% to ninety-nine point nine nine percent', () => {
      expect(ratio('99.99%')).toBe('ninety-nine point nine nine percent');
    });
  });

  describe('percent - with space', () => {
    it('converts 15 % to fifteen percent', () => {
      expect(ratio('15 %')).toBe('fifteen percent');
    });
  });

  describe('multiplier (times)', () => {
    it('converts 2x to two times', () => {
      expect(ratio('2x')).toBe('two times');
    });

    it('converts 10x to ten times', () => {
      expect(ratio('10x')).toBe('ten times');
    });

    it('converts 100x to one hundred times', () => {
      expect(ratio('100x')).toBe('one hundred times');
    });

    it('converts 1x to one time', () => {
      expect(ratio('1x')).toBe('one time');
    });

    it('converts 3x to three times', () => {
      expect(ratio('3x')).toBe('three times');
    });
  });

  describe('multiplier - decimal', () => {
    it('converts 1.5x to one point five times', () => {
      expect(ratio('1.5x')).toBe('one point five times');
    });

    it('converts 2.5x to two point five times', () => {
      expect(ratio('2.5x')).toBe('two point five times');
    });

    it('converts 0.5x to zero point five times', () => {
      expect(ratio('0.5x')).toBe('zero point five times');
    });
  });

  describe('multiplier - with space', () => {
    it('converts 2 x to two times', () => {
      expect(ratio('2 x')).toBe('two times');
    });
  });

  describe('edge cases', () => {
    it('returns empty string for empty input', () => {
      expect(ratio('')).toBe('');
    });

    it('returns original for number only', () => {
      expect(ratio('123')).toBe('123');
    });

    it('returns original for plain text', () => {
      expect(ratio('hello')).toBe('hello');
    });
  });

  describe('options', () => {
    // Note: separator and percentUnit options are not implemented yet
    it('uses default separator (to)', () => {
      expect(ratio('1:2')).toBe('one to two');
    });

    it('uses default percent unit', () => {
      expect(ratio('50%')).toBe('fifty percent');
    });
  });
});
