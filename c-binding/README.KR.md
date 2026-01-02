# Typecast Autotag C Library

TTS(Text-to-Speech) 문장 전처리 라이브러리의 C 바인딩입니다.
전화번호, 날짜, 금액 등 다양한 패턴을 음성 합성에 적합한 형식으로 자동 변환합니다.

## 특징

- **간편한 사용**: 단 3개의 함수로 모든 변환 기능 제공
- **유연한 방식 선택**: 완전 자동, 수동 태그, 하이브리드 방식 지원
- **다양한 패턴 지원**: 전화번호, 날짜, 시간, 금액, 순서 등 35+ 패턴 자동 인식
- **높은 호환성**: CentOS 6.9부터 최신 Linux까지 지원 (정적 링크)

## 빠른 시작

### 1. 파일 배치

```
/path/to/your/project/
├── your_program.c
├── libtypecast_autotag.so   # 라이브러리 파일
└── typecast_autotag.h       # 헤더 파일
```

### 2. 코드 작성

```c
#include <stdio.h>
#include "typecast_autotag.h"

int main() {
    // 1. 초기화 (프로그램 시작 시 한 번만)
    if (typecast_init() != 0) {
        fprintf(stderr, "초기화 실패\n");
        return 1;
    }

    // 2. 텍스트 변환
    char *result = typecast_auto_tag("전화번호는 010-1234-5678입니다.");
    if (result) {
        printf("%s\n", result);
        // 출력: "전화번호는 공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔 입니다."

        typecast_free(result);  // 메모리 해제
    }

    // 3. 정리 (프로그램 종료 시)
    typecast_cleanup();
    return 0;
}
```

### 3. 컴파일 및 실행

```bash
# 컴파일
gcc -o my_program my_program.c -L. -ltypecast_autotag -Wl,-rpath,.

# 실행
./my_program
```

## API 레퍼런스

### 초기화 및 해제

```c
int typecast_init(void);     // 초기화 (성공: 0, 실패: -1)
void typecast_cleanup(void); // 정리
```

### 변환 함수

| 함수                              | 설명             | 사용 시나리오                             |
| --------------------------------- | ---------------- | ----------------------------------------- |
| `typecast_auto_tag()`             | 완전 자동 처리   | 모든 패턴을 자동으로 처리하고 싶을 때     |
| `typecast_manual_tag()`           | 수동 태그만 처리 | 기존 시스템 호환, 명시적 제어가 필요할 때 |
| `typecast_auto_tag_with_manual()` | 하이브리드 방식  | 대부분 자동 + 일부 수동 태그로 보완       |

```c
char* typecast_auto_tag(const char *text);
char* typecast_auto_tag_with_manual(const char *text);
char* typecast_manual_tag(const char *text);
void typecast_free(char *str);  // 결과 문자열 해제
```

## 사용 방식 상세 설명

### 방식 1: 완전 자동 처리 (`typecast_auto_tag`)

텍스트에서 패턴을 자동으로 인식하여 변환합니다.
**가장 간편한 방식**으로 대부분의 경우 이것만으로 충분합니다.

```c
// 입력: "전화번호는 010-1234-5678입니다."
// 출력: "전화번호는 공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔 입니다."
char *result = typecast_auto_tag("전화번호는 010-1234-5678입니다.");

// 입력: "총 금액은 1500000원입니다."
// 출력: "총 금액은 백오십만 원 입니다."
char *result = typecast_auto_tag("총 금액은 1500000원입니다.");

// 입력: "회의는 2024-03-15 14:30에 시작합니다."
// 출력: "회의는 이천이십사년 삼 월 십오 일 오후 두 시 삼십 분 에 시작합니다."
char *result = typecast_auto_tag("회의는 2024-03-15 14:30에 시작합니다.");
```

**지원 패턴:**

- 전화번호: `010-1234-5678`, `02-123-4567`, `1588-1234`
- 금액: `50000원`, `1500만원`, `₩10000`
- 날짜: `2024-03-15`, `2024년 3월 15일`, `20240315`
- 시간: `14:30`, `오후 2시 30분`
- 순서: `1등`, `3번째`, `5위`
- 비율: `30%`, `3:7`
- 기간: `3개월`, `2년`, `5일간`
- 층수: `지하 2층`, `5층`, `B1층`
- 그 외: 점수, 면적, 거리, 무게, 마일리지 등

### 방식 2: 수동 태그만 처리 (`typecast_manual_tag`)

**기존 시스템과 호환**이 필요하거나 **명시적으로 제어**하고 싶을 때 사용합니다.
태그 형식: `tagName(value)`

```c
// 입력: "name(김철수)님 안녕하세요."
// 출력: "김 철 수님 안녕하세요."
char *result = typecast_manual_tag("name(김철수)님 안녕하세요.");

// 입력: "phone(010-1234-5678)로 연락주세요."
// 출력: "공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔로 연락주세요."
char *result = typecast_manual_tag("phone(010-1234-5678)로 연락주세요.");
```

**지원 태그 (총 37개):**

| 태그                   | 설명               | 예시                                            |
| ---------------------- | ------------------ | ----------------------------------------------- |
| `name(이름)`           | 이름 읽기          | `name(김철수)` → 김 철 수                       |
| `phone(번호)`          | 전화번호 읽기      | `phone(010-1234-5678)` → 공 일 공 다시...       |
| `money(금액)`          | 금액 읽기          | `money(50000)` → 오만 원                        |
| `date(날짜)`           | 날짜 읽기          | `date(2024-03-15)` → 이천이십사년 삼 월 십오 일 |
| `time(시간)`           | 시간 읽기          | `time(14:30)` → 오후 두 시 삼십 분              |
| `datetime(날짜시간)`   | 날짜+시간 읽기     | `datetime(2024-03-15T14:30)`                    |
| `year(연도)`           | 연도 읽기          | `year(2024)` → 이천이십사년                     |
| `month(월)`            | 월 읽기            | `month(3)` → 삼월                               |
| `day(일)`              | 일 읽기            | `day(15)` → 십오일                              |
| `order(순서)`          | 순서 읽기          | `order(3)` → 세 번째                            |
| `point(점수)`          | 점수 읽기          | `point(95)` → 구십오 점                         |
| `piece(개수)`          | 개수 읽기 (고유어) | `piece(3)` → 세 개                              |
| `digits(숫자)`         | 숫자 한 자리씩     | `digits(123)` → 일 이 삼                        |
| `number(번호)`         | 번호 읽기          | `number(7)` → 칠 번                             |
| `minsec(시분초)`       | 시분초 읽기        | `minsec(5m30s)` → 오 분 삼십 초                 |
| `ratio(비율)`          | 비율/퍼센트 읽기   | `ratio(30%)` → 삼십 퍼센트                      |
| `jari(자리)`           | 자리 수 읽기       | `jari(4)` → 네 자리                             |
| `duration(기간)`       | 기간 읽기          | `duration(3개월)` → 삼 개월                     |
| `floor(층)`            | 층수 읽기          | `floor(B2)` → 지하 이 층                        |
| `account(계좌)`        | 계좌번호 읽기      | `account(110-123-456789)`                       |
| `weight(무게)`         | 무게 읽기          | `weight(5kg)` → 오 킬로그램                     |
| `mile(마일)`           | 마일리지 읽기      | `mile(1000)` → 천 마일                          |
| `area(면적)`           | 면적 읽기          | `area(30평)` → 삼십 평                          |
| `serial(일련번호)`     | 일련번호 읽기      | `serial(ABC-123)`                               |
| `bakil(박일)`          | 숙박 기간 읽기     | `bakil(2박3일)` → 이 박 삼 일                   |
| `roomNumber(호실)`     | 호실 번호 읽기     | `roomNumber(1205)` → 일 이 공 오 호             |
| `jong(종)`             | 종류 수 읽기       | `jong(5)` → 다섯 종                             |
| `distance(거리)`       | 거리 읽기          | `distance(5km)` → 오 킬로미터                   |
| `carNumber(차량번호)`  | 차량번호 읽기      | `carNumber(12가3456)`                           |
| `flight(항공편)`       | 항공편 읽기        | `flight(KE123)` → 케이 이 일 이 삼              |
| `seat(좌석)`           | 좌석 번호 읽기     | `seat(23A)` → 이십삼 에이                       |
| `lecture(강의)`        | 강의 수 읽기       | `lecture(26)` → 이십육 강                       |
| `fraction(분수)`       | 분수 읽기          | `fraction(1/4)` → 사 분의 일                    |
| `temperature(온도)`    | 온도 읽기          | `temperature(25℃)` → 이십오 도                  |
| `volume(용량)`         | 용량 읽기          | `volume(500ml)` → 오백 밀리리터                 |
| `dataCapacity(데이터)` | 데이터 용량 읽기   | `dataCapacity(100GB)` → 백 기가바이트           |
| `inch(인치)`           | 인치 읽기          | `inch(55인치)` → 오십오 인치                    |

### 방식 3: 하이브리드 방식 (`typecast_auto_tag_with_manual`)

**자동 태깅이 잘못 인식하는 부분을 수동 태그로 보완**할 수 있습니다.
수동 태그를 먼저 처리한 후 나머지에 자동 태깅을 적용합니다.

```c
// 이름은 수동 태그로, 금액은 자동으로
// 입력: "name(김철수)님, 잔액은 50000원입니다."
// 출력: "김 철 수님, 잔액은 오만 원 입니다."
char *result = typecast_auto_tag_with_manual("name(김철수)님, 잔액은 50000원입니다.");

// 복합 예시
// 입력: "name(홍길동)님, 2024-03-15 14:30에 phone(02-123-4567)로 연락드리겠습니다."
char *result = typecast_auto_tag_with_manual(
    "name(홍길동)님, 2024-03-15 14:30에 phone(02-123-4567)로 연락드리겠습니다."
);
```

## 빌드

### 로컬 빌드 (macOS/Linux)

```bash
cd c-binding

# QuickJS 다운로드 및 빌드
make quickjs

# JS 번들 생성
make bundle

# 공유 라이브러리 빌드
make all

# 테스트
make test
```

### Docker 빌드 (CentOS 6.9 호환)

```bash
cd c-binding

# Docker 이미지 빌드 및 .so 생성
./scripts/build-linux.sh

# 결과물
# - build/libtypecast_autotag.so
# - build/typecast_autotag.h
```

### E2E 테스트

빌드된 라이브러리를 CentOS 6.9와 Amazon Linux 2에서 자동으로 테스트합니다.

```bash
cd c-binding

# E2E 테스트 실행 (Docker 필요)
./scripts/test-e2e.sh
```

**테스트 범위:**

| 카테고리                        | 테스트 수 | 설명                          |
| ------------------------------- | --------- | ----------------------------- |
| `typecast_manual_tag`           | 37        | 모든 수동 태그 (37개)         |
| `typecast_auto_tag`             | 8         | 자동 인식 패턴                |
| `typecast_auto_tag_with_manual` | 4         | 수동 + 자동 혼합              |
| **총합**                        | **50**    | 환경별 50개 테스트 × 2개 환경 |

**테스트 환경:**

- CentOS 6.9 (glibc 2.12)
- Amazon Linux 2 (glibc 2.26)

**출력 예시:**

```
==============================================
  Typecast Autotag C Library E2E Test
==============================================

=== Testing typecast_manual_tag (31 tags) ===
  [PASS] name
  [PASS] month
  [PASS] day
  ...

=== Testing typecast_auto_tag ===
  [PASS] auto_phone
  [PASS] auto_money
  ...

=== Testing typecast_auto_tag_with_manual ===
  [PASS] mixed_name_phone
  [PASS] mixed_name_money
  ...

===========================================
Test Results:
  Total:  44
  Passed: 44
  Failed: 0
===========================================

✓ CentOS 6.9: ALL TESTS PASSED
✓ Amazon Linux 2: ALL TESTS PASSED

All E2E tests passed!
```

## 배포

### 필요한 파일

| 파일                     | 설명            |
| ------------------------ | --------------- |
| `libtypecast_autotag.so` | 공유 라이브러리 |
| `typecast_autotag.h`     | C 헤더 파일     |

### 설치

```bash
# 시스템 라이브러리 디렉토리에 설치
sudo cp libtypecast_autotag.so /usr/local/lib/
sudo cp typecast_autotag.h /usr/local/include/
sudo ldconfig

# 또는 프로젝트 디렉토리에 함께 배치하고 rpath 사용
gcc -o program program.c -L. -ltypecast_autotag -Wl,-rpath,'$ORIGIN'
```

## 타겟 환경

| 환경           | 아키텍처 | 상태                |
| -------------- | -------- | ------------------- |
| Amazon Linux 2 | x86_64   | ✅ 지원             |
| CentOS 6.9     | x86_64   | ✅ 지원 (정적 링크) |

## 주의사항

1. **초기화**: `typecast_init()`은 프로그램 시작 시 **한 번만** 호출
2. **메모리 해제**: 반환된 문자열은 반드시 `typecast_free()`로 해제
3. **인코딩**: 입력 텍스트는 **UTF-8** 인코딩 사용
4. **스레드 안전**: 내부적으로 뮤텍스 사용, 멀티스레드 환경에서 안전

## 문의

문제가 발생하거나 도움이 필요한 경우 이슈를 등록해 주세요.
