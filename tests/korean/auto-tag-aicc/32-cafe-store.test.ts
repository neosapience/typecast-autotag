import { autoTag, extractAutoTags } from '../../../src/korean/auto-tag';

/**
 * AICC 시나리오 32: 카페 및 매장 주문 안내
 *
 * 카페/매장에서는 짧은 주문번호를 호출번호처럼 안내하는 경우가 많습니다.
 * 이런 순수 숫자 주문번호는 일련번호처럼 한 자리씩 끊지 않고 자연수로 읽습니다.
 */
describe('AICC 시나리오 32: 카페 및 매장 주문 안내', () => {
  it('카페 픽업 안내의 짧은 주문번호를 자연수로 변환한다', () => {
    const input = '주문번호 1234 고객님, 아메리카노 2잔 준비되었습니다.';
    const expected = '주문번호 천이백삼십사 고객님, 아메리카노 두 잔 준비되었습니다.';

    expect(autoTag(input)).toBe(expected);
  });

  it('매장 결제 완료 안내의 짧은 주문번호를 자연수로 변환한다', () => {
    const input = '김철수님 주문번호 1234 상품이 5만원에 결제 되었습니다';
    const expected = '김철수님 주문번호 천이백삼십사 상품이 오 만원 에 결제 되었습니다';

    expect(autoTag(input)).toBe(expected);
  });

  it('짧은 주문번호를 orderNumber 태그로 추출한다', () => {
    const result = extractAutoTags('주문번호 1234 고객님', {
      enabledTags: ['orderNumber', 'serial'],
    });

    expect(result).toEqual([
      {
        original: '주문번호 1234',
        tagType: 'orderNumber',
        start: 0,
        end: 9,
      },
    ]);
  });

  it('영문 또는 하이픈이 있는 주문번호는 기존처럼 일련번호로 변환한다', () => {
    expect(autoTag('주문번호: HS-20240120-78945')).toBe(
      '주문번호: HS-이 . 공 . 이 . 사 . 공 . 일 . 이 . 공 다시 칠 . 팔 . 구 . 사 . 오'
    );
  });

  it('긴 순수 숫자 주문번호는 기존처럼 일련번호로 변환한다', () => {
    expect(autoTag('주문번호: 2024011412345')).toBe(
      '주문번호: 이 . 공 . 이 . 사 . 공 . 일 . 일 . 사 . 일 . 이 . 삼 . 사 . 오'
    );
  });
});
