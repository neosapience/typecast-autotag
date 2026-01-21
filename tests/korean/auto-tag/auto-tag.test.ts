import { autoTag, extractAutoTags, SUPPORTED_AUTO_TAGS } from '../../../src/korean/auto-tag';

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
        '공 . 일 . 공 . 일 . 이 . 삼 . 사 . 오 . 육 . 칠 . 팔'
      );
      expect(autoTag(text, { enabledTags: ['phone'] })).toContain('5000원');

      // money만 활성화
      expect(autoTag(text, { enabledTags: ['money'] })).toContain('010-1234-5678');
      expect(autoTag(text, { enabledTags: ['money'] })).toContain('오천 원');
    });

    it('여러 태그를 활성화할 수 있다', () => {
      const text = '전화: 010-1234-5678, 금액: 5000원';
      const result = autoTag(text, { enabledTags: ['phone', 'money'] });

      expect(result).toContain('공 . 일 . 공 . 일 . 이 . 삼 . 사 . 오 . 육 . 칠 . 팔');
      expect(result).toContain('오천 원');
    });

    it('빈 배열이면 아무것도 변환하지 않는다', () => {
      const text = '전화: 010-1234-5678';
      expect(autoTag(text, { enabledTags: [] })).toBe(text);
    });
  });

  describe('중복 매칭 방지', () => {
    it('겹치는 패턴은 더 긴 것을 우선한다', () => {
      // datetime이 date + time보다 우선
      const text = '2024-01-15T14:30';
      const result = autoTag(text);

      // datetime으로 한 번에 처리되어야 함
      expect(result).toBe('이천이십사년 일 월 십오 일 오후 두 시 삼십 분');
    });

    it('순차적으로 매칭된 패턴은 모두 처리한다', () => {
      const text = '010-1234-5678로 5000원 입금';
      const result = autoTag(text, { enabledTags: ['phone', 'money'] });

      expect(result).toContain('공 . 일 . 공 .');
      expect(result).toContain('오천 원');
    });
  });

  describe('복합 문장 처리', () => {
    it('여러 종류의 태그를 포함한 문장을 처리한다', () => {
      const text = '2024-01-15T14:30에 010-1234-5678로 50000원 결제 예정';
      const result = autoTag(text);

      expect(result).toContain('이천이십사년 일 월 십오 일 오후 두 시 삼십 분');
      expect(result).toContain('공 . 일 . 공 . 일 . 이 . 삼 . 사 . 오 . 육 . 칠 . 팔');
      expect(result).toContain('오만 원');
    });

    it('같은 종류의 태그가 여러 번 나오면 모두 처리한다', () => {
      const text = '전화1: 010-1111-2222, 전화2: 010-3333-4444';
      const result = autoTag(text, { enabledTags: ['phone'] });

      expect(result).toContain('공 . 일 . 공 . 일 . 일 . 일 . 일 . 이 . 이 . 이 . 이');
      expect(result).toContain('공 . 일 . 공 . 삼 . 삼 . 삼 . 삼 . 사 . 사 . 사 . 사');
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
