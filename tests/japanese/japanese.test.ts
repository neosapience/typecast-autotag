import {
  autoTag as topLevelAutoTag,
  autoTagWithManual as topLevelAutoTagWithManual,
  getDefaultLanguage,
  getSupportedAutoTags,
  getSupportedLanguages,
  getSupportedManualTags,
  japanese,
  setDefaultLanguage,
} from '../../src';

describe('Japanese auto-tagging', () => {
  it.each([
    ['0', 'ゼロ'],
    ['14', 'じゅうよん'],
    ['300', 'さんびゃく'],
    ['600', 'ろっぴゃく'],
    ['800', 'はっぴゃく'],
    ['3000', 'さんぜん'],
    ['8000', 'はっせん'],
    ['123456789', 'いちおくにせんさんびゃくよんじゅうごまんろくせんななひゃくはちじゅうきゅう'],
  ])('reads cardinal number %s', (input, expected) => {
    expect(japanese.numberToJapanese(input)).toBe(expected);
  });

  it.each([
    [
      '電話番号は090-1234-5678です。',
      '電話番号はゼロ・きゅう・ゼロ、いち・に・さん・よん、ご・ろく・なな・はちです。',
    ],
    [
      'フリーダイヤルは0120-123-456です。',
      'フリーダイヤルはゼロ・いち・に・ゼロ、いち・に・さん、よん・ご・ろくです。',
    ],
    [
      '海外からは+81-90-1234-5678です。',
      '海外からははち・いち、きゅう・ゼロ、いち・に・さん・よん、ご・ろく・なな・はちです。',
    ],
    [
      '郵便番号は〒100-0001です。',
      '郵便番号は郵便番号いち・ゼロ・ゼロ、ゼロ・ゼロ・ゼロ・いちです。',
    ],
  ])('reads Japanese phone and postal formats: %s', (input, expected) => {
    expect(japanese.autoTag(input)).toBe(expected);
  });

  it.each([
    ['注文番号はAB-2048です。', '注文番号はA・B、に・ゼロ・よん・はちです。'],
    ['口座番号は012345です。', '口座番号はゼロ・いち・に・さん・よん・ごです。'],
    ['便名はNH2048です。', '便名はN・H・に・ゼロ・よん・はちです。'],
    ['認証コードは804216です。', '認証コードははち・ゼロ・よん・に・いち・ろくです。'],
  ])('reads contextual Japanese identifiers: %s', (input, expected) => {
    expect(japanese.autoTag(input)).toBe(expected);
  });

  it('keeps scripture references distinct from clock times', () => {
    expect(japanese.autoTag('ヨハネ3:16を読んでください。')).toBe(
      'ヨハネさんしょうじゅうろくせつを読んでください。'
    );
  });

  it.each([
    ['予約日は2026年7月14日です。', '予約日はにせんにじゅうろくねんしちがつじゅうよっかです。'],
    ['発売日は4月1日です。', '発売日はしがつついたちです。'],
    ['締切は2026-12-24です。', '締切はにせんにじゅうろくねんじゅうにがつにじゅうよっかです。'],
    ['更新は2024/02/29です。', '更新はにせんにじゅうよねんにがつにじゅうきゅうにちです。'],
    [
      '開始は2026-07-14T09:05です。',
      '開始はにせんにじゅうろくねんしちがつじゅうよっかくじごふんです。',
    ],
    ['会議は14:30に始まります。', '会議はじゅうよじさんじゅっぷんに始まります。'],
    ['受付は9時5分からです。', '受付はくじごふんからです。'],
  ])('reads valid dates and times: %s', (input, expected) => {
    expect(japanese.autoTag(input)).toBe(expected);
  });

  it.each(['2026-02-29', '2026-13-01', '25:00'])('preserves invalid date or time: %s', (input) => {
    expect(japanese.autoTag(input, { enabledTags: ['date', 'time'] })).toBe(input);
  });

  it.each(['25:00〜26:00', '25–30時'])('preserves invalid time range: %s', (input) => {
    expect(japanese.autoTag(input, { enabledTags: ['range'] })).toBe(input);
  });

  it.each([
    ['営業時間は9:00〜18:00です。', '営業時間はくじからじゅうはちじです。'],
    ['受付は6–9時の間です。', '受付はろくじからくじの間です。'],
    ['資料は3〜5ページです。', '資料はさんページからごページです。'],
    ['価格は100-200円です。', '価格はひゃくえんからにひゃくえんです。'],
    ['納期は2～4週間です。', '納期はにしゅうかんからよんしゅうかんです。'],
  ])('reads explicit ranges without leaving separators: %s', (input, expected) => {
    expect(japanese.autoTag(input)).toBe(expected);
  });

  it.each([
    ['料金は¥12,800です。', '料金はいちまんにせんはっぴゃくえんです。'],
    ['合計は1,234.56円です。', '合計はせんにひゃくさんじゅうよんてんごろくえんです。'],
    ['手数料は$19.95です。', '手数料はじゅうきゅうドルきゅうじゅうごセントです。'],
    ['予算は250ユーロです。', '予算はにひゃくごじゅうユーロです。'],
  ])('reads currencies: %s', (input, expected) => {
    expect(japanese.autoTag(input)).toBe(expected);
  });

  it.each([
    ['スコアは3-2で勝利しました。', 'スコアはさんたいにで勝利しました。'],
    ['試合は4:1で終了しました。', '試合はよんたいいちで終了しました。'],
    ['割合は3:2です。', '割合はさんたいにです。'],
    ['進捗は72.5%です。', '進捗はななじゅうにてんごパーセントです。'],
    ['半分は1/2です。', '半分はにぶんのいちです。'],
  ])('reads scores, ratios, percentages, and fractions: %s', (input, expected) => {
    expect(japanese.autoTag(input)).toBe(expected);
  });

  it('keeps clock time distinct from a contextual score', () => {
    expect(japanese.autoTag('会議は3:12です。スコアは3:12でした。')).toBe(
      '会議はさんじじゅうにふんです。スコアはさんたいじゅうにでした。'
    );
  });

  it.each([
    ['第7章を読みます。', 'だいななしょうを読みます。'],
    ['第3位でした。', 'だいさんいでした。'],
    ['No. 5を選びます。', 'ナンバーごを選びます。'],
  ])('reads order expressions: %s', (input, expected) => {
    expect(japanese.autoTag(input)).toBe(expected);
  });

  it.each([
    ['荷物は25kgです。', '荷物はにじゅうごキログラムです。'],
    ['距離は42.195kmです。', '距離はよんじゅうにてんいちきゅうごキロメートルです。'],
    ['気温は-5℃です。', '気温はマイナスごどです。'],
    ['容量は500mLです。', '容量はごひゃくミリリットルです。'],
    ['保存量は2TBです。', '保存量はにテラバイトです。'],
    ['参加者は1人と2人です。', '参加者はひとりとふたりです。'],
    ['鉛筆を1本、傘を3本用意します。', '鉛筆をいっぽん、傘をさんぼん用意します。'],
    ['商品を11個、ペンを16本用意します。', '商品をじゅういっこ、ペンをじゅうろっぽん用意します。'],
    ['本を8冊、資料を4枚配ります。', '本をはっさつ、資料をよんまい配ります。'],
    ['会議は3回、会場は8階です。', '会議はさんかい、会場ははっかいです。'],
    ['契約は6か月、保証は4年です。', '契約はろっかげつ、保証はよねんです。'],
  ])('reads measurements and Japanese counters: %s', (input, expected) => {
    expect(japanese.autoTag(input)).toBe(expected);
  });

  it('uses irregular hour and 件 readings', () => {
    expect(japanese.autoTag('受付は14時、終了は19時です。')).toBe(
      '受付はじゅうよじ、終了はじゅうくじです。'
    );
    expect(japanese.autoTag('1件、6件、8件、10件、100件')).toBe(
      'いっけん、ろっけん、はっけん、じゅっけん、ひゃっけん'
    );
  });

  it.each([
    ['東京→大阪へ行く', '東京から大阪へ行く'],
    ['連絡先はhelp@example.jpです。', '連絡先はhelp アットマーク example ドット jpです。'],
    ['えっと……そうですね', 'えっと……そうですね'],
    ['すごい……本当にすごい', 'すごい……本当にすごい'],
  ])('handles Japanese symbols without damaging pauses: %s', (input, expected) => {
    expect(japanese.autoTag(input)).toBe(expected);
  });

  it('supports manual tags and combined tagging', () => {
    expect(japanese.manualTag('暗証番号はdigits(2048)です。')).toBe(
      '暗証番号はに・ゼロ・よん・はちです。'
    );
    expect(japanese.autoTagWithManual('name(佐藤)様、合計はmoney(5000円)です。')).toBe(
      '佐藤様、合計はごせんえんです。'
    );
    expect(japanese.manualTagSelective('digits(1234) money(500円)', ['digits'])).toBe(
      'いち・に・さん・よん money(500円)'
    );
  });

  it('extracts non-overlapping Japanese tags with original offsets', () => {
    const text = '電話は090-1234-5678、料金は500円です。';
    expect(japanese.extractAutoTags(text)).toEqual([
      { original: '090-1234-5678', tagType: 'phone', start: 3, end: 16 },
      { original: '500円', tagType: 'money', start: 20, end: 24 },
    ]);
  });

  it('honors enabledTags and the public input limit', () => {
    expect(japanese.autoTag('090-1234-5678と500円', { enabledTags: ['money'] })).toBe(
      '090-1234-5678とごひゃくえん'
    );
    expect(japanese.autoTag('090-1234-5678', { enabledTags: [] })).toBe('090-1234-5678');
    expect(() => japanese.autoTag('あ'.repeat(10_001))).toThrow(RangeError);
  });
});

describe('Japanese top-level API exposure', () => {
  it('registers ja and exposes its direct namespace', () => {
    expect(getSupportedLanguages()).toEqual(
      expect.arrayContaining(['ko', 'en', 'ja', 'zh', 'zh-TW', 'jpn'])
    );
    expect(getSupportedAutoTags('ja')).toContain('phone');
    expect(getSupportedManualTags('ja')).toContain('digits');
    expect(japanese.autoTag('価格は500円です。')).toBe('価格はごひゃくえんです。');
  });

  it('routes top-level automatic and manual tagging through Japanese', () => {
    expect(topLevelAutoTag('受付は6–9時です。', { language: 'ja' })).toBe(
      '受付はろくじからくじです。'
    );
    expect(topLevelAutoTagWithManual('暗証番号はdigits(1204)です。', { language: 'ja' })).toBe(
      '暗証番号はいち・に・ゼロ・よんです。'
    );
  });

  it('can be selected as the default without changing the initial Korean default', () => {
    expect(getDefaultLanguage()).toBe('ko');
    try {
      setDefaultLanguage('ja');
      expect(topLevelAutoTag('価格は500円です。')).toBe('価格はごひゃくえんです。');
    } finally {
      setDefaultLanguage('ko');
    }
  });
});
