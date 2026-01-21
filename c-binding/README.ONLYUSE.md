# Typecast Autotag C Library Usage Guide

> A text preprocessing library for TTS (Text-to-Speech).  
> Converts phone numbers, amounts, dates, etc. into text suitable for natural voice output.

---

## Provided Files

| Filename                 | Description                                                |
| ------------------------ | ---------------------------------------------------------- |
| `libtypecast_autotag.so` | Library file (this file performs the actual functionality) |
| `typecast_autotag.h`     | Header file (file to `#include` in your code)              |

---

## Quick Start (Get Started in 5 Minutes)

### Step 1: Place Files

Copy the two provided files to your project folder.

```
/your/project/
├── your_program.c          ← Your source code
├── libtypecast_autotag.so  ← Library file (copy here)
└── typecast_autotag.h      ← Header file (copy here)
```

### Step 2: Write Code

Copy the example below and save it as `test.c`:

```c
#include <stdio.h>
#include "typecast_autotag.h"

int main() {
    /* 1. Initialize library (call only once at program start) */
    if (typecast_init() != 0) {
        printf("Initialization failed!\n");
        return 1;
    }
    printf("Initialization successful!\n");

    /* 2. Convert text */
    char *result = typecast_auto_tag("전화번호는 010-1234-5678입니다.");

    if (result != NULL) {
        printf("Conversion result: %s\n", result);

        /* 3. Free memory after use (important!) */
        typecast_free(result);
    }

    /* 4. Cleanup before program exit */
    typecast_cleanup();
    printf("Cleanup complete!\n");

    return 0;
}
```

### Step 3: Compile

Run the following command in your terminal:

```bash
gcc -o test test.c -L. -ltypecast_autotag -Wl,-rpath,.
```

> **Command explanation:**
>
> - `gcc` : C compiler
> - `-o test` : Set output file name to `test`
> - `test.c` : Source file to compile
> - `-L.` : Look for libraries in current folder
> - `-ltypecast_autotag` : Use `libtypecast_autotag.so` library
> - `-Wl,-rpath,.` : Look for libraries in current folder at runtime

### Step 4: Run

```bash
./test
```

**Expected output:**

```
Initialization successful!
Conversion result: 전화번호는 공 . 일 . 공 . 일 . 이 . 삼 . 사 . 오 . 육 . 칠 . 팔 입니다.
Cleanup complete!
```

Congratulations! The library is working correctly!

---

## Function Reference

This library requires only **5 functions**:

### Initialization Functions

#### `typecast_init()`

Call **only once** when your program starts.

```c
int result = typecast_init();
if (result != 0) {
    // Handle initialization failure
}
```

| Return Value | Meaning |
| ------------ | ------- |
| `0`          | Success |
| `-1`         | Failure |

---

#### `typecast_cleanup()`

Call **only once** when your program exits.

```c
typecast_cleanup();
```

---

### Conversion Functions (Choose 1 of 3)

#### Method 1: `typecast_auto_tag()` - Fully Automatic (Recommended!)

**The easiest method.** Just pass text and it converts automatically.

```c
char *result = typecast_auto_tag("전화번호는 010-1234-5678입니다.");
// Result: "전화번호는 공 . 일 . 공 . 일 . 이 . 삼 . 사 . 오 . 육 . 칠 . 팔 입니다."
```

**Automatically recognized patterns:**

- Phone: `010-1234-5678` → 공 . 일 . 공 . 일 . 이 . 삼 . 사 . 오 . 육 . 칠 . 팔
- Money: `50000원` → 오만 원
- Date: `2024-03-15` → 이천이십사년 삼 월 십오 일
- Time: `14:30` → 오후 두 시 삼십 분
- Percent: `30%` → 삼십 퍼센트
- Order: `3번째` → 세 번째
- Floor: `5층` → 오 층
- Duration: `3개월` → 삼 개월
- And many more patterns...

---

#### Method 2: `typecast_manual_tag()` - Manual Tags

Use when you want to precisely specify and convert certain parts.

```c
char *result = typecast_manual_tag("name(김철수)님 안녕하세요.");
// Result: "김 . 철 . 수 님 안녕하세요."
```

**Available Tags (37 total):**

| Tag                    | Purpose       | Example                                             |
| ---------------------- | ------------- | --------------------------------------------------- |
| `name(name)`           | Read name     | `name(김철수)` → 김 . 철 . 수                       |
| `phone(number)`        | Phone number  | `phone(010-1234-5678)` → 공 . 일 . 공 . 일 . 이...  |
| `money(amount)`        | Amount        | `money(50000)` → 오만 원                            |
| `date(date)`           | Date          | `date(2024-03-15)` → 이천이십사년 삼 월 십오 일     |
| `time(time)`           | Time          | `time(14:30)` → 오후 두 시 삼십 분                  |
| `datetime(datetime)`   | Date+Time     | `datetime(2024-03-15T14:30)`                        |
| `year(year)`           | Year          | `year(2024)` → 이천이십사년                         |
| `month(month)`         | Month         | `month(3)` → 삼월                                   |
| `day(day)`             | Day           | `day(15)` → 십오일                                  |
| `order(order)`         | Order         | `order(3)` → 세 번째                                |
| `digits(number)`       | Digit by digit| `digits(123)` → 1 . 2 . 3                           |
| `number(number)`       | Number        | `number(7)` → 칠 번                                 |
| `point(score)`         | Score         | `point(95)` → 구십오 점                             |
| `piece(count)`         | Count         | `piece(3)` → 세 개                                  |
| `ratio(ratio)`         | Ratio         | `ratio(30%)` → 삼십 퍼센트                          |
| `minsec(time)`         | Min/Sec       | `minsec(5m30s)` → 오 분 삼십 초                     |
| `jari(digits)`         | Digit count   | `jari(4)` → 네 자리                                 |
| `floor(floor)`         | Floor         | `floor(5)` → 오 층                                  |
| `duration(duration)`   | Duration      | `duration(3개월)` → 삼 개월                         |
| `account(account)`     | Account number| `account(110-123-456789)`                           |
| `weight(weight)`       | Weight        | `weight(5kg)` → 오 킬로그램                         |
| `mile(miles)`          | Mileage       | `mile(1000)` → 천 마일                              |
| `area(area)`           | Area          | `area(30평)` → 삼십 평                              |
| `serial(serial)`       | Serial number | `serial(ABC-123)`                                   |
| `bakil(stay)`          | Stay duration | `bakil(2박3일)` → 이 박 삼 일                       |
| `roomNumber(room)`     | Room number   | `roomNumber(1205)` → 일 이 공 오 호                 |
| `jong(type)`           | Type count    | `jong(5)` → 다섯 종                                 |
| `distance(distance)`   | Distance      | `distance(5km)` → 오 킬로미터                       |
| `carNumber(plate)`     | License plate | `carNumber(12가3456)`                               |
| `flight(flight)`       | Flight number | `flight(KE123)` → 케이 이 일 이 삼                  |
| `seat(seat)`           | Seat number   | `seat(23A)` → 이십삼 에이                           |
| `lecture(lecture)`     | Lecture count | `lecture(26)` → 이십육 강                           |
| `fraction(fraction)`   | Fraction      | `fraction(1/4)` → 사 분의 일                        |
| `temperature(temp)`    | Temperature   | `temperature(25℃)` → 이십오 도                      |
| `volume(volume)`       | Volume        | `volume(500ml)` → 오백 밀리리터                     |
| `dataCapacity(data)`   | Data capacity | `dataCapacity(100GB)` → 백 기가바이트               |
| `inch(inch)`           | Inch          | `inch(55인치)` → 오십오 인치                        |

---

#### Method 3: `typecast_auto_tag_with_manual()` - Auto + Manual

Use when you want automatic conversion but need tags for **things hard to recognize automatically** like names.

```c
char *result = typecast_auto_tag_with_manual("name(김철수)님, 잔액은 50000원입니다.");
// Result: "김 . 철 . 수 님, 잔액은 오만 원 입니다."
```

> **Explanation:** `name(김철수)` is processed as a tag, while `50000원` is automatically recognized and converted.

---

### Memory Free Function

#### `typecast_free()`

You **must** free strings returned by conversion functions.

```c
char *result = typecast_auto_tag("안녕하세요");
// ... use result ...
typecast_free(result);  // Must call after use!
```

> **Warning:** Memory leak occurs if you don't call `typecast_free()`!

---

## Which Function Should I Use?

| Situation                            | Function to Use                   | Description                               |
| ------------------------------------ | --------------------------------- | ----------------------------------------- |
| Text **without names**               | `typecast_auto_tag()`             | **Recommended!** Fully automatic          |
| Text **with names**                  | `typecast_auto_tag_with_manual()` | Names with tags, rest automatic           |
| Need legacy system compatibility     | `typecast_manual_tag()`           | Only convert tagged parts                 |

**Summary:**

- **Most cases:** Use `typecast_auto_tag()` (Recommended!)
- **With names:** Use `typecast_auto_tag_with_manual()`
- **Legacy compatibility:** Use `typecast_manual_tag()`

---

## Practical Examples

### Example 1: IVR Announcement

```c
#include <stdio.h>
#include "typecast_autotag.h"

int main() {
    typecast_init();

    // Generate announcement with customer info
    char text[256];
    sprintf(text, "name(%s)님, 현재 잔액은 %d원입니다. 문의사항은 %s로 연락주세요.",
            "김철수", 1500000, "1588-1234");

    char *result = typecast_auto_tag_with_manual(text);
    printf("TTS text: %s\n", result);
    // Output: "김 . 철 . 수 님, 현재 잔액은 백오십만 원 입니다. 문의사항은 일 . 오 . 팔 . 팔 . 일 . 이 . 삼 . 사 로 연락주세요."

    typecast_free(result);
    typecast_cleanup();
    return 0;
}
```

### Example 2: Reservation Confirmation

```c
char *result = typecast_auto_tag_with_manual(
    "name(홍길동)님의 예약이 확인되었습니다. "
    "예약일시는 2024-03-15 14:30입니다. "
    "예약번호는 1234입니다."
);
// Output: "홍 . 길 . 동 님의 예약이 확인되었습니다.
//          예약일시는 이천이십사년 삼 월 십오 일 오후 두 시 삼십 분 입니다.
//          예약번호는 천이백삼십사 입니다."
```

### Example 3: Payment Notification

```c
char *result = typecast_auto_tag(
    "결제 금액은 125000원이며, 할인율은 10%입니다."
);
// Output: "결제 금액은 십이만오천 원 이며, 할인율은 십 퍼센트 입니다."
```

---

## Compile Options Summary

### Basic Compilation

```bash
gcc -o program_name source.c -Llibrary_path -ltypecast_autotag -Wl,-rpath,library_path
```

### Example: Library in Current Folder

```bash
gcc -o myprogram myprogram.c -L. -ltypecast_autotag -Wl,-rpath,.
```

### Example: Library in /opt/lib

```bash
gcc -o myprogram myprogram.c -L/opt/lib -ltypecast_autotag -Wl,-rpath,/opt/lib
```

### Example: Library Installed System-wide

```bash
# 1. Copy library (requires admin privileges)
sudo cp libtypecast_autotag.so /usr/local/lib/
sudo cp typecast_autotag.h /usr/local/include/

# 2. Update library cache
sudo ldconfig

# 3. Compile (simpler now)
gcc -o myprogram myprogram.c -ltypecast_autotag
```

---

## FAQ

### Q1. "error while loading shared libraries" error

**Symptom:**

```
./myprogram: error while loading shared libraries: libtypecast_autotag.so: cannot open shared object file: No such file or directory
```

**Solution 1:** Specify library path when running

```bash
LD_LIBRARY_PATH=/path/to/library ./myprogram
```

**Solution 2:** Add rpath option when compiling

```bash
gcc -o myprogram myprogram.c -L. -ltypecast_autotag -Wl,-rpath,.
```

**Solution 3:** Install library to system

```bash
sudo cp libtypecast_autotag.so /usr/local/lib/
sudo ldconfig
```

---

### Q2. "undefined reference" error

**Symptom:**

```
undefined reference to `typecast_init'
```

**Cause:** Library not linked during compilation.

**Solution:**

```bash
gcc -o myprogram myprogram.c -L. -ltypecast_autotag
                              ^^^^^^^^^^^^^^^^^^^^
                              This part must not be missing!
```

---

### Q3. Header file not found

**Symptom:**

```
fatal error: typecast_autotag.h: No such file or directory
```

**Solution 1:** Copy header file to same folder as source file

**Solution 2:** Specify header file path

```bash
gcc -o myprogram myprogram.c -I/path/to/header -L. -ltypecast_autotag
```

---

### Q4. Initialization fails

**Symptom:**

```c
if (typecast_init() != 0) {
    // Enters here
}
```

**Possible causes:**

1. Out of memory
2. Corrupted library file

**Solution:** Try copying the library file again.

---

### Q5. Korean characters are garbled

**Cause:** File encoding is not UTF-8.

**Check:** Make sure your source file is saved as UTF-8.

---

## Supported Environments

### Available Libraries

#### Default Build (Single Architecture)

| Platform | Architecture   | Output File               | Size   | Status       |
| -------- | -------------- | ------------------------- | ------ | ------------ |
| Linux    | x86_64         | libtypecast_autotag.so    | ~731KB | ✅ Supported |
| macOS    | x86_64 + arm64 | libtypecast_autotag.dylib | ~1.6MB | ✅ Universal |
| Windows  | x86_64         | typecast_autotag.dll      | ~727KB | ✅ Supported |

#### Multi-Architecture Build

| Platform | Architecture | Output File                   | Size   | Status       |
| -------- | ------------ | ----------------------------- | ------ | ------------ |
| Linux    | x86_64       | libtypecast_autotag_x86_64.so | ~731KB | ✅ Supported |
| Linux    | x86 (32-bit) | libtypecast_autotag_x86.so    | ~771KB | ✅ Supported |
| Linux    | arm64        | libtypecast_autotag_arm64.so  | ~689KB | ✅ Supported |
| Linux    | armv7        | libtypecast_autotag_armv7.so  | ~559KB | ✅ Supported |
| macOS    | x86_64+arm64 | libtypecast_autotag.dylib     | ~1.6MB | ✅ Universal |
| Windows  | x86_64       | typecast_autotag_x86_64.dll   | ~727KB | ✅ Supported |
| Windows  | x86 (32-bit) | typecast_autotag_i686.dll     | ~729KB | ✅ Supported |

### Tested Environments

| Operating System | Architecture | Support Status |
| ---------------- | ------------ | -------------- |
| CentOS 6.9+      | x86_64       | ✅ Supported   |
| Amazon Linux 2   | x86_64       | ✅ Supported   |
| Debian/Ubuntu    | x86_64/arm64 | ✅ Supported   |
| macOS 11+        | x86_64/arm64 | ✅ Supported   |
| Windows 10+      | x86_64/x86   | ✅ Supported   |

---

## Important Notes

### 1. Always initialize before use

```c
// [X] Wrong usage
char *result = typecast_auto_tag("안녕");  // Not initialized!

// [O] Correct usage
typecast_init();  // Initialize first
char *result = typecast_auto_tag("안녕");
```

### 2. Always free memory

```c
// [X] Wrong usage (memory leak!)
char *result = typecast_auto_tag("안녕");
// typecast_free(result) not called

// [O] Correct usage
char *result = typecast_auto_tag("안녕");
// ... use result ...
typecast_free(result);  // Must call!
```

### 3. Check for NULL

```c
char *result = typecast_auto_tag(text);
if (result != NULL) {  // NULL check!
    printf("%s\n", result);
    typecast_free(result);
}
```

### 4. Cleanup before program exit

```c
// Call before program exits
typecast_cleanup();
```

---

## Support

If you encounter problems while using the library, please contact the maintainer.

---

## Checklist

Items to verify before use:

- [ ] Do you have the `libtypecast_autotag.so` file?
- [ ] Do you have the `typecast_autotag.h` file?
- [ ] Are both files in the correct location?
- [ ] Did you add `-ltypecast_autotag` option when compiling?
- [ ] Did you call `typecast_init()` in your code?
- [ ] Did you call `typecast_free()` after use?
- [ ] Did you call `typecast_cleanup()` before exit?

If all items are checked, you're ready to go!
