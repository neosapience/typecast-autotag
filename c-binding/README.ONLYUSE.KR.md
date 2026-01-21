# Typecast Autotag C 라이브러리 사용 가이드

> TTS(음성 합성)를 위한 텍스트 전처리 라이브러리입니다.  
> 전화번호, 금액, 날짜 등을 자연스러운 음성으로 출력가능한 텍스트로 변환해 줍니다.

---

## 제공 파일

| 파일명                   | 설명                                               |
| ------------------------ | -------------------------------------------------- |
| `libtypecast_autotag.so` | 라이브러리 파일 (이 파일이 실제 기능을 수행합니다) |
| `typecast_autotag.h`     | 헤더 파일 (코드에서 `#include` 할 파일입니다)      |

---

## 빠른 시작 (5분 만에 시작하기)

### 1단계: 파일 배치

제공받은 두 파일을 프로젝트 폴더에 복사합니다.

```
/your/project/
├── your_program.c          ← 여러분의 소스 코드
├── libtypecast_autotag.so  ← 라이브러리 파일 (여기에 복사)
└── typecast_autotag.h      ← 헤더 파일 (여기에 복사)
```

### 2단계: 코드 작성

아래 예제를 복사해서 `test.c` 파일로 저장하세요:

```c
#include <stdio.h>
#include "typecast_autotag.h"

int main() {
    /* 1. 라이브러리 초기화 (프로그램 시작할 때 딱 한 번만 호출) */
    if (typecast_init() != 0) {
        printf("초기화 실패!\n");
        return 1;
    }
    printf("초기화 성공!\n");

    /* 2. 텍스트 변환하기 */
    char *result = typecast_auto_tag("전화번호는 010-1234-5678입니다.");

    if (result != NULL) {
        printf("변환 결과: %s\n", result);

        /* 3. 사용 후 메모리 해제 (중요!) */
        typecast_free(result);
    }

    /* 4. 프로그램 종료 전 정리 */
    typecast_cleanup();
    printf("정리 완료!\n");

    return 0;
}
```

### 3단계: 컴파일

터미널에서 아래 명령어를 실행하세요:

```bash
gcc -o test test.c -L. -ltypecast_autotag -Wl,-rpath,.
```

> **명령어 설명:**
>
> - `gcc` : C 컴파일러
> - `-o test` : 출력 파일 이름을 `test`로 지정
> - `test.c` : 컴파일할 소스 파일
> - `-L.` : 현재 폴더에서 라이브러리 찾기
> - `-ltypecast_autotag` : `libtypecast_autotag.so` 라이브러리 사용
> - `-Wl,-rpath,.` : 실행 시 현재 폴더에서 라이브러리 찾기

### 4단계: 실행

```bash
./test
```

**예상 출력:**

```
초기화 성공!
변환 결과: 전화번호는 공 . 일 . 공 . 일 . 이 . 삼 . 사 . 오 . 육 . 칠 . 팔 입니다.
정리 완료!
```

축하합니다! 라이브러리가 정상 작동합니다!

---

## 함수 설명

이 라이브러리는 **5개의 함수**만 사용하면 됩니다:

### 초기화 함수

#### `typecast_init()`

프로그램 시작할 때 **딱 한 번만** 호출하세요.

```c
int result = typecast_init();
if (result != 0) {
    // 초기화 실패 처리
}
```

| 반환값 | 의미 |
| ------ | ---- |
| `0`    | 성공 |
| `-1`   | 실패 |

---

#### `typecast_cleanup()`

프로그램 종료할 때 **딱 한 번만** 호출하세요.

```c
typecast_cleanup();
```

---

### 변환 함수 (3가지 중 선택)

#### 방법 1: `typecast_auto_tag()` - 완전 자동 (권장!)

**가장 쉬운 방법입니다.** 텍스트를 넣으면 자동으로 변환해 줍니다.

```c
char *result = typecast_auto_tag("전화번호는 010-1234-5678입니다.");
// 결과: "전화번호는 공 . 일 . 공 . 일 . 이 . 삼 . 사 . 오 . 육 . 칠 . 팔 입니다."
```

**자동으로 인식하는 패턴:**

- 전화번호: `010-1234-5678` → 공 . 일 . 공 . 일 . 이 . 삼 . 사 . 오 . 육 . 칠 . 팔
- 금액: `50000원` → 오만 원
- 날짜: `2024-03-15` → 이천이십사년 삼 월 십오 일
- 시간: `14:30` → 오후 두 시 삼십 분
- 퍼센트: `30%` → 삼십 퍼센트
- 순서: `3번째` → 세 번째
- 층수: `5층` → 오 층
- 기간: `3개월` → 삼 개월
- 그 외 많은 패턴들...

---

#### 방법 2: `typecast_manual_tag()` - 수동 태그

특정 부분만 정확하게 지정해서 변환하고 싶을 때 사용합니다.

```c
char *result = typecast_manual_tag("name(김철수)님 안녕하세요.");
// 결과: "김 . 철 . 수 님 안녕하세요."
```

**사용 가능한 태그 (총 37개):**

| 태그                   | 용도        | 예시                                            |
| ---------------------- | ----------- | ----------------------------------------------- |
| `name(이름)`           | 이름 읽기   | `name(김철수)` → 김 . 철 . 수                   |
| `phone(번호)`          | 전화번호    | `phone(010-1234-5678)` → 공 . 일 . 공 . 일 . 이...  |
| `money(금액)`          | 금액        | `money(50000)` → 오만 원                        |
| `date(날짜)`           | 날짜        | `date(2024-03-15)` → 이천이십사년 삼 월 십오 일 |
| `time(시간)`           | 시간        | `time(14:30)` → 오후 두 시 삼십 분              |
| `datetime(날짜시간)`   | 날짜+시간   | `datetime(2024-03-15T14:30)`                    |
| `year(연도)`           | 연도        | `year(2024)` → 이천이십사년                     |
| `month(월)`            | 월          | `month(3)` → 삼월                               |
| `day(일)`              | 일          | `day(15)` → 십오일                              |
| `order(순서)`          | 순서        | `order(3)` → 세 번째                            |
| `digits(숫자)`         | 한 자리씩   | `digits(123)` → 1 . 2 . 3                       |
| `number(번호)`         | 번호 읽기   | `number(7)` → 칠 번                             |
| `point(점수)`          | 점수        | `point(95)` → 구십오 점                         |
| `piece(개수)`          | 개수        | `piece(3)` → 세 개                              |
| `ratio(비율)`          | 비율        | `ratio(30%)` → 삼십 퍼센트                      |
| `minsec(시분초)`       | 시분초      | `minsec(5m30s)` → 오 분 삼십 초                 |
| `jari(자리)`           | 자리 수     | `jari(4)` → 네 자리                             |
| `floor(층)`            | 층수        | `floor(5)` → 오 층                              |
| `duration(기간)`       | 기간        | `duration(3개월)` → 삼 개월                     |
| `account(계좌)`        | 계좌번호    | `account(110-123-456789)`                       |
| `weight(무게)`         | 무게        | `weight(5kg)` → 오 킬로그램                     |
| `mile(마일)`           | 마일리지    | `mile(1000)` → 천 마일                          |
| `area(면적)`           | 면적        | `area(30평)` → 삼십 평                          |
| `serial(일련번호)`     | 일련번호    | `serial(ABC-123)`                               |
| `bakil(박일)`          | 숙박 기간   | `bakil(2박3일)` → 이 박 삼 일                   |
| `roomNumber(호실)`     | 호실 번호   | `roomNumber(1205)` → 일 이 공 오 호             |
| `jong(종)`             | 종류 수     | `jong(5)` → 다섯 종                             |
| `distance(거리)`       | 거리        | `distance(5km)` → 오 킬로미터                   |
| `carNumber(차량번호)`  | 차량번호    | `carNumber(12가3456)`                           |
| `flight(항공편)`       | 항공편      | `flight(KE123)` → 케이 이 일 이 삼              |
| `seat(좌석)`           | 좌석 번호   | `seat(23A)` → 이십삼 에이                       |
| `lecture(강의)`        | 강의 수     | `lecture(26)` → 이십육 강                       |
| `fraction(분수)`       | 분수        | `fraction(1/4)` → 사 분의 일                    |
| `temperature(온도)`    | 온도        | `temperature(25℃)` → 이십오 도                  |
| `volume(용량)`         | 용량        | `volume(500ml)` → 오백 밀리리터                 |
| `dataCapacity(데이터)` | 데이터 용량 | `dataCapacity(100GB)` → 백 기가바이트           |
| `inch(인치)`           | 인치        | `inch(55인치)` → 오십오 인치                    |

---

#### 방법 3: `typecast_auto_tag_with_manual()` - 자동 + 수동

자동 변환을 사용하면서, **이름처럼 자동 인식이 어려운 것**은 태그로 지정할 때 사용합니다.

```c
char *result = typecast_auto_tag_with_manual("name(김철수)님, 잔액은 50000원입니다.");
// 결과: "김 . 철 . 수 님, 잔액은 오만 원 입니다."
```

> **설명:** `name(김철수)`는 태그로 처리하고, `50000원`은 자동으로 인식해서 변환합니다.

---

### 메모리 해제 함수

#### `typecast_free()`

변환 함수가 반환한 문자열을 **반드시** 해제해야 합니다.

```c
char *result = typecast_auto_tag("안녕하세요");
// result 사용...
typecast_free(result);  // 사용 후 반드시 호출!
```

> **주의:** `typecast_free()`를 호출하지 않으면 메모리 누수가 발생합니다!

---

## 어떤 함수를 사용해야 하나요?

| 상황                          | 사용할 함수                       | 설명                         |
| ----------------------------- | --------------------------------- | ---------------------------- |
| 텍스트에 **이름이 없는** 경우 | `typecast_auto_tag()`             | **권장!** 완전 자동으로 처리 |
| 텍스트에 **이름이 있는** 경우 | `typecast_auto_tag_with_manual()` | 이름은 태그로, 나머지는 자동 |
| 기존 시스템과 호환 필요       | `typecast_manual_tag()`           | 태그로 지정한 것만 변환      |

**요약:**

- **대부분의 경우:** `typecast_auto_tag()` 사용 (권장!)
- **이름이 있는 경우:** `typecast_auto_tag_with_manual()` 사용
- **기존 시스템 호환:** `typecast_manual_tag()` 사용

---

## 실제 사용 예시

### 예시 1: IVR 안내 멘트

```c
#include <stdio.h>
#include "typecast_autotag.h"

int main() {
    typecast_init();

    // 고객 정보로 안내 멘트 생성
    char text[256];
    sprintf(text, "name(%s)님, 현재 잔액은 %d원입니다. 문의사항은 %s로 연락주세요.",
            "김철수", 1500000, "1588-1234");

    char *result = typecast_auto_tag_with_manual(text);
    printf("TTS 텍스트: %s\n", result);
    // 출력: "김 . 철 . 수 님, 현재 잔액은 백오십만 원 입니다. 문의사항은 일 . 오 . 팔 . 팔 . 일 . 이 . 삼 . 사 로 연락주세요."

    typecast_free(result);
    typecast_cleanup();
    return 0;
}
```

### 예시 2: 예약 확인 안내

```c
char *result = typecast_auto_tag_with_manual(
    "name(홍길동)님의 예약이 확인되었습니다. "
    "예약일시는 2024-03-15 14:30입니다. "
    "예약번호는 1234입니다."
);
// 출력: "홍 . 길 . 동 님의 예약이 확인되었습니다.
//        예약일시는 이천이십사년 삼 월 십오 일 오후 두 시 삼십 분 입니다.
//        예약번호는 천이백삼십사 입니다."
```

### 예시 3: 결제 안내

```c
char *result = typecast_auto_tag(
    "결제 금액은 125000원이며, 할인율은 10%입니다."
);
// 출력: "결제 금액은 십이만오천 원 이며, 할인율은 십 퍼센트 입니다."
```

---

## 컴파일 옵션 정리

### 기본 컴파일

```bash
gcc -o 프로그램명 소스파일.c -L라이브러리경로 -ltypecast_autotag -Wl,-rpath,라이브러리경로
```

### 예시: 라이브러리가 현재 폴더에 있을 때

```bash
gcc -o myprogram myprogram.c -L. -ltypecast_autotag -Wl,-rpath,.
```

### 예시: 라이브러리가 /opt/lib에 있을 때

```bash
gcc -o myprogram myprogram.c -L/opt/lib -ltypecast_autotag -Wl,-rpath,/opt/lib
```

### 예시: 라이브러리를 시스템에 설치했을 때

```bash
# 1. 라이브러리 복사 (관리자 권한 필요)
sudo cp libtypecast_autotag.so /usr/local/lib/
sudo cp typecast_autotag.h /usr/local/include/

# 2. 라이브러리 캐시 갱신
sudo ldconfig

# 3. 컴파일 (더 간단해짐)
gcc -o myprogram myprogram.c -ltypecast_autotag
```

---

## 자주 묻는 질문 (FAQ)

### Q1. "error while loading shared libraries" 오류가 나요

**증상:**

```
./myprogram: error while loading shared libraries: libtypecast_autotag.so: cannot open shared object file: No such file or directory
```

**해결방법 1:** 라이브러리 경로 지정 후 실행

```bash
LD_LIBRARY_PATH=/라이브러리/경로 ./myprogram
```

**해결방법 2:** 컴파일 시 rpath 옵션 추가

```bash
gcc -o myprogram myprogram.c -L. -ltypecast_autotag -Wl,-rpath,.
```

**해결방법 3:** 시스템에 라이브러리 설치

```bash
sudo cp libtypecast_autotag.so /usr/local/lib/
sudo ldconfig
```

---

### Q2. "undefined reference" 오류가 나요

**증상:**

```
undefined reference to `typecast_init'
```

**원인:** 컴파일 시 라이브러리를 연결하지 않았습니다.

**해결:**

```bash
gcc -o myprogram myprogram.c -L. -ltypecast_autotag
                              ^^^^^^^^^^^^^^^^^^^^
                              이 부분이 빠지면 안 됩니다!
```

---

### Q3. 헤더 파일을 찾지 못해요

**증상:**

```
fatal error: typecast_autotag.h: No such file or directory
```

**해결방법 1:** 헤더 파일을 소스 파일과 같은 폴더에 복사

**해결방법 2:** 헤더 파일 경로 지정

```bash
gcc -o myprogram myprogram.c -I/헤더파일/경로 -L. -ltypecast_autotag
```

---

### Q4. 초기화가 실패해요

**증상:**

```c
if (typecast_init() != 0) {
    // 여기로 들어옴
}
```

**가능한 원인:**

1. 메모리 부족
2. 라이브러리 파일 손상

**해결:** 라이브러리 파일을 다시 복사해 보세요.

---

### Q5. 한글이 깨져요

**원인:** 파일 인코딩이 UTF-8이 아닙니다.

**확인:** 소스 파일을 UTF-8로 저장했는지 확인하세요.

---

## 지원 환경

### 제공되는 라이브러리

#### 기본 빌드 (단일 아키텍처)

| 플랫폼  | 아키텍처       | 출력 파일                 | 크기   | 상태         |
| ------- | -------------- | ------------------------- | ------ | ------------ |
| Linux   | x86_64         | libtypecast_autotag.so    | ~731KB | ✅ 지원      |
| macOS   | x86_64 + arm64 | libtypecast_autotag.dylib | ~1.6MB | ✅ Universal |
| Windows | x86_64         | typecast_autotag.dll      | ~727KB | ✅ 지원      |

#### 멀티 아키텍처 빌드

| 플랫폼  | 아키텍처     | 출력 파일                     | 크기   | 상태         |
| ------- | ------------ | ----------------------------- | ------ | ------------ |
| Linux   | x86_64       | libtypecast_autotag_x86_64.so | ~731KB | ✅ 지원      |
| Linux   | x86 (32-bit) | libtypecast_autotag_x86.so    | ~771KB | ✅ 지원      |
| Linux   | arm64        | libtypecast_autotag_arm64.so  | ~689KB | ✅ 지원      |
| Linux   | armv7        | libtypecast_autotag_armv7.so  | ~559KB | ✅ 지원      |
| macOS   | x86_64+arm64 | libtypecast_autotag.dylib     | ~1.6MB | ✅ Universal |
| Windows | x86_64       | typecast_autotag_x86_64.dll   | ~727KB | ✅ 지원      |
| Windows | x86 (32-bit) | typecast_autotag_i686.dll     | ~729KB | ✅ 지원      |

### 테스트된 환경

| 운영체제       | 아키텍처     | 지원 상태  |
| -------------- | ------------ | ---------- |
| CentOS 6.9+    | x86_64       | ✅ 지원    |
| Amazon Linux 2 | x86_64       | ✅ 지원    |
| Debian/Ubuntu  | x86_64/arm64 | ✅ 지원    |
| macOS 11+      | x86_64/arm64 | ✅ 지원    |
| Windows 10+    | x86_64/x86   | ✅ 지원    |

---

## 주의사항

### 1. 반드시 초기화 후 사용하세요

```c
// [X] 잘못된 사용
char *result = typecast_auto_tag("안녕");  // 초기화 안 함!

// [O] 올바른 사용
typecast_init();  // 먼저 초기화
char *result = typecast_auto_tag("안녕");
```

### 2. 반드시 메모리를 해제하세요

```c
// [X] 잘못된 사용 (메모리 누수!)
char *result = typecast_auto_tag("안녕");
// typecast_free(result) 호출 안 함

// [O] 올바른 사용
char *result = typecast_auto_tag("안녕");
// ... result 사용 ...
typecast_free(result);  // 반드시 호출!
```

### 3. NULL 체크를 하세요

```c
char *result = typecast_auto_tag(text);
if (result != NULL) {  // NULL 체크!
    printf("%s\n", result);
    typecast_free(result);
}
```

### 4. 프로그램 종료 전 정리하세요

```c
// 프로그램 종료 전에 호출
typecast_cleanup();
```

---

## 문의

라이브러리 사용 중 문제가 발생하면 담당자에게 문의해 주세요.

---

## 체크리스트

사용 전 확인 사항:

- [ ] `libtypecast_autotag.so` 파일이 있나요?
- [ ] `typecast_autotag.h` 파일이 있나요?
- [ ] 두 파일이 올바른 위치에 있나요?
- [ ] 컴파일 시 `-ltypecast_autotag` 옵션을 추가했나요?
- [ ] 코드에서 `typecast_init()`을 호출했나요?
- [ ] 사용 후 `typecast_free()`를 호출했나요?
- [ ] 종료 전 `typecast_cleanup()`을 호출했나요?

모두 체크되었다면 준비 완료입니다!
