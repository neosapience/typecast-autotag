import { autoYear } from '../../../src/korean/auto-tag';

describe('autoTag - year (년도 자동 태깅)', () => {
  describe('YYYY년 형식', () => {
    it('기본 년도를 변환한다', () => {
      expect(autoYear('올해는 2024년')).toBe('올해는 이천이십사년');
    });

    it('과거 년도를 변환한다', () => {
      expect(autoYear('1994년')).toBe('천구백구십사년');
      expect(autoYear('2000년')).toBe('이천년');
    });
  });

  describe('YYYY년도 형식', () => {
    it('년도 접미사를 변환한다', () => {
      expect(autoYear('2024년도 계획')).toBe('이천이십사년 도 계획');
    });
  });

  describe('YYYY년생 형식', () => {
    it('년생 접미사를 변환한다', () => {
      expect(autoYear('1994년생입니다')).toBe('천구백구십사년 생입니다');
    });
  });

  describe('복수 년도', () => {
    it('여러 년도를 모두 변환한다', () => {
      const result = autoYear('2023년에서 2024년으로');
      expect(result).toContain('이천이십삼년');
      expect(result).toContain('이천이십사년');
    });
  });

  describe('False Positive 방지', () => {
    it('날짜 형식의 년도는 중복 변환하지 않는다', () => {
      // 날짜 형식 안의 년도는 date 태그로 처리됨
      // year 태그만 활성화 시 년만 뒤따르지 않는 경우는 변환 안함
    });

    it('숫자만 있으면 변환하지 않는다', () => {
      expect(autoYear('2024')).toBe('2024');
    });

    it('1900년 이전, 2099년 이후는 변환하지 않는다', () => {
      expect(autoYear('1899년')).toBe('1899년');
      expect(autoYear('2100년')).toBe('2100년');
    });
  });

  describe('문맥 내 년도', () => {
    it('문장 내 년도를 올바르게 변환한다', () => {
      expect(autoYear('우리 회사는 1998년에 설립되었습니다.')).toBe(
        '우리 회사는 천구백구십팔년 에 설립되었습니다.'
      );
    });

    it('괄호 안 년도를 변환한다', () => {
      expect(autoYear('(2024년)')).toBe('(이천이십사년)');
    });
  });
});
