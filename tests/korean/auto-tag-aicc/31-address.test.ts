import { autoTag } from '../../../src/korean/auto-tag';
import { address } from '../../../src/korean/tags/address';

/**
 * AICC 시나리오 31: 주소 변환 안내
 *
 * 배송 주소, 아파트 주소 등에서 괄호 안의 내용을 무시하고
 * 동/호/층 번호를 한글로 변환하는 시나리오입니다.
 *
 * 요청사항:
 * - 괄호 안의 내용 (예: 엘지동, 우성베스토피아) 읽지 않음
 * - N동 → 한자어 수사 + 동 (예: 102동 → 백이동)
 * - N호 → 한자어 수사 + 호 (예: 1101호 → 천백일호)
 * - N-M → 한자어 수사 다시 한자어 수사 (예: 611-9 → 육백십일 다시 구)
 */
describe('AICC 시나리오 31: 주소 변환', () => {
  describe('address 태그 함수 테스트', () => {
    it('예시 1: 우성베스토피아 102동 1101호 ( 엘지동, 우성베스토피아 )', () => {
      const input = '우성베스토피아 102동 1101호 ( 엘지동, 우성베스토피아 )';
      const expected = '우성베스토피아 백이동 천백일호';
      expect(address(input)).toBe(expected);
    });

    it('예시 2: 113동2602호(엘지동, 더샵 염주센트럴파크)', () => {
      const input = '113동2602호(엘지동, 더샵 염주센트럴파크)';
      const expected = '백십삼동 이천육백이호';
      expect(address(input)).toBe(expected);
    });

    it('예시 3: 엘지주공아파트 101동 1504호 ( 엘지동, 주공아파트 )', () => {
      const input = '엘지주공아파트 101동 1504호 ( 엘지동, 주공아파트 )';
      const expected = '엘지주공아파트 백일동 천오백사호';
      expect(address(input)).toBe(expected);
    });

    it('예시 4: 동아 아파트 3동 204호 ( 엘지동, 동아아파트 )', () => {
      const input = '동아 아파트 3동 204호 ( 엘지동, 동아아파트 )';
      const expected = '동아 아파트 삼동 이백사호';
      expect(address(input)).toBe(expected);
    });

    it('예시 5: 202호', () => {
      const input = '202호';
      const expected = '이백이호';
      expect(address(input)).toBe(expected);
    });

    it('예시 6: 1011동 24호(엘지동, 엘지아이파크)', () => {
      const input = '1011동 24호(엘지동, 엘지아이파크)';
      const expected = '천십일동 이십사호';
      expect(address(input)).toBe(expected);
    });

    it('예시 7: 611-9 원조닭한마리 1층', () => {
      const input = '611-9 원조닭한마리 1층';
      const expected = '육백십일 다시 구 원조닭한마리 일층';
      expect(address(input)).toBe(expected);
    });

    it('예시 8: 102-1808', () => {
      const input = '102-1808';
      const expected = '백이 다시 천팔백팔';
      expect(address(input)).toBe(expected);
    });

    it('예시 9: 210-405호(엘지동, 엘지주공아파트)', () => {
      const input = '210-405호(엘지동, 엘지주공아파트)';
      const expected = '이백십 다시 사백오호';
      expect(address(input)).toBe(expected);
    });

    it('예시 10: 33, (엘지동, 청명마을삼성아파트)439동 1006호', () => {
      const input = '33, (엘지동, 청명마을삼성아파트)439동 1006호';
      const expected = '삼십삼 사백삼십구동 천육호';
      expect(address(input)).toBe(expected);
    });

    it('예시 11: 1층 111-2, 112호 (엘지동, 엘지그라시움아파트상가4동)', () => {
      const input = '1층 111-2, 112호 (엘지동, 엘지그라시움아파트상가4동)';
      const expected = '일층 백십일 다시 이 백십이호';
      expect(address(input)).toBe(expected);
    });
  });

  describe('특이 케이스 (특수문자 묵음 처리)', () => {
    it('특이 예시 1: 104/4122호 - 슬래시 묵음 처리', () => {
      const input = '104/4122호';
      const expected = '백사 사천백이십이호';
      expect(address(input)).toBe(expected);
    });

    it('특이 예시 2: , 102동 304호 - 앞쪽 쉼표 제거', () => {
      const input = ', 102동 304호';
      const expected = '백이동 삼백사호';
      expect(address(input)).toBe(expected);
    });

    it('특이 예시 3: 국수역 국수차？주재(국수역) - 물음표 묵음 처리', () => {
      const input = '국수역 국수차？주재(국수역)';
      const expected = '국수역 국수차 주재';
      expect(address(input)).toBe(expected);
    });
  });

  describe('autoTag 오토태깅 통합 테스트', () => {
    it('괄호가 포함된 아파트 주소 오토태깅', () => {
      // 오토태깅에서는 기본 패턴만 처리됨
      const input = '우성베스토피아 102동 1101호 ( 엘지동, 우성베스토피아 )';
      const result = autoTag(input);
      // 오토태깅으로 처리되면 괄호 내용이 제거되어야 함
      expect(result).toBe('우성베스토피아 백이동 천백일호');
    });

    it('괄호 없는 단순 동호수 오토태깅', () => {
      // 괄호가 없는 경우는 buildingNumber, roomNumber 패턴으로 처리됨
      const input = '102동 1101호';
      const result = autoTag(input);
      // 기존 buildingNumber, roomNumber 패턴이 처리
      expect(result).toContain('동');
      expect(result).toContain('호');
    });

    it('복잡한 주소 오토태깅 - 괄호 시작', () => {
      const input = '33, (엘지동, 청명마을삼성아파트)439동 1006호';
      const result = autoTag(input);
      // 괄호가 있는 패턴이므로 address 패턴으로 처리됨
      expect(result).toBe('삼십삼 사백삼십구동 천육호');
    });
  });

  describe('manualTag 매뉴얼 태그 테스트', () => {
    // manualTag는 별도의 import가 필요하므로 address 함수 직접 테스트
    it('address 함수로 매뉴얼 태그 처리 가능', () => {
      // 매뉴얼 태그 형식: address(주소내용)
      // 실제 manualTag 함수에서는 이렇게 처리됨
      const addressValue = '우성베스토피아 102동 1101호 ( 엘지동, 우성베스토피아 )';
      const result = address(addressValue);
      expect(result).toBe('우성베스토피아 백이동 천백일호');
    });
  });
});
