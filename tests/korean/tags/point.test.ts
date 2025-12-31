import { point } from '../../../src/korean/tags/point';

describe('point', () => {
  describe('기본 동작', () => {
    it('95를 구십오 점으로 변환한다', () => {
      expect(point(95)).toBe('구십오 점');
    });

    it('100을 백 점으로 변환한다', () => {
      expect(point(100)).toBe('백 점');
    });

    it('0을 영 점으로 변환한다', () => {
      expect(point(0)).toBe('영 점');
    });

    it('50을 오십 점으로 변환한다', () => {
      expect(point(50)).toBe('오십 점');
    });

    it('1을 일 점으로 변환한다', () => {
      expect(point(1)).toBe('일 점');
    });
  });

  describe('소수점 처리', () => {
    it('4.5를 사 쩜 오 점으로 변환한다', () => {
      expect(point(4.5)).toBe('사 쩜 오 점');
    });

    it('3.14를 삼 쩜 일사 점으로 변환한다', () => {
      expect(point(3.14)).toBe('삼 쩜 일사 점');
    });

    it('0.5를 영 쩜 오 점으로 변환한다', () => {
      expect(point(0.5)).toBe('영 쩜 오 점');
    });

    it('99.99를 구십구 쩜 구구 점으로 변환한다', () => {
      expect(point(99.99)).toBe('구십구 쩜 구구 점');
    });
  });

  describe('음수 처리', () => {
    it('-5를 마이너스 오 점으로 변환한다', () => {
      expect(point(-5)).toBe('마이너스 오 점');
    });

    it('-10.5를 마이너스 십 쩜 오 점으로 변환한다', () => {
      expect(point(-10.5)).toBe('마이너스 십 쩜 오 점');
    });
  });

  describe('문자열 입력', () => {
    it('"85점"을 팔십오 점으로 변환한다', () => {
      expect(point('85점')).toBe('팔십오 점');
    });

    it('"100"을 백 점으로 변환한다', () => {
      expect(point('100')).toBe('백 점');
    });

    it('"4.5점"을 사 쩜 오 점으로 변환한다', () => {
      expect(point('4.5점')).toBe('사 쩜 오 점');
    });

    it('천단위 구분자가 있는 숫자도 처리한다', () => {
      expect(point('1,000점')).toBe('천 점');
    });

    it('공백이 있는 문자열도 처리한다', () => {
      expect(point('  95점  ')).toBe('구십오 점');
    });
  });

  describe('옵션 - 단위', () => {
    it('단위를 등급으로 설정할 수 있다', () => {
      expect(point(90, { unit: '등급' })).toBe('구십 등급');
    });

    it('단위를 개로 설정할 수 있다', () => {
      expect(point(5, { unit: '개' })).toBe('오 개');
    });

    it('단위를 퍼센트로 설정할 수 있다', () => {
      expect(point(85, { unit: '퍼센트' })).toBe('팔십오 퍼센트');
    });
  });

  describe('옵션 - 공백', () => {
    it('공백을 제거할 수 있다', () => {
      expect(point(95, { includeSpace: false })).toBe('구십오점');
    });

    it('단위와 공백 옵션을 함께 사용할 수 있다', () => {
      expect(point(90, { unit: '등급', includeSpace: false })).toBe('구십등급');
    });
  });

  describe('엣지 케이스', () => {
    it('빈 문자열은 그대로 반환한다', () => {
      expect(point('')).toBe('');
    });

    it('NaN은 원본 반환한다', () => {
      expect(point(NaN)).toBe('NaN');
    });

    it('공백만 있는 문자열은 그대로 반환한다', () => {
      expect(point('   ')).toBe('   ');
    });
  });

  describe('Infinity 처리', () => {
    it('Infinity를 무한대 점으로 변환한다', () => {
      expect(point(Infinity)).toBe('무한대 점');
    });

    it('-Infinity를 마이너스 무한대 점으로 변환한다', () => {
      expect(point(-Infinity)).toBe('마이너스 무한대 점');
    });

    it('Infinity에 커스텀 단위를 적용할 수 있다', () => {
      expect(point(Infinity, { unit: '개' })).toBe('무한대 개');
    });

    it('Infinity에 공백 옵션을 적용할 수 있다', () => {
      expect(point(Infinity, { includeSpace: false })).toBe('무한대점');
    });
  });

  describe('음수 문자열 처리', () => {
    it('"-5"를 마이너스 오 점으로 변환한다', () => {
      expect(point('-5')).toBe('마이너스 오 점');
    });

    it('"-100점"을 마이너스 백 점으로 변환한다', () => {
      expect(point('-100점')).toBe('마이너스 백 점');
    });

    it('"-10.5"를 마이너스 십 쩜 오 점으로 변환한다', () => {
      expect(point('-10.5')).toBe('마이너스 십 쩜 오 점');
    });

    it('"-1,000점"을 마이너스 천 점으로 변환한다', () => {
      expect(point('-1,000점')).toBe('마이너스 천 점');
    });
  });

  describe('+ 기호 처리', () => {
    it('"+5"를 오 점으로 변환한다', () => {
      expect(point('+5')).toBe('오 점');
    });

    it('"+100점"을 백 점으로 변환한다', () => {
      expect(point('+100점')).toBe('백 점');
    });

    it('"+3.14"를 삼 쩜 일사 점으로 변환한다', () => {
      expect(point('+3.14')).toBe('삼 쩜 일사 점');
    });
  });

  describe('소수점 엣지 케이스', () => {
    it('".5"를 영 쩜 오 점으로 변환한다', () => {
      expect(point('.5')).toBe('영 쩜 오 점');
    });

    it('"1."을 일 점으로 변환한다', () => {
      expect(point('1.')).toBe('일 점');
    });

    it('"1.2.3" 같은 잘못된 형식은 원본 반환한다', () => {
      expect(point('1.2.3')).toBe('1.2.3');
    });

    it('"1.00"을 일 쩜 영영 점으로 변환한다', () => {
      expect(point('1.00')).toBe('일 쩜 영영 점');
    });

    it('"0.01"을 영 쩜 영일 점으로 변환한다', () => {
      expect(point('0.01')).toBe('영 쩜 영일 점');
    });

    it('"-.5"를 마이너스 영 쩜 오 점으로 변환한다', () => {
      expect(point('-.5')).toBe('마이너스 영 쩜 오 점');
    });
  });

  describe('큰 숫자 처리', () => {
    it('1조를 일조 점으로 변환한다', () => {
      expect(point(1000000000000)).toBe('일조 점');
    });

    it('1억을 일억 점으로 변환한다', () => {
      expect(point(100000000)).toBe('일억 점');
    });

    it('"1,234,567,890"을 십이억삼천사백오십육만칠천팔백구십 점으로 변환한다', () => {
      expect(point('1,234,567,890')).toBe('십이억삼천사백오십육만칠천팔백구십 점');
    });
  });

  describe('앞에 0이 있는 경우', () => {
    it('"007"을 칠 점으로 변환한다', () => {
      expect(point('007')).toBe('칠 점');
    });

    it('"00"을 영 점으로 변환한다', () => {
      expect(point('00')).toBe('영 점');
    });
  });

  describe('특수 케이스', () => {
    it('"-"만 있으면 원본 반환한다', () => {
      expect(point('-')).toBe('-');
    });

    it('"+"만 있으면 원본 반환한다', () => {
      expect(point('+')).toBe('+');
    });

    it('"."만 있으면 원본 반환한다', () => {
      expect(point('.')).toBe('.');
    });

    it('숫자가 아닌 문자열은 원본 반환한다', () => {
      expect(point('abc')).toBe('abc');
    });

    it('숫자 앞에 문자가 있으면 원본 반환한다', () => {
      expect(point('점수95')).toBe('점수95');
    });
  });

  describe('크레딧 처리', () => {
    it('"150000크레딧"을 십오만 크레딧으로 변환한다', () => {
      expect(point('150000크레딧')).toBe('십오만 크레딧');
    });

    it('"100크레딧"을 백 크레딧으로 변환한다', () => {
      expect(point('100크레딧')).toBe('백 크레딧');
    });

    it('"1000크레딧"을 천 크레딧으로 변환한다', () => {
      expect(point('1000크레딧')).toBe('천 크레딧');
    });

    it('"50크레딧"을 오십 크레딧으로 변환한다', () => {
      expect(point('50크레딧')).toBe('오십 크레딧');
    });

    it('천단위 구분자가 있는 크레딧도 처리한다', () => {
      expect(point('1,000,000크레딧')).toBe('백만 크레딧');
    });

    it('소수점 크레딧도 처리한다', () => {
      expect(point('10.5크레딧')).toBe('십 쩜 오 크레딧');
    });
  });
});
