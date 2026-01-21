import { autoTag, autoCarNumber } from '../../../src/korean/auto-tag';
import { carNumber } from '../../../src/korean/tags/car-number';

describe('carNumber - 차량번호 변환', () => {
  describe('기본 차량번호 형식', () => {
    it('2자리+한글+4자리 형식을 변환한다', () => {
      expect(carNumber('12가 3456')).toBe('일 이 가 삼 사 오 육');
      expect(carNumber('12가3456')).toBe('일 이 가 삼 사 오 육');
    });

    it('3자리+한글+4자리 형식을 변환한다', () => {
      expect(carNumber('123가1234')).toBe('일 이 삼 가 일 이 삼 사');
      expect(carNumber('789나5678')).toBe('칠 팔 구 나 오 육 칠 팔');
    });

    it('지역명이 포함된 차량번호를 변환한다', () => {
      expect(carNumber('서울12가3456')).toBe('서울 일 이 가 삼 사 오 육');
      expect(carNumber('경기123가1234')).toBe('경기 일 이 삼 가 일 이 삼 사');
    });
  });

  describe('다양한 한글 문자', () => {
    it('다양한 차량 용도 문자를 처리한다', () => {
      expect(carNumber('12가 1234')).toBe('일 이 가 일 이 삼 사');
      expect(carNumber('34나 5678')).toBe('삼 사 나 오 육 칠 팔');
      expect(carNumber('56다 9012')).toBe('오 육 다 구 공 일 이');
    });
  });

  describe('변환하지 않는 경우', () => {
    it('빈 문자열은 그대로 반환한다', () => {
      expect(carNumber('')).toBe('');
      expect(carNumber('   ')).toBe('   ');
    });

    it('차량번호 형식이 아닌 경우 그대로 반환한다', () => {
      expect(carNumber('12345')).toBe('12345');
      expect(carNumber('가나다라')).toBe('가나다라');
      expect(carNumber('ABC-1234')).toBe('ABC-1234');
    });
  });
});

describe('autoCarNumber - 차량번호 자동 태깅', () => {
  it('문장 내 차량번호를 변환한다', () => {
    const result = autoCarNumber('차량번호: 12가 3456');
    expect(result).toContain('일 이 가 삼 사 오 육');
  });

  it('여러 차량번호를 모두 변환한다', () => {
    const result = autoCarNumber('12가3456과 34나5678');
    expect(result).toContain('일 이 가');
    expect(result).toContain('삼 사 나');
  });
});

describe('autoTag - 차량번호 통합 테스트', () => {
  it('차량번호가 포함된 문장을 올바르게 변환한다', () => {
    const result = autoTag('차량번호: 12가 3456', { enabledTags: ['carNumber'] });
    expect(result).toContain('일 이 가 삼 사 오 육');
  });
});
