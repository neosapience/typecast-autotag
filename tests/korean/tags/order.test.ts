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
    it('11을 열한 번째로 변환한다', () => {
      expect(order(11)).toBe('열한 번째');
    });

    it('15를 열다섯 번째로 변환한다', () => {
      expect(order(15)).toBe('열다섯 번째');
    });

    it('20을 스물 번째로 변환한다', () => {
      expect(order(20)).toBe('스물 번째');
    });

    it('21을 스물한 번째로 변환한다', () => {
      expect(order(21)).toBe('스물한 번째');
    });

    it('50을 쉰 번째로 변환한다', () => {
      expect(order(50)).toBe('쉰 번째');
    });

    it('99를 아흔아홉 번째로 변환한다', () => {
      expect(order(99)).toBe('아흔아홉 번째');
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
  });

  describe('엣지 케이스', () => {
    it('0을 영 번째로 변환한다', () => {
      expect(order(0)).toBe('영 번째');
    });

    it('음수는 원본 반환한다', () => {
      expect(order(-1)).toBe('-1');
    });

    it('빈 문자열은 그대로 반환한다', () => {
      expect(order('')).toBe('');
    });
  });

  describe('문자열 입력', () => {
    it('"1번째"를 첫 번째로 변환한다', () => {
      expect(order('1번째')).toBe('첫 번째');
    });

    it('"3등"을 세 등으로 변환한다', () => {
      expect(order('3등')).toBe('세 등');
    });

    it('"5위"를 다섯 위로 변환한다', () => {
      expect(order('5위')).toBe('다섯 위');
    });

    it('천단위 구분자가 있는 숫자도 처리한다', () => {
      expect(order('1,000번째')).toBe('천 번째');
    });
  });

  describe('옵션 - 접미사', () => {
    it('접미사를 등으로 설정할 수 있다', () => {
      expect(order(2, { suffix: '등' })).toBe('두 등');
    });

    it('접미사를 위로 설정할 수 있다', () => {
      expect(order(1, { suffix: '위' })).toBe('첫 위');
    });

    it('접미사를 순위로 설정할 수 있다', () => {
      expect(order(3, { suffix: '순위' })).toBe('세 순위');
    });
  });

  describe('옵션 - 공백', () => {
    it('공백을 제거할 수 있다', () => {
      expect(order(1, { includeSpace: false })).toBe('첫번째');
    });

    it('접미사와 공백 옵션을 함께 사용할 수 있다', () => {
      expect(order(2, { suffix: '등', includeSpace: false })).toBe('두등');
    });
  });
});
