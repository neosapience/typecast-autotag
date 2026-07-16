import {
  autoTag as topLevelAutoTag,
  autoTagWithManual as topLevelAutoTagWithManual,
  chinese,
  getDefaultLanguage,
  getSupportedAutoTags,
  getSupportedLanguages,
  getSupportedManualTags,
  setDefaultLanguage,
} from '../../src';

describe('Chinese auto-tagging', () => {
  it.each([
    ['0', '零'],
    ['10', '十'],
    ['14', '十四'],
    ['101', '一百零一'],
    ['10010', '一万零一十'],
    ['100000001', '一亿零一'],
    ['123456789', '一亿二千三百四十五万六千七百八十九'],
    ['-72.5', '负七十二点五'],
  ])('reads cardinal number %s', (input, expected) => {
    expect(chinese.numberToChinese(input)).toBe(expected);
  });

  it.each([
    ['手机号是138-0013-8000。', '手机号是一·三·八、零·零·一·三、八·零·零·零。'],
    ['客服电话是400-123-4567。', '客服电话是四·零·零、一·二·三、四·五·六·七。'],
    ['座机是010-12345678。', '座机是零·一·零、一·二·三·四·五·六·七·八。'],
    ['海外请拨+86-138-0013-8000。', '海外请拨八·六、一·三·八、零·零·一·三、八·零·零·零。'],
    ['邮编是100000。', '邮编是一·零·零·零·零·零。'],
  ])('reads Chinese phone and postal formats: %s', (input, expected) => {
    expect(chinese.autoTag(input)).toBe(expected);
  });

  it.each([
    ['订单编号是AB-2048。', '订单编号是A·B、二·零·四·八。'],
    ['账号是012345。', '账号是零·一·二·三·四·五。'],
    ['航班号是MU512。', '航班号是M·U·五·一·二。'],
    ['验证码是804216。', '验证码是八·零·四·二·一·六。'],
  ])('reads contextual Chinese identifiers: %s', (input, expected) => {
    expect(chinese.autoTag(input)).toBe(expected);
  });

  it('keeps scripture references distinct from clock times', () => {
    expect(chinese.autoTag('请读约翰福音3:16。')).toBe('请读约翰福音三章十六节。');
  });

  it('does not partially match longer identifiers as phone or postal numbers', () => {
    expect(chinese.autoTag('编号138001380001。', { enabledTags: ['phone'] })).toBe(
      '编号138001380001。'
    );
    expect(chinese.autoTag('邮编是1000000。', { enabledTags: ['postalCode'] })).toBe(
      '邮编是1000000。'
    );
  });

  it.each([
    ['预约日期是2026年7月14日。', '预约日期是二零二六年七月十四日。'],
    ['发布日期是4月1日。', '发布日期是四月一日。'],
    ['截止日期是2026-12-24。', '截止日期是二零二六年十二月二十四日。'],
    ['更新日期是2024/02/29。', '更新日期是二零二四年二月二十九日。'],
    ['开始时间是2026-07-14T09:05。', '开始时间是二零二六年七月十四日九点五分。'],
    ['会议14:30开始。', '会议十四点三十分开始。'],
    ['请在9点05分到达。', '请在九点五分到达。'],
  ])('reads valid dates and times: %s', (input, expected) => {
    expect(chinese.autoTag(input)).toBe(expected);
  });

  it.each(['2026-02-29', '2026-13-01', '25:00'])('preserves invalid date or time: %s', (input) => {
    expect(chinese.autoTag(input, { enabledTags: ['date', 'time'] })).toBe(input);
  });

  it.each(['2026-07-140', '12026-07-14', '14:300', '114:30'])(
    'does not partially match a date or time inside a longer number: %s',
    (input) => {
      expect(chinese.autoTag(input, { enabledTags: ['datetime', 'date', 'time'] })).toBe(input);
    }
  );

  it.each(['25:00至26:00', '25–30点'])('preserves invalid time range: %s', (input) => {
    expect(chinese.autoTag(input, { enabledTags: ['range'] })).toBe(input);
  });

  it.each([
    ['营业时间是9:00至18:00。', '营业时间是九点到十八点。'],
    ['客服时间是6–9点。', '客服时间是六点到九点。'],
    ['今晚阅读第3至5页。', '今晚阅读第三页到五页。'],
    ['价格约为100-200元。', '价格约为一百元到二百元。'],
    ['配送需要2～4周。', '配送需要两周到四周。'],
  ])('reads explicit ranges without leaving separators: %s', (input, expected) => {
    expect(chinese.autoTag(input)).toBe(expected);
  });

  it.each([
    ['费用是¥12,800。', '费用是一万二千八百元。'],
    ['总计1,234.56元。', '总计一千二百三十四点五六元。'],
    ['手续费是$19.95。', '手续费是十九点九五美元。'],
    ['预算是250欧元。', '预算是二百五十欧元。'],
  ])('reads currencies: %s', (input, expected) => {
    expect(chinese.autoTag(input)).toBe(expected);
  });

  it.each([
    ['最终比分是3-2。', '最终比分是三比二。'],
    ['比赛4:1结束。', '比赛四比一结束。'],
    ['画面比例是16:9。', '画面比例是十六比九。'],
    ['当前进度是72.5%。', '当前进度是百分之七十二点五。'],
    ['已经完成1/2。', '已经完成二分之一。'],
  ])('reads scores, ratios, percentages, and fractions: %s', (input, expected) => {
    expect(chinese.autoTag(input)).toBe(expected);
  });

  it('keeps clock time distinct from a contextual score', () => {
    expect(chinese.autoTag('会议3:12开始。比分3:12。')).toBe('会议三点十二分开始。比分三比十二。');
  });

  it.each([
    ['请阅读第7章。', '请阅读第七章。'],
    ['他获得第3名。', '他获得第三名。'],
    ['请选择No. 5。', '请选择编号五。'],
  ])('reads order expressions: %s', (input, expected) => {
    expect(chinese.autoTag(input)).toBe(expected);
  });

  it.each([
    ['包裹重25kg。', '包裹重二十五千克。'],
    ['距离是42.195km。', '距离是四十二点一九五公里。'],
    ['气温是-5℃。', '气温是负五摄氏度。'],
    ['加入500mL水。', '加入五百毫升水。'],
    ['容量是2TB。', '容量是二太字节。'],
    ['参加者有1人和2人。', '参加者有一人和两人。'],
    ['购买2个商品和12本书。', '购买两个商品和十二本书。'],
    ['等待2小时30分钟。', '等待两小时三十分钟。'],
    ['合同期为6个月，保修4年。', '合同期为六个月，保修四年。'],
  ])('reads measurements and Chinese counters: %s', (input, expected) => {
    expect(chinese.autoTag(input)).toBe(expected);
  });

  it.each([
    ['北京→上海出发', '北京到上海出发'],
    ['邮箱是help@example.cn。', '邮箱是help 艾特 example 点 cn。'],
    ['嗯……我想想', '嗯……我想想'],
    ['太好了……真的太好了', '太好了……真的太好了'],
  ])('handles Chinese symbols without damaging pauses: %s', (input, expected) => {
    expect(chinese.autoTag(input)).toBe(expected);
  });

  it('supports manual tags and combined tagging', () => {
    expect(chinese.manualTag('验证码是digits(2048)。')).toBe('验证码是二·零·四·八。');
    expect(chinese.autoTagWithManual('name(王伟)，总计money(5000元)。')).toBe('王伟，总计五千元。');
    expect(chinese.manualTagSelective('digits(1234) money(500元)', ['digits'])).toBe(
      '一·二·三·四 money(500元)'
    );
  });

  it('extracts non-overlapping Chinese tags with original offsets', () => {
    const text = '电话是138-0013-8000，费用500元。';
    expect(chinese.extractAutoTags(text)).toEqual([
      { original: '138-0013-8000', tagType: 'phone', start: 3, end: 16 },
      { original: '500元', tagType: 'money', start: 19, end: 23 },
    ]);
  });

  it('honors enabledTags and the public input limit', () => {
    expect(chinese.autoTag('138-0013-8000和500元', { enabledTags: ['money'] })).toBe(
      '138-0013-8000和五百元'
    );
    expect(chinese.autoTag('138-0013-8000', { enabledTags: [] })).toBe('138-0013-8000');
    expect(() => chinese.autoTag('中'.repeat(10_001))).toThrow(RangeError);
  });
});

describe('Chinese top-level API exposure', () => {
  it('registers zh and exposes its direct namespace', () => {
    expect(getSupportedLanguages()).toEqual(
      expect.arrayContaining(['ko', 'en', 'ja', 'zh', 'zh-TW', 'zho'])
    );
    expect(getSupportedAutoTags('zh')).toContain('phone');
    expect(getSupportedManualTags('zh')).toContain('digits');
    expect(chinese.autoTag('价格是500元。')).toBe('价格是五百元。');
  });

  it('routes top-level automatic and manual tagging through Chinese', () => {
    expect(topLevelAutoTag('客服时间是6–9点。', { language: 'zh' })).toBe('客服时间是六点到九点。');
    expect(topLevelAutoTagWithManual('验证码是digits(1204)。', { language: 'zh' })).toBe(
      '验证码是一·二·零·四。'
    );
  });

  it('can be selected as the default without changing the initial Korean default', () => {
    expect(getDefaultLanguage()).toBe('ko');
    try {
      setDefaultLanguage('zh');
      expect(topLevelAutoTag('价格是500元。')).toBe('价格是五百元。');
    } finally {
      setDefaultLanguage('ko');
    }
  });
});
