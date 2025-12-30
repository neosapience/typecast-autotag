import { month } from '../../../src/korean/tags/month';

describe('month', () => {
  describe('기본 동작', () => {
    it('12월을 십이월로 변환한다', () => {
      expect(month(12)).toBe('십이월');
    });

    it('1월을 일월로 변환한다', () => {
      expect(month(1)).toBe('일월');
    });

    it('6월을 육월로 변환한다', () => {
      expect(month(6)).toBe('육월');
    });

    it('10월을 십월로 변환한다', () => {
      expect(month(10)).toBe('십월');
    });
  });

  describe('문자열 입력', () => {
    it('문자열 숫자도 처리한다', () => {
      expect(month('12')).toBe('십이월');
    });

    it('문자열 "6"을 육월로 변환한다', () => {
      expect(month('6')).toBe('육월');
    });
  });

  describe('엣지 케이스', () => {
    it('범위를 벗어난 월은 그대로 반환한다', () => {
      expect(month(0)).toBe('0');
      expect(month(13)).toBe('13');
    });

    it('유효하지 않은 문자열은 그대로 반환한다', () => {
      expect(month('abc')).toBe('abc');
    });
  });
});
