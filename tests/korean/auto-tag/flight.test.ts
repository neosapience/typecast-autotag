import { autoTag, autoFlight } from '../../../src/korean/auto-tag';
import { flight } from '../../../src/korean/tags/flight';

describe('flight - 항공편 변환', () => {
  describe('기본 항공편 형식', () => {
    it('2자리 항공사코드 + 숫자를 변환한다', () => {
      expect(flight('SK301')).toBe('SK 삼 공 일');
      expect(flight('KE123')).toBe('KE 일 이 삼');
      expect(flight('OZ751')).toBe('OZ 칠 오 일');
    });

    it('3자리 항공사코드 + 숫자를 변환한다', () => {
      expect(flight('AAL100')).toBe('AAL 일 공 공');
    });

    it('1자리 숫자 편명을 변환한다', () => {
      expect(flight('KE1')).toBe('KE 일');
    });

    it('4자리 숫자 편명을 변환한다', () => {
      expect(flight('OZ1234')).toBe('OZ 일 이 삼 사');
    });
  });

  describe('소문자 입력', () => {
    it('소문자 항공사코드를 대문자로 변환한다', () => {
      expect(flight('oz301')).toBe('OZ 삼 공 일');
      expect(flight('ke123')).toBe('KE 일 이 삼');
    });
  });

  describe('변환하지 않는 경우', () => {
    it('빈 문자열은 그대로 반환한다', () => {
      expect(flight('')).toBe('');
      expect(flight('   ')).toBe('   ');
    });

    it('항공편 형식이 아닌 경우 그대로 반환한다', () => {
      expect(flight('12345')).toBe('12345');
      expect(flight('ABCDE')).toBe('ABCDE');
      expect(flight('A1')).toBe('A1'); // 1자리 코드는 변환하지 않음
    });
  });
});

describe('autoFlight - 항공편 자동 태깅', () => {
  it('출발편 레이블이 있는 항공편을 변환한다', () => {
    const result = autoFlight('출발편: SK301');
    expect(result).toContain('삼 공 일');
  });

  it('도착편 레이블이 있는 항공편을 변환한다', () => {
    const result = autoFlight('도착편: KE123');
    expect(result).toContain('일 이 삼');
  });

  it('알려진 항공사 코드를 변환한다', () => {
    const result = autoFlight('KE123 항공편');
    expect(result).toContain('일 이 삼');
  });
});

describe('autoTag - 항공편 통합 테스트', () => {
  it('항공편이 포함된 문장을 올바르게 변환한다', () => {
    const result = autoTag('출발편: SK301', { enabledTags: ['flight'] });
    expect(result).toContain('삼 공 일');
  });
});
