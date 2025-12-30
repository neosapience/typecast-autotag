import { name } from '../../../src/korean/tags/name';

describe('name', () => {
  describe('기본 동작', () => {
    it('이름을 한 글자씩 끊어서 반환한다', () => {
      expect(name('김형우')).toBe('김 형 우');
    });

    it('두 글자 이름도 처리한다', () => {
      expect(name('김철')).toBe('김 철');
    });

    it('네 글자 이름도 처리한다', () => {
      expect(name('남궁민수')).toBe('남 궁 민 수');
    });
  });

  describe('커스텀 구분자', () => {
    it('커스텀 구분자를 사용할 수 있다', () => {
      expect(name('홍길동', ', ')).toBe('홍, 길, 동');
    });

    it('빈 구분자도 사용할 수 있다', () => {
      expect(name('홍길동', '')).toBe('홍길동');
    });
  });

  describe('엣지 케이스', () => {
    it('빈 문자열은 그대로 반환한다', () => {
      expect(name('')).toBe('');
    });

    it('한 글자는 그대로 반환한다', () => {
      expect(name('김')).toBe('김');
    });
  });
});
