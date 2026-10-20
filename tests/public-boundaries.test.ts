import {
  autoTag,
  manualTag,
  autoTagWithManual,
  extractAutoTags,
  extractTags,
  manualTagSelective,
  getSupportedLanguages,
  getSupportedAutoTags,
  getSupportedManualTags,
  setDefaultLanguage,
  getDefaultLanguage,
  korean,
  english,
  japanese,
  chinese,
  taiwaneseMandarin,
  MAX_INPUT_LENGTH,
  type SupportedLanguage,
} from '../src';
import { convertInput } from '../demo-html/src/convert-input';

describe('public API boundaries', () => {
  afterEach(() => setDefaultLanguage('ko'));

  it.each(['constructor', '__proto__', 'toString', 'valueOf', 'unsupported'])(
    'rejects %s without changing the default',
    (invalid) => {
      const language = invalid as SupportedLanguage;
      for (const invoke of [
        () => setDefaultLanguage(language),
        () => autoTag('42', { language }),
        () => manualTag('number(42)', { language }),
        () => autoTagWithManual('42', { language }),
        () => extractAutoTags('42', { language }),
        () => extractTags('number(42)', { language }),
        () => manualTagSelective('number(42)', { language, allowedTags: [] }),
        () => getSupportedAutoTags(language),
        () => getSupportedManualTags(language),
      ])
        expect(invoke).toThrow(`Unsupported language: ${invalid}`);
      expect(getDefaultLanguage()).toBe('ko');
    }
  );

  it.each(getSupportedLanguages())('preserves public input limits for %s', (language) => {
    const options = { language };
    for (const convert of [autoTag, manualTag, autoTagWithManual]) {
      expect(convert('', options)).toBe('');
      expect(() => convert('x'.repeat(MAX_INPUT_LENGTH + 1), options)).toThrow(RangeError);
    }
    expect(extractTags('', options)).toEqual([]);
    expect(extractAutoTags('', options)).toEqual([]);
    expect(() => extractTags('x'.repeat(MAX_INPUT_LENGTH + 1), options)).toThrow(RangeError);
    expect(() => extractAutoTags('x'.repeat(MAX_INPUT_LENGTH + 1), options)).toThrow(RangeError);
    expect(manualTagSelective('', { language, allowedTags: ['number'] })).toBe('');
    expect(manualTagSelective('number(42)', { language, allowedTags: [] })).toBe('number(42)');
    expect(manualTagSelective('number(42)', { language, allowedTags: ['unknown'] })).toBe(
      'number(42)'
    );
    expect(manualTagSelective('number(42)', { language, allowedTags: ['number'] })).toBe(
      manualTag('number(42)', options)
    );
    expect(autoTag('25℃ 10kg', { language, enabledTags: [] })).toBe('25℃ 10kg');
    expect(autoTag('25℃ 10kg', { language, enabledTags: ['unknown'] })).toBe('25℃ 10kg');
    const enabledTags = ['constructor', '__proto__', 'toString'];
    expect(autoTag('25℃ 10kg', { language, enabledTags })).toBe('25℃ 10kg');
    expect(extractAutoTags('25℃ 10kg', { language, enabledTags })).toEqual([]);
  });

  it.each(getSupportedLanguages())(
    'protects manual readings and accepts expanded output in %s',
    (language) => {
      const input = 'phone(010-1234-5678) '.repeat(400);
      expect(input.length).toBe(8400);
      expect(autoTagWithManual(input, { language })).toBe(manualTag(input, { language }));
      const part = 'phone(010-1234-5678)';
      expect(autoTagWithManual(`${part} / 50 USD`, { language })).toBe(
        manualTag(part, { language }) + autoTag(' / 50 USD', { language })
      );
    }
  );

  it.each([korean, english, japanese, chinese, taiwaneseMandarin])(
    'keeps namespace composition consistent with manual readings',
    (module) => {
      const input = 'phone(010-1234-5678) '.repeat(400);
      expect(module.autoTagWithManual(input)).toBe(module.manualTag(input));
      expect(module.autoTagWithManual('')).toBe('');
      expect(() => module.autoTagWithManual('x'.repeat(MAX_INPUT_LENGTH + 1))).toThrow(RangeError);
    }
  );

  it('extracts and preserves nested Korean manual tags', () => {
    const input = 'address(102동 1101호 (엘지동, 아파트))';
    expect(extractTags(input)).toEqual([
      { tag: 'address', value: '102동 1101호 (엘지동, 아파트)', start: 0, end: input.length },
    ]);
    expect(autoTagWithManual(input)).toBe(manualTag(input));
  });

  it('contains demo conversion errors and recovers on the next input', () => {
    expect(convertInput('x'.repeat(MAX_INPUT_LENGTH + 1), autoTag)).toEqual({
      text: '',
      error: true,
    });
    expect(convertInput('안녕하세요', autoTag)).toEqual({ text: '안녕하세요', error: false });
  });
});
