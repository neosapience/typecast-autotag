import { year } from '../../../src/korean/tags/year';

describe('year', () => {
  describe('기본 동작', () => {
    it('2024를 이천이십사년으로 변환한다', () => {
      expect(year(2024)).toBe('이천이십사년');
    });

    it('1994를 천구백구십사년으로 변환한다', () => {
      expect(year(1994)).toBe('천구백구십사년');
    });

    it('2000을 이천년으로 변환한다', () => {
      expect(year(2000)).toBe('이천년');
    });

    it('1900을 천구백년으로 변환한다', () => {
      expect(year(1900)).toBe('천구백년');
    });

    it('2010을 이천십년으로 변환한다', () => {
      expect(year(2010)).toBe('이천십년');
    });
  });

  describe('문자열 입력', () => {
    it('"2024년"을 이천이십사년으로 변환한다', () => {
      expect(year('2024년')).toBe('이천이십사년');
    });

    it('"2024"를 이천이십사년으로 변환한다', () => {
      expect(year('2024')).toBe('이천이십사년');
    });

    it('"1994년생"을 천구백구십사년생으로 변환한다', () => {
      expect(year('1994년생')).toBe('천구백구십사년생');
    });

    it('공백이 있는 문자열도 처리한다', () => {
      expect(year('  2024년  ')).toBe('이천이십사년');
    });
  });

  describe('옵션 - 접미사', () => {
    it('접미사를 제거할 수 있다', () => {
      expect(year(2024, { includeSuffix: false })).toBe('이천이십사');
    });
  });

  describe('옵션 - 공백', () => {
    it('년 앞에 공백을 추가할 수 있다', () => {
      expect(year(2024, { includeSpace: true })).toBe('이천이십사 년');
    });

    it('접미사와 공백 옵션을 함께 사용할 수 있다', () => {
      expect(year(2024, { includeSuffix: true, includeSpace: true })).toBe('이천이십사 년');
    });

    it('접미사 제거 시 공백 옵션은 무시된다', () => {
      expect(year(2024, { includeSuffix: false, includeSpace: true })).toBe('이천이십사');
    });
  });

  describe('엣지 케이스', () => {
    it('0은 영년으로 변환한다', () => {
      expect(year(0)).toBe('영년');
    });

    it('음수는 원본 반환한다', () => {
      expect(year(-2024)).toBe('-2024');
    });

    it('빈 문자열은 그대로 반환한다', () => {
      expect(year('')).toBe('');
    });

    it('잘못된 형식은 원본 반환한다', () => {
      expect(year('abc')).toBe('abc');
    });
  });

  describe('다양한 년도', () => {
    it('100을 백년으로 변환한다', () => {
      expect(year(100)).toBe('백년');
    });

    it('1을 일년으로 변환한다', () => {
      expect(year(1)).toBe('일년');
    });

    it('10000을 일만년으로 변환한다', () => {
      expect(year(10000)).toBe('일만년');
    });
  });
});
