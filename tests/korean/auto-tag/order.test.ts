import { autoTag, autoOrder } from '../../../src/korean/auto-tag';

describe('autoTag - order (순서 자동 태깅)', () => {
  describe('N번째 형식', () => {
    it('기본 순서를 변환한다', () => {
      expect(autoOrder('1번째')).toBe('첫 번째');
      expect(autoOrder('2번째')).toBe('두 번째');
      expect(autoOrder('3번째')).toBe('세 번째');
    });

    it('10 이상 순서를 변환한다', () => {
      expect(autoOrder('10번째')).toBe('열 번째');
      expect(autoOrder('21번째')).toBe('스물 한 번째'); // order 함수의 실제 출력
      expect(autoOrder('99번째')).toBe('아흔 아홉 번째');
    });

    it('100 이상 순서를 변환한다', () => {
      expect(autoOrder('100번째')).toBe('백 번째');
      expect(autoOrder('1000번째')).toBe('천 번째');
    });
  });

  describe('N등 형식 (한자어 수사)', () => {
    it('등수를 변환한다', () => {
      expect(autoOrder('1등')).toBe('일 등');
      expect(autoOrder('2등')).toBe('이 등');
      expect(autoOrder('10등')).toBe('십 등');
    });
  });

  describe('N위 형식 (한자어 수사)', () => {
    it('순위를 변환한다', () => {
      expect(autoOrder('1위')).toBe('일 위');
      expect(autoOrder('5위')).toBe('오 위');
      expect(autoOrder('100위')).toBe('백 위');
    });
  });

  describe('복수 순서', () => {
    it('여러 순서를 모두 변환한다', () => {
      const result = autoOrder('1등부터 10등까지');
      expect(result).toContain('일 등');
      expect(result).toContain('십 등');
    });
  });

  describe('False Positive 방지', () => {
    it('접미사 없는 숫자는 변환하지 않는다', () => {
      expect(autoOrder('숫자 5')).toBe('숫자 5');
    });

    it('금액은 변환하지 않는다', () => {
      expect(autoTag('5000원', { enabledTags: ['order'] })).toBe('5000원');
    });
  });

  describe('문맥 내 순서', () => {
    it('문장 내 순서를 변환한다', () => {
      expect(autoOrder('우리 팀이 1등을 차지했습니다')).toBe('우리 팀이 일 등 을 차지했습니다');
    });

    it('괄호 안 순서를 변환한다', () => {
      expect(autoOrder('(3번째)')).toBe('(세 번째)');
    });
  });
});
