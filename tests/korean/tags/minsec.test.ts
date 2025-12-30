import { minsec } from '../../../src/korean/tags/minsec';

describe('minsec', () => {
  describe('기본 동작', () => {
    it('분초를 대기시간 안내 문구로 변환한다', () => {
      expect(minsec('3m20s')).toBe('상담사연결까지 약 삼 분 이십 초 소요예정입니다');
    });

    it('분만 있는 경우도 처리한다', () => {
      expect(minsec('5m')).toBe('상담사연결까지 약 오 분 소요예정입니다');
    });

    it('초만 있는 경우도 처리한다', () => {
      expect(minsec('30s')).toBe('상담사연결까지 약 삼십 초 소요예정입니다');
    });
  });

  describe('다양한 시간', () => {
    it('1분 1초를 처리한다', () => {
      expect(minsec('1m1s')).toBe('상담사연결까지 약 일 분 일 초 소요예정입니다');
    });

    it('10분 10초를 처리한다', () => {
      expect(minsec('10m10s')).toBe('상담사연결까지 약 십 분 십 초 소요예정입니다');
    });

    it('큰 숫자도 처리한다', () => {
      expect(minsec('60m59s')).toBe('상담사연결까지 약 육십 분 오십구 초 소요예정입니다');
    });
  });

  describe('엣지 케이스', () => {
    it('빈 문자열은 그대로 반환한다', () => {
      expect(minsec('')).toBe('');
    });

    it('분초 형식이 아닌 입력은 그대로 반환한다', () => {
      expect(minsec('abc')).toBe('abc');
    });

    it('0분 0초는 그대로 반환한다', () => {
      expect(minsec('0m0s')).toBe('0m0s');
    });
  });
});
