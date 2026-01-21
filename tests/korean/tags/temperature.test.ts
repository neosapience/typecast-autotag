import { temperature } from '../../../src/korean/tags/temperature';

describe('temperature', () => {
  describe('숫자만 입력', () => {
    it('숫자만 입력하면 섭씨 도로 변환한다', () => {
      expect(temperature(25)).toBe('이십오 도');
    });

    it('문자열 숫자만 입력해도 섭씨 도로 변환한다', () => {
      expect(temperature('25')).toBe('이십오 도');
    });

    it('음수 숫자만 입력하면 영하로 변환한다', () => {
      expect(temperature(-5)).toBe('영하 오 도');
    });

    it('0도도 처리한다', () => {
      expect(temperature(0)).toBe('영 도');
    });
  });

  describe('단위가 있는 입력', () => {
    it('℃ 기호가 있으면 섭씨 도로 변환한다', () => {
      expect(temperature('25℃')).toBe('이십오 도');
    });

    it('°C 기호가 있으면 섭씨 도로 변환한다', () => {
      expect(temperature('25°C')).toBe('이십오 도');
    });

    it('도가 있으면 섭씨 도로 변환한다', () => {
      expect(temperature('25도')).toBe('이십오 도');
    });

    it('℉ 기호가 있으면 화씨로 변환한다', () => {
      expect(temperature('68℉')).toBe('육십팔 화씨');
    });

    it('K 기호가 있으면 켈빈으로 변환한다', () => {
      expect(temperature('273K')).toBe('이백칠십삼 켈빈');
    });
  });

  describe('음수 온도', () => {
    it('음수 섭씨는 영하로 표현한다', () => {
      expect(temperature('-5℃')).toBe('영하 오 도');
    });

    it('음수 화씨는 영하로 표현한다', () => {
      expect(temperature('-10℉')).toBe('영하 십 화씨');
    });
  });

  describe('소수점', () => {
    it('소수점이 있는 온도도 처리한다', () => {
      expect(temperature('20.5℃')).toBe('이십 쩜 오 도');
    });

    it('숫자만 입력해도 소수점 처리한다', () => {
      expect(temperature('36.5')).toBe('삼십육 쩜 오 도');
    });
  });
});
