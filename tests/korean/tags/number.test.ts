import { numberTag } from '../../../src/korean/tags/number';

describe('numberTag', () => {
  describe('기본 동작 - 번호 표현', () => {
    it('1을 일 번으로 변환한다', () => {
      expect(numberTag(1)).toBe('일 번');
    });

    it('2를 이 번으로 변환한다', () => {
      expect(numberTag(2)).toBe('이 번');
    });

    it('3을 삼 번으로 변환한다', () => {
      expect(numberTag(3)).toBe('삼 번');
    });

    it('4를 사 번으로 변환한다', () => {
      expect(numberTag(4)).toBe('사 번');
    });

    it('5를 오 번으로 변환한다', () => {
      expect(numberTag(5)).toBe('오 번');
    });

    it('6을 육 번으로 변환한다', () => {
      expect(numberTag(6)).toBe('육 번');
    });

    it('7을 칠 번으로 변환한다', () => {
      expect(numberTag(7)).toBe('칠 번');
    });

    it('8을 팔 번으로 변환한다', () => {
      expect(numberTag(8)).toBe('팔 번');
    });

    it('9를 구 번으로 변환한다', () => {
      expect(numberTag(9)).toBe('구 번');
    });

    it('10을 십 번으로 변환한다', () => {
      expect(numberTag(10)).toBe('십 번');
    });
  });

  describe('10 이상 번호', () => {
    it('11을 십일 번으로 변환한다', () => {
      expect(numberTag(11)).toBe('십일 번');
    });

    it('15를 십오 번으로 변환한다', () => {
      expect(numberTag(15)).toBe('십오 번');
    });

    it('20을 이십 번으로 변환한다', () => {
      expect(numberTag(20)).toBe('이십 번');
    });

    it('100을 백 번으로 변환한다', () => {
      expect(numberTag(100)).toBe('백 번');
    });

    it('1000을 천 번으로 변환한다', () => {
      expect(numberTag(1000)).toBe('천 번');
    });
  });

  describe('엣지 케이스', () => {
    it('0을 영 번으로 변환한다', () => {
      expect(numberTag(0)).toBe('영 번');
    });

    it('음수는 마이너스를 붙여 반환한다', () => {
      expect(numberTag(-1)).toBe('마이너스 일 번');
    });

    it('-5는 마이너스 오 번으로 변환한다', () => {
      expect(numberTag(-5)).toBe('마이너스 오 번');
    });

    it('NaN은 숫자가 아닙니다로 반환한다', () => {
      expect(numberTag(NaN)).toBe('숫자가 아닙니다');
    });

    it('Infinity는 무한대로 반환한다', () => {
      expect(numberTag(Infinity)).toBe('무한대');
    });

    it('-Infinity는 마이너스 무한대로 반환한다', () => {
      expect(numberTag(-Infinity)).toBe('마이너스 무한대');
    });

    it('빈 문자열은 그대로 반환한다', () => {
      expect(numberTag('')).toBe('');
    });
  });

  describe('문자열 입력', () => {
    it('"1번"을 일 번으로 변환한다', () => {
      expect(numberTag('1번')).toBe('일 번');
    });

    it('"2번"을 이 번으로 변환한다', () => {
      expect(numberTag('2번')).toBe('이 번');
    });

    it('"10번"을 십 번으로 변환한다', () => {
      expect(numberTag('10번')).toBe('십 번');
    });

    it('천단위 구분자가 있는 숫자도 처리한다', () => {
      expect(numberTag('1,000번')).toBe('천 번');
    });

    it('"0번"을 영 번으로 변환한다', () => {
      expect(numberTag('0번')).toBe('영 번');
    });

    it('"-1번"을 마이너스 일 번으로 변환한다', () => {
      expect(numberTag('-1번')).toBe('마이너스 일 번');
    });

    it('숫자만 있는 문자열도 처리한다', () => {
      expect(numberTag('123')).toBe('백이십삼 번');
    });

    it('알파벳 문자열은 원본 반환한다', () => {
      expect(numberTag('abc')).toBe('abc');
    });
  });

  describe('옵션 - 접미사', () => {
    it('접미사를 변경할 수 있다', () => {
      expect(numberTag(2, { suffix: '호' })).toBe('이 호');
    });

    it('빈 접미사를 사용할 수 있다', () => {
      expect(numberTag(1, { suffix: '' })).toBe('일');
    });
  });

  describe('옵션 - 공백', () => {
    it('공백을 제거할 수 있다', () => {
      expect(numberTag(1, { includeSpace: false })).toBe('일번');
    });

    it('접미사와 공백 옵션을 함께 사용할 수 있다', () => {
      expect(numberTag(2, { suffix: '호', includeSpace: false })).toBe('이호');
    });
  });
});
