import { autoTag, autoPoint } from '../../../src/korean/auto-tag';

describe('autoTag - point (점수 자동 태깅)', () => {
  describe('N점 형식', () => {
    it('기본 점수를 변환한다', () => {
      expect(autoPoint('95점')).toBe('구십오 점');
      expect(autoPoint('100점')).toBe('백 점');
      expect(autoPoint('0점')).toBe('영 점');
    });

    it('공백이 있는 점수를 변환한다', () => {
      expect(autoPoint('85 점')).toBe('팔십오 점');
    });
  });

  describe('소수점 점수', () => {
    it('소수점 점수를 변환한다', () => {
      expect(autoPoint('4.5점')).toBe('사 쩜 오 점');
      expect(autoPoint('9.8점')).toBe('구 쩜 팔 점');
      expect(autoPoint('3.14점')).toBe('삼 쩜 일사 점');
    });
  });

  describe('천단위 구분자', () => {
    it('큰 점수를 변환한다', () => {
      expect(autoPoint('1,000점')).toBe('천 점');
      expect(autoPoint('10,000점')).toBe('일만 점'); // point 함수의 실제 출력
    });
  });

  describe('복수 점수', () => {
    it('여러 점수를 모두 변환한다', () => {
      const result = autoPoint('최저 0점, 최고 100점');
      expect(result).toContain('영 점');
      expect(result).toContain('백 점');
    });
  });

  describe('False Positive 방지', () => {
    it('금액은 점수로 변환하지 않는다', () => {
      expect(autoTag('5000원', { enabledTags: ['point'] })).toBe('5000원');
    });

    it('단위 없는 숫자는 변환하지 않는다', () => {
      expect(autoPoint('95')).toBe('95');
    });
  });

  describe('문맥 내 점수', () => {
    it('문장 내 점수를 변환한다', () => {
      expect(autoPoint('시험에서 95점을 받았습니다')).toBe('시험에서 구십오 점을 받았습니다');
    });

    it('괄호 안 점수를 변환한다', () => {
      expect(autoPoint('(85점)')).toBe('(팔십오 점)');
    });
  });
});
