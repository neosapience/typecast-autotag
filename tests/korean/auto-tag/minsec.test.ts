import { autoTag, autoMinsec } from '../../../src/korean/auto-tag';

describe('autoTag - minsec (시분초 자동 태깅)', () => {
  describe('영문 형식', () => {
    it('NmNs 형식을 변환한다', () => {
      expect(autoMinsec('3m20s')).toBe('삼분 이십초');
      expect(autoMinsec('5m30s')).toBe('오분 삼십초');
    });

    it('Nm 형식을 변환한다', () => {
      expect(autoMinsec('5m')).toBe('오분');
      expect(autoMinsec('30m')).toBe('삼십분');
    });

    it('Ns 형식을 변환한다', () => {
      expect(autoMinsec('30s')).toBe('삼십초');
      expect(autoMinsec('45s')).toBe('사십오초');
    });

    it('NhNmNs 형식을 변환한다', () => {
      expect(autoMinsec('1h30m20s')).toBe('한시간 삼십분 이십초');
      expect(autoMinsec('2h15m')).toBe('두시간 십오분');
    });

    it('Nh 형식을 변환한다', () => {
      expect(autoMinsec('2h')).toBe('두시간');
    });
  });

  describe('영문 풀 단어 형식', () => {
    it('minutes/seconds를 변환한다', () => {
      expect(autoMinsec('5 minutes')).toBe('오분');
      expect(autoMinsec('30 seconds')).toBe('삼십초');
    });

    it('hour를 변환한다', () => {
      expect(autoMinsec('1 hour')).toBe('한시간');
      expect(autoMinsec('2 hours')).toBe('두시간');
    });

    it('min/sec 약어를 변환한다', () => {
      expect(autoMinsec('5min')).toBe('오분');
      expect(autoMinsec('30sec')).toBe('삼십초');
    });
  });

  describe('한글 형식', () => {
    it('N분N초를 변환한다', () => {
      expect(autoMinsec('3분20초')).toBe('삼분 이십초');
      expect(autoMinsec('5분 30초')).toBe('오분 삼십초');
    });

    it('N분만 변환한다', () => {
      expect(autoMinsec('10분')).toBe('십분');
    });

    it('N초만 변환한다', () => {
      expect(autoMinsec('30초')).toBe('삼십초');
    });

    it('N시간N분을 변환한다', () => {
      expect(autoMinsec('1시간30분')).toBe('한시간 삼십분');
      expect(autoMinsec('2시간 15분 20초')).toBe('두시간 십오분 이십초');
    });
  });

  describe('복수 시간', () => {
    it('여러 시간을 모두 변환한다', () => {
      const result = autoMinsec('대기 5m, 처리 30s');
      expect(result).toContain('오분');
      expect(result).toContain('삼십초');
    });
  });

  describe('False Positive 방지', () => {
    it('단위 없는 숫자는 변환하지 않는다', () => {
      expect(autoMinsec('숫자 5')).toBe('숫자 5');
    });

    it('날짜의 월은 변환하지 않는다', () => {
      // 5m이 5월로 해석되면 안됨 - m은 분(minute)
      expect(autoTag('2024-05-15', { enabledTags: ['minsec'] })).toBe('2024-05-15');
    });
  });

  describe('문맥 내 시간', () => {
    it('문장 내 시간을 변환한다', () => {
      expect(autoMinsec('대기시간은 약 5m입니다')).toBe('대기시간은 약 오분 입니다');
    });

    it('괄호 안 시간을 변환한다', () => {
      expect(autoMinsec('(3분 20초)')).toBe('(삼분 이십초)');
    });
  });
});
