import { autoTag, autoSeat } from '../../../src/korean/auto-tag';
import { seat } from '../../../src/korean/tags/seat';

describe('seat - 좌석번호 변환', () => {
  describe('기본 좌석번호 형식', () => {
    it('2자리 숫자 + 영문을 변환한다', () => {
      expect(seat('23A')).toBe('이 삼 A');
      expect(seat('15F')).toBe('일 오 F');
      expect(seat('42C')).toBe('사 이 C');
    });

    it('1자리 숫자 + 영문을 변환한다', () => {
      expect(seat('7C')).toBe('칠 C');
      expect(seat('1A')).toBe('일 A');
    });

    it('3자리 숫자 + 영문을 변환한다', () => {
      expect(seat('100A')).toBe('일 영 영 A');
    });
  });

  describe('소문자 입력', () => {
    it('소문자 영문을 대문자로 변환한다', () => {
      expect(seat('23a')).toBe('이 삼 A');
      expect(seat('15f')).toBe('일 오 F');
    });
  });

  describe('변환하지 않는 경우', () => {
    it('빈 문자열은 그대로 반환한다', () => {
      expect(seat('')).toBe('');
      expect(seat('   ')).toBe('   ');
    });

    it('좌석번호 형식이 아닌 경우 그대로 반환한다', () => {
      expect(seat('12345')).toBe('12345');
      expect(seat('ABC')).toBe('ABC');
      expect(seat('A23')).toBe('A23'); // 영문이 앞에 오면 변환하지 않음
    });
  });
});

describe('autoSeat - 좌석번호 자동 태깅', () => {
  it('좌석번호 레이블이 있는 경우를 변환한다', () => {
    const result = autoSeat('좌석번호: 23A');
    expect(result).toContain('이 삼 A');
  });

  it('좌석 레이블이 있는 경우를 변환한다', () => {
    const result = autoSeat('좌석: 15F');
    expect(result).toContain('일 오 F');
  });
});

describe('autoTag - 좌석번호 통합 테스트', () => {
  it('좌석번호가 포함된 문장을 올바르게 변환한다', () => {
    const result = autoTag('좌석번호: 23A (창가석)', { enabledTags: ['seat'] });
    expect(result).toContain('이 삼 A');
  });
});
