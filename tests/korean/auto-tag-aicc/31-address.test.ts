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

  describe('완전한 도로명주소 + 괄호 패턴 (콤마 없는 경우)', () => {
    // 괄호 안에 "동" 뒤에 콤마 없이 건물명이 오거나, 동만 있는 경우
    it('도로명 + 괄호(동 건물명) - 콤마 없음: 엘지대로 111 (엘지동 동문굿모닝힐2차아파트)', () => {
      const input = '엘지대로 111 (엘지동 동문굿모닝힐2차아파트)';
      const result = autoTag(input);
      expect(result).toBe('엘지대로 백십일');
    });

    it('도로명(숫자+길) + 괄호(동만) - 콤마 없음: 엘지로99길 11-1 (엘지동 )', () => {
      const input = '엘지로99길 11-1 (엘지동 )';
      const result = autoTag(input);
      expect(result).toBe('엘지로구십구길 십일 다시 일');
    });

    it('도로명(숫자+번길) + 괄호(동 건물명) - 콤마 없음: 엘지로999번길 10 (엘지동 한성아파트)', () => {
      const input = '엘지로999번길 10 (엘지동 한성아파트)';
      const result = autoTag(input);
      expect(result).toBe('엘지로구백구십구번길 십');
    });

    it('도로명 + 괄호(동 건물명) - 콤마 없음, 공백 포함: 엘지로 114-31 (엘지동 금호 베스트빌)', () => {
      const input = '엘지로 114-31 (엘지동 금호 베스트빌)';
      const result = autoTag(input);
      expect(result).toBe('엘지로 백십사 다시 삼십일');
    });

    it('도로명(숫자+번길) + 괄호(동 건물명+숫자) - 콤마 없음: 엘지로512번길 52 (엘지동 엘지아파트1단지)', () => {
      const input = '엘지로512번길 52 (엘지동 엘지아파트1단지)';
      const result = autoTag(input);
      expect(result).toBe('엘지로오백십이번길 오십이');
    });

    it('N-N + 괄호(동,건물명) - 콤마 있음: 108-2004 (엘지동, 엘지센텀퍼스트)', () => {
      const input = '108-2004 (엘지동, 엘지센텀퍼스트)';
      const result = autoTag(input);
      expect(result).toBe('백팔 다시 이천사');
    });

    it('한글+숫자+길 + 괄호(읍): 엘지1길 19-8, (엘지읍)', () => {
      const input = '엘지1길 19-8, (엘지읍)';
      const result = autoTag(input);
      expect(result).toBe('엘지일길 십구 다시 팔');
    });
  });

  describe('N동N 형식 (호 없음)', () => {
    it('N동N - 호 없이 동+숫자: 101동1512', () => {
      const input = '101동1512';
      const result = address(input);
      expect(result).toBe('백일동 천오백십이');
    });

    it('N동N - 호 없이 동+숫자 (공백): 101동 1512', () => {
      const input = '101동 1512';
      const result = address(input);
      // 이 경우는 N동 + 단독숫자로 처리됨
      expect(result).toBe('백일동 천오백십이');
    });
  });

  // =============================================
  // 확장 테스트: 다양한 한국 주소 케이스
  // =============================================

  describe('아파트 주소 - 다양한 동/호 조합', () => {
    it('한자리 동 + 세자리 호: 1동 101호', () => {
      const input = '1동 101호';
      expect(address(input)).toBe('일동 백일호');
    });

    it('두자리 동 + 네자리 호: 12동 1234호', () => {
      const input = '12동 1234호';
      expect(address(input)).toBe('십이동 천이백삼십사호');
    });

    it('세자리 동 + 두자리 호: 101동 12호', () => {
      const input = '101동 12호';
      expect(address(input)).toBe('백일동 십이호');
    });

    it('네자리 동 + 네자리 호: 1234동 5678호', () => {
      const input = '1234동 5678호';
      expect(address(input)).toBe('천이백삼십사동 오천육백칠십팔호');
    });

    it('동호 붙어있는 경우: 101동101호', () => {
      const input = '101동101호';
      expect(address(input)).toBe('백일동 백일호');
    });

    it('동호 공백 있는 경우: 101동  101호', () => {
      const input = '101동  101호';
      expect(address(input)).toBe('백일동 백일호');
    });

    it('건물명 + 동호: 래미안아파트 102동 1503호', () => {
      const input = '래미안아파트 102동 1503호';
      expect(address(input)).toBe('래미안아파트 백이동 천오백삼호');
    });

    it('복합 건물명 + 동호: 힐스테이트 더 퍼스트 101동 2201호', () => {
      const input = '힐스테이트 더 퍼스트 101동 2201호';
      expect(address(input)).toBe('힐스테이트 더 퍼스트 백일동 이천이백일호');
    });
  });

  describe('오피스텔/상가 주소 - 층/호 조합', () => {
    it('층 + 호: 5층 501호', () => {
      const input = '5층 501호';
      expect(address(input)).toBe('오층 오백일호');
    });

    it('층만: 지상 3층', () => {
      const input = '지상 3층';
      expect(address(input)).toBe('지상 삼층');
    });

    it('두자리 층: 15층', () => {
      const input = '15층';
      expect(address(input)).toBe('십오층');
    });

    it('층 + 호 붙어있음: 3층301호', () => {
      const input = '3층301호';
      expect(address(input)).toBe('삼층삼백일호');
    });

    it('건물명 + 층 + 호: 강남타워 12층 1201호', () => {
      const input = '강남타워 12층 1201호';
      expect(address(input)).toBe('강남타워 십이층 천이백일호');
    });
  });

  describe('도로명주소 - 다양한 형태', () => {
    it('대로: 테헤란대로 521', () => {
      const input = '테헤란대로 521';
      expect(address(input)).toBe('테헤란대로 오백이십일');
    });

    it('로: 강남대로 123', () => {
      const input = '강남대로 123';
      expect(address(input)).toBe('강남대로 백이십삼');
    });

    it('길: 역삼로3길 15', () => {
      const input = '역삼로3길 15';
      expect(address(input)).toBe('역삼로삼길 십오');
    });

    it('번길: 역삼로3번길 15', () => {
      const input = '역삼로3번길 15';
      expect(address(input)).toBe('역삼로삼번길 십오');
    });

    it('도로명 + 번지 + 동호: 테헤란로 123 101동 1501호', () => {
      const input = '테헤란로 123 101동 1501호';
      expect(address(input)).toBe('테헤란로 백이십삼 백일동 천오백일호');
    });

    it('도로명 + 번지-부번지: 강남대로 123-45', () => {
      const input = '강남대로 123-45';
      expect(address(input)).toBe('강남대로 백이십삼 다시 사십오');
    });
  });

  describe('지번주소 - 동/리 + 번지', () => {
    it('동 + 번지: 역삼동 123-45', () => {
      const input = '역삼동 123-45';
      expect(address(input)).toBe('역삼동 백이십삼 다시 사십오');
    });

    it('리 + 번지: 장기리 567-89', () => {
      const input = '장기리 567-89';
      expect(address(input)).toBe('장기리 오백육십칠 다시 팔십구');
    });

    it('동 + 번지(부번지 없음): 삼성동 123', () => {
      const input = '삼성동 123';
      expect(address(input)).toBe('삼성동 백이십삼');
    });
  });

  describe('복합 주소 - 여러 요소 조합', () => {
    it('도로명 + 건물명 + 동호 + 괄호: 테헤란로 123 래미안 101동 1501호 (역삼동, 래미안아파트)', () => {
      const input = '테헤란로 123 래미안 101동 1501호 (역삼동, 래미안아파트)';
      expect(address(input)).toBe('테헤란로 백이십삼 래미안 백일동 천오백일호');
    });

    it('지번 + 건물명 + 층 + 호: 역삼동 123-45 강남빌딩 5층 501호', () => {
      const input = '역삼동 123-45 강남빌딩 5층 501호';
      expect(address(input)).toBe('역삼동 백이십삼 다시 사십오 강남빌딩 오층 오백일호');
    });

    it('전체 주소: 서울특별시 강남구 테헤란로 123 101동 1501호', () => {
      const input = '서울특별시 강남구 테헤란로 123 101동 1501호';
      expect(address(input)).toBe('서울특별시 강남구 테헤란로 백이십삼 백일동 천오백일호');
    });
  });

  describe('대괄호 처리', () => {
    it('대괄호 안의 내용 제거: 101동 1501호 [역삼동]', () => {
      const input = '101동 1501호 [역삼동]';
      expect(address(input)).toBe('백일동 천오백일호');
    });

    it('전각 대괄호 안의 내용 제거: 101동 1501호 ［역삼동］', () => {
      const input = '101동 1501호 ［역삼동］';
      expect(address(input)).toBe('백일동 천오백일호');
    });

    it('대괄호와 소괄호 동시 사용: 101동 1501호 (역삼동) [래미안]', () => {
      const input = '101동 1501호 (역삼동) [래미안]';
      expect(address(input)).toBe('백일동 천오백일호');
    });
  });

  describe('빌라/연립주택 주소', () => {
    it('빌라 주소: 행복빌라 3동 201호', () => {
      const input = '행복빌라 3동 201호';
      expect(address(input)).toBe('행복빌라 삼동 이백일호');
    });

    it('연립주택: 가나다연립 101호', () => {
      const input = '가나다연립 101호';
      expect(address(input)).toBe('가나다연립 백일호');
    });

    it('다세대: ABC빌라 B동 302호', () => {
      const input = 'ABC빌라 B동 302호';
      // B동은 영문이므로 그대로, 호수만 변환
      expect(address(input)).toBe('ABC빌라 B동 삼백이호');
    });
  });

  describe('상업시설 주소', () => {
    it('상가: 강남상가 1층 101호', () => {
      const input = '강남상가 1층 101호';
      expect(address(input)).toBe('강남상가 일층 백일호');
    });

    it('오피스: 테헤란빌딩 10층 1001호', () => {
      const input = '테헤란빌딩 10층 1001호';
      expect(address(input)).toBe('테헤란빌딩 십층 천일호');
    });

    it('지하상가: 지하 1층 B101호', () => {
      const input = '지하 1층 B101호';
      expect(address(input)).toBe('지하 일층 B백일호');
    });
  });

  describe('특수 케이스', () => {
    it('0이 포함된 동호수: 101동 1001호', () => {
      const input = '101동 1001호';
      expect(address(input)).toBe('백일동 천일호');
    });

    it('연속된 숫자: 111동 1111호', () => {
      const input = '111동 1111호';
      expect(address(input)).toBe('백십일동 천백십일호');
    });

    it('다양한 구분자 혼합: 101동/1501호', () => {
      const input = '101동/1501호';
      expect(address(input)).toBe('백일동 천오백일호');
    });

    it('쉼표로 구분: 101동, 1501호', () => {
      const input = '101동, 1501호';
      expect(address(input)).toBe('백일동 천오백일호');
    });

    it('번지-호: 123-4호', () => {
      const input = '123-4호';
      expect(address(input)).toBe('백이십삼 다시 사호');
    });

    it('다중 괄호: 아파트 101동 1501호 (역삼동) (래미안)', () => {
      const input = '아파트 101동 1501호 (역삼동) (래미안)';
      expect(address(input)).toBe('아파트 백일동 천오백일호');
    });
  });

  describe('autoTag 통합 테스트 - 확장', () => {
    it('도로명주소 + 괄호(동, 건물명): 테헤란로 123 (역삼동, 래미안)', () => {
      const input = '테헤란로 123 (역삼동, 래미안)';
      const result = autoTag(input);
      expect(result).toBe('테헤란로 백이십삼');
    });

    it('도로명주소 + 괄호(동 건물명) 콤마없음: 강남대로 456 (삼성동 타워팰리스)', () => {
      const input = '강남대로 456 (삼성동 타워팰리스)';
      const result = autoTag(input);
      expect(result).toBe('강남대로 사백오십육');
    });

    it('번길 주소 + 괄호: 역삼로15번길 23 (역삼동 현대아파트)', () => {
      const input = '역삼로15번길 23 (역삼동 현대아파트)';
      const result = autoTag(input);
      expect(result).toBe('역삼로십오번길 이십삼');
    });

    it('복잡한 도로명 + 동호 + 괄호: 테헤란로87길 12 101동 1501호 (역삼동, 래미안아파트)', () => {
      const input = '테헤란로87길 12 101동 1501호 (역삼동, 래미안아파트)';
      const result = autoTag(input);
      // 괄호는 제거되고 동호수는 변환됨
      expect(result).not.toContain('(');
      expect(result).not.toContain(')');
      expect(result).toContain('백일동');
    });

    it('읍면 주소 + 괄호: 장기로 123 (장기면 행복마을)', () => {
      const input = '장기로 123 (장기면 행복마을)';
      const result = autoTag(input);
      expect(result).toBe('장기로 백이십삼');
    });
  });

  describe('경계 케이스', () => {
    it('빈 문자열', () => {
      expect(address('')).toBe('');
    });

    it('공백만 있는 경우', () => {
      expect(address('   ')).toBe('   ');
    });

    it('숫자 없는 주소', () => {
      const input = '서울시 강남구 역삼동';
      expect(address(input)).toBe('서울시 강남구 역삼동');
    });

    it('동호수 없이 괄호만: (역삼동, 래미안)', () => {
      const input = '(역삼동, 래미안)';
      expect(address(input)).toBe('');
    });

    it('매우 긴 호수: 9999호', () => {
      const input = '9999호';
      expect(address(input)).toBe('구천구백구십구호');
    });

    it('매우 긴 동수: 9999동', () => {
      const input = '9999동';
      expect(address(input)).toBe('구천구백구십구동');
    });
  });

  describe('주소 줄에서 모든 괄호 제거', () => {
    it('도로명주소 + 건물명 괄호 + 호수: 서울 엘지구 엘지로 99길 11-1 (휴먼시아, 센트럴파크) 201호', () => {
      const input = '서울 엘지구 엘지로 99길 11-1 (휴먼시아, 센트럴파크) 201호';
      const result = autoTag(input);
      // 괄호 안 건물명이 제거되어야 함
      expect(result).not.toContain('(');
      expect(result).not.toContain(')');
      expect(result).not.toContain('휴먼시아');
      expect(result).not.toContain('센트럴파크');
      // 호수는 변환되어야 함
      expect(result).toContain('이백일호');
    });

    it('도로명주소 + 숫자 괄호 + 한글 + 숫자 괄호: 서울시 강남구 도안대로 (12394) ㅁㅁ ㅁ(124124)', () => {
      const input = '서울시 강남구 도안대로 (12394) ㅁㅁ ㅁ(124124)';
      const result = autoTag(input);
      // 괄호 안 숫자가 제거되어야 함
      expect(result).not.toContain('(');
      expect(result).not.toContain(')');
      expect(result).not.toContain('12394');
      expect(result).not.toContain('124124');
    });

    it('층수 정보 괄호는 유지: 103동 1502호 (15층/25층)', () => {
      const input = '103동 1502호 (15층/25층)';
      const result = autoTag(input);
      // 층수 정보는 유지되어야 함
      expect(result).toContain('(');
      expect(result).toContain('층');
    });

    it('혼합 케이스: 테헤란로 123 101동 1501호 (역삼동, 래미안) (15층/25층)', () => {
      const input = '테헤란로 123 101동 1501호 (역삼동, 래미안) (15층/25층)';
      const result = autoTag(input);
      // 역삼동, 래미안 괄호는 제거되고, 층수 괄호는 유지
      expect(result).not.toContain('역삼동');
      expect(result).not.toContain('래미안');
      expect(result).toContain('층');
    });

    it('시/구 + 여러 괄호: 서울시 (가나다) 강남구 메롱아파트 (가나다라) 201-1123 102호', () => {
      const input = '서울시 (가나다) 강남구 메롱아파트 (가나다라) 201-1123 102호';
      const result = autoTag(input);
      expect(result).not.toContain('(');
      expect(result).not.toContain(')');
      expect(result).not.toContain('가나다');
    });

    it('동 + 여러 괄호: 강남 (가나다) 1234-131동 (가나다) 19호', () => {
      const input = '강남 (가나다) 1234-131동 (가나다) 19호';
      const result = autoTag(input);
      expect(result).not.toContain('(');
      expect(result).not.toContain(')');
      expect(result).not.toContain('가나다');
    });

    it('도로명 + 괄호(길 이름): 대전시 대덕구 남산로 (김치길)', () => {
      const input = '대전시 대덕구 남산로 (김치길)';
      const result = autoTag(input);
      expect(result).not.toContain('(');
      expect(result).not.toContain(')');
      expect(result).not.toContain('김치길');
    });

    it('대괄호도 제거: 서울시 [가나다] 강남구 메롱아파트 [가나다라] 201-1123 102호', () => {
      const input = '서울시 [가나다] 강남구 메롱아파트 [가나다라] 201-1123 102호';
      const result = autoTag(input);
      expect(result).not.toContain('[');
      expect(result).not.toContain(']');
      expect(result).not.toContain('가나다');
    });

    it('대괄호 + 도로명: 대전시 대덕구 남산로 [김치길]', () => {
      const input = '대전시 대덕구 남산로 [김치길]';
      const result = autoTag(input);
      expect(result).not.toContain('[');
      expect(result).not.toContain(']');
      expect(result).not.toContain('김치길');
    });

    it('소괄호와 대괄호 혼합: 강남 (가나다) 1234-131동 [가나다] 19호', () => {
      const input = '강남 (가나다) 1234-131동 [가나다] 19호';
      const result = autoTag(input);
      expect(result).not.toContain('(');
      expect(result).not.toContain(')');
      expect(result).not.toContain('[');
      expect(result).not.toContain(']');
      expect(result).not.toContain('가나다');
    });

    it('도로명+숫자 붙어있는 경우: 성남 중원구 금광로11 (가나다) 108-2001', () => {
      const input = '성남 중원구 금광로11 (가나다) 108-2001';
      const result = autoTag(input);
      expect(result).not.toContain('(');
      expect(result).not.toContain(')');
      expect(result).not.toContain('가나다');
    });

    it('도로명+숫자 붙어있는 경우 (괄호 없음): 성남 중원구 금광로11 108-2001', () => {
      const input = '성남 중원구 금광로11 108-2001';
      const result = autoTag(input);
      // 주소로 인식되어야 함 (금광로11 패턴)
      expect(result).toContain('금광로');
    });

    it('도로명 숫자 띄어쓰기: 성남 중원구 금광로 11 [금광동, e편한세상] 108-2001', () => {
      const input = '성남 중원구 금광로 11 [금광동, e편한세상] 108-2001';
      const result = autoTag(input);
      expect(result).not.toContain('[');
      expect(result).not.toContain(']');
      expect(result).not.toContain('금광동');
    });

    it('긴 괄호 내용도 선형 시간으로 처리한다', () => {
      const input = `서울시 강남구 테헤란로 123 (${'가나다'.repeat(1000)}) 101동 1501호`;
      const result = autoTag(input);
      expect(result).not.toContain('(');
      expect(result).not.toContain(')');
      expect(result).toContain('백일동 천오백일호');
    });
  });
});
