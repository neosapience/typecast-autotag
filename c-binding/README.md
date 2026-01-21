# Typecast Autotag C Library

C bindings for the TTS (Text-to-Speech) text preprocessing library.
Automatically converts various patterns like phone numbers, dates, and amounts into formats suitable for voice synthesis.

**[한국어 문서](./README.KR.md)**

## Features

- **Multi-language Support**: Full support for Korean and English text preprocessing
- **Easy to use**: Complete functionality with just 3 functions
- **Flexible approach**: Supports fully automatic, manual tag, and hybrid modes
- **Wide pattern support**: Auto-recognition of 35+ patterns including phone, date, time, money, order
- **Cross-platform**: Supports Linux (.so), Windows (.dll), and macOS (.dylib)
- **High compatibility**: Supports from CentOS 6.9 to latest Linux (static linking)

## Supported Languages

| Language | Status | Example |
| -------- | ------ | ------- |
| **Korean** (한국어) | ✅ Full Support | `010-1234-5678` → `공 . 일 . 공 . 일 . 이 . 삼 . 사...` |
| **English** | ✅ Full Support | `555-123-4567` → `five five five, one two three...` |

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

    // 2. Convert text (Korean)
    char *result = typecast_auto_tag("전화번호는 010-1234-5678입니다.");
    if (result) {
        printf("%s\n", result);
        // Output: "전화번호는 공 . 일 . 공 . 일 . 이 . 삼 . 사 . 오 . 육 . 칠 . 팔 입니다."
        typecast_free(result);
    }

    // 3. Convert text (English)
    char *result_en = typecast_auto_tag_en("Call me at 555-123-4567.");
    if (result_en) {
        printf("%s\n", result_en);
        // Output: "Call me at five five five, one two three, four five six seven."
        typecast_free(result_en);
    }

    // 4. Cleanup (call before program exit)
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

#### Korean (Default)

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

#### English

| Function                             | Description      | Use Case                                           |
| ------------------------------------ | ---------------- | -------------------------------------------------- |
| `typecast_auto_tag_en()`             | Fully automatic  | When you want all patterns processed automatically |
| `typecast_manual_tag_en()`           | Manual tags only | Legacy system compatibility, explicit control      |
| `typecast_auto_tag_with_manual_en()` | Hybrid mode      | Mostly automatic + manual tags for supplements     |

```c
char* typecast_auto_tag_en(const char *text);
char* typecast_auto_tag_with_manual_en(const char *text);
char* typecast_manual_tag_en(const char *text);
```

## Detailed Usage

### Method 1: Fully Automatic (`typecast_auto_tag` / `typecast_auto_tag_en`)

Automatically recognizes and converts patterns in text.
**Most convenient method** - sufficient for most cases.

#### Korean Examples

```c
// Input: "전화번호는 010-1234-5678입니다."
// Output: "전화번호는 공 . 일 . 공 . 일 . 이 . 삼 . 사 . 오 . 육 . 칠 . 팔 입니다."
char *result = typecast_auto_tag("전화번호는 010-1234-5678입니다.");

// Input: "총 금액은 1500000원입니다."
// Output: "총 금액은 백오십만 원 입니다."
char *result = typecast_auto_tag("총 금액은 1500000원입니다.");

// Input: "회의는 2024-03-15 14:30에 시작합니다."
// Output: "회의는 이천이십사년 삼 월 십오 일 오후 두 시 삼십 분 에 시작합니다."
char *result = typecast_auto_tag("회의는 2024-03-15 14:30에 시작합니다.");
```

#### English Examples

```c
// Input: "Call me at 555-123-4567."
// Output: "Call me at five five five, one two three, four five six seven."
char *result = typecast_auto_tag_en("Call me at 555-123-4567.");

// Input: "Total is $1,500."
// Output: "Total is one thousand five hundred dollars."
char *result = typecast_auto_tag_en("Total is $1,500.");

// Input: "Meeting is at 2:30 PM."
// Output: "Meeting is at two thirty PM."
char *result = typecast_auto_tag_en("Meeting is at 2:30 PM.");
```

**Supported Patterns (Korean):**

- Phone numbers: `010-1234-5678`, `02-123-4567`, `1588-1234`
- Money: `50000원`, `1500만원`, `₩10000`
- Dates: `2024-03-15`, `2024년 3월 15일`, `20240315`
- Time: `14:30`, `오후 2시 30분`
- Order: `1등`, `3번째`, `5위`
- Ratio: `30%`, `3:7`
- Duration: `3개월`, `2년`, `5일간`
- Floor: `지하 2층`, `5층`, `B1층`
- Others: scores, area, distance, weight, mileage, etc.

**Supported Patterns (English):**

- Phone numbers: `555-123-4567`, `(212) 555-1234`, `1-800-555-1234`
- Money: `$1,500`, `€100`, `50 dollars`
- Dates: `January 15, 2024`, `2024-01-15`
- Time: `2:30 PM`, `10:00 AM`
- Order: `1st place`, `2nd`, `3rd`
- Ratio: `50%`, `1:2`
- Duration: `3 months`, `2 years`
- Floor: `5th floor`, `B1`, `basement level 2`
- Others: scores, area, distance, weight, temperature, etc.

### Method 2: Manual Tags Only (`typecast_manual_tag`)

Use when **legacy system compatibility** is needed or you want **explicit control**.
Tag format: `tagName(value)`

```c
// Input: "name(김철수)님 안녕하세요."
// Output: "김 . 철 . 수 님 안녕하세요."
char *result = typecast_manual_tag("name(김철수)님 안녕하세요.");

// Input: "phone(010-1234-5678)로 연락주세요."
// Output: "공 . 일 . 공 . 일 . 이 . 삼 . 사 . 오 . 육 . 칠 . 팔 로 연락주세요."
char *result = typecast_manual_tag("phone(010-1234-5678)로 연락주세요.");
```

**Supported Tags (37 total):**

| Tag                  | Description         | Example                                         |
| -------------------- | ------------------- | ----------------------------------------------- |
| `name(name)`         | Read name           | `name(김철수)` → 김 . 철 . 수                   |
| `phone(number)`      | Read phone number   | `phone(010-1234-5678)` → 공 . 일 . 공 . 일 . 이...  |
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
| `digits(number)`     | Read digit by digit | `digits(123)` → 1 . 2 . 3                       |
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
// Output: "김 . 철 . 수 님, 잔액은 오만 원 입니다."
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

# Download Duktape
make duktape

# Generate JS bundle
make bundle

# Build shared library
make all

# Test
make test
```

### Docker Build - Linux (CentOS 6.9 Compatible)

```bash
cd c-binding

# Build Docker image and generate .so
./scripts/build-linux.sh

# Output files
# - build/libtypecast_autotag.so
# - build/typecast_autotag.h
```

### Docker Build - Windows DLL

```bash
cd c-binding

# Build Windows DLL using MinGW-w64 in Docker
./scripts/build-windows.sh

# Or use make target
make docker-build-windows

# Output files
# - build/typecast_autotag.dll   (Windows DLL)
# - build/typecast_autotag.lib   (Import library for linking)
# - build/typecast_autotag.h
```

### Docker Build - macOS (Universal Binary)

```bash
cd c-binding

# Build macOS universal binary (x86_64 + arm64)
# Note: Must be run on macOS
./scripts/build-macos.sh

# Or use make target
make macos-universal

# Output files
# - build/libtypecast_autotag.dylib  (Universal Binary)
# - build/typecast_autotag.h
```

### Build All Platforms

```bash
cd c-binding

# Build Linux, Windows, and macOS (default x86_64 only)
make all-platforms

# Or use pnpm
pnpm c-binding:build-all

# Output files
# - build/libtypecast_autotag.so     (Linux x86_64)
# - build/libtypecast_autotag.dylib  (macOS universal)
# - build/typecast_autotag.dll       (Windows x86_64)
# - build/typecast_autotag.lib       (Windows import lib)
```

### Build All Platforms & All Architectures

```bash
cd c-binding

# Build for all platforms and all architectures
make all-multiarch

# Or use pnpm
pnpm c-binding:build-all-multiarch

# Output files (Linux)
# - build/libtypecast_autotag_x86_64.so   (Linux x86_64)
# - build/libtypecast_autotag_x86.so      (Linux x86 32-bit)
# - build/libtypecast_autotag_arm64.so    (Linux arm64)
# - build/libtypecast_autotag_armv7.so    (Linux armv7 32-bit)
# - build/libtypecast_autotag.so          (symlink to x86_64)

# Output files (Windows)
# - build/typecast_autotag_x86_64.dll     (Windows x86_64)
# - build/typecast_autotag_i686.dll       (Windows x86 32-bit)
# - build/typecast_autotag.dll            (copy of x86_64)

# Output files (macOS)
# - build/libtypecast_autotag.dylib       (Universal: x86_64 + arm64)
```

### E2E Tests

Automatically tests the built library on multiple platforms and architectures.

```bash
# From project root

# Test all platforms and all architectures (default)
pnpm test:e2e

# Test Linux only (x86_64)
pnpm test:e2e:linux

# Test Linux all architectures (x86_64, x86, arm64, armv7)
pnpm test:e2e:linux-multiarch

# Test Windows only (x86_64)
pnpm test:e2e:windows

# Test Windows all architectures (x86_64, i686)
pnpm test:e2e:windows-multiarch

# Test macOS (universal binary, local execution)
pnpm test:e2e:macos
```

**Test Coverage:**

| Category                        | Test Count | Description               |
| ------------------------------- | ---------- | ------------------------- |
| `typecast_manual_tag`           | 37         | All manual tags (37)      |
| `typecast_auto_tag`             | 8          | Auto-recognition patterns |
| `typecast_auto_tag_with_manual` | 4          | Manual + auto hybrid      |
| **Total**                       | **49**     | 49 tests per environment  |

**Test Environments (Multi-Arch):**

| Platform | Architecture | Test Environment              |
| -------- | ------------ | ----------------------------- |
| Linux    | x86_64       | Debian Bullseye (amd64)       |
| Linux    | x86          | Debian Bullseye (i386)        |
| Linux    | arm64        | Debian Bullseye (arm64)       |
| Linux    | armv7        | Debian Bullseye (arm/v7)      |
| Windows  | x86_64       | Wine64 on Debian              |
| Windows  | i686         | Wine32 on Debian              |
| macOS    | universal    | Local macOS (x86_64 + arm64)  |

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

#### Linux

| File                     | Description    |
| ------------------------ | -------------- |
| `libtypecast_autotag.so` | Shared library |
| `typecast_autotag.h`     | C header file  |

#### macOS

| File                       | Description                          |
| -------------------------- | ------------------------------------ |
| `libtypecast_autotag.dylib`| Dynamic library (Universal Binary)   |
| `typecast_autotag.h`       | C header file                        |

#### Windows

| File                   | Description                       |
| ---------------------- | --------------------------------- |
| `typecast_autotag.dll` | Dynamic Link Library              |
| `typecast_autotag.lib` | Import library (for MSVC linking) |
| `typecast_autotag.h`   | C header file                     |

### Installation

#### Linux

```bash
# Install to system library directory
sudo cp libtypecast_autotag.so /usr/local/lib/
sudo cp typecast_autotag.h /usr/local/include/
sudo ldconfig

# Or place with project and use rpath
gcc -o program program.c -L. -ltypecast_autotag -Wl,-rpath,'$ORIGIN'
```

#### macOS

```bash
# Install to system library directory
sudo cp libtypecast_autotag.dylib /usr/local/lib/
sudo cp typecast_autotag.h /usr/local/include/

# Or place with project and use rpath
clang -o program program.c -L. -ltypecast_autotag -Wl,-rpath,@executable_path
```

#### Windows

```bash
# Place DLL in application directory or system PATH
copy typecast_autotag.dll C:\path\to\your\application\
copy typecast_autotag.h C:\path\to\your\project\include\

# Compile with MSVC
cl /I. program.c typecast_autotag.lib

# Or with MinGW
gcc -o program.exe program.c -L. -ltypecast_autotag
```

## Target Environments

### Default Build (Single Architecture)

| Platform       | Architecture   | Output File                 | Size   | Status       |
| -------------- | -------------- | --------------------------- | ------ | ------------ |
| Linux          | x86_64         | libtypecast_autotag.so      | ~731KB | ✅ Supported |
| macOS          | x86_64 + arm64 | libtypecast_autotag.dylib   | ~1.6MB | ✅ Universal |
| Windows        | x86_64         | typecast_autotag.dll        | ~727KB | ✅ Supported |

### Multi-Architecture Build

| Platform | Architecture | Output File                      | Size   | Status       |
| -------- | ------------ | -------------------------------- | ------ | ------------ |
| Linux    | x86_64       | libtypecast_autotag_x86_64.so    | ~731KB | ✅ Supported |
| Linux    | x86 (32-bit) | libtypecast_autotag_x86.so       | ~771KB | ✅ Supported |
| Linux    | arm64        | libtypecast_autotag_arm64.so     | ~689KB | ✅ Supported |
| Linux    | armv7        | libtypecast_autotag_armv7.so     | ~559KB | ✅ Supported |
| macOS    | x86_64+arm64 | libtypecast_autotag.dylib        | ~1.6MB | ✅ Universal |
| Windows  | x86_64       | typecast_autotag_x86_64.dll      | ~727KB | ✅ Supported |
| Windows  | x86 (32-bit) | typecast_autotag_i686.dll        | ~729KB | ✅ Supported |

## Architecture: Duktape Integration

This C library embeds [Duktape](https://duktape.org/), a lightweight JavaScript engine, to execute the TypeScript-based autotag logic within a native C environment.

### What is Duktape?

Duktape is an **embeddable JavaScript engine** written in portable C (C99). It provides a complete ECMAScript E5/E5.1 implementation with selected ES2015+ features.

**Key characteristics:**
- **Lightweight**: ~160KB code footprint (minimal configuration)
- **Portable**: Runs on virtually any platform with a C compiler
- **Embeddable**: Designed to be integrated into C/C++ applications
- **No external dependencies**: Single source file compilation

### Why Duktape?

| Consideration | Reason |
| ------------- | ------ |
| **Code Reuse** | Directly executes the same autotag logic written in TypeScript, eliminating the need to rewrite complex text processing rules in C |
| **Consistency** | Ensures identical behavior between Node.js (TypeScript) and C library |
| **Maintainability** | Single source of truth for autotag rules - update once, deploy everywhere |
| **Cross-platform** | Duktape's portability enables the library to run on Linux, Windows, and macOS |
| **Lightweight** | Minimal overhead compared to full JavaScript runtimes like V8 |

### Version Information

| Component | Version |
| --------- | ------- |
| Duktape | **2.7.0** |
| ECMAScript | E5/E5.1 (with select ES2015+ features) |

### How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                        C Application                             │
├─────────────────────────────────────────────────────────────────┤
│  typecast_auto_tag("010-1234-5678")                             │
│         │                                                        │
│         ▼                                                        │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Typecast Autotag C Library                  │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │           Duktape JavaScript Engine              │    │    │
│  │  │  ┌─────────────────────────────────────────┐    │    │    │
│  │  │  │   Bundled TypeScript Autotag Logic      │    │    │    │
│  │  │  │   (compiled to JavaScript)              │    │    │    │
│  │  │  └─────────────────────────────────────────┘    │    │    │
│  │  └─────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────┘    │
│         │                                                        │
│         ▼                                                        │
│  "공 . 일 . 공 . 일 . 이 . 삼 . 사 . 오 . 육 . 칠 . 팔"        │
└─────────────────────────────────────────────────────────────────┘
```

**Build-time process:**
1. TypeScript autotag source code is bundled into a single JavaScript file
2. The JavaScript is converted to a C header file (`autotag_bundle.h`) as a string literal
3. At runtime, Duktape evaluates this bundled JavaScript once during `typecast_init()`

**Runtime process:**
1. `typecast_init()` creates a Duktape heap and loads the JavaScript bundle
2. Each conversion function (`typecast_auto_tag`, etc.) calls the corresponding JavaScript function
3. Results are converted from JavaScript strings to C strings
4. `typecast_cleanup()` destroys the Duktape heap when done

### Source Files

| File | Description |
| ---- | ----------- |
| `duktape/duktape-2.7.0/` | Duktape source distribution |
| `src/typecast_autotag.c` | C library implementation with Duktape integration |
| `src/bundle-entry.ts` | TypeScript entry point for the JavaScript bundle |
| `src/autotag_bundle.h` | Generated header containing the bundled JavaScript |
| `src/autotag_bundle.js` | Generated JavaScript bundle (intermediate file) |

## Important Notes

1. **Initialization**: Call `typecast_init()` **only once** at program start
2. **Memory management**: Always free returned strings with `typecast_free()`
3. **Encoding**: Input text must use **UTF-8** encoding
4. **Thread safety**: Uses mutex internally, safe for multi-threaded environments

## Support

If you encounter issues or need help, please file an issue.
