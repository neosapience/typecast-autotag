import { autoTag, autoPiece } from '../../../src/korean/auto-tag';

describe('autoTag - piece (개수 자동 태깅)', () => {
  describe('N개 형식', () => {
    it('기본 개수를 고유어로 변환한다', () => {
      expect(autoPiece('1개')).toBe('한 개');
      expect(autoPiece('2개')).toBe('두 개');
      expect(autoPiece('3개')).toBe('세 개');
      expect(autoPiece('5개')).toBe('다섯 개');
      expect(autoPiece('10개')).toBe('열 개');
    });

    it('100 이상은 한자어로 변환한다', () => {
      expect(autoPiece('100개')).toBe('백 개');
      expect(autoPiece('1000개')).toBe('천 개');
    });
  });

  describe('다양한 단위', () => {
    it('N마리를 변환한다', () => {
      expect(autoPiece('3마리')).toBe('세 마리');
      expect(autoPiece('10마리')).toBe('열 마리');
    });

    it('N명을 변환한다', () => {
      expect(autoPiece('5명')).toBe('다섯 명');
      expect(autoPiece('100명')).toBe('백 명');
    });

    it('N대를 변환한다', () => {
      expect(autoPiece('2대')).toBe('두 대');
    });

    it('N장을 변환한다', () => {
      expect(autoPiece('10장')).toBe('열 장');
    });

    it('N권을 변환한다', () => {
      expect(autoPiece('3권')).toBe('세 권');
    });

    it('기타 단위를 변환한다', () => {
      expect(autoPiece('2병')).toBe('두 병');
      expect(autoPiece('3잔')).toBe('세 잔');
      expect(autoPiece('5송이')).toBe('다섯 송이');
      expect(autoPiece('1쌍')).toBe('한 쌍');
      expect(autoPiece('2벌')).toBe('두 벌');
      expect(autoPiece('1켤레')).toBe('한 켤레');
      expect(autoPiece('1채')).toBe('한 채');
    });
  });

  describe('복수 개수', () => {
    it('여러 개수를 모두 변환한다', () => {
      const result = autoPiece('사과 3개와 귤 5개');
      expect(result).toContain('세 개');
      expect(result).toContain('다섯 개');
    });
  });

  describe('False Positive 방지', () => {
    it('단위 없는 숫자는 변환하지 않는다', () => {
      expect(autoPiece('숫자 5')).toBe('숫자 5');
    });

    it('금액은 변환하지 않는다', () => {
      expect(autoTag('5000원', { enabledTags: ['piece'] })).toBe('5000원');
    });

    it('점수는 변환하지 않는다', () => {
      expect(autoTag('95점', { enabledTags: ['piece'] })).toBe('95점');
    });
  });

  describe('문맥 내 개수', () => {
    it('문장 내 개수를 변환한다', () => {
      expect(autoPiece('사과 5개를 샀습니다')).toBe('사과 다섯 개 를 샀습니다');
    });

    it('괄호 안 개수를 변환한다', () => {
      expect(autoPiece('(10개)')).toBe('(열 개)');
    });
  });
});
