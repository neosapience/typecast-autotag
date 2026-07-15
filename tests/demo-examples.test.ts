import {
  aiccExamplesJa,
  aiccExamplesZh,
  aiccExamplesZhTw,
  examplesEn,
  examplesJa,
  examplesKo,
  examplesZh,
  examplesZhTw,
} from '../demo-html/src/examples';
import { chinese, english, japanese, korean, taiwaneseMandarin } from '../src/index';

describe('demo example consistency', () => {
  it.each([
    ['Korean', examplesKo, korean.autoTag, korean.autoTagWithManual],
    ['English', examplesEn, english.autoTag, english.autoTagWithManual],
    ['Japanese', examplesJa, japanese.autoTag, japanese.autoTagWithManual],
    ['Chinese', examplesZh, chinese.autoTag, chinese.autoTagWithManual],
    [
      'Taiwan Mandarin',
      examplesZhTw,
      taiwaneseMandarin.autoTag,
      taiwaneseMandarin.autoTagWithManual,
    ],
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

  it('keeps Japanese AICC scenarios free of numeric placeholders', () => {
    for (const example of aiccExamplesJa) {
      expect({ id: example.id, result: japanese.autoTag(example.input) }).toEqual({
        id: example.id,
        result: expect.not.stringMatching(/\d/),
      });
    }
  });

  it('keeps Chinese AICC scenarios free of numeric placeholders', () => {
    for (const example of aiccExamplesZh) {
      expect({ id: example.id, result: chinese.autoTag(example.input) }).toEqual({
        id: example.id,
        result: expect.not.stringMatching(/\d/),
      });
    }
  });

  it('keeps Taiwan Mandarin AICC scenarios free of numeric placeholders', () => {
    for (const example of aiccExamplesZhTw) {
      expect({ id: example.id, result: taiwaneseMandarin.autoTag(example.input) }).toEqual({
        id: example.id,
        result: expect.not.stringMatching(/\d/),
      });
    }
  });
});
