import { autoTag, autoLecture } from '../../../src/korean/auto-tag';
import { lecture } from '../../../src/korean/tags/lecture';

describe('lecture - 강의수 변환', () => {
  describe('기본 강의수 형식', () => {
    it('1자리 강의수를 변환한다', () => {
      expect(lecture('1강')).toBe('일 강');
      expect(lecture('5강')).toBe('오 강');
      expect(lecture('9강')).toBe('구 강');
    });

    it('2자리 강의수를 변환한다', () => {
      expect(lecture('26강')).toBe('이십육 강');
      expect(lecture('40강')).toBe('사십 강');
      expect(lecture('15강')).toBe('십오 강');
    });

    it('3자리 강의수를 변환한다', () => {
      expect(lecture('100강')).toBe('백 강');
      expect(lecture('120강')).toBe('백이십 강');
    });
  });

  describe('천단위 구분자', () => {
    it('천단위 구분자가 있는 경우를 처리한다', () => {
      expect(lecture('1,000강')).toBe('천 강');
    });
  });

  describe('공백 옵션', () => {
    it('공백 없이 변환할 수 있다', () => {
      expect(lecture('26강', { includeSpace: false })).toBe('이십육강');
    });
  });

  describe('변환하지 않는 경우', () => {
    it('빈 문자열은 그대로 반환한다', () => {
      expect(lecture('')).toBe('');
      expect(lecture('   ')).toBe('   ');
    });

    it('강의수 형식이 아닌 경우 그대로 반환한다', () => {
      expect(lecture('12345')).toBe('12345');
      expect(lecture('강의')).toBe('강의');
    });
  });
});

describe('autoLecture - 강의수 자동 태깅', () => {
  it('문장 내 강의수를 변환한다', () => {
    const result = autoLecture('진도율: 65% (26강/40강)');
    expect(result).toContain('이십육 강');
    expect(result).toContain('사십 강');
  });

  it('단독 강의수를 변환한다', () => {
    const result = autoLecture('현재 9강 수강 완료');
    expect(result).toContain('구 강');
  });
});

describe('autoTag - 강의수 통합 테스트', () => {
  it('강의수가 포함된 문장을 올바르게 변환한다', () => {
    const result = autoTag('진도율: (26강/40강)', { enabledTags: ['lecture'] });
    expect(result).toContain('이십육 강');
    expect(result).toContain('사십 강');
  });

  it('강의, 강사 등과 구분한다', () => {
    // 강의, 강사 등은 변환하지 않음
    const result = autoTag('10강의 내용', { enabledTags: ['lecture'] });
    expect(result).toBe('10강의 내용');
  });
});
