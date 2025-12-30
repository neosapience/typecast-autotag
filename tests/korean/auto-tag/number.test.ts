import { autoTag, autoNumber } from '../../../src/korean/auto-tag';

describe('autoTag - number (번호 자동 태깅)', () => {
  describe('기본 번호 변환', () => {
    it('1번을 일 번으로 변환한다', () => {
      expect(autoNumber('1번을 눌러주세요.')).toBe('일 번 을 눌러주세요.');
    });

    it('2번을 이 번으로 변환한다', () => {
      expect(autoNumber('2번을 눌러주세요.')).toBe('이 번 을 눌러주세요.');
    });

    it('10번을 십 번으로 변환한다', () => {
      expect(autoNumber('10번')).toBe('십 번');
    });
  });

  describe('실제 문맥', () => {
    it('메뉴 선택 안내를 변환한다', () => {
      expect(autoNumber('전체 전환을 원하시면 1번,')).toBe('전체 전환을 원하시면 일 번,');
    });

    it('변경 안내를 변환한다', () => {
      expect(autoNumber('변경을 원하시면 2번을 눌러주세요.')).toBe(
        '변경을 원하시면 이 번 을 눌러주세요.'
      );
    });

    it('복수 번호 안내를 변환한다', () => {
      const result = autoNumber('조회는 1번, 변경은 2번을 눌러주세요.');
      expect(result).toContain('일 번');
      expect(result).toContain('이 번');
    });
  });

  describe('다양한 번호', () => {
    it('1-9번을 모두 변환한다', () => {
      expect(autoNumber('1번')).toBe('일 번');
      expect(autoNumber('2번')).toBe('이 번');
      expect(autoNumber('3번')).toBe('삼 번');
      expect(autoNumber('4번')).toBe('사 번');
      expect(autoNumber('5번')).toBe('오 번');
      expect(autoNumber('6번')).toBe('육 번');
      expect(autoNumber('7번')).toBe('칠 번');
      expect(autoNumber('8번')).toBe('팔 번');
      expect(autoNumber('9번')).toBe('구 번');
    });

    it('큰 번호를 변환한다', () => {
      expect(autoNumber('100번')).toBe('백 번');
      expect(autoNumber('1000번')).toBe('천 번');
    });
  });

  describe('False Positive 방지 - 번째', () => {
    it('번째는 number 태그로 변환하지 않는다', () => {
      // 번째는 order 태그에서 처리
      expect(autoTag('1번째', { enabledTags: ['number'] })).toBe('1번째');
      expect(autoTag('2번째', { enabledTags: ['number'] })).toBe('2번째');
    });
  });

  describe('False Positive 방지 - 번호', () => {
    it('번호는 number 태그로 변환하지 않는다', () => {
      expect(autoTag('전화번호', { enabledTags: ['number'] })).toBe('전화번호');
    });
  });

  describe('False Positive 방지 - 일반 숫자', () => {
    it('번이 없는 숫자는 변환하지 않는다', () => {
      expect(autoNumber('12345')).toBe('12345');
    });
  });

  describe('괄호 내 번호', () => {
    it('괄호 안 번호를 변환한다', () => {
      expect(autoNumber('(1번)')).toBe('(일 번)');
      expect(autoNumber('(2번을 눌러주세요)')).toBe('(이 번 을 눌러주세요)');
    });
  });
});
