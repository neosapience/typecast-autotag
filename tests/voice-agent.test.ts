import {
  autoTag,
  autoTagWithManual,
  extractAutoTags,
  createVoiceAgent,
  setDefaultLanguage,
  MAX_INPUT_LENGTH,
  korean,
  english,
} from '../src';

describe('protected data', () => {
  it.each(['ko', 'en', 'ja', 'zh', 'zh-TW', 'spa'] as const)(
    'preserves URLs and code in %s with correct extraction offsets',
    (language) => {
      for (const protectedText of [
        'https://example.com/2024/01/15?id=500',
        'www.example.com/2024/01/15',
        'https://example.com/(2024)/01/15',
        '`2024-01-15 500kg`',
        '```\nphone(010-1234-5678)\n2024-01-15\n```',
      ]) {
        expect(autoTag(protectedText, { language })).toBe(protectedText);
        expect(autoTagWithManual(protectedText, { language })).toBe(protectedText);
        expect(extractAutoTags(protectedText, { language })).toEqual([]);
        const input = `${protectedText} 2024-01-15`;
        expect(autoTag(input, { language }).slice(0, protectedText.length)).toBe(protectedText);
        const matches = extractAutoTags(input, { language });
        expect(matches.length).toBeGreaterThan(0);
        for (const match of matches) {
          expect(match.start).toBeGreaterThan(protectedText.length);
          expect(input.slice(match.start, match.end)).toBe(match.original);
        }
      }
    }
  );
});

describe('spoken units and phone numbers', () => {
  it.each(['ko', 'en'] as const)(
    'reads both range endpoints and full phone numbers in %s',
    (language) => {
      for (const input of ['1.5~2.0kg', '1.5-2.0km', '1.5–2.0L']) {
        expect(autoTag(input, { language })).not.toMatch(/\d/);
      }
      for (const input of ['9007199254740993~2kg', '1~9007199254740993kg', '9007199254740993kg']) {
        expect(autoTag(input, { language })).toBe(input);
        expect(extractAutoTags(input, { language })).toEqual([]);
      }
      for (const input of [
        '+82 10-1234-5678',
        '+44 20 7946 0958',
        '+821012345678',
        '02-1234-5678 내선 0012',
        '202-555-0175 ext. 0012',
        '(202) 555-0175 ext. 0012',
      ]) {
        expect(autoTag(input, { language })).not.toMatch(/\d/);
        expect(extractAutoTags(input, { language })).toEqual([
          { original: input, tagType: 'phone', start: 0, end: input.length },
        ]);
      }
    }
  );
  it('does not interpret signed amounts or embedded plus signs as international phones', () => {
    expect(autoTag('+1500원', { language: 'ko' })).toBe('+천오백원');
    expect(autoTag('+1500 points', { language: 'en' })).toBe('+one thousand five hundred points');
    for (const language of ['ko', 'en'] as const) {
      for (const input of [
        language === 'ko' ? '+15000000원' : '+15000000 points',
        '+1500.50',
        'abc+821012345678',
        '++821012345678',
      ]) {
        expect(extractAutoTags(input, { language }).filter((m) => m.tagType === 'phone')).toEqual(
          []
        );
      }
    }
  });

  it.each([
    'points',
    'POINTS',
    'point',
    'dollars',
    'dollar',
    'USD',
    'P',
    '원',
    '달러',
    '엔',
    '유로',
    '위안',
    '₩',
    '$',
    '€',
    '£',
    '¥',
  ])('does not let the US country-code fallback override the %s suffix', (suffix) => {
    const input = `+15000000000 ${suffix}`;
    expect(
      extractAutoTags(input, { language: 'en' }).some((match) => match.tagType === 'phone')
    ).toBe(false);
    expect(autoTag(input, { language: 'en' })).not.toContain('plus one five zero');
  });

  it('reads large quantities while retaining compact and separated US phone formats', () => {
    expect(autoTag('+15000000000 points', { language: 'en' })).toBe('+fifteen billion points');
    expect(autoTag('+15000000000 dollars', { language: 'en' })).toBe('+fifteen billion dollars');
    for (const input of ['+12025550175', '+1-202-555-0175', '+1 2025550175', '+1202555-0175']) {
      expect(autoTag(input, { language: 'en' })).toBe(
        'plus one two zero two five five five zero one seven five'
      );
      expect(extractAutoTags(input, { language: 'en' })).toEqual([
        { original: input, tagType: 'phone', start: 0, end: input.length },
      ]);
    }
  });

  it('uses the same extension handling for direct phone tags', () => {
    expect(korean.phone('02-1234-5678 내선 0012')).toContain('내선 공 . 공 . 일 . 이');
    expect(english.phone('202-555-0175 ext. 0012')).toContain('extension zero zero one two');
    expect(korean.phone('02-1234-5678 내선 12', { usePhoneticCode: true })).toContain(
      '내선 하나 . 둘'
    );
    expect(english.phone('202-555-0175 ext. 9', { usePhoneticCode: true })).toContain(
      'extension niner'
    );
  });
});

describe('voice-agent sessions', () => {
  afterEach(() => setDefaultLanguage('ko'));

  it('isolates languages, tag lists and dictionaries from global and caller mutation', () => {
    const config = {
      language: 'ko' as const,
      enabledTags: ['money'],
      pronunciations: { Typecast: '타입캐스트' },
    };
    const ko = createVoiceAgent(config);
    const en = createVoiceAgent({ language: 'en' });
    config.enabledTags.length = 0;
    config.pronunciations.Typecast = 'changed';
    setDefaultLanguage('en');
    expect(ko.normalize('Typecast 500원')).toBe('타입캐스트 오백원');
    expect(en.normalize('$500')).toBe('five hundred dollars');
    expect(() => createVoiceAgent({ language: 'invalid' as 'ko' })).toThrow('Unsupported language');
    expect(() => createVoiceAgent({ language: 'ko', pronunciations: { '': 'x' } })).toThrow();
  });

  it('preserves ambiguous dates unless order or a manual tag is explicit', () => {
    const safe = createVoiceAgent({ language: 'ko' });
    expect(safe.normalize('3/4에 예약되었습니다.')).toBe('3/4에 예약되었습니다.');
    expect(safe.normalize('예약일 03/04/2026')).toBe('예약일 03/04/2026');
    expect(safe.normalize('예약일: 3/4.')).toBe('예약일: 3/4.');
    expect(createVoiceAgent({ language: 'en', dateOrder: 'mdy' }).normalize('3/4.')).toBe(
      'March fourth.'
    );
    expect(safe.normalize('fraction(1/2)정')).toBe('이 분의 일정');
    expect(safe.normalize('date(2026-03-04)')).not.toMatch(/\d/);
    expect(createVoiceAgent({ language: 'ko', dateOrder: 'mdy' }).normalize('3/4')).toBe(
      '삼 월 사 일'
    );
    expect(createVoiceAgent({ language: 'ko', dateOrder: 'dmy' }).normalize('3/4')).toBe(
      '사 월 삼 일'
    );
    expect(
      createVoiceAgent({ language: 'en', dateOrder: 'dmy' }).normalize('03/04/2026')
    ).toContain('April');
    expect(createVoiceAgent({ language: 'ko', dateOrder: 'mdy' }).normalize('2/30')).toBe('2/30');
  });

  it('reads labelled identifiers as strings and preserves leading zeroes', () => {
    expect(createVoiceAgent({ language: 'ko' }).normalize('인증번호는 001234입니다.')).toBe(
      '인증번호는 공 . 공 . 일 . 이 . 삼 . 사입니다.'
    );
    expect(
      createVoiceAgent({ language: 'en' }).normalize('Your verification code is 001234.')
    ).toContain('zero zero one two three four');
    expect(createVoiceAgent({ language: 'ko' }).normalize('계좌번호: 001234')).toContain('공 . 공');
    expect(createVoiceAgent({ language: 'ko' }).normalize('예약번호는 AB-001234입니다.')).toContain(
      '공 . 공 . 일 . 이 . 삼 . 사'
    );
  });

  it('uses literal pronunciation overrides without reparsing or modifying protected data', () => {
    const agent = createVoiceAgent({
      language: 'ko',
      pronunciations: { 'GPT-4o': '지피티 포 오', API: '$&', Typecast: '타입캐스트' },
    });
    expect(agent.normalize('GPT-4o API')).toBe('지피티 포 오 $&');
    expect(agent.normalize('CAPITAL')).toBe('CAPITAL');
    expect(agent.normalize('https://Typecast.ai/API `API`')).toBe('https://Typecast.ai/API `API`');
    expect(agent.normalize('digits(001) API')).toBe('공 . 공 . 일 $&');
  });

  it.each([
    '가격은 12,500원입니다. 다음 안내입니다.',
    '전화번호는 phone(+82 10-1234-5678)입니다. 감사합니다.',
    '인증번호는 001234입니다. 예약일은 3/4입니다.',
    'https://example.com/2024/01/15 뒤의 가격은 500원입니다.',
    '`money(500)` 다음은 1.5~2.0kg입니다.',
    '연락처는 +1 (202) 555-0175 ext. 0012입니다. 감사합니다.',
  ])('matches batch output at every single split: %s', (input) => {
    const expected = createVoiceAgent({ language: 'ko' }).normalize(input);
    for (let split = 0; split <= input.length; split++) {
      const agent = createVoiceAgent({ language: 'ko' });
      expect(
        agent.push(input.slice(0, split)) + agent.push(input.slice(split)) + agent.flush()
      ).toBe(expected);
    }
    const agent = createVoiceAgent({ language: 'ko' });
    expect([...input].map((char) => agent.push(char)).join('') + agent.flush()).toBe(expected);
  });

  it('emits completed sentences and discards an interrupted turn', () => {
    const agent = createVoiceAgent({ language: 'ko' });
    expect(agent.push('가격은 12,')).toBe('');
    expect(agent.push('500원입니다. ')).toContain('일만이천오백원');
    agent.push('phone(010-');
    agent.reset();
    expect(agent.push('새 답변입니다! ')).toBe('새 답변입니다! ');
    expect(agent.flush()).toBe('');
    expect(agent.flush()).toBe('');
  });

  it('keeps decimals, abbreviations and split dictionary terms pending', () => {
    const agent = createVoiceAgent({
      language: 'en',
      pronunciations: { 'Acme. Inc': 'Acme Incorporated' },
    });
    expect(agent.push('Dr. Smith owes $12.')).toBe('');
    expect(agent.push('50. ')).toContain('twelve dollars and fifty cents');
    expect(agent.push('Acme. ')).toBe('');
    expect(agent.push('Inc')).toBe('');
    expect(agent.push('. ')).toBe('Acme Incorporated. ');
    expect(agent.push('Acme. Inc')).toBe('');
    expect(agent.flush()).toBe('Acme Incorporated');
  });

  it('emits URL-ending sentences while preserving URL paths and code', () => {
    const agent = createVoiceAgent({ language: 'en' });
    for (const input of [
      'See https://example.com/2024. ',
      'See (https://example.com/(2024)). ',
      'See https://example.com/?x=500;:! ',
    ]) {
      expect(agent.push(input)).toBe(input);
      expect(agent.flush()).toBe('');
    }
    expect(agent.push('See `https://example.com/2024.`')).toBe('');
    expect(agent.flush()).toBe('See `https://example.com/2024.`');
  });

  it('bounds pending input and preserves the previous buffer after a failed push', () => {
    const agent = createVoiceAgent({ language: 'ko' });
    agent.push('a'.repeat(MAX_INPUT_LENGTH));
    expect(() => agent.push('b')).toThrow(RangeError);
    expect(agent.flush()).toBe('a'.repeat(MAX_INPUT_LENGTH));
    expect(() => agent.normalize('a'.repeat(MAX_INPUT_LENGTH + 1))).toThrow(RangeError);
  });
});
