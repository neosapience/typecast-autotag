import {
  manualTag,
  extractTags,
  manualTagSelective,
  SUPPORTED_TAGS,
} from '../src/korean/manual-tag';

describe('manualTag', () => {
  describe('기본 동작', () => {
    it('name 태그를 변환한다', () => {
      expect(manualTag('안녕하세요, name(김형우) 고객님.')).toBe('안녕하세요, 김 형 우 고객님.');
    });

    it('month 태그를 변환한다', () => {
      expect(manualTag('month(12)월입니다')).toBe('십이월월입니다');
      expect(manualTag('month(6)')).toBe('유월');
      expect(manualTag('month(10)')).toBe('시월');
    });

    it('day 태그를 변환한다', () => {
      expect(manualTag('day(25)에 방문합니다')).toBe('이십오일에 방문합니다');
    });

    it('date 태그를 변환한다', () => {
      expect(manualTag('date(19940616)')).toBe('천구백구십사년 유 월 십육 일');
    });

    it('time 태그를 변환한다', () => {
      expect(manualTag('time(14:30)에 만납시다')).toBe('오후 두 시 삼십 분에 만납시다');
    });

    it('year 태그를 변환한다', () => {
      expect(manualTag('year(2024)년도입니다')).toBe('이천이십사년년도입니다');
    });

    it('phone 태그를 변환한다', () => {
      expect(manualTag('전화번호: phone(010-1234-5678)')).toBe(
        '전화번호: 공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔'
      );
    });

    it('money 태그를 변환한다', () => {
      expect(manualTag('금액은 money(10000)입니다')).toBe('금액은 일만 원입니다');
    });

    it('order 태그를 변환한다', () => {
      expect(manualTag('order(1) 고객님')).toBe('첫 번째 고객님');
      expect(manualTag('order(3)')).toBe('세 번째');
    });

    it('point 태그를 변환한다', () => {
      expect(manualTag('point(95)을 획득했습니다')).toBe('구십오 점을 획득했습니다');
    });

    it('piece 태그를 변환한다', () => {
      expect(manualTag('piece(5)를 구매했습니다')).toBe('다섯 개를 구매했습니다');
    });

    it('digits 태그를 변환한다', () => {
      expect(manualTag('인증번호: digits(1234)')).toBe('인증번호: 일 이 삼 사');
    });

    it('minsec 태그를 변환한다', () => {
      expect(manualTag('대기시간: minsec(3m20s)')).toBe('대기시간: 삼 분 이십 초');
    });

    it('datetime 태그를 변환한다', () => {
      expect(manualTag('datetime(2024-01-15T14:30)')).toBe(
        '이천이십사년 일 월 십오 일 오후 두 시 삼십 분'
      );
    });
  });

  describe('복수 태그 처리', () => {
    it('여러 개의 동일한 태그를 변환한다', () => {
      expect(manualTag('name(김철수)님과 name(이영희)님')).toBe('김 철 수님과 이 영 희님');
    });

    it('여러 종류의 태그를 변환한다', () => {
      expect(
        manualTag('안녕하세요, name(김형우) 고객님. month(12) day(25)에 방문 예정입니다.')
      ).toBe('안녕하세요, 김 형 우 고객님. 십이월 이십오일에 방문 예정입니다.');
    });

    it('복잡한 문장에서 모든 태그를 변환한다', () => {
      const input = 'name(홍길동)님, year(2024) month(1) day(15)에 money(50000) 결제 예정입니다.';
      const expected = '홍 길 동님, 이천이십사년 일월 십오일에 오만 원 결제 예정입니다.';
      expect(manualTag(input)).toBe(expected);
    });
  });

  describe('엣지 케이스', () => {
    it('빈 문자열은 그대로 반환한다', () => {
      expect(manualTag('')).toBe('');
    });

    it('null/undefined 같은 falsy 값은 그대로 반환한다', () => {
      expect(manualTag(null as unknown as string)).toBe(null);
      expect(manualTag(undefined as unknown as string)).toBe(undefined);
    });

    it('태그가 없는 문자열은 그대로 반환한다', () => {
      expect(manualTag('안녕하세요')).toBe('안녕하세요');
    });

    it('빈 값을 가진 태그도 처리한다', () => {
      expect(manualTag('name()')).toBe('');
    });

    it('지원하지 않는 태그는 그대로 유지한다', () => {
      expect(manualTag('unknown(test)')).toBe('unknown(test)');
    });

    it('중첩된 괄호가 없는 값만 처리한다', () => {
      // 중첩 괄호는 지원하지 않음 - 첫 번째 닫는 괄호까지만 매칭
      expect(manualTag('name(김(형)우)')).toBe('김 ( 형우)');
    });
  });
});

describe('extractTags', () => {
  it('텍스트에서 태그 정보를 추출한다', () => {
    const result = extractTags('안녕하세요, name(김형우) 고객님.');
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      tag: 'name',
      value: '김형우',
      start: 7,
      end: 16,
    });
  });

  it('여러 태그를 추출한다', () => {
    const result = extractTags('name(홍길동) month(12) day(25)');
    expect(result).toHaveLength(3);
    expect(result[0]?.tag).toBe('name');
    expect(result[1]?.tag).toBe('month');
    expect(result[2]?.tag).toBe('day');
  });

  it('빈 문자열에서는 빈 배열을 반환한다', () => {
    expect(extractTags('')).toEqual([]);
  });

  it('태그가 없으면 빈 배열을 반환한다', () => {
    expect(extractTags('안녕하세요')).toEqual([]);
  });
});

describe('manualTagSelective', () => {
  it('선택된 태그만 변환한다', () => {
    expect(manualTagSelective('name(김형우) month(12)', ['name'])).toBe('김 형 우 month(12)');
  });

  it('여러 태그를 선택할 수 있다', () => {
    expect(manualTagSelective('name(김형우) month(12) day(25)', ['name', 'month'])).toBe(
      '김 형 우 십이월 day(25)'
    );
  });

  it('빈 허용 목록이면 변환하지 않는다', () => {
    expect(manualTagSelective('name(김형우) month(12)', [])).toBe('name(김형우) month(12)');
  });

  it('지원하지 않는 태그명은 무시한다', () => {
    expect(manualTagSelective('name(김형우)', ['unknown'])).toBe('name(김형우)');
  });

  it('빈 문자열은 그대로 반환한다', () => {
    expect(manualTagSelective('', ['name'])).toBe('');
  });
});

describe('SUPPORTED_TAGS', () => {
  it('모든 지원 태그가 포함되어 있다', () => {
    expect(SUPPORTED_TAGS).toContain('name');
    expect(SUPPORTED_TAGS).toContain('month');
    expect(SUPPORTED_TAGS).toContain('day');
    expect(SUPPORTED_TAGS).toContain('date');
    expect(SUPPORTED_TAGS).toContain('time');
    expect(SUPPORTED_TAGS).toContain('year');
    expect(SUPPORTED_TAGS).toContain('phone');
    expect(SUPPORTED_TAGS).toContain('money');
    expect(SUPPORTED_TAGS).toContain('order');
    expect(SUPPORTED_TAGS).toContain('point');
    expect(SUPPORTED_TAGS).toContain('piece');
    expect(SUPPORTED_TAGS).toContain('digits');
    expect(SUPPORTED_TAGS).toContain('minsec');
    expect(SUPPORTED_TAGS).toContain('datetime');
  });

  it('32개의 태그가 지원된다', () => {
    expect(SUPPORTED_TAGS).toHaveLength(32);
  });
});
