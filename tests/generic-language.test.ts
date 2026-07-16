import {
  autoTag,
  extractAutoTags,
  getSupportedAutoTags,
  getSupportedLanguages,
  getSupportedManualTags,
  manualTag,
  manualTagSelective,
  autoTagWithManual,
  SUPPORTED_TTS_LANGUAGES,
} from '../src';

const AICC_PROMPTS = {
  ara: 'للدعم، أدخل الرقم المرجعي digits(42) أو اتصل على +1-202-555-0175.',
  ben: 'সহায়তার জন্য রেফারেন্স নম্বর digits(42) লিখুন অথবা +1-202-555-0175 নম্বরে কল করুন।',
  bul: 'За поддръжка въведете референтен номер digits(42) или се обадете на +1-202-555-0175.',
  ces: 'Pro podporu zadejte referenční číslo digits(42) nebo zavolejte na +1-202-555-0175.',
  dan: 'For support skal du indtaste referencenummer digits(42) eller ringe til +1-202-555-0175.',
  deu: 'Geben Sie für den Support die Referenznummer digits(42) ein oder rufen Sie +1-202-555-0175 an.',
  ell: 'Για υποστήριξη, εισαγάγετε τον αριθμό αναφοράς digits(42) ή καλέστε στο +1-202-555-0175.',
  eng: 'For support, enter reference number digits(42) or call +1-202-555-0175.',
  fin: 'Saat tukea syöttämällä viitenumeron digits(42) tai soittamalla numeroon +1-202-555-0175.',
  fra: 'Pour obtenir de l’aide, saisissez la référence digits(42) ou appelez le +1-202-555-0175.',
  hin: 'सहायता के लिए संदर्भ संख्या digits(42) दर्ज करें या +1-202-555-0175 पर कॉल करें।',
  hrv: 'Za podršku unesite referentni broj digits(42) ili nazovite +1-202-555-0175.',
  hun: 'Támogatásért adja meg a digits(42) hivatkozási számot, vagy hívja a +1-202-555-0175 számot.',
  ind: 'Untuk bantuan, masukkan nomor referensi digits(42) atau hubungi +1-202-555-0175.',
  ita: 'Per assistenza, inserisci il numero di riferimento digits(42) o chiama +1-202-555-0175.',
  jpn: 'サポートをご希望の場合は、受付番号 digits(42) を入力するか、+1-202-555-0175 へお電話ください。',
  kor: '상담을 원하시면 접수번호 digits(42)를 입력하거나 +1-202-555-0175로 전화해 주세요.',
  msa: 'Untuk bantuan, masukkan nombor rujukan digits(42) atau hubungi +1-202-555-0175.',
  nan: '欲揣客服，請輸入案件編號 digits(42)，抑是拍 +1-202-555-0175。',
  nld: 'Voer voor ondersteuning referentienummer digits(42) in of bel +1-202-555-0175.',
  nor: 'For kundestøtte, skriv inn referansenummer digits(42) eller ring +1-202-555-0175.',
  pan: 'ਸਹਾਇਤਾ ਲਈ ਹਵਾਲਾ ਨੰਬਰ digits(42) ਦਰਜ ਕਰੋ ਜਾਂ +1-202-555-0175 ਉੱਤੇ ਕਾਲ ਕਰੋ।',
  pol: 'Aby uzyskać pomoc, wprowadź numer referencyjny digits(42) lub zadzwoń pod +1-202-555-0175.',
  por: 'Para obter apoio, introduza o número de referência digits(42) ou ligue para +1-202-555-0175.',
  ron: 'Pentru asistență, introduceți numărul de referință digits(42) sau sunați la +1-202-555-0175.',
  rus: 'Для поддержки введите номер обращения digits(42) или позвоните по номеру +1-202-555-0175.',
  slk: 'Pre podporu zadajte referenčné číslo digits(42) alebo zavolajte na +1-202-555-0175.',
  spa: 'Para recibir ayuda, introduzca el número de referencia digits(42) o llame al +1-202-555-0175.',
  swe: 'För support, ange referensnummer digits(42) eller ring +1-202-555-0175.',
  tam: 'உதவிக்கு digits(42) என்ற குறிப்பு எண்ணை உள்ளிடவும் அல்லது +1-202-555-0175 எண்ணை அழைக்கவும்.',
  tgl: 'Para sa suporta, ilagay ang reference number digits(42) o tumawag sa +1-202-555-0175.',
  tha: 'หากต้องการความช่วยเหลือ ให้ป้อนหมายเลขอ้างอิง digits(42) หรือโทร +1-202-555-0175',
  tur: 'Destek için digits(42) referans numarasını girin veya +1-202-555-0175 numarasını arayın.',
  ukr: 'Для підтримки введіть номер звернення digits(42) або зателефонуйте за номером +1-202-555-0175.',
  vie: 'Để được hỗ trợ, hãy nhập mã tham chiếu digits(42) hoặc gọi +1-202-555-0175.',
  yue: '如需客戶服務，請輸入個案編號 digits(42)，或者致電 +1-202-555-0175。',
  zho: '如需客服，请输入受理编号 digits(42)，或拨打 +1-202-555-0175。',
} satisfies Record<(typeof SUPPORTED_TTS_LANGUAGES)[number], string>;

describe('SSFM v3.0 language coverage', () => {
  it('registers every official TTS language code', () => {
    expect(SUPPORTED_TTS_LANGUAGES).toHaveLength(37);
    expect(getSupportedLanguages()).toEqual(expect.arrayContaining([...SUPPORTED_TTS_LANGUAGES]));
  });

  it.each(SUPPORTED_TTS_LANGUAGES)('routes %s without falling back or throwing', (language) => {
    expect(manualTag('number(42)', { language })).not.toBe('number(42)');
    expect(getSupportedAutoTags(language).length).toBeGreaterThan(0);
    expect(getSupportedManualTags(language).length).toBeGreaterThan(0);
  });

  it.each(SUPPORTED_TTS_LANGUAGES)('processes a localized AICC prompt for %s', (language) => {
    const input = AICC_PROMPTS[language];
    const result = autoTagWithManual(input, { language });

    expect(result).not.toMatch(/(?:digits|phone)\(/);
    expect(result).not.toContain('42');
    expect(result).not.toContain('+1-202-555-0175');
  });

  it.each([
    ['ara', 'اثنان و أربعون'],
    ['ben', 'বিয়াল্লিশ'],
    ['bul', 'четиридесет две'],
    ['deu', 'zweiundvierzig'],
    ['ell', 'σαράντα δύο'],
    ['hin', 'बयालीस'],
    ['spa', 'cuarenta y dos'],
    ['tgl', 'apatnapu dalawa'],
    ['tha', 'สี่สิบสอง'],
    ['yue', '四十二'],
    ['nan', '四十二'],
  ] as const)('uses locale number words for %s', (language, expected) => {
    expect(autoTag('42', { language })).toBe(expected);
  });

  it('keeps the precise modules behind their ISO 639-3 aliases', () => {
    expect(autoTag('Call 555-123-4567.', { language: 'eng' })).toContain('five five five');
    expect(autoTag('価格は500円です。', { language: 'jpn' })).toBe('価格はごひゃくえんです。');
    expect(autoTag('价格是500元。', { language: 'zho' })).toBe('价格是五百元。');
    expect(autoTag('日期是2024年1月25日。', { language: 'nan' })).toBe(
      '日期是二零二四年一月二十五日。'
    );
    expect(autoTag('日期係2024年1月25日。', { language: 'yue' })).toBe(
      '日期係二零二四年一月二十五日。'
    );
  });
});

describe('generic language safety and manual tags', () => {
  it('handles standalone numbers, percentages, and conservative phone formats', () => {
    expect(autoTag('Total 1,234.5 and 72.5%.', { language: 'spa' })).toBe(
      'Total mil doscientos treinta y cuatro punto cinco and setenta y dos punto cinco%.'
    );
    expect(autoTag('Call +49-30-1234567.', { language: 'deu' })).toBe(
      'Call + vier neun, drei null, eins zwei drei vier fünf sechs sieben.'
    );
  });

  it.each([
    ['deu', '1.234,56', 'tausend zwei hundert vierunddreißig komma sechsundfünfzig'],
    ['fra', '1 234,56', 'mille deux cent trente-quatre virgule cinquante-six'],
    ['ara', '١٢٫٥', 'اثنا عشر فاصلة خمسة'],
    ['ben', '১২.৫', 'বারো দশমিক পাঁচ'],
    ['hin', '१२.५', 'बारह दशांश पांच'],
  ] as const)(
    'handles locale-formatted and native-script numerals for %s',
    (language, input, expected) => {
      expect(autoTag(input, { language })).toBe(expected);
    }
  );

  it('normalizes localized percent and minus symbols', () => {
    expect(autoTag('٧٢٫٥٪', { language: 'ara' })).toBe('اثنان و سبعون فاصلة خمسة%');
    expect(autoTag('−12,5', { language: 'deu' })).toBe('minus zwölf komma fünf');
  });

  it('localizes dates and times while reading ranges and identifiers safely', () => {
    const input = '2026-07-16 16.07.2026 14:30 pages 3–5 score 2:1 ZX-407';
    expect(autoTag(input, { language: 'fra' })).toBe(
      'seize juillet deux mille vingt-six seize juillet deux mille vingt-six, quatorze:trente pages trois–cinq score deux:un Z X, quatre zéro sept'
    );
  });

  it('localizes currency names and preserves compact units', () => {
    expect(
      autoTag('Am 25.01.2024 kostet es 59,90 $ und wiegt 35.000kg.', { language: 'deu' })
    ).toBe(
      'Am fünfundzwanzig. Januar zwei tausend vierundzwanzig kostet es neunundfünfzig komma neunzig US-Dollar und wiegt fünfunddreißig tausendkg.'
    );
    expect(autoTag('$5.00', { language: 'deu' })).toBe('fünf US-Dollar');
  });

  it('handles localized h-times and space-grouped thousands', () => {
    expect(autoTag('Ouvert de 09h00 à 18h30, avec 3 000 places.', { language: 'fra' })).toBe(
      'Ouvert de neuf:zéro à dix-huit:trente, avec trois mille places.'
    );
    expect(autoTag('Poids 1 234,56 kg.', { language: 'fra' })).toBe(
      'Poids mille deux cent trente-quatre virgule cinquante-six kg.'
    );
  });

  it('supports generic manual digits, identifiers, selection, and extraction', () => {
    expect(manualTag('PIN digits(2048), order serial(AB-407).', { language: 'fra' })).toBe(
      'PIN deux zéro quatre huit, order A B, quatre zéro sept.'
    );
    expect(manualTag('PIN digits(१२३).', { language: 'hin' })).toBe('PIN एक दो तीन.');
    expect(
      manualTagSelective('name(Ana) digits(12)', {
        language: 'spa',
        allowedTags: ['name'],
      })
    ).toBe('Ana digits(12)');
    expect(extractAutoTags('Value 42 and 72%.', { language: 'spa' })).toEqual([
      { original: '42', tagType: 'number', start: 6, end: 8 },
      { original: '72%', tagType: 'percentage', start: 13, end: 16 },
    ]);
  });

  it('honors enabledTags and the public input limit', () => {
    expect(autoTag('42', { language: 'spa', enabledTags: [] })).toBe('42');
    expect(() => autoTag('a'.repeat(10_001), { language: 'spa' })).toThrow(RangeError);
  });
});
