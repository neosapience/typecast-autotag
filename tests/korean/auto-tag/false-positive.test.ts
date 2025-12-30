import { autoTag } from '../../../src/korean/auto-tag';

/**
 * False Positive 방지 테스트
 *
 * 자동 태깅에서 가장 중요한 것은 잘못된 탐지를 방지하는 것입니다.
 * 이 테스트 파일은 자동 태깅이 잘못 적용되어서는 안 되는 케이스들을 검증합니다.
 */
describe('False Positive 방지', () => {
  describe('일반 텍스트는 변환하지 않아야 한다', () => {
    it('한글 문장은 그대로 유지한다', () => {
      expect(autoTag('안녕하세요, 오늘 날씨가 좋네요.')).toBe('안녕하세요, 오늘 날씨가 좋네요.');
    });

    it('영문 문장은 그대로 유지한다', () => {
      expect(autoTag('Hello, how are you?')).toBe('Hello, how are you?');
    });

    it('단순 숫자는 변환하지 않는다', () => {
      expect(autoTag('숫자 12345')).toBe('숫자 12345');
      expect(autoTag('코드: ABC123')).toBe('코드: ABC123');
    });
  });

  describe('비슷하지만 다른 패턴 구분', () => {
    it('4자리 숫자는 전화번호가 아니다', () => {
      expect(autoTag('주문번호: 1234', { enabledTags: ['phone'] })).toBe('주문번호: 1234');
    });

    it('5자리 이하 숫자는 전화번호가 아니다', () => {
      expect(autoTag('PIN: 12345', { enabledTags: ['phone'] })).toBe('PIN: 12345');
    });

    it('콜론이 있어도 유효하지 않은 시간은 변환하지 않는다', () => {
      // 유효하지 않은 시간 (25시, 61분 등)
      expect(autoTag('25:00', { enabledTags: ['time'] })).toBe('25:00');
      expect(autoTag('12:61', { enabledTags: ['time'] })).toBe('12:61');
    });

    it('날짜 형식이지만 유효하지 않은 값은 처리된다', () => {
      // 주의: date 함수 자체가 유효성 검사를 하지 않으므로 변환됨
      // 유효성 검사가 필요하다면 date 함수를 수정해야 함
      expect(autoTag('2024-13-01', { enabledTags: ['date'] })).toBe('이천이십사년 십삼 월 일 일');
      expect(autoTag('2024-01-32', { enabledTags: ['date'] })).toBe('이천이십사년 일 월 삼십이 일');
    });
  });

  describe('문맥에 따른 구분', () => {
    it('IP 주소는 전화번호로 변환하지 않는다', () => {
      expect(autoTag('서버: 192.168.1.1', { enabledTags: ['phone'] })).toBe('서버: 192.168.1.1');
    });

    it('버전 번호는 시간으로 변환하지 않는다', () => {
      // v2.3.1 같은 버전 번호
      expect(autoTag('버전 v2.3.1', { enabledTags: ['time'] })).toBe('버전 v2.3.1');
    });

    it('MAC 주소는 변환하지 않는다', () => {
      expect(autoTag('MAC: 00:1A:2B:3C:4D:5E', { enabledTags: ['time'] })).toBe(
        'MAC: 00:1A:2B:3C:4D:5E'
      );
    });
  });

  describe('단위 혼동 방지', () => {
    it('원이 아닌 단위는 금액으로 변환하지 않는다', () => {
      expect(autoTag('50점', { enabledTags: ['money'] })).toBe('50점');
      expect(autoTag('100개', { enabledTags: ['money'] })).toBe('100개');
    });

    it('점이 아닌 단위는 점수로 변환하지 않는다', () => {
      expect(autoTag('5000원', { enabledTags: ['point'] })).toBe('5000원');
      expect(autoTag('10명', { enabledTags: ['point'] })).toBe('10명');
    });

    it('순서 접미사가 없는 숫자는 order로 변환하지 않는다', () => {
      expect(autoTag('숫자 5', { enabledTags: ['order'] })).toBe('숫자 5');
      expect(autoTag('5명', { enabledTags: ['order'] })).toBe('5명');
    });
  });

  describe('날짜/시간 구분', () => {
    it('datetime 형식에서 날짜와 시간이 함께 변환된다', () => {
      // datetime이 우선되어야 함 - 날짜와 시간이 모두 변환됨
      const result = autoTag('2024-01-15T14:30');
      expect(result).toContain('오후 두 시'); // 시간도 변환되어야 함
      expect(result).toContain('십오 일'); // 날짜도 변환됨
    });

    it('날짜 뒤의 공백 + 시간은 datetime으로 처리해야 한다', () => {
      const result = autoTag('2024-01-15 14:30');
      // datetime으로 한 번에 처리되어야 함
      expect(result).toBe('이천이십사년 일 월 십오 일 오후 두 시 삼십 분');
    });
  });

  describe('이름/한글 문자열 구분', () => {
    it('일반 한글 단어는 이름으로 변환하지 않는다', () => {
      // 자동 태깅에서 이름은 지원하지 않음 (false positive 위험이 너무 높음)
      expect(autoTag('안녕하세요')).toBe('안녕하세요');
      expect(autoTag('감사합니다')).toBe('감사합니다');
    });
  });

  describe('복합 패턴에서의 정확성', () => {
    it('문장에서 올바른 부분만 변환한다', () => {
      const text = '주문번호 1234, 전화 010-1234-5678';
      const result = autoTag(text, { enabledTags: ['phone'] });

      expect(result).toBe('주문번호 1234, 전화 공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔');
    });

    it('날짜와 일반 숫자를 구분한다', () => {
      const text = '날짜: 2024-01-15, 코드: 2024';
      const result = autoTag(text, { enabledTags: ['date'] });

      expect(result).toContain('이천이십사년 일 월 십오 일');
      expect(result).toContain('코드: 2024'); // 일반 숫자는 유지
    });
  });

  describe('경계 조건', () => {
    it('문자열 시작의 패턴을 올바르게 처리한다', () => {
      expect(autoTag('010-1234-5678입니다', { enabledTags: ['phone'] })).toBe(
        '공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔 입니다'
      );
    });

    it('문자열 끝의 패턴을 올바르게 처리한다', () => {
      expect(autoTag('전화번호: 010-1234-5678', { enabledTags: ['phone'] })).toBe(
        '전화번호: 공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔'
      );
    });

    it('괄호 안의 패턴을 올바르게 처리한다', () => {
      expect(autoTag('(010-1234-5678)', { enabledTags: ['phone'] })).toBe(
        '(공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔)'
      );
    });
  });
});
