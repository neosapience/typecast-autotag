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

    it('101을 백일 개로 변환한다', () => {
      expect(piece(101)).toBe('백일 개');
    });

    it('150을 백오십 개로 변환한다', () => {
      expect(piece(150)).toBe('백오십 개');
    });

    it('999를 구백구십구 개로 변환한다', () => {
      expect(piece(999)).toBe('구백구십구 개');
    });

    it('1000을 천 개로 변환한다', () => {
      expect(piece(1000)).toBe('천 개');
    });

    it('1234를 천이백삼십사 개로 변환한다', () => {
      expect(piece(1234)).toBe('천이백삼십사 개');
    });
  });

  describe('큰 숫자 (만/억/조)', () => {
    it('10000을 일만 개로 변환한다', () => {
      expect(piece(10000)).toBe('일만 개');
    });

    it('12345를 일만이천삼백사십오 개로 변환한다', () => {
      expect(piece(12345)).toBe('일만이천삼백사십오 개');
    });

    it('100000을 십만 개로 변환한다', () => {
      expect(piece(100000)).toBe('십만 개');
    });

    it('1000000을 백만 개로 변환한다', () => {
      expect(piece(1000000)).toBe('백만 개');
    });

    it('10000000을 천만 개로 변환한다', () => {
      expect(piece(10000000)).toBe('천만 개');
    });

    it('100000000을 일억 개로 변환한다', () => {
      expect(piece(100000000)).toBe('일억 개');
    });

    it('123456789를 일억이천삼백사십오만육천칠백팔십구 개로 변환한다', () => {
      expect(piece(123456789)).toBe('일억이천삼백사십오만육천칠백팔십구 개');
    });

    it('1000000000000을 일조 개로 변환한다', () => {
      expect(piece(1000000000000)).toBe('일조 개');
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

    it('공백만 있는 문자열은 원본 반환한다', () => {
      expect(piece('   ')).toBe('   ');
    });
  });

  describe('소수점 및 특수 숫자', () => {
    it('소수점 숫자는 버림하여 변환한다', () => {
      expect(piece(1.5)).toBe('한 개');
    });

    it('1.9는 한 개로 변환한다 (버림)', () => {
      expect(piece(1.9)).toBe('한 개');
    });

    it('0.5는 영 개로 변환한다 (버림)', () => {
      expect(piece(0.5)).toBe('영 개');
    });

    it('99.9는 아흔아홉 개로 변환한다 (버림, 고유어)', () => {
      expect(piece(99.9)).toBe('아흔아홉 개');
    });

    it('100.5는 백 개로 변환한다 (버림, 한자어)', () => {
      expect(piece(100.5)).toBe('백 개');
    });

    it('소수점 문자열은 버림하여 변환한다', () => {
      expect(piece('1.5개')).toBe('한 개');
    });

    it('소수점 문자열 2.7을 버림하여 변환한다', () => {
      expect(piece('2.7개')).toBe('두 개');
    });

    it('NaN은 원본 반환한다', () => {
      expect(piece(NaN)).toBe('NaN');
    });

    it('Infinity는 원본 반환한다', () => {
      expect(piece(Infinity)).toBe('Infinity');
    });

    it('-Infinity는 원본 반환한다', () => {
      expect(piece(-Infinity)).toBe('-Infinity');
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

  describe('문자열 엣지 케이스', () => {
    it('단위 없는 숫자 문자열도 처리한다', () => {
      expect(piece('5')).toBe('다섯 개');
    });

    it('숫자와 단위 사이 공백이 있는 경우도 처리한다', () => {
      expect(piece('5 개')).toBe('다섯 개');
    });

    it('0개를 영 개로 변환한다', () => {
      expect(piece('0개')).toBe('영 개');
    });

    it('음수 문자열은 원본 반환한다', () => {
      expect(piece('-5개')).toBe('-5개');
    });

    it('음수 문자열 (단위 없음)은 원본 반환한다', () => {
      expect(piece('-5')).toBe('-5');
    });

    it('문자만 있는 경우 원본 반환한다', () => {
      expect(piece('abc')).toBe('abc');
    });

    it('숫자로 시작하지 않는 문자열은 원본 반환한다', () => {
      expect(piece('개5')).toBe('개5');
    });

    it('여러 천단위 구분자가 있는 경우도 처리한다', () => {
      expect(piece('1,234,567개')).toBe('백이십삼만사천오백육십칠 개');
    });

    it('큰 숫자 문자열도 처리한다', () => {
      expect(piece('100000000개')).toBe('일억 개');
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

    it('0에도 공백 옵션이 적용된다', () => {
      expect(piece(0, { includeSpace: false })).toBe('영개');
    });

    it('100 이상에도 공백 옵션이 적용된다', () => {
      expect(piece(100, { includeSpace: false })).toBe('백개');
    });
  });

  describe('문자열 입력과 옵션 상호작용', () => {
    it('문자열에 단위가 있으면 파싱된 단위가 우선된다', () => {
      expect(piece('5개', { unit: '마리' })).toBe('다섯 개');
    });

    it('문자열에 단위가 없으면 옵션 단위가 사용된다', () => {
      expect(piece('5', { unit: '마리' })).toBe('다섯 마리');
    });

    it('문자열에 공백 옵션이 적용된다', () => {
      expect(piece('5개', { includeSpace: false })).toBe('다섯개');
    });

    it('문자열에 단위와 공백 옵션이 함께 적용된다', () => {
      expect(piece('5', { unit: '마리', includeSpace: false })).toBe('다섯마리');
    });

    it('파싱된 단위와 공백 옵션 조합', () => {
      expect(piece('3명', { includeSpace: false })).toBe('세명');
    });

    it('큰 숫자 문자열에도 옵션이 적용된다', () => {
      expect(piece('1000', { unit: '원', includeSpace: false })).toBe('천원');
    });
  });

  describe('경계값 테스트', () => {
    it('99는 고유어로 변환된다 (경계)', () => {
      expect(piece(99)).toBe('아흔아홉 개');
    });

    it('100은 한자어로 변환된다 (경계)', () => {
      expect(piece(100)).toBe('백 개');
    });

    it('1은 고유어로 변환된다 (최소 양수)', () => {
      expect(piece(1)).toBe('한 개');
    });

    it('0은 영으로 변환된다 (경계)', () => {
      expect(piece(0)).toBe('영 개');
    });

    it('-1은 원본 반환된다 (음수 경계)', () => {
      expect(piece(-1)).toBe('-1');
    });

    it('문자열 99는 고유어로 변환된다', () => {
      expect(piece('99개')).toBe('아흔아홉 개');
    });

    it('문자열 100은 한자어로 변환된다', () => {
      expect(piece('100개')).toBe('백 개');
    });
  });
});
