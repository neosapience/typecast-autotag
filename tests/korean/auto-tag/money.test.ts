import { autoTag, autoMoney } from '../../../src/korean/auto-tag';

describe('autoTag - money (금액 자동 태깅)', () => {
  describe('숫자 + 원', () => {
    it('기본 금액을 변환한다', () => {
      expect(autoMoney('가격: 5000원')).toBe('가격: 오천 원');
      expect(autoMoney('10000원')).toBe('일만 원');
      expect(autoMoney('50000원')).toBe('오만 원');
    });

    it('천단위 구분자가 있는 금액을 변환한다', () => {
      expect(autoMoney('총액: 1,000,000원')).toBe('총액: 백만 원');
      expect(autoMoney('50,000원')).toBe('오만 원');
    });

    it('공백이 있는 금액을 변환한다', () => {
      expect(autoMoney('5000 원')).toBe('오천 원');
    });
  });

  describe('화폐 기호', () => {
    it('원화 기호를 변환한다', () => {
      expect(autoMoney('₩10000')).toBe('일만 원');
      expect(autoMoney('₩ 50,000')).toBe('오만 원');
    });
  });

  describe('다양한 금액', () => {
    it('작은 금액을 변환한다', () => {
      expect(autoMoney('100원')).toBe('백 원');
      expect(autoMoney('500원')).toBe('오백 원');
    });

    it('큰 금액을 변환한다', () => {
      expect(autoMoney('1000000원')).toBe('백만 원');
      expect(autoMoney('10,000,000원')).toBe('천만 원');
      expect(autoMoney('100000000원')).toBe('일억 원');
    });

    it('복합 금액을 변환한다', () => {
      expect(autoMoney('12,340원')).toBe('일만이천삼백사십 원');
      expect(autoMoney('987654원')).toBe('구십팔만칠천육백오십사 원');
    });
  });

  describe('복수 금액', () => {
    it('여러 금액을 모두 변환한다', () => {
      const result = autoMoney('정가: 50000원, 할인가: 35000원');
      expect(result).toContain('오만 원');
      expect(result).toContain('삼만오천 원');
    });
  });

  describe('False Positive 방지', () => {
    it('점수는 금액으로 변환하지 않는다', () => {
      // '점' 단위는 money가 아님
      expect(autoTag('95점', { enabledTags: ['money'] })).toBe('95점');
    });

    it('단위 없는 숫자는 변환하지 않는다', () => {
      expect(autoMoney('12345')).toBe('12345');
    });

    it('날짜/시간 관련 숫자는 변환하지 않는다', () => {
      expect(autoMoney('2024년')).toBe('2024년');
      expect(autoMoney('30분')).toBe('30분');
    });
  });

  describe('문맥 내 금액', () => {
    it('문장 내 금액을 올바르게 변환한다', () => {
      expect(autoMoney('이 상품의 가격은 49,900원입니다.')).toBe(
        '이 상품의 가격은 사만구천구백 원 입니다.'
      );
    });

    it('괄호 안 금액을 변환한다', () => {
      expect(autoMoney('(10,000원)')).toBe('(일만 원)');
    });

    it('범위 금액을 변환한다', () => {
      const result = autoMoney('5000원~10000원');
      expect(result).toContain('오천 원');
      expect(result).toContain('일만 원');
    });
  });

  describe('한글 큰 단위', () => {
    it('1억원을 변환한다', () => {
      expect(autoMoney('연간 1억원 이상 구매')).toBe('연간 일 억원 이상 구매');
    });

    it('1000만원을 변환한다', () => {
      expect(autoMoney('연간 1000만원 이상 구매')).toBe('연간 천 만원 이상 구매');
    });

    it('100만원을 변환한다', () => {
      expect(autoMoney('연간 100만원 이상 구매')).toBe('연간 백 만원 이상 구매');
    });

    it('5천원을 변환한다', () => {
      expect(autoMoney('배송비 5천원')).toBe('배송비 오 천원');
    });

    it('1조원을 변환한다', () => {
      expect(autoMoney('매출 1조원 달성')).toBe('매출 일 조원 달성');
    });

    it('1경원을 변환한다', () => {
      expect(autoMoney('예산 1경원')).toBe('예산 일 경원');
    });

    it('천단위 구분자가 있는 큰 단위를 변환한다', () => {
      expect(autoMoney('1,000만원')).toBe('천 만원');
    });

    it('여러 큰 단위 금액을 모두 변환한다', () => {
      const result = autoMoney('최소 100만원, 최대 1억원');
      expect(result).toContain('백 만원');
      expect(result).toContain('일 억원');
    });
  });
});
