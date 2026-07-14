import { autoTag, autoFloor } from '../../../src/korean/auto-tag';

describe('autoTag - floor (층수 자동 태깅)', () => {
  describe('일반 층수', () => {
    it('기본 층수를 변환한다', () => {
      expect(autoFloor('3층')).toBe('삼층');
      expect(autoFloor('10층')).toBe('십층');
    });

    it('문장 내 층수를 올바르게 변환한다', () => {
      expect(autoFloor('예약 장소: 강남 센터 3층')).toBe('예약 장소: 강남 센터 삼층');
    });

    it('여러 층수를 모두 변환한다', () => {
      const result = autoFloor('1층 로비에서 만나 5층으로 이동');
      expect(result).toContain('일층');
      expect(result).toContain('오층');
    });
  });

  describe('지하층 - 영문 B', () => {
    it('B층 표기를 변환한다', () => {
      expect(autoFloor('B1층')).toBe('지하일층');
      expect(autoFloor('B2층')).toBe('지하이층');
    });

    it('소문자 b도 처리한다', () => {
      expect(autoFloor('b1층')).toBe('지하일층');
    });

    it('문장 내 B층을 올바르게 변환한다', () => {
      expect(autoFloor('주차장은 B2층에 있습니다')).toBe('주차장은 지하이층 에 있습니다');
    });
  });

  describe('지하층 - 한글', () => {
    it('지하층 표기를 변환한다', () => {
      expect(autoFloor('지하1층')).toBe('지하일층');
      expect(autoFloor('지하2층')).toBe('지하이층');
    });

    it('지하와 숫자 사이에 공백이 있어도 처리한다', () => {
      expect(autoFloor('지하 1층')).toBe('지하일층');
    });

    it('문장 내 지하층을 올바르게 변환한다', () => {
      expect(autoFloor('창고는 지하3층에 있습니다')).toBe('창고는 지하삼층 에 있습니다');
    });
  });

  describe('복합 상황', () => {
    it('지상층과 지하층을 함께 변환한다', () => {
      const result = autoFloor('엘리베이터는 B1층부터 20층까지');
      expect(result).toContain('지하일층');
      expect(result).toContain('이십층');
    });
  });

  describe('False Positive 방지', () => {
    it('단위 없는 숫자는 변환하지 않는다', () => {
      expect(autoFloor('12345')).toBe('12345');
    });

    it('층이 아닌 단어는 변환하지 않는다', () => {
      expect(autoFloor('3회')).toBe('3회');
    });
  });

  describe('통합 테스트', () => {
    it('전체 태그와 함께 사용할 때 층수가 올바르게 처리된다', () => {
      const result = autoTag('예약 장소: 강남 센터 3층');
      expect(result).toBe('예약 장소: 강남 센터 삼층');
    });

    it('다른 태그와 함께 사용할 때 각각 올바르게 처리된다', () => {
      const result = autoTag('3층에서 5000원 결제');
      expect(result).toContain('삼층');
      expect(result).toContain('오천원');
    });
  });
});
