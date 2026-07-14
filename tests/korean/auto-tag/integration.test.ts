import { autoTag } from '../../../src/korean/auto-tag';

/**
 * 통합 테스트
 *
 * 실제 사용 시나리오를 테스트합니다.
 */
describe('autoTag 통합 테스트', () => {
  describe('실제 사용 시나리오', () => {
    it('주문 확인 메시지', () => {
      const text = '주문이 완료되었습니다. 결제금액: 49900원, 연락처: 010-1234-5678';
      const result = autoTag(text);

      expect(result).toContain('사만구천구백원');
      expect(result).toContain('공 . 일 . 공, 일 . 이 . 삼 . 사, 오 . 육 . 칠 . 팔');
    });

    it('일정 안내 메시지', () => {
      const text = '다음 회의는 2024-01-15T14:30에 예정되어 있습니다.';
      const result = autoTag(text);

      expect(result).toContain('이천이십사년 일월 십오일 오후 두시 삼십분');
    });

    it('고객 정보 메시지', () => {
      const text = '생년월일: 19940616, 연락처: 010-9876-5432';
      const result = autoTag(text);

      expect(result).toContain('천구백구십사년 유월 십육일');
      expect(result).toContain('공 . 일 . 공, 구 . 팔 . 칠 . 육, 오 . 사 . 삼 . 이');
    });

    it('결제 안내 메시지', () => {
      const text = '총 결제금액 150000원이 카드로 승인되었습니다.';
      const result = autoTag(text);

      expect(result).toContain('십오만원');
    });

    it('대기 시간 안내', () => {
      const text = '예상 대기시간은 약 15m입니다.';
      const result = autoTag(text);

      expect(result).toContain('십오분');
    });

    it('순위 안내', () => {
      const text = '현재 순위: 3등, 점수: 95점';
      const result = autoTag(text);

      expect(result).toContain('삼등');
      expect(result).toContain('구십오점');
    });

    it('수량 안내', () => {
      const text = '장바구니에 5개 상품이 담겨 있습니다.';
      const result = autoTag(text);

      expect(result).toContain('다섯개');
    });
  });

  describe('복잡한 문장', () => {
    it('다양한 패턴이 섞인 문장', () => {
      const text =
        '고객님(1990년생), 2024-01-15T10:00 예약이 확정되었습니다. 금액: 50000원, 문의: 1588-1234';
      const result = autoTag(text);

      expect(result).toContain('천구백구십년생'); // 1990년생
      expect(result).toContain('이천이십사년 일월 십오일 오전 열시'); // datetime
      expect(result).toContain('오만원'); // money
      expect(result).toContain('일 . 오 . 팔 . 팔 . 일 . 이 . 삼 . 사'); // phone
    });

    it('긴 문단', () => {
      const text = `
        안녕하세요, 고객님.
        2024-01-15T14:30에 예약하신 상품이 준비되었습니다.
        총 금액은 125000원이며, 3개입니다.
        문의사항이 있으시면 010-1234-5678로 연락 주세요.
        감사합니다.
      `;
      const result = autoTag(text);

      expect(result).toContain('이천이십사년 일월 십오일 오후 두시 삼십분');
      expect(result).toContain('십이만오천원');
      expect(result).toContain('세개');
      expect(result).toContain('공 . 일 . 공, 일 . 이 . 삼 . 사, 오 . 육 . 칠 . 팔');
    });
  });

  describe('경계 케이스', () => {
    it('연속된 패턴', () => {
      const text = '010-1234-5678 / 010-8765-4321';
      const result = autoTag(text, { enabledTags: ['phone'] });

      expect(result).toContain('공 . 일 . 공, 일 . 이 . 삼 . 사, 오 . 육 . 칠 . 팔');
      expect(result).toContain('공 . 일 . 공, 팔 . 칠 . 육 . 오, 사 . 삼 . 이 . 일');
    });

    it('중첩 가능한 패턴 (우선순위)', () => {
      // datetime이 date + time보다 우선
      const text = '2024-01-15T14:30';
      const result = autoTag(text);

      // 한 번에 datetime으로 처리되어야 함
      expect(result).toContain('오후 두시 삼십분'); // 시간이 포함되어야 함
    });

    it('패턴 사이의 텍스트 보존', () => {
      const text = '전화: 010-1234-5678, 팩스: 02-123-4567';
      const result = autoTag(text, { enabledTags: ['phone'] });

      expect(result).toContain(', 팩스: ');
    });
  });

  describe('특수 문자 처리', () => {
    it('괄호 안의 패턴', () => {
      const text = '연락처(010-1234-5678)로 문의';
      const result = autoTag(text, { enabledTags: ['phone'] });

      expect(result).toBe('연락처(공 . 일 . 공, 일 . 이 . 삼 . 사, 오 . 육 . 칠 . 팔)로 문의');
    });

    it('따옴표 안의 패턴', () => {
      const text = '"5000원"이 결제되었습니다';
      const result = autoTag(text, { enabledTags: ['money'] });

      expect(result).toBe('"오천원"이 결제되었습니다');
    });

    it('특수 기호가 포함된 텍스트', () => {
      const text = '★ 특가 ★ 9900원!';
      const result = autoTag(text, { enabledTags: ['money'] });

      expect(result).toBe('★ 특가 ★ 구천구백원!');
    });
  });

  describe('유니코드 처리', () => {
    it('이모지가 포함된 텍스트', () => {
      const text = '🎉 축하합니다! 10000원 당첨! 🎊';
      const result = autoTag(text, { enabledTags: ['money'] });

      expect(result).toBe('🎉 축하합니다! 일만원 당첨! 🎊');
    });

    it('한자가 포함된 텍스트', () => {
      const text = '金額: 5000원';
      const result = autoTag(text, { enabledTags: ['money'] });

      expect(result).toBe('金額: 오천원');
    });
  });
});
