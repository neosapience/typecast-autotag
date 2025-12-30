import { autoTag, autoDay } from '../../../src/korean/auto-tag';

describe('autoTag - day (일 자동 태깅)', () => {
  describe('D-Day 형식', () => {
    it('D-Day를 변환한다', () => {
      expect(autoDay('D-Day')).toBe('디데이');
      expect(autoDay('D-day')).toBe('디데이');
      expect(autoDay('d-day')).toBe('디데이');
    });

    it('D-N 형식을 변환한다', () => {
      expect(autoDay('D-100')).toBe('디데이 백일');
      expect(autoDay('D-30')).toBe('디데이 삼십일');
      expect(autoDay('D-7')).toBe('디데이 칠일');
    });

    it('D+N 형식을 변환한다', () => {
      expect(autoDay('D+50')).toBe('디데이 플러스 오십일');
      expect(autoDay('D+1')).toBe('디데이 플러스 일일');
    });

    it('일 접미사가 있는 형식을 변환한다', () => {
      expect(autoDay('D-100일')).toBe('디데이 백일');
    });
  });

  describe('N일째/N일차 형식', () => {
    it('N일째를 변환한다', () => {
      expect(autoDay('100일째')).toBe('백일째');
      expect(autoDay('365일째')).toBe('삼백육십오일째');
    });

    it('N일차를 변환한다', () => {
      expect(autoDay('30일차')).toBe('삼십일차');
      expect(autoDay('1일차')).toBe('일일차');
    });
  });

  describe('False Positive 방지', () => {
    it('날짜의 일부인 일은 변환하지 않는다', () => {
      // "1월 15일"의 15일은 date가 처리해야 함
      expect(autoTag('1월 15일', { enabledTags: ['day'] })).toBe('1월 15일');
    });

    it('범위를 벗어난 일은 단독 처리하지 않는다', () => {
      // 32일 이상은 일반 일로 변환 안함 (N일째/N일차는 제외)
      expect(autoDay('32일')).toBe('32일');
    });
  });

  describe('문맥 내 일', () => {
    it('문장 내 D-Day를 변환한다', () => {
      expect(autoDay('시험 D-7까지')).toBe('시험 디데이 칠일 까지');
    });

    it('문장 내 N일째를 변환한다', () => {
      expect(autoDay('오늘로 100일째입니다')).toBe('오늘로 백일째 입니다');
    });
  });
});
