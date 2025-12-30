import { digits } from '../../../src/korean/tags/digits';

describe('digits', () => {
  describe('기본 동작', () => {
    it('숫자를 한 자리씩 끊어서 읽는다', () => {
      expect(digits(123456)).toBe('일 이 삼 사 오 육');
    });

    it('문자열 숫자도 처리한다', () => {
      expect(digits('789')).toBe('칠 팔 구');
    });

    it('0도 처리한다', () => {
      expect(digits('0')).toBe('영');
    });

    it('모든 숫자를 처리한다', () => {
      expect(digits('1234567890')).toBe('일 이 삼 사 오 육 칠 팔 구 영');
    });
  });

  describe('커스텀 구분자', () => {
    it('커스텀 구분자를 사용할 수 있다', () => {
      expect(digits('123', ', ')).toBe('일, 이, 삼');
    });

    it('빈 구분자도 사용할 수 있다', () => {
      expect(digits('123', '')).toBe('일이삼');
    });
  });

  describe('엣지 케이스', () => {
    it('빈 문자열은 그대로 반환한다', () => {
      expect(digits('')).toBe('');
    });

    it('한 자리 숫자는 그대로 변환한다', () => {
      expect(digits('5')).toBe('오');
    });
  });
});
