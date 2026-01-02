import { autoTag } from '../../../src/english/auto-tag';

describe('autoTag - simpleDigitContext (press N, dial N, etc.)', () => {
  describe('Press N pattern', () => {
    it('converts "press 1"', () => {
      const result = autoTag('press 1', { enabledTags: ['simpleDigitContext'] });
      expect(result).toBe('press one');
    });

    it('converts "Press 2"', () => {
      const result = autoTag('Press 2', { enabledTags: ['simpleDigitContext'] });
      expect(result).toBe('Press two');
    });

    it('converts "press 0 for operator"', () => {
      const result = autoTag('press 0 for operator', { enabledTags: ['simpleDigitContext'] });
      expect(result).toBe('press zero for operator');
    });
  });

  describe('Dial N pattern', () => {
    it('converts "dial 9"', () => {
      const result = autoTag('dial 9', { enabledTags: ['simpleDigitContext'] });
      expect(result).toBe('dial nine');
    });
  });

  describe('Enter N pattern', () => {
    it('converts "enter 5"', () => {
      const result = autoTag('enter 5', { enabledTags: ['simpleDigitContext'] });
      expect(result).toBe('enter five');
    });
  });

  describe('Type N pattern', () => {
    it('converts "type 3"', () => {
      const result = autoTag('type 3', { enabledTags: ['simpleDigitContext'] });
      expect(result).toBe('type three');
    });
  });

  describe('Hit N pattern', () => {
    it('converts "hit 4"', () => {
      const result = autoTag('hit 4', { enabledTags: ['simpleDigitContext'] });
      expect(result).toBe('hit four');
    });
  });

  describe('Option N pattern', () => {
    it('converts "option 1"', () => {
      const result = autoTag('option 1', { enabledTags: ['simpleDigitContext'] });
      expect(result).toBe('option one');
    });

    it('converts "select option 3"', () => {
      const result = autoTag('select option 3', { enabledTags: ['simpleDigitContext'] });
      expect(result).toBe('select option three');
    });
  });

  describe('Choice N pattern', () => {
    it('converts "choice 2"', () => {
      const result = autoTag('choice 2', { enabledTags: ['simpleDigitContext'] });
      expect(result).toBe('choice two');
    });
  });

  describe('Step N pattern', () => {
    it('converts "step 1"', () => {
      const result = autoTag('step 1', { enabledTags: ['simpleDigitContext'] });
      expect(result).toBe('step one');
    });
  });

  describe('In full context', () => {
    it('converts in IVR prompt', () => {
      const result = autoTag('Please press 1 to continue or press 2 to speak to an agent');
      expect(result).toContain('press one');
      expect(result).toContain('press two');
    });
  });

  describe('False positive prevention', () => {
    it('does not convert multi-digit numbers', () => {
      // Multi-digit should not match
      expect(autoTag('press 12', { enabledTags: ['simpleDigitContext'] })).toBe('press 12');
      expect(autoTag('dial 911', { enabledTags: ['simpleDigitContext'] })).toBe('dial 911');
    });

    it('does not convert without keyword', () => {
      expect(autoTag('number 5', { enabledTags: ['simpleDigitContext'] })).toBe('number 5');
    });
  });
});
