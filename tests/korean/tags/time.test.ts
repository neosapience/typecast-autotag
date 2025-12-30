import { time } from '../../../src/korean/tags/time';

describe('time', () => {
  describe('12시간제 (기본)', () => {
    it('14:30을 오후 두 시 삼십 분으로 변환한다', () => {
      expect(time('14:30')).toBe('오후 두 시 삼십 분');
    });

    it('09:05를 오전 아홉 시 오 분으로 변환한다', () => {
      expect(time('09:05')).toBe('오전 아홉 시 오 분');
    });

    it('12:00을 오후 열두 시로 변환한다', () => {
      expect(time('12:00')).toBe('오후 열두 시');
    });

    it('00:00을 오전 열두 시로 변환한다', () => {
      expect(time('00:00')).toBe('오전 열두 시');
    });

    it('23:59를 오후 열한 시 오십구 분으로 변환한다', () => {
      expect(time('23:59')).toBe('오후 열한 시 오십구 분');
    });

    it('01:00을 오전 한 시로 변환한다', () => {
      expect(time('01:00')).toBe('오전 한 시');
    });

    it('13:00을 오후 한 시로 변환한다', () => {
      expect(time('13:00')).toBe('오후 한 시');
    });
  });

  describe('24시간제', () => {
    it('00:00을 영 시로 변환한다', () => {
      expect(time('00:00', { use24Hour: true })).toBe('영 시');
    });

    it('00:30을 영 시 삼십 분으로 변환한다', () => {
      expect(time('00:30', { use24Hour: true })).toBe('영 시 삼십 분');
    });

    it('09:05를 아홉 시 오 분으로 변환한다', () => {
      expect(time('09:05', { use24Hour: true })).toBe('아홉 시 오 분');
    });

    it('13:00을 열세 시로 변환한다', () => {
      expect(time('13:00', { use24Hour: true })).toBe('열세 시');
    });

    it('14:30을 열네 시 삼십 분으로 변환한다', () => {
      expect(time('14:30', { use24Hour: true })).toBe('열네 시 삼십 분');
    });

    it('15:00을 열다섯 시로 변환한다', () => {
      expect(time('15:00', { use24Hour: true })).toBe('열다섯 시');
    });

    it('16:00을 열여섯 시로 변환한다', () => {
      expect(time('16:00', { use24Hour: true })).toBe('열여섯 시');
    });

    it('17:00을 열일곱 시로 변환한다', () => {
      expect(time('17:00', { use24Hour: true })).toBe('열일곱 시');
    });

    it('18:00을 열여덟 시로 변환한다', () => {
      expect(time('18:00', { use24Hour: true })).toBe('열여덟 시');
    });

    it('19:00을 열아홉 시로 변환한다', () => {
      expect(time('19:00', { use24Hour: true })).toBe('열아홉 시');
    });

    it('20:00을 스물 시로 변환한다', () => {
      expect(time('20:00', { use24Hour: true })).toBe('스물 시');
    });

    it('21:00을 스물한 시로 변환한다', () => {
      expect(time('21:00', { use24Hour: true })).toBe('스물한 시');
    });

    it('22:00을 스물두 시로 변환한다', () => {
      expect(time('22:00', { use24Hour: true })).toBe('스물두 시');
    });

    it('23:00을 스물세 시로 변환한다', () => {
      expect(time('23:00', { use24Hour: true })).toBe('스물세 시');
    });
  });

  describe('초 단위 포함', () => {
    it('14:30:45를 오후 두 시 삼십 분 사십오 초로 변환한다', () => {
      expect(time('14:30:45')).toBe('오후 두 시 삼십 분 사십오 초');
    });

    it('09:05:10을 오전 아홉 시 오 분 십 초로 변환한다', () => {
      expect(time('09:05:10')).toBe('오전 아홉 시 오 분 십 초');
    });

    it('00:00:00을 오전 열두 시로 변환한다 (0분 0초는 생략)', () => {
      expect(time('00:00:00')).toBe('오전 열두 시');
    });

    it('14:00:30을 오후 두 시 삼십 초로 변환한다 (분이 0이면 생략)', () => {
      expect(time('14:00:30')).toBe('오후 두 시 삼십 초');
    });
  });

  describe('한글 형식 입력', () => {
    it('"3시"를 오전 세 시로 변환한다', () => {
      expect(time('3시')).toBe('오전 세 시');
    });

    it('"14시30분"을 열네 시 삼십 분으로 변환한다', () => {
      expect(time('14시30분', { use24Hour: true })).toBe('열네 시 삼십 분');
    });

    it('"오후 3시 30분"을 오후 세 시 삼십 분으로 변환한다', () => {
      expect(time('오후 3시 30분')).toBe('오후 세 시 삼십 분');
    });

    it('"오전 9시"를 오전 아홉 시로 변환한다', () => {
      expect(time('오전 9시')).toBe('오전 아홉 시');
    });

    it('"오후 12시"를 오후 열두 시로 변환한다', () => {
      expect(time('오후 12시')).toBe('오후 열두 시');
    });

    it('"오전 12시"를 오전 열두 시로 변환한다 (자정)', () => {
      expect(time('오전 12시')).toBe('오전 열두 시');
    });

    it('"14시 30분 45초"를 변환한다', () => {
      expect(time('14시 30분 45초', { use24Hour: true })).toBe('열네 시 삼십 분 사십오 초');
    });

    it('"오후 2시 30분 15초"를 변환한다', () => {
      expect(time('오후 2시 30분 15초')).toBe('오후 두 시 삼십 분 십오 초');
    });

    it('"0시"를 24시간제로 변환한다', () => {
      expect(time('0시', { use24Hour: true })).toBe('영 시');
    });
  });

  describe('숫자 형식 입력', () => {
    it('4자리 숫자 "1430"을 변환한다', () => {
      expect(time('1430')).toBe('오후 두 시 삼십 분');
    });

    it('6자리 숫자 "143045"를 변환한다', () => {
      expect(time('143045')).toBe('오후 두 시 삼십 분 사십오 초');
    });

    it('4자리 숫자 "0905"를 변환한다', () => {
      expect(time('0905')).toBe('오전 아홉 시 오 분');
    });
  });

  describe('includeSeconds 옵션', () => {
    it('옵션이 true면 초가 없어도 0초를 표시한다', () => {
      expect(time('14:30', { includeSeconds: true })).toBe('오후 두 시 삼십 분 영 초');
    });

    it('옵션이 true면 분이 0이어도 표시한다', () => {
      expect(time('14:00', { includeSeconds: true })).toBe('오후 두 시 영 분 영 초');
    });

    it('24시간제와 함께 사용할 수 있다', () => {
      expect(time('14:30', { use24Hour: true, includeSeconds: true })).toBe(
        '열네 시 삼십 분 영 초'
      );
    });
  });

  describe('단일 자릿수 시간', () => {
    it('9:30을 오전 아홉 시 삼십 분으로 변환한다', () => {
      expect(time('9:30')).toBe('오전 아홉 시 삼십 분');
    });

    it('1:05를 오전 한 시 오 분으로 변환한다', () => {
      expect(time('1:05')).toBe('오전 한 시 오 분');
    });
  });

  describe('엣지 케이스', () => {
    it('빈 문자열은 그대로 반환한다', () => {
      expect(time('')).toBe('');
    });

    it('공백만 있는 문자열은 그대로 반환한다', () => {
      expect(time('   ')).toBe('   ');
    });

    it('잘못된 형식은 원본 반환한다', () => {
      expect(time('abc')).toBe('abc');
    });

    it('잘못된 시간 (25시)은 원본 반환한다', () => {
      expect(time('25:00')).toBe('25:00');
    });

    it('잘못된 시간 (24시)은 원본 반환한다', () => {
      expect(time('24:00')).toBe('24:00');
    });

    it('잘못된 분 (60분)은 원본 반환한다', () => {
      expect(time('12:60')).toBe('12:60');
    });

    it('잘못된 초 (60초)는 원본 반환한다', () => {
      expect(time('12:30:60')).toBe('12:30:60');
    });

    it('음수 시간은 원본 반환한다', () => {
      expect(time('-1:00')).toBe('-1:00');
    });
  });

  describe('고유어 시 변환 검증', () => {
    it('1시는 한 시로 변환한다', () => {
      expect(time('01:00', { use24Hour: true })).toBe('한 시');
    });

    it('2시는 두 시로 변환한다', () => {
      expect(time('02:00', { use24Hour: true })).toBe('두 시');
    });

    it('3시는 세 시로 변환한다', () => {
      expect(time('03:00', { use24Hour: true })).toBe('세 시');
    });

    it('4시는 네 시로 변환한다', () => {
      expect(time('04:00', { use24Hour: true })).toBe('네 시');
    });

    it('5시는 다섯 시로 변환한다', () => {
      expect(time('05:00', { use24Hour: true })).toBe('다섯 시');
    });

    it('6시는 여섯 시로 변환한다', () => {
      expect(time('06:00', { use24Hour: true })).toBe('여섯 시');
    });

    it('7시는 일곱 시로 변환한다', () => {
      expect(time('07:00', { use24Hour: true })).toBe('일곱 시');
    });

    it('8시는 여덟 시로 변환한다', () => {
      expect(time('08:00', { use24Hour: true })).toBe('여덟 시');
    });

    it('9시는 아홉 시로 변환한다', () => {
      expect(time('09:00', { use24Hour: true })).toBe('아홉 시');
    });

    it('10시는 열 시로 변환한다', () => {
      expect(time('10:00', { use24Hour: true })).toBe('열 시');
    });

    it('11시는 열한 시로 변환한다', () => {
      expect(time('11:00', { use24Hour: true })).toBe('열한 시');
    });

    it('12시는 열두 시로 변환한다', () => {
      expect(time('12:00', { use24Hour: true })).toBe('열두 시');
    });
  });
});
