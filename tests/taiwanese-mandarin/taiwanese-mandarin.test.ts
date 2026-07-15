import {
  autoTag as topLevelAutoTag,
  autoTagWithManual as topLevelAutoTagWithManual,
  getDefaultLanguage,
  getSupportedAutoTags,
  getSupportedLanguages,
  getSupportedManualTags,
  setDefaultLanguage,
  taiwaneseMandarin,
} from '../../src';

describe('Taiwan Mandarin auto-tagging', () => {
  it.each([
    ['0', '零'],
    ['14', '十四'],
    ['10010', '一萬零一十'],
    ['100000001', '一億零一'],
    ['-72.5', '負七十二點五'],
  ])('reads cardinal number %s', (input, expected) => {
    expect(taiwaneseMandarin.numberToTaiwaneseMandarin(input)).toBe(expected);
  });

  it.each([
    ['手機號碼是0912-345-678。', '手機號碼是零·九·一·二、三·四·五、六·七·八。'],
    ['市話是02-2345-6789。', '市話是零·二、二·三·四·五、六·七·八·九。'],
    ['郵遞區號是10617。', '郵遞區號是一·零·六·一·七。'],
    ['郵遞區號是106-409。', '郵遞區號是一·零·六、四·零·九。'],
  ])('reads Taiwan phone and postal formats: %s', (input, expected) => {
    expect(taiwaneseMandarin.autoTag(input)).toBe(expected);
  });

  it.each([
    ['預約日期是2026年7月14日。', '預約日期是二零二六年七月十四日。'],
    ['會議14:30開始。', '會議十四點三十分開始。'],
    ['客服時間是6–9點。', '客服時間是六點到九點。'],
  ])('reads dates, times, and ranges: %s', (input, expected) => {
    expect(taiwaneseMandarin.autoTag(input)).toBe(expected);
  });

  it.each([
    ['總計NT$1,280。', '總計一千二百八十新臺幣。'],
    ['手續費是$19.95。', '手續費是十九點九五美元。'],
    ['目前進度是72.5%。', '目前進度是百分之七十二點五。'],
    ['最終比數是3-2。', '最終比數是三比二。'],
  ])('reads Taiwan currency and ratios: %s', (input, expected) => {
    expect(taiwaneseMandarin.autoTag(input)).toBe(expected);
  });

  it.each([
    ['訂單編號是AB-2048。', '訂單編號是A·B、二·零·四·八。'],
    ['帳號是012345。', '帳號是零·一·二·三·四·五。'],
    ['航班號是BR108。', '航班號是B·R·一·零·八。'],
    ['驗證碼是804216。', '驗證碼是八·零·四·二·一·六。'],
  ])('reads contextual Taiwan identifiers: %s', (input, expected) => {
    expect(taiwaneseMandarin.autoTag(input)).toBe(expected);
  });

  it('keeps scripture references distinct from clock times', () => {
    expect(taiwaneseMandarin.autoTag('請讀約翰福音3:16。')).toBe('請讀約翰福音三章十六節。');
  });

  it.each([
    ['包裹重25kg。', '包裹重二十五公斤。'],
    ['距離是42.195km。', '距離是四十二點一九五公里。'],
    ['長度是30cm。', '長度是三十公分。'],
    ['容量是2TB。', '容量是二太位元組。'],
    ['購買2個商品和12本書。', '購買兩個商品和十二本書。'],
  ])('reads Taiwan measurements and counters: %s', (input, expected) => {
    expect(taiwaneseMandarin.autoTag(input)).toBe(expected);
  });

  it.each([
    ['台北→高雄出發', '台北到高雄出發'],
    ['信箱是help@example.tw。', '信箱是help 小老鼠 example 點 tw。'],
    ['嗯……我想想', '嗯……我想想'],
  ])('handles Taiwan symbols without damaging pauses: %s', (input, expected) => {
    expect(taiwaneseMandarin.autoTag(input)).toBe(expected);
  });

  it('supports manual tags and combined tagging', () => {
    expect(taiwaneseMandarin.manualTag('驗證碼是digits(2048)。')).toBe('驗證碼是二·零·四·八。');
    expect(taiwaneseMandarin.autoTagWithManual('name(王偉)，總計money(5000新臺幣)。')).toBe(
      '王偉，總計五千新臺幣。'
    );
    expect(taiwaneseMandarin.manualTagSelective('digits(1234) money(500元)', ['digits'])).toBe(
      '一·二·三·四 money(500元)'
    );
    expect(taiwaneseMandarin.manualTag('name(米雪)')).toBe('米雪');
  });

  it('extracts non-overlapping tags with original offsets', () => {
    const text = '電話是0912-345-678，費用NT$500。';
    expect(taiwaneseMandarin.extractAutoTags(text)).toEqual([
      { original: '0912-345-678', tagType: 'phone', start: 3, end: 15 },
      { original: 'NT$500', tagType: 'money', start: 18, end: 24 },
    ]);
  });

  it('honors enabledTags and the public input limit', () => {
    expect(taiwaneseMandarin.autoTag('0912-345-678和NT$500', { enabledTags: ['money'] })).toBe(
      '0912-345-678和五百新臺幣'
    );
    expect(taiwaneseMandarin.autoTag('0912-345-678', { enabledTags: [] })).toBe('0912-345-678');
    expect(() => taiwaneseMandarin.autoTag('臺'.repeat(10_001))).toThrow(RangeError);
  });
});

describe('Taiwan Mandarin top-level API exposure', () => {
  it('registers zh-TW and exposes its direct namespace', () => {
    expect(getSupportedLanguages()).toEqual(['ko', 'en', 'ja', 'zh', 'zh-TW']);
    expect(getSupportedAutoTags('zh-TW')).toContain('phone');
    expect(getSupportedManualTags('zh-TW')).toContain('digits');
    expect(taiwaneseMandarin.autoTag('總計NT$500。')).toBe('總計五百新臺幣。');
  });

  it('routes top-level automatic and manual tagging through zh-TW', () => {
    expect(topLevelAutoTag('客服時間是6–9點。', { language: 'zh-TW' })).toBe(
      '客服時間是六點到九點。'
    );
    expect(topLevelAutoTagWithManual('驗證碼是digits(1204)。', { language: 'zh-TW' })).toBe(
      '驗證碼是一·二·零·四。'
    );
  });

  it('can be selected as the default without changing the initial Korean default', () => {
    expect(getDefaultLanguage()).toBe('ko');
    try {
      setDefaultLanguage('zh-TW');
      expect(topLevelAutoTag('總計NT$500。')).toBe('總計五百新臺幣。');
    } finally {
      setDefaultLanguage('ko');
    }
  });
});
