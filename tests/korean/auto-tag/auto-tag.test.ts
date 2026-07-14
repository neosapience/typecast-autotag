import {
  autoTag,
  autoTagWithManual,
  extractAutoTags,
  SUPPORTED_AUTO_TAGS,
} from '../../../src/korean/auto-tag';

describe('autoTag 핵심 기능', () => {
  describe('기본 동작', () => {
    it('빈 문자열은 그대로 반환한다', () => {
      expect(autoTag('')).toBe('');
    });

    it('null/undefined 같은 falsy 값은 그대로 반환한다', () => {
      expect(autoTag(null as unknown as string)).toBe(null);
      expect(autoTag(undefined as unknown as string)).toBe(undefined);
    });

    it('태그 가능한 패턴이 없으면 원본 반환한다', () => {
      expect(autoTag('안녕하세요')).toBe('안녕하세요');
      expect(autoTag('Hello World')).toBe('Hello World');
    });
  });

  describe('enabledTags 옵션', () => {
    it('특정 태그만 활성화할 수 있다', () => {
      const text = '전화: 010-1234-5678, 금액: 5000원';

      // phone만 활성화
      expect(autoTag(text, { enabledTags: ['phone'] })).toContain(
        '공 . 일 . 공, 일 . 이 . 삼 . 사, 오 . 육 . 칠 . 팔'
      );
      expect(autoTag(text, { enabledTags: ['phone'] })).toContain('5000원');

      // money만 활성화
      expect(autoTag(text, { enabledTags: ['money'] })).toContain('010-1234-5678');
      expect(autoTag(text, { enabledTags: ['money'] })).toContain('오천원');
    });

    it('여러 태그를 활성화할 수 있다', () => {
      const text = '전화: 010-1234-5678, 금액: 5000원';
      const result = autoTag(text, { enabledTags: ['phone', 'money'] });

      expect(result).toContain('공 . 일 . 공, 일 . 이 . 삼 . 사, 오 . 육 . 칠 . 팔');
      expect(result).toContain('오천원');
    });

    it('빈 배열이면 아무것도 변환하지 않는다', () => {
      const text = '서울시 [중앙동] 세종대로 10, 전화: 010-1234-5678';
      expect(autoTag(text, { enabledTags: [] })).toBe(text);
    });
  });

  describe('중복 매칭 방지', () => {
    it('겹치는 패턴은 더 긴 것을 우선한다', () => {
      // datetime이 date + time보다 우선
      const text = '2024-01-15T14:30';
      const result = autoTag(text);

      // datetime으로 한 번에 처리되어야 함
      expect(result).toBe('이천이십사년 일월 십오일 오후 두시 삼십분');
    });

    it('순차적으로 매칭된 패턴은 모두 처리한다', () => {
      const text = '010-1234-5678로 5000원 입금';
      const result = autoTag(text, { enabledTags: ['phone', 'money'] });

      expect(result).toContain('공 . 일 . 공,');
      expect(result).toContain('오천원');
    });
  });

  describe('복합 문장 처리', () => {
    it('여러 종류의 태그를 포함한 문장을 처리한다', () => {
      const text = '2024-01-15T14:30에 010-1234-5678로 50000원 결제 예정';
      const result = autoTag(text);

      expect(result).toContain('이천이십사년 일월 십오일 오후 두시 삼십분');
      expect(result).toContain('공 . 일 . 공, 일 . 이 . 삼 . 사, 오 . 육 . 칠 . 팔');
      expect(result).toContain('오만원');
    });

    it('같은 종류의 태그가 여러 번 나오면 모두 처리한다', () => {
      const text = '전화1: 010-1111-2222, 전화2: 010-3333-4444';
      const result = autoTag(text, { enabledTags: ['phone'] });

      expect(result).toContain('공 . 일 . 공, 일 . 일 . 일 . 일, 이 . 이 . 이 . 이');
      expect(result).toContain('공 . 일 . 공, 삼 . 삼 . 삼 . 삼, 사 . 사 . 사 . 사');
    });
  });

  describe('기호와 단위 경계 사례', () => {
    it('시간·주소로 오인식하던 문맥을 올바르게 변환한다', () => {
      expect(autoTag('요한복음 3:16 말씀을 읽어주세요')).toBe(
        '요한복음 삼장 십육절 말씀을 읽어주세요'
      );
      expect(autoTag('제작 기간은 2-4주 정도예요')).toBe('제작 기간은 이주에서 사주 정도예요');
      expect(autoTag('원정팀이 4-1로 승리했어요')).toBe('원정팀이 사대일로 승리했어요');
      expect(autoTag('예산은 300-500원 사이입니다')).toBe('예산은 삼백원에서 오백원 사이입니다');
    });

    it('수사와 단위를 붙이고 순우리말 수사를 사용한다', () => {
      expect(autoTag('후보 매장은 2곳, 점검 지점은 8곳입니다')).toBe(
        '후보 매장은 두곳, 점검 지점은 여덟곳 입니다'
      );
      expect(autoTag('사용량은 1 TW이고 계약액은 250억 달러입니다')).toBe(
        '사용량은 일테라와트 이고 계약액은 이백오십억달러 입니다'
      );
      expect(autoTag('사과는 50개 준비했습니다')).toBe('사과는 쉰개 준비했습니다');
      expect(autoTag('결제 금액은 2,345.67달러예요')).toContain('육 칠달러 예요');
    });

    it('이메일을 읽을 수 있게 바꾸고 미지원 일본어는 훼손하지 않는다', () => {
      expect(autoTag('문의는 help@sample.org로 보내주세요')).toBe(
        '문의는 help 골뱅이 sample 점 org로 보내주세요'
      );
      expect(autoTag('大阪→京都へ向かう')).toBe('大阪→京都へ向かう');
      expect(autoTag('まあ……少し待ちましょう')).toBe('まあ……少し待ちましょう');
      expect(autoTag('8–11時の予定です')).toBe('8–11時の予定です');
    });

    it('점수 문맥과 시간 문맥을 구분한다', () => {
      expect(autoTag('결승 스코어는 3:12였습니다')).toBe('결승 스코어는 삼대십이 였습니다');
      expect(autoTag('회의는 3:12에 시작해요')).toBe('회의는 오전 세시 십이분 에 시작해요');
    });

    it('단위를 한 번만 쓴 시간과 온도 범위를 변환한다', () => {
      expect(autoTag('운영 시간은 6–9시입니다')).toBe(
        '운영 시간은 오전 여섯시에서 오전 아홉시 입니다'
      );
      expect(autoTag('기온은 -5~10℃입니다')).toBe('기온은 영하 오도에서 십도 입니다');
    });

    it('언어 모듈을 직접 사용해도 수동 태그를 먼저 처리한다', () => {
      const result = autoTagWithManual('name(박서윤)님은 010-2468-1357로 연락해주세요.');
      expect(result).not.toContain('name(');
      expect(result).toContain('박 . 서 . 윤님');
      expect(result).toContain('공 . 일 . 공');
    });
  });
});

describe('extractAutoTags', () => {
  it('텍스트에서 인식된 태그 정보를 추출한다', () => {
    const text = '전화번호는 010-1234-5678입니다.';
    const result = extractAutoTags(text, { enabledTags: ['phone'] });

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      original: '010-1234-5678',
      tagType: 'phone',
    });
    expect(result[0]?.start).toBe(6);
    expect(result[0]?.end).toBe(19);
  });

  it('여러 태그를 추출한다', () => {
    const text = '전화: 010-1234-5678, 금액: 5000원';
    const result = extractAutoTags(text, { enabledTags: ['phone', 'money'] });

    expect(result).toHaveLength(2);
    expect(result[0]?.tagType).toBe('phone');
    expect(result[1]?.tagType).toBe('money');
  });

  it('빈 문자열에서는 빈 배열을 반환한다', () => {
    expect(extractAutoTags('')).toEqual([]);
  });

  it('태그가 없으면 빈 배열을 반환한다', () => {
    expect(extractAutoTags('안녕하세요')).toEqual([]);
  });
});

describe('SUPPORTED_AUTO_TAGS', () => {
  it('모든 지원 태그가 포함되어 있다', () => {
    expect(SUPPORTED_AUTO_TAGS).toContain('phone');
    expect(SUPPORTED_AUTO_TAGS).toContain('datetime');
    expect(SUPPORTED_AUTO_TAGS).toContain('time');
    expect(SUPPORTED_AUTO_TAGS).toContain('date');
    expect(SUPPORTED_AUTO_TAGS).toContain('money');
    expect(SUPPORTED_AUTO_TAGS).toContain('year');
    expect(SUPPORTED_AUTO_TAGS).toContain('month');
    expect(SUPPORTED_AUTO_TAGS).toContain('day');
    expect(SUPPORTED_AUTO_TAGS).toContain('order');
    expect(SUPPORTED_AUTO_TAGS).toContain('point');
    expect(SUPPORTED_AUTO_TAGS).toContain('piece');
    expect(SUPPORTED_AUTO_TAGS).toContain('minsec');
  });
});
