import { month } from '../../../src/korean/tags/month';

describe('month', () => {
  describe('1~12월 전체 테스트', () => {
    const expected: [number, string][] = [
      [1, '일월'],
      [2, '이월'],
      [3, '삼월'],
      [4, '사월'],
      [5, '오월'],
      [6, '유월'], // 불규칙: 육월 → 유월
      [7, '칠월'],
      [8, '팔월'],
      [9, '구월'],
      [10, '시월'], // 불규칙: 십월 → 시월
      [11, '십일월'],
      [12, '십이월'],
    ];

    expected.forEach(([num, name]) => {
      it(`${num}월을 ${name}로 변환한다`, () => {
        expect(month(num)).toBe(name);
      });
    });
  });

  describe('월 발음 불규칙 (표준 발음법)', () => {
    it('6월을 유월로 변환한다 (육월 ❌)', () => {
      expect(month(6)).toBe('유월');
      expect(month('6')).toBe('유월');
    });

    it('10월을 시월로 변환한다 (십월 ❌)', () => {
      expect(month(10)).toBe('시월');
      expect(month('10')).toBe('시월');
    });
  });

  describe('문자열 입력', () => {
    it('문자열 숫자도 처리한다', () => {
      expect(month('12')).toBe('십이월');
      expect(month('1')).toBe('일월');
    });

    it('앞뒤 공백이 있는 숫자도 처리한다', () => {
      expect(month(' 6 ')).toBe('유월');
      expect(month(' 10')).toBe('시월');
    });
  });

  describe('엣지 케이스', () => {
    it('범위를 벗어난 월은 그대로 반환한다', () => {
      expect(month(0)).toBe('0');
      expect(month(13)).toBe('13');
      expect(month(-1)).toBe('-1');
      expect(month(100)).toBe('100');
    });

    it('유효하지 않은 문자열은 그대로 반환한다', () => {
      expect(month('abc')).toBe('abc');
      expect(month('')).toBe('');
      expect(month('  ')).toBe('  ');
    });

    it('소수점이 포함된 숫자는 정수 부분만 사용한다', () => {
      expect(month(6.7)).toBe('유월');
      expect(month(10.9)).toBe('시월');
      expect(month(1.5)).toBe('일월');
    });
  });
});
