# Typecast Autotag C Library

C bindings for the TTS (Text-to-Speech) text preprocessing library.
Automatically converts various patterns like phone numbers, dates, and amounts into formats suitable for voice synthesis.

## Features

- **Easy to use**: Complete functionality with just 3 functions
- **Flexible approach**: Supports fully automatic, manual tag, and hybrid modes
- **Wide pattern support**: Auto-recognition of 35+ patterns including phone, date, time, money, order
- **High compatibility**: Supports from CentOS 6.9 to latest Linux (static linking)

## Quick Start

### 1. File Placement

```
/path/to/your/project/
├── your_program.c
├── libtypecast_autotag.so   # Library file
└── typecast_autotag.h       # Header file
```

### 2. Write Code

```c
#include <stdio.h>
#include "typecast_autotag.h"

int main() {
    // 1. Initialize (call once at program start)
    if (typecast_init() != 0) {
        fprintf(stderr, "Initialization failed\n");
        return 1;
    }

    // 2. Convert text
    char *result = typecast_auto_tag("전화번호는 010-1234-5678입니다.");
    if (result) {
        printf("%s\n", result);
        // Output: "전화번호는 공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔 입니다."

        typecast_free(result);  // Free memory
    }

    // 3. Cleanup (call before program exit)
    typecast_cleanup();
    return 0;
}
```

### 3. Compile and Run

```bash
# Compile
gcc -o my_program my_program.c -L. -ltypecast_autotag -Wl,-rpath,.

# Run
./my_program
```

## API Reference

### Initialization and Cleanup

```c
int typecast_init(void);     // Initialize (success: 0, failure: -1)
void typecast_cleanup(void); // Cleanup
```

### Conversion Functions

| Function                          | Description      | Use Case                                           |
| --------------------------------- | ---------------- | -------------------------------------------------- |
| `typecast_auto_tag()`             | Fully automatic  | When you want all patterns processed automatically |
| `typecast_manual_tag()`           | Manual tags only | Legacy system compatibility, explicit control      |
| `typecast_auto_tag_with_manual()` | Hybrid mode      | Mostly automatic + manual tags for supplements     |

```c
char* typecast_auto_tag(const char *text);
char* typecast_auto_tag_with_manual(const char *text);
char* typecast_manual_tag(const char *text);
void typecast_free(char *str);  // Free result string
```

## Detailed Usage

### Method 1: Fully Automatic (`typecast_auto_tag`)

Automatically recognizes and converts patterns in text.
**Most convenient method** - sufficient for most cases.

```c
// Input: "전화번호는 010-1234-5678입니다."
// Output: "전화번호는 공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔 입니다."
char *result = typecast_auto_tag("전화번호는 010-1234-5678입니다.");

// Input: "총 금액은 1500000원입니다."
// Output: "총 금액은 백오십만 원 입니다."
char *result = typecast_auto_tag("총 금액은 1500000원입니다.");

// Input: "회의는 2024-03-15 14:30에 시작합니다."
// Output: "회의는 이천이십사년 삼 월 십오 일 오후 두 시 삼십 분 에 시작합니다."
char *result = typecast_auto_tag("회의는 2024-03-15 14:30에 시작합니다.");
```

**Supported Patterns:**

- Phone numbers: `010-1234-5678`, `02-123-4567`, `1588-1234`
- Money: `50000원`, `1500만원`, `₩10000`
- Dates: `2024-03-15`, `2024년 3월 15일`, `20240315`
- Time: `14:30`, `오후 2시 30분`
- Order: `1등`, `3번째`, `5위`
- Ratio: `30%`, `3:7`
- Duration: `3개월`, `2년`, `5일간`
- Floor: `지하 2층`, `5층`, `B1층`
- Others: scores, area, distance, weight, mileage, etc.

### Method 2: Manual Tags Only (`typecast_manual_tag`)

Use when **legacy system compatibility** is needed or you want **explicit control**.
Tag format: `tagName(value)`

```c
// Input: "name(김철수)님 안녕하세요."
// Output: "김 철 수님 안녕하세요."
char *result = typecast_manual_tag("name(김철수)님 안녕하세요.");

// Input: "phone(010-1234-5678)로 연락주세요."
// Output: "공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔로 연락주세요."
char *result = typecast_manual_tag("phone(010-1234-5678)로 연락주세요.");
```

**Supported Tags (37 total):**

| Tag                  | Description         | Example                                         |
| -------------------- | ------------------- | ----------------------------------------------- |
| `name(name)`         | Read name           | `name(김철수)` → 김 철 수                       |
| `phone(number)`      | Read phone number   | `phone(010-1234-5678)` → 공 일 공 다시...       |
| `money(amount)`      | Read amount         | `money(50000)` → 오만 원                        |
| `date(date)`         | Read date           | `date(2024-03-15)` → 이천이십사년 삼 월 십오 일 |
| `time(time)`         | Read time           | `time(14:30)` → 오후 두 시 삼십 분              |
| `datetime(datetime)` | Read date+time      | `datetime(2024-03-15T14:30)`                    |
| `year(year)`         | Read year           | `year(2024)` → 이천이십사년                     |
| `month(month)`       | Read month          | `month(3)` → 삼월                               |
| `day(day)`           | Read day            | `day(15)` → 십오일                              |
| `order(order)`       | Read order          | `order(3)` → 세 번째                            |
| `point(score)`       | Read score          | `point(95)` → 구십오 점                         |
| `piece(count)`       | Read count (native) | `piece(3)` → 세 개                              |
| `digits(number)`     | Read digit by digit | `digits(123)` → 일 이 삼                        |
| `number(number)`     | Read number         | `number(7)` → 칠 번                             |
| `minsec(time)`       | Read min/sec        | `minsec(5m30s)` → 오 분 삼십 초                 |
| `ratio(ratio)`       | Read ratio/percent  | `ratio(30%)` → 삼십 퍼센트                      |
| `jari(digits)`       | Read digit count    | `jari(4)` → 네 자리                             |
| `duration(duration)` | Read duration       | `duration(3개월)` → 삼 개월                     |
| `floor(floor)`       | Read floor          | `floor(B2)` → 지하 이 층                        |
| `account(account)`   | Read account number | `account(110-123-456789)`                       |
| `weight(weight)`     | Read weight         | `weight(5kg)` → 오 킬로그램                     |
| `mile(miles)`        | Read mileage        | `mile(1000)` → 천 마일                          |
| `area(area)`         | Read area           | `area(30평)` → 삼십 평                          |
| `serial(serial)`     | Read serial number  | `serial(ABC-123)`                               |
| `bakil(stay)`        | Read stay duration  | `bakil(2박3일)` → 이 박 삼 일                   |
| `roomNumber(room)`   | Read room number    | `roomNumber(1205)` → 일 이 공 오 호             |
| `jong(type)`         | Read type count     | `jong(5)` → 다섯 종                             |
| `distance(distance)` | Read distance       | `distance(5km)` → 오 킬로미터                   |
| `carNumber(plate)`   | Read license plate  | `carNumber(12가3456)`                           |
| `flight(flight)`     | Read flight number  | `flight(KE123)` → 케이 이 일 이 삼              |
| `seat(seat)`         | Read seat number    | `seat(23A)` → 이십삼 에이                       |
| `lecture(lecture)`   | Read lecture count  | `lecture(26)` → 이십육 강                       |
| `fraction(fraction)` | Read fraction       | `fraction(1/4)` → 사 분의 일                    |
| `temperature(temp)`  | Read temperature    | `temperature(25℃)` → 이십오 도                  |
| `volume(volume)`     | Read volume         | `volume(500ml)` → 오백 밀리리터                 |
| `dataCapacity(data)` | Read data capacity  | `dataCapacity(100GB)` → 백 기가바이트           |
| `inch(inch)`         | Read inch           | `inch(55인치)` → 오십오 인치                    |

### Method 3: Hybrid Mode (`typecast_auto_tag_with_manual`)

**Supplement auto-tagging with manual tags** for parts that are incorrectly recognized.
Manual tags are processed first, then auto-tagging is applied to the rest.

```c
// Name with manual tag, amount automatically
// Input: "name(김철수)님, 잔액은 50000원입니다."
// Output: "김 철 수님, 잔액은 오만 원 입니다."
char *result = typecast_auto_tag_with_manual("name(김철수)님, 잔액은 50000원입니다.");

// Complex example
// Input: "name(홍길동)님, 2024-03-15 14:30에 phone(02-123-4567)로 연락드리겠습니다."
char *result = typecast_auto_tag_with_manual(
    "name(홍길동)님, 2024-03-15 14:30에 phone(02-123-4567)로 연락드리겠습니다."
);
```

## Build

### Local Build (macOS/Linux)

```bash
cd c-binding

# Download and build QuickJS
make quickjs

# Generate JS bundle
make bundle

# Build shared library
make all

# Test
make test
```

### Docker Build (CentOS 6.9 Compatible)

```bash
cd c-binding

# Build Docker image and generate .so
./scripts/build-linux.sh

# Output files
# - build/libtypecast_autotag.so
# - build/typecast_autotag.h
```

### E2E Tests

Automatically tests the built library on CentOS 6.9 and Amazon Linux 2.

```bash
# From project root
pnpm test:e2e
```

**Test Coverage:**

| Category                        | Test Count | Description               |
| ------------------------------- | ---------- | ------------------------- |
| `typecast_manual_tag`           | 37         | All manual tags (37)      |
| `typecast_auto_tag`             | 8          | Auto-recognition patterns |
| `typecast_auto_tag_with_manual` | 4          | Manual + auto hybrid      |
| **Total**                       | **49**     | 49 tests × 2 environments |

**Test Environments:**

- CentOS 6.9 (glibc 2.12)
- Amazon Linux 2 (glibc 2.26)

**Sample Output:**

```
==============================================
  Typecast Autotag C Library E2E Test
==============================================

=== Testing typecast_manual_tag (37 tags) ===
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
  Total:  49
  Passed: 49
  Failed: 0
===========================================

✓ CentOS 6.9: ALL TESTS PASSED
✓ Amazon Linux 2: ALL TESTS PASSED

All E2E tests passed!
```

## Deployment

### Required Files

| File                     | Description    |
| ------------------------ | -------------- |
| `libtypecast_autotag.so` | Shared library |
| `typecast_autotag.h`     | C header file  |

### Installation

```bash
# Install to system library directory
sudo cp libtypecast_autotag.so /usr/local/lib/
sudo cp typecast_autotag.h /usr/local/include/
sudo ldconfig

# Or place with project and use rpath
gcc -o program program.c -L. -ltypecast_autotag -Wl,-rpath,'$ORIGIN'
```

## Target Environments

| Environment    | Architecture | Status                     |
| -------------- | ------------ | -------------------------- |
| Amazon Linux 2 | x86_64       | ✅ Supported               |
| CentOS 6.9     | x86_64       | ✅ Supported (static link) |

## Important Notes

1. **Initialization**: Call `typecast_init()` **only once** at program start
2. **Memory management**: Always free returned strings with `typecast_free()`
3. **Encoding**: Input text must use **UTF-8** encoding
4. **Thread safety**: Uses mutex internally, safe for multi-threaded environments

## Support

If you encounter issues or need help, please file an issue.
