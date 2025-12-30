import { duration } from '../../../src/korean/tags/duration';

describe('duration', () => {
  describe('기본 동작 - 개월', () => {
    it('1개월을 일 개월로 변환한다', () => {
      expect(duration('1개월')).toBe('일 개월');
    });

    it('3개월을 삼 개월로 변환한다', () => {
      expect(duration('3개월')).toBe('삼 개월');
    });

    it('6개월을 육 개월로 변환한다', () => {
      expect(duration('6개월')).toBe('육 개월');
    });

    it('12개월을 십이 개월로 변환한다', () => {
      expect(duration('12개월')).toBe('십이 개월');
    });

    it('24개월을 이십사 개월로 변환한다', () => {
      expect(duration('24개월')).toBe('이십사 개월');
    });
  });

  describe('주 단위', () => {
    it('1주를 일 주로 변환한다', () => {
      expect(duration('1주')).toBe('일 주');
    });

    it('2주를 이 주로 변환한다', () => {
      expect(duration('2주')).toBe('이 주');
    });

    it('4주를 사 주로 변환한다', () => {
      expect(duration('4주')).toBe('사 주');
    });

    it('1주일을 일 주일로 변환한다', () => {
      expect(duration('1주일')).toBe('일 주일');
    });

    it('2주일을 이 주일로 변환한다', () => {
      expect(duration('2주일')).toBe('이 주일');
    });
  });

  describe('년간/달', () => {
    it('1년간을 일 년간으로 변환한다', () => {
      expect(duration('1년간')).toBe('일 년간');
    });

    it('2년간을 이 년간으로 변환한다', () => {
      expect(duration('2년간')).toBe('이 년간');
    });

    it('5년간을 오 년간으로 변환한다', () => {
      expect(duration('5년간')).toBe('오 년간');
    });

    it('1달을 일 달로 변환한다', () => {
      expect(duration('1달')).toBe('일 달');
    });

    it('3달을 삼 달로 변환한다', () => {
      expect(duration('3달')).toBe('삼 달');
    });
  });

  describe('학기/분기', () => {
    it('1학기를 일 학기로 변환한다', () => {
      expect(duration('1학기')).toBe('일 학기');
    });

    it('2학기를 이 학기로 변환한다', () => {
      expect(duration('2학기')).toBe('이 학기');
    });

    it('1분기를 일 분기로 변환한다', () => {
      expect(duration('1분기')).toBe('일 분기');
    });

    it('4분기를 사 분기로 변환한다', () => {
      expect(duration('4분기')).toBe('사 분기');
    });
  });

  describe('엣지 케이스', () => {
    it('0개월을 영 개월로 변환한다', () => {
      expect(duration('0개월')).toBe('영 개월');
    });

    it('빈 문자열은 그대로 반환한다', () => {
      expect(duration('')).toBe('');
    });

    it('공백만 있는 문자열은 원본 반환한다', () => {
      expect(duration('   ')).toBe('   ');
    });

    it('단위 없는 숫자만 입력하면 원본 반환한다', () => {
      expect(duration(5)).toBe('5');
    });

    it('인식되지 않는 단위는 원본 반환한다', () => {
      expect(duration('3시간')).toBe('3시간');
    });
  });

  describe('옵션 - 공백', () => {
    it('공백을 제거할 수 있다', () => {
      expect(duration('3개월', { includeSpace: false })).toBe('삼개월');
    });

    it('주일에도 공백 옵션이 적용된다', () => {
      expect(duration('2주일', { includeSpace: false })).toBe('이주일');
    });

    it('년간에도 공백 옵션이 적용된다', () => {
      expect(duration('5년간', { includeSpace: false })).toBe('오년간');
    });
  });

  describe('천단위 구분자', () => {
    it('천단위 구분자가 있는 숫자도 처리한다', () => {
      expect(duration('1,000개월')).toBe('천 개월');
    });
  });
});
