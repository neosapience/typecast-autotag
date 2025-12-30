import { floor } from '../../../src/korean/tags/floor';

describe('floor', () => {
  describe('기본 동작 - 일반 층수', () => {
    it('1층을 일 층으로 변환한다', () => {
      expect(floor('1층')).toBe('일 층');
    });

    it('3층을 삼 층으로 변환한다', () => {
      expect(floor('3층')).toBe('삼 층');
    });

    it('5층을 오 층으로 변환한다', () => {
      expect(floor('5층')).toBe('오 층');
    });

    it('10층을 십 층으로 변환한다', () => {
      expect(floor('10층')).toBe('십 층');
    });

    it('15층을 십오 층으로 변환한다', () => {
      expect(floor('15층')).toBe('십오 층');
    });

    it('20층을 이십 층으로 변환한다', () => {
      expect(floor('20층')).toBe('이십 층');
    });

    it('100층을 백 층으로 변환한다', () => {
      expect(floor('100층')).toBe('백 층');
    });
  });

  describe('지하층 - 영문 B', () => {
    it('B1층을 지하 일 층으로 변환한다', () => {
      expect(floor('B1층')).toBe('지하 일 층');
    });

    it('B2층을 지하 이 층으로 변환한다', () => {
      expect(floor('B2층')).toBe('지하 이 층');
    });

    it('B3층을 지하 삼 층으로 변환한다', () => {
      expect(floor('B3층')).toBe('지하 삼 층');
    });

    it('b1층 (소문자)을 지하 일 층으로 변환한다', () => {
      expect(floor('b1층')).toBe('지하 일 층');
    });
  });

  describe('지하층 - 한글', () => {
    it('지하1층을 지하 일 층으로 변환한다', () => {
      expect(floor('지하1층')).toBe('지하 일 층');
    });

    it('지하2층을 지하 이 층으로 변환한다', () => {
      expect(floor('지하2층')).toBe('지하 이 층');
    });

    it('지하 1층 (공백 포함)을 지하 일 층으로 변환한다', () => {
      expect(floor('지하 1층')).toBe('지하 일 층');
    });
  });

  describe('숫자 입력', () => {
    it('숫자 3을 삼 층으로 변환한다', () => {
      expect(floor(3)).toBe('삼 층');
    });

    it('숫자 10을 십 층으로 변환한다', () => {
      expect(floor(10)).toBe('십 층');
    });

    it('음수 -1을 지하 일 층으로 변환한다', () => {
      expect(floor(-1)).toBe('지하 일 층');
    });

    it('음수 -2를 지하 이 층으로 변환한다', () => {
      expect(floor(-2)).toBe('지하 이 층');
    });

    it('0을 영 층으로 변환한다', () => {
      expect(floor(0)).toBe('영 층');
    });
  });

  describe('엣지 케이스', () => {
    it('빈 문자열은 그대로 반환한다', () => {
      expect(floor('')).toBe('');
    });

    it('공백만 있는 문자열은 원본 반환한다', () => {
      expect(floor('   ')).toBe('   ');
    });

    it('인식되지 않는 형식은 원본 반환한다', () => {
      expect(floor('1st floor')).toBe('1st floor');
    });

    it('NaN은 원본 반환한다', () => {
      expect(floor(NaN)).toBe('NaN');
    });

    it('Infinity는 원본 반환한다', () => {
      expect(floor(Infinity)).toBe('Infinity');
    });
  });

  describe('옵션 - 공백', () => {
    it('공백을 제거할 수 있다', () => {
      expect(floor('3층', { includeSpace: false })).toBe('삼층');
    });

    it('지하층에도 공백 옵션이 적용된다', () => {
      expect(floor('B1층', { includeSpace: false })).toBe('지하일층');
    });

    it('숫자 입력에도 공백 옵션이 적용된다', () => {
      expect(floor(5, { includeSpace: false })).toBe('오층');
    });

    it('음수 입력에도 공백 옵션이 적용된다', () => {
      expect(floor(-2, { includeSpace: false })).toBe('지하이층');
    });
  });

  describe('천단위 구분자', () => {
    it('천단위 구분자가 있는 숫자도 처리한다', () => {
      expect(floor('1,000층')).toBe('천 층');
    });
  });
});
