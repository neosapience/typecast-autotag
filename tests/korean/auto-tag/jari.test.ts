import { autoTag, autoJari } from '../../../src/korean/auto-tag';

describe('autoTag - jari (자리 자동 태깅)', () => {
  describe('자리 수 변환', () => {
    it('기본 자리 수를 변환한다', () => {
      expect(autoJari('4자리')).toBe('네자리');
      expect(autoJari('2자리')).toBe('두자리');
    });

    it('10 이상 자리 수를 변환한다', () => {
      expect(autoJari('10자리')).toBe('열자리');
      expect(autoJari('13자리')).toBe('열세자리');
    });
  });

  describe('자리 수 + 후행 숫자', () => {
    it('자리 수와 후행 숫자를 함께 변환한다', () => {
      expect(autoJari('4자리 5678')).toBe('네자리 오 . 육 . 칠 . 팔');
      expect(autoJari('4자리 1234')).toBe('네자리 일 . 이 . 삼 . 사');
    });

    it('0이 포함된 후행 숫자를 변환한다', () => {
      expect(autoJari('4자리 1023')).toBe('네자리 일 . 영 . 이 . 삼');
      expect(autoJari('4자리 0000')).toBe('네자리 영 . 영 . 영 . 영');
    });
  });

  describe('접두사 포함', () => {
    it('끝 자리 패턴을 변환한다', () => {
      expect(autoJari('끝 4자리 5678')).toBe('끝 네자리 오 . 육 . 칠 . 팔');
    });

    it('마지막 자리 패턴을 변환한다', () => {
      expect(autoJari('마지막 2자리')).toBe('마지막 두자리');
    });
  });

  describe('실제 문맥', () => {
    it('계좌번호 안내 문맥을 변환한다', () => {
      expect(autoJari('등록된 계좌: 국민은행 끝 4자리 5678')).toBe(
        '등록된 계좌: 국민은행 끝 네자리 오 . 육 . 칠 . 팔'
      );
    });

    it('비밀번호 안내 문맥을 변환한다', () => {
      expect(autoJari('비밀번호는 6자리입니다.')).toBe('비밀번호는 여섯자리 입니다.');
    });
  });

  describe('False Positive 방지', () => {
    it('자리가 포함되지 않은 숫자는 변환하지 않는다', () => {
      expect(autoJari('12345')).toBe('12345');
    });

    it('단독 숫자는 변환하지 않는다', () => {
      expect(autoTag('5678', { enabledTags: ['jari'] })).toBe('5678');
    });
  });

  describe('복수 자리', () => {
    it('여러 자리 표현을 모두 변환한다', () => {
      const result = autoJari('앞 2자리와 뒤 4자리');
      expect(result).toContain('두자리');
      expect(result).toContain('네자리');
    });
  });
});
