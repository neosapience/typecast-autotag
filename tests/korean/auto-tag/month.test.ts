import { autoTag, autoMonth } from '../../../src/korean/auto-tag';

describe('autoTag - month (월 자동 태깅)', () => {
  describe('N월 형식', () => {
    it('기본 월을 변환한다', () => {
      expect(autoMonth('이번달은 12월')).toBe('이번달은 십이월');
      expect(autoMonth('3월에 만나요')).toBe('삼월 에 만나요');
    });

    it('불규칙 발음 월을 변환한다', () => {
      expect(autoMonth('6월')).toBe('유월');
      expect(autoMonth('10월')).toBe('시월');
    });

    it('1월부터 12월까지 변환한다', () => {
      expect(autoMonth('1월')).toBe('일월');
      expect(autoMonth('2월')).toBe('이월');
      expect(autoMonth('3월')).toBe('삼월');
      expect(autoMonth('4월')).toBe('사월');
      expect(autoMonth('5월')).toBe('오월');
      expect(autoMonth('6월')).toBe('유월');
      expect(autoMonth('7월')).toBe('칠월');
      expect(autoMonth('8월')).toBe('팔월');
      expect(autoMonth('9월')).toBe('구월');
      expect(autoMonth('10월')).toBe('시월');
      expect(autoMonth('11월')).toBe('십일월');
      expect(autoMonth('12월')).toBe('십이월');
    });
  });

  describe('False Positive 방지', () => {
    it('날짜의 일부인 월은 변환하지 않는다 (date가 처리)', () => {
      // "2024년 1월 15일"에서 1월은 date 태그가 처리해야 함
      // month만 활성화 시, 년 뒤에 오는 월은 매칭하지 않음
      expect(autoTag('2024년 1월 15일', { enabledTags: ['month'] })).toBe('2024년 1월 15일');
    });

    it('월일 조합은 변환하지 않는다', () => {
      // 월 뒤에 일이 따라오면 date로 처리해야 함
      expect(autoTag('1월 15일', { enabledTags: ['month'] })).toBe('1월 15일');
    });

    it('범위를 벗어난 월은 변환하지 않는다', () => {
      expect(autoMonth('13월')).toBe('13월');
      expect(autoMonth('0월')).toBe('0월');
    });
  });

  describe('문맥 내 월', () => {
    it('문장 끝 월을 변환한다', () => {
      expect(autoMonth('다음 분기는 4월부터')).toBe('다음 분기는 사월 부터');
    });

    it('괄호 안 월을 변환한다', () => {
      expect(autoMonth('(6월)')).toBe('(유월)');
    });
  });
});
