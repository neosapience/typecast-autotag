import { autoTag, autoDate } from '../../../src/korean/auto-tag';

describe('autoTag - date (날짜 자동 태깅)', () => {
  describe('YYYYMMDD 형식', () => {
    it('8자리 날짜를 변환한다', () => {
      expect(autoDate('생년월일: 19940616')).toBe('생년월일: 천구백구십사년 유 월 십육 일생');
    });

    it('2000년대 날짜를 변환한다', () => {
      expect(autoDate('등록일: 20240115')).toBe('등록일: 이천이십사년 일 월 십오 일생');
    });
  });

  describe('YYYY-MM-DD 형식', () => {
    it('하이픈 구분 날짜를 변환한다', () => {
      expect(autoDate('날짜: 2024-01-15')).toBe('날짜: 이천이십사년 일 월 십오 일생');
    });

    it('6월과 10월 불규칙 발음을 처리한다', () => {
      expect(autoDate('2024-06-10')).toBe('이천이십사년 유 월 십 일생');
      expect(autoDate('2024-10-15')).toBe('이천이십사년 시 월 십오 일생');
    });
  });

  describe('YYYY/MM/DD 형식', () => {
    it('슬래시 구분 날짜를 변환한다', () => {
      expect(autoDate('2024/12/25')).toBe('이천이십사년 십이 월 이십오 일생');
    });
  });

  describe('한글 날짜 형식', () => {
    it('YYYY년 M월 D일 형식을 변환한다', () => {
      expect(autoDate('1994년6월16일')).toBe('천구백구십사년 유 월 십육 일생');
      expect(autoDate('2024년 1월 15일')).toBe('이천이십사년 일 월 십오 일생');
    });

    it('YYYY년생 형식을 변환한다', () => {
      expect(autoDate('1994년생')).toBe('천구백구십사년생');
    });

    it('YYYY년만 있는 경우를 변환한다', () => {
      // date 태그에서 년만 있으면 년생으로 처리됨
      expect(autoDate('1994년')).toBe('천구백구십사년생');
    });

    it('M월 D일 형식을 변환한다', () => {
      expect(autoDate('6월16일')).toBe('유 월 십육 일생');
    });
  });

  describe('복수 날짜', () => {
    it('여러 날짜를 모두 변환한다', () => {
      const result = autoDate('시작: 2024-01-01, 종료: 2024-12-31');
      expect(result).toContain('이천이십사년 일 월 일 일생');
      expect(result).toContain('이천이십사년 십이 월 삼십일 일생');
    });
  });

  describe('False Positive 방지', () => {
    it('8자리지만 날짜가 아닌 숫자는 변환하지 않는다', () => {
      // 월이 13 이상이거나 일이 32 이상이면 변환 안함
      expect(autoDate('12345678')).toBe('12345678'); // 월:34, 일:56 - 범위 초과
    });

    it('1900년 이전, 2099년 이후는 변환하지 않는다', () => {
      expect(autoDate('18991231')).toBe('18991231');
      expect(autoDate('21000101')).toBe('21000101');
    });

    it('전화번호는 날짜로 인식하지 않는다', () => {
      expect(autoTag('010-1234-5678', { enabledTags: ['date'] })).toBe('010-1234-5678');
    });
  });

  describe('문맥 내 날짜', () => {
    it('문장 내 날짜를 올바르게 변환한다', () => {
      expect(autoDate('신청 마감일은 2024-03-15입니다.')).toBe(
        '신청 마감일은 이천이십사년 삼 월 십오 일생 입니다.'
      );
    });

    it('괄호 안 날짜를 변환한다', () => {
      expect(autoDate('(2024-01-15) 발표')).toBe('(이천이십사년 일 월 십오 일생) 발표');
    });
  });
});
