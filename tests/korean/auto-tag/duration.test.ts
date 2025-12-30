import { autoTag, autoDuration } from '../../../src/korean/auto-tag';

describe('autoTag - duration (기간 자동 태깅)', () => {
  describe('개월', () => {
    it('기본 개월을 변환한다', () => {
      expect(autoDuration('3개월')).toBe('삼 개월');
      expect(autoDuration('6개월')).toBe('육 개월');
    });

    it('문장 내 개월을 올바르게 변환한다', () => {
      expect(autoDuration('프리미엄 구독권 3개월')).toBe('프리미엄 구독권 삼 개월');
    });

    it('여러 개월을 모두 변환한다', () => {
      const result = autoDuration('3개월 또는 6개월 구독 가능');
      expect(result).toContain('삼 개월');
      expect(result).toContain('육 개월');
    });
  });

  describe('주/주일', () => {
    it('기본 주를 변환한다', () => {
      expect(autoDuration('2주')).toBe('이 주');
      expect(autoDuration('4주')).toBe('사 주');
    });

    it('주일을 변환한다', () => {
      expect(autoDuration('2주일')).toBe('이 주일');
    });

    it('문장 내 주를 올바르게 변환한다', () => {
      expect(autoDuration('배송은 2주 소요됩니다')).toBe('배송은 이 주 소요됩니다');
    });
  });

  describe('년간', () => {
    it('년간을 변환한다', () => {
      expect(autoDuration('1년간')).toBe('일 년간');
      expect(autoDuration('5년간')).toBe('오 년간');
    });

    it('문장 내 년간을 올바르게 변환한다', () => {
      expect(autoDuration('최대 10년간 보장됩니다')).toBe('최대 십 년간 보장됩니다');
    });
  });

  describe('달', () => {
    it('달을 변환한다', () => {
      expect(autoDuration('3달')).toBe('삼 달');
    });

    it('문장 내 달을 올바르게 변환한다', () => {
      expect(autoDuration('3달 동안 사용 가능')).toBe('삼 달 동안 사용 가능');
    });
  });

  describe('학기/분기', () => {
    it('학기를 변환한다', () => {
      expect(autoDuration('1학기')).toBe('일 학기');
      expect(autoDuration('2학기')).toBe('이 학기');
    });

    it('분기를 변환한다', () => {
      expect(autoDuration('1분기')).toBe('일 분기');
      expect(autoDuration('4분기')).toBe('사 분기');
    });
  });

  describe('piece와의 구분', () => {
    it('개월은 duration으로 처리하고 개는 piece로 처리한다', () => {
      // duration만 활성화
      expect(autoDuration('3개월 구독')).toBe('삼 개월 구독');

      // piece만 활성화
      const pieceResult = autoTag('사과 3개', { enabledTags: ['piece'] });
      expect(pieceResult).toBe('사과 세 개');

      // 둘 다 활성화
      const bothResult = autoTag('3개월 구독, 사은품 5개', { enabledTags: ['duration', 'piece'] });
      expect(bothResult).toContain('삼 개월');
      expect(bothResult).toContain('다섯 개');
    });
  });

  describe('False Positive 방지', () => {
    it('단위 없는 숫자는 변환하지 않는다', () => {
      expect(autoDuration('12345')).toBe('12345');
    });

    it('인식되지 않는 단위는 변환하지 않는다', () => {
      expect(autoDuration('3시간')).toBe('3시간');
    });
  });

  describe('통합 테스트', () => {
    it('전체 태그와 함께 사용할 때 개월이 올바르게 처리된다', () => {
      const result = autoTag('프리미엄 구독권 3개월');
      expect(result).toBe('프리미엄 구독권 삼 개월');
      expect(result).not.toContain('세 개');
    });
  });
});
