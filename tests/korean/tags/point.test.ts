import { point } from '../../../src/korean/tags/point';

describe('point', () => {
  describe('기본 동작', () => {
    it('95를 구십오 점으로 변환한다', () => {
      expect(point(95)).toBe('구십오 점');
    });

    it('100을 백 점으로 변환한다', () => {
      expect(point(100)).toBe('백 점');
    });

    it('0을 영 점으로 변환한다', () => {
      expect(point(0)).toBe('영 점');
    });

    it('50을 오십 점으로 변환한다', () => {
      expect(point(50)).toBe('오십 점');
    });

    it('1을 일 점으로 변환한다', () => {
      expect(point(1)).toBe('일 점');
    });
  });

  describe('소수점 처리', () => {
    it('4.5를 사 쩜 오 점으로 변환한다', () => {
      expect(point(4.5)).toBe('사 쩜 오 점');
    });

    it('3.14를 삼 쩜 일사 점으로 변환한다', () => {
      expect(point(3.14)).toBe('삼 쩜 일사 점');
    });

    it('0.5를 영 쩜 오 점으로 변환한다', () => {
      expect(point(0.5)).toBe('영 쩜 오 점');
    });

    it('99.99를 구십구 쩜 구구 점으로 변환한다', () => {
      expect(point(99.99)).toBe('구십구 쩜 구구 점');
    });
  });

  describe('음수 처리', () => {
    it('-5를 마이너스 오 점으로 변환한다', () => {
      expect(point(-5)).toBe('마이너스 오 점');
    });

    it('-10.5를 마이너스 십 쩜 오 점으로 변환한다', () => {
      expect(point(-10.5)).toBe('마이너스 십 쩜 오 점');
    });
  });

  describe('문자열 입력', () => {
    it('"85점"을 팔십오 점으로 변환한다', () => {
      expect(point('85점')).toBe('팔십오 점');
    });

    it('"100"을 백 점으로 변환한다', () => {
      expect(point('100')).toBe('백 점');
    });

    it('"4.5점"을 사 쩜 오 점으로 변환한다', () => {
      expect(point('4.5점')).toBe('사 쩜 오 점');
    });

    it('천단위 구분자가 있는 숫자도 처리한다', () => {
      expect(point('1,000점')).toBe('천 점');
    });

    it('공백이 있는 문자열도 처리한다', () => {
      expect(point('  95점  ')).toBe('구십오 점');
    });
  });

  describe('옵션 - 단위', () => {
    it('단위를 등급으로 설정할 수 있다', () => {
      expect(point(90, { unit: '등급' })).toBe('구십 등급');
    });

    it('단위를 개로 설정할 수 있다', () => {
      expect(point(5, { unit: '개' })).toBe('오 개');
    });

    it('단위를 퍼센트로 설정할 수 있다', () => {
      expect(point(85, { unit: '퍼센트' })).toBe('팔십오 퍼센트');
    });
  });

  describe('옵션 - 공백', () => {
    it('공백을 제거할 수 있다', () => {
      expect(point(95, { includeSpace: false })).toBe('구십오점');
    });

    it('단위와 공백 옵션을 함께 사용할 수 있다', () => {
      expect(point(90, { unit: '등급', includeSpace: false })).toBe('구십등급');
    });
  });

  describe('엣지 케이스', () => {
    it('빈 문자열은 그대로 반환한다', () => {
      expect(point('')).toBe('');
    });

    it('NaN은 원본 반환한다', () => {
      expect(point(NaN)).toBe('NaN');
    });
  });
});
