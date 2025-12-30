import { order } from '../../../src/korean/tags/order';

describe('order', () => {
  describe('기본 동작 - 서수 표현', () => {
    it('1을 첫 번째로 변환한다', () => {
      expect(order(1)).toBe('첫 번째');
    });

    it('2를 두 번째로 변환한다', () => {
      expect(order(2)).toBe('두 번째');
    });

    it('3을 세 번째로 변환한다', () => {
      expect(order(3)).toBe('세 번째');
    });

    it('4를 네 번째로 변환한다', () => {
      expect(order(4)).toBe('네 번째');
    });

    it('5를 다섯 번째로 변환한다', () => {
      expect(order(5)).toBe('다섯 번째');
    });

    it('6을 여섯 번째로 변환한다', () => {
      expect(order(6)).toBe('여섯 번째');
    });

    it('7을 일곱 번째로 변환한다', () => {
      expect(order(7)).toBe('일곱 번째');
    });

    it('8을 여덟 번째로 변환한다', () => {
      expect(order(8)).toBe('여덟 번째');
    });

    it('9를 아홉 번째로 변환한다', () => {
      expect(order(9)).toBe('아홉 번째');
    });

    it('10을 열 번째로 변환한다', () => {
      expect(order(10)).toBe('열 번째');
    });
  });

  describe('10 이상 서수 표현', () => {
    it('11을 열 한 번째로 변환한다', () => {
      expect(order(11)).toBe('열 한 번째');
    });

    it('15를 열 다섯 번째로 변환한다', () => {
      expect(order(15)).toBe('열 다섯 번째');
    });

    it('20을 스물 번째로 변환한다', () => {
      expect(order(20)).toBe('스물 번째');
    });

    it('21을 스물 한 번째로 변환한다', () => {
      expect(order(21)).toBe('스물 한 번째');
    });

    it('30을 서른 번째로 변환한다', () => {
      expect(order(30)).toBe('서른 번째');
    });

    it('31을 서른 한 번째로 변환한다', () => {
      expect(order(31)).toBe('서른 한 번째');
    });

    it('40을 마흔 번째로 변환한다', () => {
      expect(order(40)).toBe('마흔 번째');
    });

    it('50을 쉰 번째로 변환한다', () => {
      expect(order(50)).toBe('쉰 번째');
    });

    it('60을 예순 번째로 변환한다', () => {
      expect(order(60)).toBe('예순 번째');
    });

    it('70을 일흔 번째로 변환한다', () => {
      expect(order(70)).toBe('일흔 번째');
    });

    it('80을 여든 번째로 변환한다', () => {
      expect(order(80)).toBe('여든 번째');
    });

    it('90을 아흔 번째로 변환한다', () => {
      expect(order(90)).toBe('아흔 번째');
    });

    it('99를 아흔 아홉 번째로 변환한다', () => {
      expect(order(99)).toBe('아흔 아홉 번째');
    });
  });

  describe('100 이상 한자어 서수', () => {
    it('100을 백 번째로 변환한다', () => {
      expect(order(100)).toBe('백 번째');
    });

    it('101을 백일 번째로 변환한다', () => {
      expect(order(101)).toBe('백일 번째');
    });

    it('1000을 천 번째로 변환한다', () => {
      expect(order(1000)).toBe('천 번째');
    });

    it('10000을 일만 번째로 변환한다', () => {
      expect(order(10000)).toBe('일만 번째');
    });

    it('100000000을 일억 번째로 변환한다', () => {
      expect(order(100000000)).toBe('일억 번째');
    });
  });

  describe('엣지 케이스', () => {
    it('0을 영 번째로 변환한다', () => {
      expect(order(0)).toBe('영 번째');
    });

    it('음수는 마이너스를 붙여 반환한다', () => {
      expect(order(-1)).toBe('마이너스 첫 번째');
    });

    it('-5는 마이너스 다섯 번째로 변환한다', () => {
      expect(order(-5)).toBe('마이너스 다섯 번째');
    });

    it('-100은 마이너스 백 번째로 변환한다', () => {
      expect(order(-100)).toBe('마이너스 백 번째');
    });

    it('NaN은 숫자가 아닙니다로 반환한다', () => {
      expect(order(NaN)).toBe('숫자가 아닙니다');
    });

    it('Infinity는 무한대로 반환한다', () => {
      expect(order(Infinity)).toBe('무한대');
    });

    it('-Infinity는 마이너스 무한대로 반환한다', () => {
      expect(order(-Infinity)).toBe('마이너스 무한대');
    });

    it('빈 문자열은 그대로 반환한다', () => {
      expect(order('')).toBe('');
    });
  });

  describe('문자열 입력', () => {
    it('"1번째"를 첫 번째로 변환한다', () => {
      expect(order('1번째')).toBe('첫 번째');
    });

    it('"3등"을 삼 등으로 변환한다 (한자어 수사)', () => {
      expect(order('3등')).toBe('삼 등');
    });

    it('"5위"를 오 위로 변환한다 (한자어 수사)', () => {
      expect(order('5위')).toBe('오 위');
    });

    it('천단위 구분자가 있는 숫자도 처리한다', () => {
      expect(order('1,000번째')).toBe('천 번째');
    });

    it('"0번째"를 영 번째로 변환한다', () => {
      expect(order('0번째')).toBe('영 번째');
    });

    it('"-1번째"를 마이너스 첫 번째로 변환한다', () => {
      expect(order('-1번째')).toBe('마이너스 첫 번째');
    });

    it('"-5등"을 마이너스 오 등으로 변환한다 (한자어 수사)', () => {
      expect(order('-5등')).toBe('마이너스 오 등');
    });

    it('숫자만 있는 문자열도 처리한다', () => {
      expect(order('123')).toBe('백이십삼 번째');
    });

    it('알파벳 문자열은 원본 반환한다', () => {
      expect(order('abc')).toBe('abc');
    });
  });

  describe('옵션 - 접미사', () => {
    it('접미사를 등으로 설정하면 한자어 수사를 사용한다', () => {
      expect(order(2, { suffix: '등' })).toBe('이 등');
    });

    it('접미사를 위로 설정하면 한자어 수사를 사용한다', () => {
      expect(order(1, { suffix: '위' })).toBe('일 위');
    });

    it('접미사를 순위로 설정하면 고유어 수사를 사용한다', () => {
      expect(order(3, { suffix: '순위' })).toBe('세 순위');
    });

    it('빈 접미사를 사용할 수 있다', () => {
      expect(order(1, { suffix: '' })).toBe('첫');
    });

    it('빈 접미사와 2를 사용하면 두만 반환한다', () => {
      expect(order(2, { suffix: '' })).toBe('두');
    });
  });

  describe('옵션 - 공백', () => {
    it('공백을 제거할 수 있다', () => {
      expect(order(1, { includeSpace: false })).toBe('첫번째');
    });

    it('접미사와 공백 옵션을 함께 사용할 수 있다 (한자어 수사)', () => {
      expect(order(2, { suffix: '등', includeSpace: false })).toBe('이등');
    });
  });
});
