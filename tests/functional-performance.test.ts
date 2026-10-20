import { execFileSync } from 'node:child_process';
import {
  autoTag,
  autoTagWithManual,
  manualTag,
  extractAutoTags,
  extractTags,
  manualTagSelective,
  korean,
  english,
} from '../src';
import { patternMatches } from '../src/utils/pattern-matches';
import { numberToEnglish } from '../src/english/utils/number-to-english';
import { numberToKorean } from '../src/korean/utils/number-to-korean';

describe('numeric safety', () => {
  it.each(['ko', 'en'] as const)('preserves unsafe automatic numeric units in %s', (language) => {
    for (const value of ['9007199254740993', '9'.repeat(309)]) {
      const inputs = [
        `${value}P`,
        `${value}ms`,
        `${value}~${value}ms`,
        `${value}~${value}${language === 'ko' ? '개월' : ' months'}`,
        ...(language === 'ko' ? [`$${value}`, `$${value}.25`, `${value}인승`, `${value}동`] : []),
      ];
      for (const input of inputs) {
        expect(autoTag(input, { language })).toBe(input);
        expect(extractAutoTags(input, { language })).toEqual([]);
      }
    }
  });

  it('preserves Korean mixed amounts whose total exceeds the safe range', () => {
    const input = '9007199254740991억 1천만원';
    expect(korean.money(input)).toBe(input);
    expect(korean.money('3억 5천만원')).toBe('삼억 오천만원');
  });

  it('terminates for overflowing numeric strings in automatic and manual APIs', () => {
    // A subprocess timeout also catches native-style infinite loops that Jest cannot interrupt.
    execFileSync(
      process.execPath,
      [
        '--import',
        'tsx',
        '--eval',
        `
      const assert = require('node:assert/strict');
      const sdk = require('./src/index.ts');
      const value = '9'.repeat(309);
      for (const language of ['ko', 'en']) {
        assert.equal(sdk.manualTag('number(' + value + ')', {language}), value);
        assert.equal(sdk.manualTag('money(' + value + ')', {language}), value);
        const input = value + (language === 'ko' ? '원' : ' dollars');
        assert.equal(sdk.autoTag(input, {language}), input);
        assert.deepEqual(sdk.extractAutoTags(input, {language}), []);
      }
    `,
      ],
      { cwd: process.cwd(), timeout: 5000, stdio: 'pipe' }
    );
  });

  it.each([korean.numberTag, english.numberTag, korean.money, english.money])(
    'preserves unsupported integer strings and numeric inputs',
    (convert) => {
      for (const value of [
        '9007199254740992',
        '9007199254740993',
        '-9007199254740993',
        '12345678901234567890',
      ]) {
        expect(convert(value)).toBe(value);
      }
      expect(convert(9007199254740992)).toBe('9007199254740992');
    }
  );

  it.each([numberToEnglish, numberToKorean])('guards shared number conversion', (convert) => {
    for (const value of [Infinity, -Infinity, NaN, 9007199254740992])
      expect(convert(value)).toBe(String(value));
  });

  it.each(['ko', 'en'] as const)(
    'preserves unsafe decimals and contextual amounts in %s',
    (language) => {
      for (const input of ['9007199254740993.50', '9'.repeat(309) + '.25']) {
        expect(manualTag(`money(${input})`, { language })).toBe(input);
      }
      expect(
        autoTag('9007199254740993' + (language === 'ko' ? '원' : ' dollars'), { language })
      ).toBe('9007199254740993' + (language === 'ko' ? '원' : ' dollars'));
    }
  );
});

describe('localized currency', () => {
  it.each([
    ['spa', 'menos cincuenta euros'],
    ['deu', 'minus fünfzig Euro'],
    ['fra', 'moins cinquante euros'],
  ] as const)('retains negative currency signs in %s', (language, expected) => {
    for (const input of ['-50€', '-€50', '€-50', '−50€', '−€50']) {
      expect(autoTag(input, { language })).toBe(expected);
      expect(manualTag(`money(${input})`, { language })).toBe(expected);
    }
    expect(autoTag('50€', { language })).not.toBe(expected);
  });

  it.each(['spa', 'deu', 'fra', 'ara'] as const)(
    'preserves unsupported currency precision in %s',
    (language) => {
      for (const input of [
        '1.' + '1'.repeat(101) + '€',
        '1.' + '1'.repeat(21) + '€',
        '9007199254740993€',
        '-9007199254740993€',
        '999999999999999.99€',
        '1.12345678901234567890€',
      ]) {
        expect(autoTag(input, { language })).toBe(input);
        expect(manualTag(`money(${input})`, { language })).toBe(input);
        expect(extractAutoTags(input, { language })).toEqual([]);
      }
      expect(autoTag('1.25€ 2.50€', { language })).not.toContain('1.25');
    }
  );
});

describe('parenthesized phone numbers', () => {
  it.each(['en', 'spa'] as const)(
    'handles one-level parentheses consistently in %s',
    (language) => {
      const input = 'phone(+1 (202) 555-0175)';
      const expected = manualTag('phone(+1 202 555-0175)', { language });
      expect(manualTag(input, { language })).toBe(expected);
      expect(autoTagWithManual(input, { language })).toBe(expected);
      expect(manualTagSelective(input, { language, allowedTags: ['phone'] })).toBe(expected);
      expect(extractTags(input, { language })).toEqual([
        { tag: 'phone', value: '+1 (202) 555-0175', start: 0, end: input.length },
      ]);
    }
  );
});

describe('numeric pattern boundaries', () => {
  it.each(['101, 102동 304호', '101,102동 304호'])(
    'matches comma addresses after a numeric prefix: %s',
    (input) => {
      expect(autoTag(input)).toBe('101백이동 삼백사호');
      expect(extractAutoTags(input)).toEqual([
        { original: input.slice(3), tagType: 'address', start: 3, end: input.length },
      ]);
    }
  );
  it.each(['엘지아파트, 102동 304호', '엘지아파트,102동 304호'])(
    'keeps literal comma address patterns: %s',
    (input) => {
      expect(autoTag(input)).toBe('엘지아파트백이동 삼백사호');
      expect(extractAutoTags(input).some((tag) => tag.tagType === 'address')).toBe(true);
    }
  );
  it('does not read a fractional duration as an integer suffix', () => {
    expect(autoTag('0.4 months', { language: 'en' })).toBe('0.4 months');
    expect(extractAutoTags('0.4 months', { language: 'en' })).toEqual([]);
  });
  it('keeps original offsets and adjacent matches around punctuation', () => {
    const text = 'x,5kg,6kg 7kg.8kg';
    expect(patternMatches(text, /\d+kg/g)).toEqual([
      { original: '5kg', start: 2 },
      { original: '6kg', start: 6 },
      { original: '7kg', start: 10 },
      { original: '8kg', start: 14 },
    ]);
    expect(patternMatches('1,234kg', /\d+kg/g)).toEqual([]);
    expect(patternMatches('1,234kg', /[\d,]+kg/g)).toEqual([{ original: '1,234kg', start: 0 }]);
    expect(patternMatches('١٢٣kg', /\p{Nd}+kg/gu)).toEqual([{ original: '١٢٣kg', start: 0 }]);
    expect(patternMatches('𝟙𝟚kg,𝟛kg', /\p{Nd}+kg/gu)).toEqual([
      { original: '𝟙𝟚kg', start: 0 },
      { original: '𝟛kg', start: 7 },
    ]);
    expect(patternMatches('abc', /(?:)/g)).toEqual([]);
  });

  it.each(['ko', 'en', 'spa'] as const)(
    'handles long non-matching numbers without blocking in %s',
    (language) => {
      execFileSync(
        process.execPath,
        [
          '--import',
          'tsx',
          '--eval',
          `
      const assert = require('node:assert/strict');
      const sdk = require('./src/index.ts');
      for (const input of ['9'.repeat(10000), '999,'.repeat(2499) + '999']) {
        const output = sdk.autoTag(input, {language: '${language}'});
        assert.equal(output, input);
      }
    `,
        ],
        { cwd: process.cwd(), timeout: 5000, stdio: 'pipe' }
      );
    }
  );
});

describe('formatter reuse', () => {
  it('reuses only formatters with the same language and options', () => {
    const numberFormatter = jest.spyOn(Intl, 'NumberFormat');
    const dateFormatter = jest.spyOn(Intl, 'DateTimeFormat');
    try {
      const input = '€51.25;€61.25;€71.50;2024-01-15;2024-02-16;14:30;15:45;16:20:30';
      const output = autoTag(input, { language: 'bul' });
      expect(autoTag(input, { language: 'bul' })).toBe(output);
      expect(numberFormatter).toHaveBeenCalledTimes(1);
      expect(dateFormatter).toHaveBeenCalledTimes(3);
      autoTag('$51.25;€51;€51.2500', { language: 'bul' });
      expect(numberFormatter).toHaveBeenCalledTimes(4);
    } finally {
      numberFormatter.mockRestore();
      dateFormatter.mockRestore();
    }
  });
});
