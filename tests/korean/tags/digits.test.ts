import { digits } from '../../../src/korean/tags/digits';

describe('digits', () => {
  describe('기본 동작', () => {
    it('숫자를 한 자리씩 끊어서 읽는다', () => {
      expect(digits(123456)).toBe('일 이 삼 사 오 육');
    });

    it('문자열 숫자도 처리한다', () => {
      expect(digits('789')).toBe('칠 팔 구');
    });

    it('0도 처리한다', () => {
      expect(digits('0')).toBe('영');
    });

    it('number 타입 0도 처리한다', () => {
      expect(digits(0)).toBe('영');
    });

    it('모든 숫자를 처리한다', () => {
      expect(digits('1234567890')).toBe('일 이 삼 사 오 육 칠 팔 구 영');
    });

    it('앞자리 0이 있는 문자열도 처리한다', () => {
      expect(digits('007')).toBe('영 영 칠');
    });
  });

  describe('커스텀 구분자', () => {
    it('커스텀 구분자를 사용할 수 있다', () => {
      expect(digits('123', ', ')).toBe('일, 이, 삼');
    });

    it('빈 구분자도 사용할 수 있다', () => {
      expect(digits('123', '')).toBe('일이삼');
    });
  });

  describe('숫자가 아닌 문자 처리', () => {
    it('음수 부호는 그대로 유지한다', () => {
      expect(digits('-123')).toBe('- 일 이 삼');
    });

    it('소수점은 쩜으로 변환한다', () => {
      expect(digits('1.5')).toBe('일 쩜 오');
    });

    it('숫자가 아닌 문자가 섞여 있어도 처리한다', () => {
      expect(digits('12a34')).toBe('일 이 a 삼 사');
    });

    it('공백이 포함된 문자열도 처리한다', () => {
      expect(digits('1 2 3')).toBe('일   이   삼');
    });
  });

  describe('엣지 케이스', () => {
    it('빈 문자열은 그대로 반환한다', () => {
      expect(digits('')).toBe('');
    });

    it('한 자리 숫자는 그대로 변환한다', () => {
      expect(digits('5')).toBe('오');
    });
  });

  describe('실제 사용 사례', () => {
    it('전화번호 길이의 숫자를 처리한다', () => {
      expect(digits('01012345678')).toBe('영 일 영 일 이 삼 사 오 육 칠 팔');
    });

    it('주민등록번호 앞자리 길이의 숫자를 처리한다', () => {
      expect(digits('940101')).toBe('구 사 영 일 영 일');
    });
  });

  describe('옵션 객체 지원', () => {
    it('옵션 객체로 구분자를 설정할 수 있다', () => {
      expect(digits('123', { separator: '-' })).toBe('일-이-삼');
    });

    it('옵션 객체로 빈 구분자를 설정할 수 있다', () => {
      expect(digits('123', { separator: '' })).toBe('일이삼');
    });
  });

  describe('포네틱 코드', () => {
    it('포네틱 코드를 사용하면 혼동되기 쉬운 숫자를 다르게 발음한다', () => {
      expect(digits('1234', { usePhoneticCode: true })).toBe('하나 둘 삼 넷');
    });

    it('포네틱 코드로 모든 숫자를 변환한다', () => {
      // 0=공, 1=하나, 2=둘, 3=삼, 4=넷, 5=오, 6=여섯, 7=칠, 8=팔, 9=아홉
      expect(digits('1234567890', { usePhoneticCode: true })).toBe(
        '하나 둘 삼 넷 오 여섯 칠 팔 아홉 공'
      );
    });

    it('기본값은 포네틱 코드를 사용하지 않는다', () => {
      expect(digits('1234')).toBe('일 이 삼 사');
    });

    it('usePhoneticCode: false는 기본 발음을 사용한다', () => {
      expect(digits('1234', { usePhoneticCode: false })).toBe('일 이 삼 사');
    });

    it('포네틱 코드와 구분자를 함께 사용할 수 있다', () => {
      expect(digits('1234', { usePhoneticCode: true, separator: '-' })).toBe('하나-둘-삼-넷');
    });

    it('포네틱 코드에서 소수점도 쩜으로 변환한다', () => {
      expect(digits('1.5', { usePhoneticCode: true })).toBe('하나 쩜 오');
    });

    it('포네틱 코드에서 0은 공으로 변환한다', () => {
      expect(digits('0', { usePhoneticCode: true })).toBe('공');
    });
  });
});
