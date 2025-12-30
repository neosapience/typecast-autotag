import { day } from '../../../src/korean/tags/day';

describe('day', () => {
  describe('기본 동작', () => {
    it('25일을 이십오일로 변환한다', () => {
      expect(day(25)).toBe('이십오일');
    });

    it('1일을 일일로 변환한다', () => {
      expect(day(1)).toBe('일일');
    });

    it('15일을 십오일로 변환한다', () => {
      expect(day(15)).toBe('십오일');
    });

    it('31일을 삼십일일로 변환한다', () => {
      expect(day(31)).toBe('삼십일일');
    });

    it('10일을 십일로 변환한다', () => {
      expect(day(10)).toBe('십일');
    });
  });

  describe('문자열 입력', () => {
    it('문자열 숫자도 처리한다', () => {
      expect(day('25')).toBe('이십오일');
    });

    it('문자열 "1"을 일일로 변환한다', () => {
      expect(day('1')).toBe('일일');
    });
  });

  describe('엣지 케이스', () => {
    it('범위를 벗어난 일은 그대로 반환한다', () => {
      expect(day(0)).toBe('0');
      expect(day(32)).toBe('32');
    });

    it('유효하지 않은 문자열은 그대로 반환한다', () => {
      expect(day('abc')).toBe('abc');
    });
  });
});
