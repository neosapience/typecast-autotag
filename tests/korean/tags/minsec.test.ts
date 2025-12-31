import { minsec } from '../../../src/korean/tags/minsec';

describe('minsec', () => {
  describe('기본 동작', () => {
    it('분초를 한글로 변환한다', () => {
      expect(minsec('3m20s')).toBe('삼 분 이십 초');
    });

    it('분만 있는 경우도 처리한다', () => {
      expect(minsec('5m')).toBe('오 분');
    });

    it('초만 있는 경우도 처리한다', () => {
      expect(minsec('30s')).toBe('삼십 초');
    });
  });

  describe('시간(hour) 지원', () => {
    it('시간만 있는 경우를 처리한다', () => {
      expect(minsec('2h')).toBe('두 시간');
    });

    it('시간과 분을 함께 처리한다', () => {
      expect(minsec('1h30m')).toBe('한 시간 삼십 분');
    });

    it('시간, 분, 초를 모두 처리한다', () => {
      expect(minsec('1h30m45s')).toBe('한 시간 삼십 분 사십오 초');
    });

    it('시간과 초만 있는 경우를 처리한다', () => {
      expect(minsec('2h15s')).toBe('두 시간 십오 초');
    });
  });

  describe('한글 형식 지원', () => {
    it('분만 있는 한글 형식을 처리한다', () => {
      expect(minsec('3분')).toBe('삼 분');
    });

    it('초만 있는 한글 형식을 처리한다', () => {
      expect(minsec('30초')).toBe('삼십 초');
    });

    it('분초 한글 형식을 처리한다', () => {
      expect(minsec('3분30초')).toBe('삼 분 삼십 초');
    });

    it('시간만 있는 한글 형식을 처리한다', () => {
      expect(minsec('2시간')).toBe('두 시간');
    });

    it('시간분 한글 형식을 처리한다', () => {
      expect(minsec('1시간30분')).toBe('한 시간 삼십 분');
    });

    it('시간분초 한글 형식을 처리한다', () => {
      expect(minsec('1시간30분45초')).toBe('한 시간 삼십 분 사십오 초');
    });

    it('한글 형식에 공백이 있어도 처리한다', () => {
      expect(minsec('3분 30초')).toBe('삼 분 삼십 초');
    });
  });

  describe('영어 단어 형식 지원', () => {
    it('hour 형식을 처리한다', () => {
      expect(minsec('3hour')).toBe('세 시간');
    });

    it('hours 형식을 처리한다', () => {
      expect(minsec('2hours')).toBe('두 시간');
    });

    it('minute 형식을 처리한다', () => {
      expect(minsec('5minute')).toBe('오 분');
    });

    it('minutes 형식을 처리한다', () => {
      expect(minsec('5minutes')).toBe('오 분');
    });

    it('min 형식을 처리한다', () => {
      expect(minsec('5min')).toBe('오 분');
    });

    it('second 형식을 처리한다', () => {
      expect(minsec('30second')).toBe('삼십 초');
    });

    it('seconds 형식을 처리한다', () => {
      expect(minsec('30seconds')).toBe('삼십 초');
    });

    it('sec 형식을 처리한다', () => {
      expect(minsec('30sec')).toBe('삼십 초');
    });

    it('복합 영어 단어 형식을 처리한다', () => {
      expect(minsec('3minute2seconds')).toBe('삼 분 이 초');
    });

    it('다양한 영어 단어 조합을 처리한다', () => {
      expect(minsec('1hour30min45sec')).toBe('한 시간 삼십 분 사십오 초');
    });
  });

  describe('다양한 시간', () => {
    it('1분 1초를 처리한다', () => {
      expect(minsec('1m1s')).toBe('일 분 일 초');
    });

    it('10분 10초를 처리한다', () => {
      expect(minsec('10m10s')).toBe('십 분 십 초');
    });

    it('큰 숫자도 처리한다', () => {
      expect(minsec('60m59s')).toBe('육십 분 오십구 초');
    });
  });

  describe('대소문자 및 공백 처리', () => {
    it('대문자도 인식한다', () => {
      expect(minsec('3M20S')).toBe('삼 분 이십 초');
    });

    it('대소문자 혼합도 인식한다', () => {
      expect(minsec('1H30m45S')).toBe('한 시간 삼십 분 사십오 초');
    });

    it('공백이 포함되어도 처리한다', () => {
      expect(minsec('3m 20s')).toBe('삼 분 이십 초');
    });

    it('여러 공백이 포함되어도 처리한다', () => {
      expect(minsec('1h  30m  45s')).toBe('한 시간 삼십 분 사십오 초');
    });
  });

  describe('정규화 옵션', () => {
    it('60초를 1분 0초로 정규화한다', () => {
      expect(minsec('60s', { normalize: true })).toBe('일 분 영 초');
    });

    it('90초를 1분 30초로 정규화한다', () => {
      expect(minsec('90s', { normalize: true })).toBe('일 분 삼십 초');
    });

    it('60분을 1시간 0분으로 정규화한다', () => {
      expect(minsec('60m', { normalize: true })).toBe('한 시간 영 분');
    });

    it('90분을 1시간 30분으로 정규화한다', () => {
      expect(minsec('90m', { normalize: true })).toBe('한 시간 삼십 분');
    });

    it('복합 정규화를 처리한다 (3m90s → 4분 30초)', () => {
      expect(minsec('3m90s', { normalize: true })).toBe('사 분 삼십 초');
    });

    it('정규화가 비활성화되면 그대로 표시한다', () => {
      expect(minsec('90s', { normalize: false })).toBe('구십 초');
    });

    it('정규화 옵션 기본값은 false이다', () => {
      expect(minsec('90s')).toBe('구십 초');
    });
  });

  describe('템플릿 커스터마이징', () => {
    it('prefix를 추가할 수 있다', () => {
      expect(minsec('5m', { prefix: '약 ' })).toBe('약 오 분');
    });

    it('suffix를 추가할 수 있다', () => {
      expect(minsec('5m', { suffix: ' 소요' })).toBe('오 분 소요');
    });

    it('prefix와 suffix를 모두 추가할 수 있다', () => {
      expect(minsec('5m', { prefix: '약 ', suffix: ' 소요예정' })).toBe('약 오 분 소요예정');
    });

    it('안내 문구를 포함한 형태로 사용할 수 있다', () => {
      expect(minsec('3m20s', { prefix: '상담사연결까지 약 ', suffix: ' 소요예정입니다' })).toBe(
        '상담사연결까지 약 삼 분 이십 초 소요예정입니다'
      );
    });
  });

  describe('0값 처리', () => {
    it('0분도 명시되어 있으면 표시한다', () => {
      expect(minsec('0m30s')).toBe('영 분 삼십 초');
    });

    it('0초도 명시되어 있으면 표시한다', () => {
      expect(minsec('5m0s')).toBe('오 분 영 초');
    });

    it('0시간도 명시되어 있으면 표시한다', () => {
      expect(minsec('0h5m30s')).toBe('영 시간 오 분 삼십 초');
    });
  });

  describe('엣지 케이스', () => {
    it('빈 문자열은 그대로 반환한다', () => {
      expect(minsec('')).toBe('');
    });

    it('분초 형식이 아닌 입력은 그대로 반환한다', () => {
      expect(minsec('abc')).toBe('abc');
    });

    it('0분 0초도 한글로 변환한다', () => {
      expect(minsec('0m0s')).toBe('영 분 영 초');
    });

    it('0시간 0분 0초도 한글로 변환한다', () => {
      expect(minsec('0h0m0s')).toBe('영 시간 영 분 영 초');
    });

    it('숫자만 있는 경우 초로 해석하여 변환한다', () => {
      expect(minsec('123')).toBe('백이십삼 초');
    });

    it('0만 있는 경우도 초로 해석하여 변환한다', () => {
      expect(minsec('0')).toBe('영 초');
    });
  });

  describe('소수점 초 처리', () => {
    it('0.3초를 영 쩜 삼 초로 변환한다', () => {
      expect(minsec('0.3초')).toBe('영 쩜 삼 초');
    });

    it('1.5초를 일 쩜 오 초로 변환한다', () => {
      expect(minsec('1.5초')).toBe('일 쩜 오 초');
    });

    it('0.05초를 영 쩜 영오 초로 변환한다', () => {
      expect(minsec('0.05초')).toBe('영 쩜 영오 초');
    });

    it('10.5초를 십 쩜 오 초로 변환한다', () => {
      expect(minsec('10.5초')).toBe('십 쩜 오 초');
    });

    it('3.14초를 삼 쩜 일사 초로 변환한다', () => {
      expect(minsec('3.14초')).toBe('삼 쩜 일사 초');
    });

    it('소수점 초와 분을 함께 처리한다', () => {
      expect(minsec('2분0.5초')).toBe('이 분 영 쩜 오 초');
    });

    it('소수점 초와 시간을 함께 처리한다', () => {
      expect(minsec('1시간0.3초')).toBe('한 시간 영 쩜 삼 초');
    });

    it('영어 형식 소수점 초도 처리한다 (0.5s)', () => {
      expect(minsec('0.5s')).toBe('영 쩜 오 초');
    });

    it('영어 형식 분 + 소수점 초도 처리한다 (2m0.5s)', () => {
      expect(minsec('2m0.5s')).toBe('이 분 영 쩜 오 초');
    });
  });
});
