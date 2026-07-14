import { examplesEn, examplesKo } from '../demo-html/src/examples';
import { english, korean } from '../src/index';

describe('demo example consistency', () => {
  it.each([
    ['Korean', examplesKo, korean.autoTag, korean.autoTagWithManual],
    ['English', examplesEn, english.autoTag, english.autoTagWithManual],
  ] as const)(
    '%s examples do not leave numeric placeholders behind',
    (_language, examples, tag, tagWithManual) => {
      for (const example of examples) {
        const result = example.hasManualTag
          ? tagWithManual(example.original)
          : tag(example.original);
        expect({ id: example.id, result }).toEqual({
          id: example.id,
          result: expect.not.stringMatching(/\d/),
        });
      }
    }
  );

  it('keeps the large-currency and ranking examples executable', () => {
    expect(english.autoTag(examplesEn.find((example) => example.id === 11)!.original)).toContain(
      'two point five million dollars'
    );
    expect(english.autoTag(examplesEn.find((example) => example.id === 14)!.original)).toContain(
      'first prize'
    );
  });
});
