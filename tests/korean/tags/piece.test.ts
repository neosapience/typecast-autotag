import { piece } from '../../../src/korean/tags/piece';

describe('piece', () => {
  describe('기본 동작 - 고유어 수사', () => {
    it('1을 한 개로 변환한다', () => {
      expect(piece(1)).toBe('한 개');
    });

    it('2를 두 개로 변환한다', () => {
      expect(piece(2)).toBe('두 개');
    });

    it('3을 세 개로 변환한다', () => {
      expect(piece(3)).toBe('세 개');
    });

    it('4를 네 개로 변환한다', () => {
      expect(piece(4)).toBe('네 개');
    });

    it('5를 다섯 개로 변환한다', () => {
      expect(piece(5)).toBe('다섯 개');
    });

    it('6을 여섯 개로 변환한다', () => {
      expect(piece(6)).toBe('여섯 개');
    });

    it('7을 일곱 개로 변환한다', () => {
      expect(piece(7)).toBe('일곱 개');
    });

    it('8을 여덟 개로 변환한다', () => {
      expect(piece(8)).toBe('여덟 개');
    });

    it('9를 아홉 개로 변환한다', () => {
      expect(piece(9)).toBe('아홉 개');
    });

    it('10을 열 개로 변환한다', () => {
      expect(piece(10)).toBe('열 개');
    });
  });

  describe('10 이상 고유어 수사', () => {
    it('11을 열한 개로 변환한다', () => {
      expect(piece(11)).toBe('열한 개');
    });

    it('15를 열다섯 개로 변환한다', () => {
      expect(piece(15)).toBe('열다섯 개');
    });

    it('20을 스물 개로 변환한다', () => {
      expect(piece(20)).toBe('스물 개');
    });

    it('21을 스물한 개로 변환한다', () => {
      expect(piece(21)).toBe('스물한 개');
    });

    it('30을 서른 개로 변환한다', () => {
      expect(piece(30)).toBe('서른 개');
    });

    it('45를 마흔다섯 개로 변환한다', () => {
      expect(piece(45)).toBe('마흔다섯 개');
    });

    it('50을 쉰 개로 변환한다', () => {
      expect(piece(50)).toBe('쉰 개');
    });

    it('67을 예순일곱 개로 변환한다', () => {
      expect(piece(67)).toBe('예순일곱 개');
    });

    it('78을 일흔여덟 개로 변환한다', () => {
      expect(piece(78)).toBe('일흔여덟 개');
    });

    it('89를 여든아홉 개로 변환한다', () => {
      expect(piece(89)).toBe('여든아홉 개');
    });

    it('99를 아흔아홉 개로 변환한다', () => {
      expect(piece(99)).toBe('아흔아홉 개');
    });
  });

  describe('100 이상 한자어 수사', () => {
    it('100을 백 개로 변환한다', () => {
      expect(piece(100)).toBe('백 개');
    });

    it('150을 백오십 개로 변환한다', () => {
      expect(piece(150)).toBe('백오십 개');
    });

    it('1000을 천 개로 변환한다', () => {
      expect(piece(1000)).toBe('천 개');
    });
  });

  describe('엣지 케이스', () => {
    it('0을 영 개로 변환한다', () => {
      expect(piece(0)).toBe('영 개');
    });

    it('음수는 원본 반환한다', () => {
      expect(piece(-5)).toBe('-5');
    });

    it('빈 문자열은 그대로 반환한다', () => {
      expect(piece('')).toBe('');
    });
  });

  describe('문자열 입력', () => {
    it('"5개"를 다섯 개로 변환한다', () => {
      expect(piece('5개')).toBe('다섯 개');
    });

    it('"10마리"를 열 마리로 변환한다', () => {
      expect(piece('10마리')).toBe('열 마리');
    });

    it('"3명"을 세 명으로 변환한다', () => {
      expect(piece('3명')).toBe('세 명');
    });

    it('천단위 구분자가 있는 숫자도 처리한다', () => {
      expect(piece('1,000개')).toBe('천 개');
    });

    it('공백이 있는 문자열도 처리한다', () => {
      expect(piece('  5개  ')).toBe('다섯 개');
    });
  });

  describe('옵션 - 단위', () => {
    it('단위를 명으로 설정할 수 있다', () => {
      expect(piece(3, { unit: '명' })).toBe('세 명');
    });

    it('단위를 마리로 설정할 수 있다', () => {
      expect(piece(2, { unit: '마리' })).toBe('두 마리');
    });

    it('단위를 병으로 설정할 수 있다', () => {
      expect(piece(5, { unit: '병' })).toBe('다섯 병');
    });

    it('단위를 장으로 설정할 수 있다', () => {
      expect(piece(10, { unit: '장' })).toBe('열 장');
    });
  });

  describe('옵션 - 공백', () => {
    it('공백을 제거할 수 있다', () => {
      expect(piece(5, { includeSpace: false })).toBe('다섯개');
    });

    it('단위와 공백 옵션을 함께 사용할 수 있다', () => {
      expect(piece(3, { unit: '명', includeSpace: false })).toBe('세명');
    });
  });
});
