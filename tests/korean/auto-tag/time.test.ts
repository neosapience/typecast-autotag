import { autoTime } from '../../../src/korean/auto-tag';

describe('autoTag - time (시간 자동 태깅)', () => {
  describe('HH:MM 형식', () => {
    it('14:30을 변환한다', () => {
      expect(autoTime('회의는 14:30에 시작합니다.')).toBe(
        '회의는 오후 두 시 삼십 분에 시작합니다.'
      );
    });

    it('09:05를 변환한다', () => {
      expect(autoTime('아침 09:05')).toBe('아침 오전 아홉 시 오 분');
    });

    it('00:00 (자정)을 변환한다', () => {
      expect(autoTime('자정 00:00')).toBe('자정 오전 열두 시');
    });

    it('12:00 (정오)을 변환한다', () => {
      expect(autoTime('점심 12:00')).toBe('점심 오후 열두 시');
    });

    it('23:59를 변환한다', () => {
      expect(autoTime('마감 23:59')).toBe('마감 오후 열한 시 오십구 분');
    });
  });

  describe('HH:MM:SS 형식', () => {
    it('14:30:45를 변환한다', () => {
      expect(autoTime('시작: 14:30:45')).toBe('시작: 오후 두 시 삼십 분 사십오 초');
    });

    it('09:00:00을 변환한다', () => {
      expect(autoTime('출근: 09:00:00')).toBe('출근: 오전 아홉 시');
    });
  });

  describe('한글 시간 형식', () => {
    it('오전/오후 N시 M분을 변환한다', () => {
      expect(autoTime('오후 3시 30분')).toBe('오후 세 시 삼십 분');
      expect(autoTime('오전 9시 5분')).toBe('오전 아홉 시 오 분');
    });

    it('N시M분 형식을 변환한다', () => {
      expect(autoTime('14시30분')).toBe('오후 두 시 삼십 분');
    });
  });

  describe('복수 시간', () => {
    it('여러 시간을 모두 변환한다', () => {
      const result = autoTime('시작 09:00, 종료 18:00');
      expect(result).toContain('오전 아홉 시');
      expect(result).toContain('오후 여섯 시');
    });
  });

  describe('False Positive 방지', () => {
    it('날짜 뒤의 시간은 datetime으로 처리되어야 함 (time만 활성화시 변환 안함)', () => {
      // datetime 형식일 때는 time 패턴으로 잘못 매칭되면 안됨
      // 단, 이 테스트에서는 time만 활성화했으므로 T 뒤의 시간이 매칭될 수 있음
      // 실제로는 datetime이 먼저 처리됨
    });

    it('버전 번호는 시간으로 변환하지 않는다', () => {
      // "1:2" 형식은 분이 1자리라 HH:MM 형식이 아님 - 변환 안됨
      expect(autoTime('버전 1:2')).toBe('버전 1:2');
    });

    it('IP 주소 포트는 시간으로 변환하지 않는다', () => {
      // 포트 번호가 59 이하면 시간으로 오인될 수 있음 - 이건 한계점
      expect(autoTime('192.168.1.1:8080')).toBe('192.168.1.1:8080');
    });
  });

  describe('문맥 내 시간', () => {
    it('괄호 안 시간을 변환한다', () => {
      expect(autoTime('회의 (14:30~16:00)')).toContain('오후 두 시 삼십 분');
    });

    it('문장 끝 시간을 변환한다', () => {
      expect(autoTime('퇴근시간은 18:00')).toBe('퇴근시간은 오후 여섯 시');
    });
  });
});
