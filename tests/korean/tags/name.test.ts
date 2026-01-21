import { name } from '../../../src/korean/tags/name';

describe('name', () => {
  describe('기본 동작', () => {
    it('이름을 한 글자씩 끊어서 반환한다', () => {
      expect(name('김형우')).toBe('김 . 형 . 우');
    });

    it('두 글자 이름도 처리한다', () => {
      expect(name('김철')).toBe('김 . 철');
    });

    it('네 글자 이름도 처리한다', () => {
      expect(name('남궁민수')).toBe('남 . 궁 . 민 . 수');
    });
  });

  describe('커스텀 구분자', () => {
    it('커스텀 구분자를 사용할 수 있다', () => {
      expect(name('홍길동', ', ')).toBe('홍, 길, 동');
    });

    it('빈 구분자도 사용할 수 있다', () => {
      expect(name('홍길동', '')).toBe('홍길동');
    });

    it('공백 구분자를 사용할 수 있다', () => {
      expect(name('홍길동', ' ')).toBe('홍 길 동');
    });
  });

  describe('공백 처리', () => {
    it('앞뒤 공백을 제거한다', () => {
      expect(name(' 김형우 ')).toBe('김 . 형 . 우');
    });

    it('이미 공백이 포함된 이름도 정규화한다', () => {
      expect(name('김 형우')).toBe('김 . 형 . 우');
    });

    it('여러 공백도 정규화한다', () => {
      expect(name('김  형  우')).toBe('김 . 형 . 우');
    });

    it('공백만 있는 문자열은 빈 문자열을 반환한다', () => {
      expect(name('   ')).toBe('');
    });
  });

  describe('영문 처리', () => {
    it('영문 이름은 분리하지 않고 그대로 유지한다', () => {
      expect(name('John')).toBe('John');
    });

    it('연속된 영문은 하나의 단어로 유지한다', () => {
      expect(name('Michael')).toBe('Michael');
    });

    it('한글 뒤에 영문이 오면 분리한다', () => {
      expect(name('김John')).toBe('김 . John');
    });

    it('영문 뒤에 한글이 오면 분리한다', () => {
      expect(name('John김')).toBe('John . 김');
    });

    it('한글-영문-한글 혼합을 처리한다', () => {
      expect(name('김John호')).toBe('김 . John . 호');
    });

    it('영문-한글-영문 혼합을 처리한다', () => {
      expect(name('John김Smith')).toBe('John . 김 . Smith');
    });
  });

  describe('숫자/특수문자 처리', () => {
    it('숫자가 포함된 이름도 글자별로 분리한다', () => {
      expect(name('김1호')).toBe('김 . 1 . 호');
    });

    it('연속된 숫자도 각각 분리한다', () => {
      expect(name('김12호')).toBe('김 . 1 . 2 . 호');
    });

    it('특수문자도 분리한다', () => {
      expect(name('김!호')).toBe('김 . ! . 호');
    });

    it('영문과 숫자가 함께 있으면 숫자에서 분리한다', () => {
      expect(name('John3Kim')).toBe('John . 3 . Kim');
    });
  });

  describe('엣지 케이스', () => {
    it('빈 문자열은 그대로 반환한다', () => {
      expect(name('')).toBe('');
    });

    it('한 글자는 그대로 반환한다', () => {
      expect(name('김')).toBe('김');
    });

    it('영문 한 글자도 그대로 반환한다', () => {
      expect(name('A')).toBe('A');
    });

    it('숫자 한 글자도 그대로 반환한다', () => {
      expect(name('1')).toBe('1');
    });
  });
});
