import { autoTag, autoRatio } from '../../../src/korean/auto-tag';

describe('autoTag - ratio (비율 자동 태깅)', () => {
  describe('콜론 비율', () => {
    it('기본 비율을 변환한다', () => {
      expect(autoRatio('비율은 1:1입니다.')).toBe('비율은 일대일 입니다.');
      expect(autoRatio('7:3')).toBe('칠대삼');
    });

    it('세 개 이상의 비율을 변환한다', () => {
      expect(autoRatio('1:2:3')).toBe('일대이대삼');
    });

    it('두 자리 숫자 비율을 변환한다', () => {
      expect(autoRatio('10:90')).toBe('십대구십');
      expect(autoRatio('50:50')).toBe('오십대오십');
    });
  });

  describe('퍼센트', () => {
    it('기본 퍼센트를 변환한다', () => {
      expect(autoRatio('할인율 15%')).toBe('할인율 십오 퍼센트');
      expect(autoRatio('100%')).toBe('백 퍼센트');
    });

    it('소수점 퍼센트를 변환한다', () => {
      expect(autoRatio('3.5%')).toBe('삼쩜오 퍼센트');
      expect(autoRatio('0.1%')).toBe('영쩜일 퍼센트');
    });

    it('공백이 있는 퍼센트를 변환한다', () => {
      expect(autoRatio('50 %')).toBe('오십 퍼센트');
    });
  });

  describe('복수 비율', () => {
    it('여러 퍼센트를 모두 변환한다', () => {
      const result = autoRatio('할인 20%, 적립 5%');
      expect(result).toContain('이십 퍼센트');
      expect(result).toContain('오 퍼센트');
    });

    it('콜론 비율과 퍼센트를 함께 변환한다', () => {
      const result = autoRatio('비율 7:3, 성공률 85%');
      expect(result).toContain('칠대삼');
      expect(result).toContain('팔십오 퍼센트');
    });
  });

  describe('False Positive 방지', () => {
    it('단위 없는 숫자는 변환하지 않는다', () => {
      expect(autoRatio('12345')).toBe('12345');
    });

    it('퍼센트 기호 없는 숫자는 변환하지 않는다', () => {
      expect(autoTag('15', { enabledTags: ['ratio'] })).toBe('15');
    });
  });

  describe('문맥 내 비율', () => {
    it('문장 내 비율을 올바르게 변환한다', () => {
      expect(autoRatio('이 상품은 95% 할인됩니다.')).toBe('이 상품은 구십오 퍼센트 할인됩니다.');
    });

    it('괄호 안 비율을 변환한다', () => {
      expect(autoRatio('(50%)')).toBe('(오십 퍼센트)');
    });
  });

  describe('시간과 비율 구분', () => {
    it('시간 패턴과 함께 사용할 때 올바르게 처리한다', () => {
      // time 태그와 ratio 태그를 모두 활성화
      const result = autoTag('회의 14:30, 비율 1:1', { enabledTags: ['time', 'ratio'] });
      // 14:30은 시간으로, 1:1은 비율로 처리됨
      expect(result).toContain('일대일');
    });
  });

  describe('배수', () => {
    it('기본 배수를 변환한다 (고유어 사용)', () => {
      expect(autoRatio('포인트 2배 적립')).toBe('포인트 두 배 적립');
      expect(autoRatio('10배')).toBe('열 배');
    });

    it('소수점 배수를 변환한다', () => {
      expect(autoRatio('1.5배')).toBe('한쩜오 배');
      expect(autoRatio('2.5배 증가')).toBe('두쩜오 배 증가');
    });

    it('여러 배수를 모두 변환한다', () => {
      const result = autoRatio('기본 2배, 프리미엄 3배');
      expect(result).toContain('두 배');
      expect(result).toContain('세 배');
    });

    it('문장 내 배수를 올바르게 변환한다', () => {
      expect(autoRatio('네 번째 혜택: 포인트 2배 적립')).toBe('네 번째 혜택: 포인트 두 배 적립');
    });

    it('100 이상의 배수는 한자어를 사용한다', () => {
      expect(autoRatio('100배')).toBe('백 배');
      expect(autoRatio('200배')).toBe('이백 배');
    });
  });
});
