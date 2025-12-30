import { autoDatetime } from '../../../src/korean/auto-tag';

describe('autoTag - datetime (날짜시간 자동 태깅)', () => {
  describe('ISO 8601 형식', () => {
    it('YYYY-MM-DDTHH:MM 형식을 변환한다', () => {
      expect(autoDatetime('회의: 2024-01-15T14:30')).toBe(
        '회의: 이천이십사년 일 월 십오 일 오후 두 시 삼십 분'
      );
    });

    it('YYYY-MM-DDTHH:MM:SS 형식을 변환한다', () => {
      expect(autoDatetime('시작: 2024-06-10T09:05:30')).toBe(
        '시작: 이천이십사년 유 월 십 일 오전 아홉 시 오 분 삼십 초'
      );
    });

    it('타임존이 포함된 형식을 변환한다', () => {
      expect(autoDatetime('2024-01-15T14:30:00Z')).toBe(
        '이천이십사년 일 월 십오 일 오후 두 시 삼십 분'
      );
      expect(autoDatetime('2024-01-15T14:30:00+09:00')).toBe(
        '이천이십사년 일 월 십오 일 오후 두 시 삼십 분'
      );
    });

    it('밀리초가 포함된 형식을 변환한다', () => {
      expect(autoDatetime('2024-01-15T14:30:00.123')).toBe(
        '이천이십사년 일 월 십오 일 오후 두 시 삼십 분'
      );
    });
  });

  describe('공백 구분 형식', () => {
    it('YYYY-MM-DD HH:MM 형식을 변환한다', () => {
      expect(autoDatetime('예약: 2024-01-15 14:30')).toBe(
        '예약: 이천이십사년 일 월 십오 일 오후 두 시 삼십 분'
      );
    });

    it('YYYY/MM/DD HH:MM:SS 형식을 변환한다', () => {
      expect(autoDatetime('2024/06/10 09:05:30')).toBe(
        '이천이십사년 유 월 십 일 오전 아홉 시 오 분 삼십 초'
      );
    });
  });

  describe('복수 datetime', () => {
    it('여러 datetime을 모두 변환한다', () => {
      const result = autoDatetime('시작: 2024-01-15T09:00, 종료: 2024-01-15T18:00');
      expect(result).toContain('이천이십사년 일 월 십오 일 오전 아홉 시');
      expect(result).toContain('이천이십사년 일 월 십오 일 오후 여섯 시');
    });
  });

  describe('False Positive 방지', () => {
    it('날짜만 있으면 datetime으로 변환하지 않는다', () => {
      // datetime 태그만 활성화했을 때 날짜만 있으면 변환 안함
      expect(autoDatetime('2024-01-15')).toBe('2024-01-15');
    });

    it('시간만 있으면 datetime으로 변환하지 않는다', () => {
      expect(autoDatetime('14:30')).toBe('14:30');
    });
  });

  describe('문맥 내 datetime', () => {
    it('문장 내 datetime을 올바르게 변환한다', () => {
      expect(autoDatetime('다음 회의는 2024-01-15T14:30에 예정되어 있습니다.')).toBe(
        '다음 회의는 이천이십사년 일 월 십오 일 오후 두 시 삼십 분 에 예정되어 있습니다.'
      );
    });
  });
});
