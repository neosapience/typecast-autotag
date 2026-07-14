export interface Example {
  id: number;
  category: string;
  description: string;
  original: string;
  hasManualTag?: boolean;
}

// Korean examples
export const examplesKo: Example[] = [
  {
    id: 1,
    category: '전화번호',
    description: '휴대폰 번호',
    original: '전화번호는 010-1234-5678입니다.',
  },
  {
    id: 2,
    category: '전화번호',
    description: '지역번호 포함',
    original: '고객센터 번호는 02-123-4567입니다.',
  },
  { id: 3, category: '전화번호', description: '대표번호', original: '1577-1234로 전화주세요.' },
  {
    id: 4,
    category: '날짜',
    description: 'ISO 형식 날짜',
    original: '배송 예정일은 2024-12-25입니다.',
  },
  { id: 5, category: '날짜', description: '한글 날짜', original: '12월 25일에 크리스마스입니다.' },
  { id: 6, category: '날짜', description: '년월일', original: '2025년 1월 1일은 새해입니다.' },
  { id: 7, category: '시간', description: '24시간 형식', original: '회의는 14:30에 시작합니다.' },
  { id: 8, category: '시간', description: '오전/오후', original: '오전 10시에 출근합니다.' },
  { id: 9, category: '시간', description: '분 포함', original: '약속은 오후 3시 45분입니다.' },
  { id: 10, category: '금액', description: '원화', original: '총 금액은 50000원입니다.' },
  { id: 11, category: '금액', description: '콤마 포함', original: '가격은 1,234,567원입니다.' },
  { id: 12, category: '금액', description: '만원 단위', original: '월급은 350만원입니다.' },
  { id: 13, category: '순서', description: '번째', original: '저는 3번째로 도착했습니다.' },
  { id: 14, category: '순서', description: '등수', original: '마라톤에서 2등을 했습니다.' },
  { id: 15, category: '순서', description: '회차', original: '이번이 5회차 공연입니다.' },
  { id: 16, category: '층수', description: '일반 층', original: '사무실은 7층에 있습니다.' },
  { id: 17, category: '층수', description: '지하', original: '주차장은 B2층입니다.' },
  { id: 18, category: '층수', description: '고층', original: '전망대는 123층입니다.' },
  { id: 19, category: '비율', description: '퍼센트', original: '할인율은 30%입니다.' },
  { id: 20, category: '비율', description: '대 비율', original: '비율은 3:1입니다.' },
  { id: 21, category: '단위', description: '무게', original: '짐 무게는 25kg입니다.' },
  { id: 22, category: '단위', description: '거리', original: '서울에서 부산까지 400km입니다.' },
  { id: 23, category: '단위', description: '온도', original: '오늘 기온은 25℃입니다.' },
  { id: 24, category: '단위', description: '용량', original: '물을 500ml 마셨습니다.' },
  { id: 25, category: '단위', description: '데이터', original: '저장공간이 256GB입니다.' },
  {
    id: 32,
    category: '경계 사례',
    description: '이메일',
    original: '문의는 help@sample.org로 보내주세요.',
  },
  {
    id: 33,
    category: '경계 사례',
    description: '경기 점수',
    original: '원정팀이 4-1로 승리했어요.',
  },
  {
    id: 34,
    category: '경계 사례',
    description: '기간 범위',
    original: '제작 기간은 2-4주 정도예요.',
  },
  {
    id: 35,
    category: '경계 사례',
    description: '성경 구절',
    original: '요한복음 3:16 말씀을 읽어주세요.',
  },
  {
    id: 36,
    category: '경계 사례',
    description: '외화 소수점',
    original: '결제 금액은 2,345.67달러예요.',
  },
  {
    id: 37,
    category: '경계 사례',
    description: '순우리말 수사',
    original: '후보 매장은 2곳, 점검 지점은 8곳입니다.',
  },
  {
    id: 26,
    category: '수동태그 - 이름',
    description: '이름 읽기',
    original: 'name(김철수)님, 안녕하세요.',
    hasManualTag: true,
  },
  {
    id: 27,
    category: '수동태그 - 숫자',
    description: '숫자 하나씩',
    original: '비밀번호는 digits(1234)입니다.',
    hasManualTag: true,
  },
  {
    id: 28,
    category: '수동태그 - 주소',
    description: '주소 변환',
    original: 'address(102동 1101호 (엘지동, 우성베스토피아)) 입주 안내',
    hasManualTag: true,
  },
  {
    id: 29,
    category: '복합',
    description: '전화+금액',
    original: '010-1234-5678로 50000원 입금해주세요.',
  },
  { id: 30, category: '복합', description: '날짜+시간', original: '2024-12-25 14:30에 만나요.' },
  {
    id: 31,
    category: '복합',
    description: '이름+전화번호',
    original: 'name(홍길동)님, 010-9876-5432로 연락주세요.',
    hasManualTag: true,
  },
];

// English examples
export const examplesEn: Example[] = [
  { id: 1, category: 'Phone', description: 'Mobile number', original: 'Call me at 555-123-4567.' },
  {
    id: 2,
    category: 'Phone',
    description: 'Toll-free number',
    original: 'Customer service: 1-800-555-1234.',
  },
  {
    id: 3,
    category: 'Phone',
    description: 'International format',
    original: 'Reach us at +1-202-555-0123.',
  },
  { id: 4, category: 'Date', description: 'ISO format', original: 'The deadline is 2024-12-25.' },
  {
    id: 5,
    category: 'Date',
    description: 'Written date',
    original: 'Christmas is on December 25th.',
  },
  {
    id: 6,
    category: 'Date',
    description: 'US format',
    original: 'Independence Day is 07/04/2024.',
  },
  {
    id: 7,
    category: 'Time',
    description: '24-hour format',
    original: 'The meeting starts at 14:30.',
  },
  { id: 8, category: 'Time', description: '12-hour format', original: 'Lunch is at 12:00 PM.' },
  {
    id: 9,
    category: 'Time',
    description: 'With seconds',
    original: 'The race finished at 10:45:32.',
  },
  { id: 10, category: 'Money', description: 'USD', original: 'The total is $1,234.56.' },
  {
    id: 11,
    category: 'Money',
    description: 'Large amount',
    original: 'The budget is $2.5 million.',
  },
  { id: 12, category: 'Money', description: 'Cents', original: 'The price is $0.99.' },
  { id: 13, category: 'Order', description: 'Ordinal', original: 'I finished in 3rd place.' },
  { id: 14, category: 'Order', description: 'Ranking', original: 'She won 1st prize.' },
  { id: 15, category: 'Order', description: 'Position', original: 'This is the 21st century.' },
  {
    id: 16,
    category: 'Floor',
    description: 'Regular floor',
    original: 'The office is on the 7th floor.',
  },
  { id: 17, category: 'Floor', description: 'Basement', original: 'Parking is on B2.' },
  {
    id: 18,
    category: 'Floor',
    description: 'High rise',
    original: 'The observation deck is on floor 102.',
  },
  { id: 19, category: 'Ratio', description: 'Percentage', original: 'The discount is 30%.' },
  { id: 20, category: 'Ratio', description: 'Ratio format', original: 'The aspect ratio is 16:9.' },
  { id: 21, category: 'Units', description: 'Weight', original: 'The package weighs 25kg.' },
  { id: 22, category: 'Units', description: 'Distance', original: 'The marathon is 42.195km.' },
  {
    id: 23,
    category: 'Units',
    description: 'Temperature',
    original: "Today's temperature is 77°F.",
  },
  { id: 24, category: 'Units', description: 'Volume', original: 'Drink 500ml of water daily.' },
  { id: 25, category: 'Units', description: 'Data', original: 'Storage capacity: 256GB.' },
  {
    id: 31,
    category: 'Edge Cases',
    description: 'Roman numeral',
    original: 'Part IX starts here.',
  },
  {
    id: 32,
    category: 'Edge Cases',
    description: 'Decimal weight',
    original: 'The parcel weighs 2,345.67 grams.',
  },
  {
    id: 33,
    category: 'Edge Cases',
    description: 'Page range',
    original: 'Review pages 8–12 before class.',
  },
  {
    id: 34,
    category: 'Edge Cases',
    description: 'Game score',
    original: 'The match ended 4:2.',
  },
  {
    id: 35,
    category: 'Edge Cases',
    description: 'Number label',
    original: 'No. 8 is available.',
  },
  {
    id: 36,
    category: 'Edge Cases',
    description: 'Hashtag',
    original: '#BuildTogether starts today.',
  },
  {
    id: 26,
    category: 'Manual Tag - Name',
    description: 'Name spelling',
    original: 'Hello, name(John Smith)!',
    hasManualTag: true,
  },
  {
    id: 27,
    category: 'Manual Tag - Digits',
    description: 'Digit by digit',
    original: 'Your PIN is digits(1234).',
    hasManualTag: true,
  },
  {
    id: 28,
    category: 'Combined',
    description: 'Phone + Money',
    original: 'Call 555-123-4567, deposit $500.',
  },
  {
    id: 29,
    category: 'Combined',
    description: 'Date + Time',
    original: 'Meeting: 2024-12-25 at 14:30.',
  },
  {
    id: 30,
    category: 'Combined',
    description: 'Name + Phone',
    original: 'Contact name(Jane Doe) at 555-987-6543.',
    hasManualTag: true,
  },
];

export interface AICCExample {
  id: string;
  category: string;
  title: string;
  input: string;
}

export const aiccExamplesKo: AICCExample[] = [
  {
    id: 'main-menu',
    category: 'ARS 안내',
    title: '메인 메뉴 안내',
    input: `안녕하세요, 타입캐스트 고객센터입니다.
상담 품질 향상을 위해 통화 내용이 녹음됩니다.

메뉴 안내입니다.
요금 및 결제 문의는 1번,
배송 조회는 2번,
주문 취소 및 환불은 3번,
회원 정보 변경은 4번,
상담원 연결은 0번을 눌러주세요.

현재 상담 대기 시간은 약 5m30s입니다.
고객센터 운영시간은 09:00부터 18:00까지입니다.`,
  },
  {
    id: 'delivery',
    category: '배송',
    title: '배송 상태 안내',
    input: `배송 조회 서비스입니다.

1번째 주문: 주문번호 끝 4자리 5678
주문일: 2024-01-10
배송 완료일: 2024-01-12T14:30

2번째 주문: 주문번호 끝 4자리 9012
주문일: 2024-01-14
예상 도착일: 2024-01-16`,
  },
  {
    id: 'telecom',
    category: '통신',
    title: '휴대폰 요금 안내',
    input: `요금 안내입니다.

청구월: 2024년 1월
납부기한: 2024-01-25

기본료: 69,000원
부가서비스: 5,500원
할인: -10,000원

음성통화: 1,234분
데이터: 45.3GB

총 청구금액: 64,500원`,
  },
];

export const aiccExamplesEn: AICCExample[] = [
  {
    id: 'main-menu',
    category: 'IVR Menu',
    title: 'Main Menu',
    input: `Thank you for calling Customer Service.

Main Menu:
For billing, press 1.
For order tracking, press 2.
For returns, press 3.
For account settings, press 4.
To speak with a representative, press 0.

Current wait time is approximately 5m30s.
Our hours are 09:00 to 18:00.`,
  },
  {
    id: 'delivery',
    category: 'Shipping',
    title: 'Order Status',
    input: `Order Tracking Service.

Order #1: Ending in 5678
Order Date: 2024-01-10
Delivered: 2024-01-12T14:30

Order #2: Ending in 9012
Order Date: 2024-01-14
Expected: 2024-01-16`,
  },
  {
    id: 'telecom',
    category: 'Telecom',
    title: 'Phone Bill',
    input: `Billing Summary.

Billing Period: January 2024
Due Date: 2024-01-25

Base Plan: $69.00
Add-ons: $5.50
Discount: -$10.00

Voice: 1,234 minutes
Data: 45.3GB

Total Due: $64.50`,
  },
];
