import {
  MAX_INPUT_LENGTH,
  autoTag,
  autoTagWithManual,
  english,
  extractAutoTags,
  extractTags,
  korean,
  manualTag,
  manualTagSelective,
} from '../src/index';

describe('public input length limit', () => {
  const atLimit = 'x'.repeat(MAX_INPUT_LENGTH);
  const overLimit = 'x'.repeat(MAX_INPUT_LENGTH + 1);

  it('exports and accepts the documented 10,000-character boundary', () => {
    expect(MAX_INPUT_LENGTH).toBe(10_000);
    expect(autoTag(atLimit, { language: 'en' })).toBe(atLimit);
  });

  it.each([
    ['autoTag', () => autoTag(overLimit)],
    ['manualTag', () => manualTag(overLimit)],
    ['autoTagWithManual', () => autoTagWithManual(overLimit)],
    ['extractAutoTags', () => extractAutoTags(overLimit)],
    ['extractTags', () => extractTags(overLimit)],
    [
      'manualTagSelective',
      () => manualTagSelective(overLimit, { allowedTags: ['name'], language: 'en' }),
    ],
    ['korean.autoTag', () => korean.autoTag(overLimit)],
    ['korean.autoTagWithManual', () => korean.autoTagWithManual(overLimit)],
    ['english.autoTag', () => english.autoTag(overLimit)],
    ['english.autoTagWithManual', () => english.autoTagWithManual(overLimit)],
  ])('rejects over-limit input in %s', (_name, invoke) => {
    expect(invoke).toThrow(RangeError);
    expect(invoke).toThrow(String(MAX_INPUT_LENGTH));
  });
});
