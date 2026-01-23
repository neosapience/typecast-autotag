# Typecast Autotag Java Binding

Java binding for the TTS (Text-to-Speech) text preprocessing library.
Automatically converts phone numbers, dates, amounts, and various other patterns into formats suitable for speech synthesis.

**[한국어 문서](./README.KR.md)**

## Features

- **Multi-language Support**: Full support for Korean and English text preprocessing
- **Easy to use**: Complete functionality with just 3 main functions
- **Flexible approach**: Supports fully automatic, manual tags, and hybrid modes
- **Wide pattern support**: Automatically recognizes 35+ patterns including phone numbers, dates, times, amounts, order, etc.
- **Cross-platform**: Supports Linux, Windows, and macOS
- **Java 8 compatible**: Works with Java 8 and above
- **Thread-safe**: Safe to use in multi-threaded environments

## Supported Languages

| Language | Status | Example |
| -------- | ------ | ------- |
| **Korean** (한국어) | ✅ Full Support | `010-1234-5678` → `공 . 일 . 공 . ...` |
| **English** | ✅ Full Support | `555-123-4567` → `five five five, one two three...` |

## Requirements

- Java 8 or higher
- Maven 3.x or Gradle 6.x or higher

### Quick Test

```bash
# From project root
pnpm test:java

# Or build
pnpm java-binding:build
```

## Installation

### Option 1: Download from GitHub Releases (Recommended)

```bash
# Download the latest JAR from GitHub Releases
# Replace VERSION with the latest release version (e.g., 1.3.0)
VERSION=$(curl -s https://api.github.com/repos/neosapience/typecast-autotag/releases/latest | grep '"tag_name"' | sed -E 's/.*"v([^"]+)".*/\1/')
curl -L -o typecast-autotag-${VERSION}.jar \
  https://github.com/neosapience/typecast-autotag/releases/download/v${VERSION}/typecast-autotag-${VERSION}.jar

# Use in your project
javac -cp typecast-autotag-${VERSION}.jar YourApp.java
java -cp typecast-autotag-${VERSION}.jar:. YourApp
```

Or add to your Maven project:

```xml
<dependency>
    <groupId>ai.typecast</groupId>
    <artifactId>typecast-autotag</artifactId>
    <version>${project.version}</version> <!-- Use your project's version -->
    <scope>system</scope>
    <systemPath>${project.basedir}/lib/typecast-autotag-${project.version}.jar</systemPath>
</dependency>
```

### Option 2: Build from Source

```bash
# Clone the repository
git clone https://github.com/neosapience/typecast-autotag.git
cd typecast-autotag

# Build C libraries (required)
pnpm install
pnpm c-binding:build-all

# Build Java binding (version auto-synced from package.json)
pnpm java-binding:build

# JAR file will be at: java-binding/target/typecast-autotag-{VERSION}.jar
```

### Option 3: Install to Local Maven Repository

```bash
# After building from source
cd java-binding
mvn install

# Then use in your pom.xml (check version in pom.xml)
<dependency>
    <groupId>ai.typecast</groupId>
    <artifactId>typecast-autotag</artifactId>
    <version>${typecast-autotag.version}</version> <!-- Check installed version -->
</dependency>
```

## Quick Start

```java
import ai.typecast.autotag.TypecastAutotag;

public class Example {
    public static void main(String[] args) {
        try {
            // Korean - Automatic pattern recognition and conversion
            String result = TypecastAutotag.autoTag("전화번호는 010-1234-5678입니다.");
            System.out.println(result);
            // Output: "전화번호는 공 . 일 . 공 . 일 . 이 . 삼 . 사 . 오 . 육 . 칠 . 팔입니다."

            String result2 = TypecastAutotag.autoTag("총 금액은 1500000원입니다.");
            System.out.println(result2);
            // Output: "총 금액은 백오십만 원입니다."

            // English - Automatic pattern recognition and conversion
            String resultEn = TypecastAutotag.autoTagEn("Call me at 555-123-4567.");
            System.out.println(resultEn);
            // Output: "Call me at five five five, one two three, four five six seven."

            String resultEn2 = TypecastAutotag.autoTagEn("Total is $1,500.");
            System.out.println(resultEn2);
            // Output: "Total is one thousand five hundred dollars."

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

## API Reference

### Initialization and Cleanup

```java
import ai.typecast.autotag.*;

// Initialize (automatically called on first use)
TypecastAutotag.initialize();

// Cleanup (optional, releases resources)
TypecastAutotag.cleanup();
```

**Note:** In most cases, you don't need to explicitly call `initialize()`. It's automatically called when you first use a conversion function.

### Conversion Functions

#### Korean (Default)

| Method                | Description      | Use Case                                                      |
| --------------------- | ---------------- | ------------------------------------------------------------- |
| `autoTag()`           | Fully automatic  | When you want all patterns processed automatically            |
| `manualTag()`         | Manual tags only | Legacy system compatibility, explicit control needed          |
| `autoTagWithManual()` | Hybrid           | Mostly automatic + supplement with manual tags for edge cases |

#### English

| Method                  | Description      | Use Case                                                      |
| ----------------------- | ---------------- | ------------------------------------------------------------- |
| `autoTagEn()`           | Fully automatic  | When you want all patterns processed automatically            |
| `manualTagEn()`         | Manual tags only | Legacy system compatibility, explicit control needed          |
| `autoTagWithManualEn()` | Hybrid           | Mostly automatic + supplement with manual tags for edge cases |

### Method 1: Fully Automatic (`autoTag` / `autoTagEn`)

Automatically recognizes and converts patterns in text.
**Most convenient method** - sufficient for most cases.

#### Korean Examples

```java
import ai.typecast.autotag.TypecastAutotag;

// Phone number
String result = TypecastAutotag.autoTag("전화번호는 010-1234-5678입니다.");
// → "전화번호는 공 . 일 . 공 . 일 . 이 . 삼 . 사 . 오 . 육 . 칠 . 팔입니다."

// Money
String result2 = TypecastAutotag.autoTag("총 금액은 1500000원입니다.");
// → "총 금액은 백오십만 원입니다."

// Date and time
String result3 = TypecastAutotag.autoTag("회의는 2024-03-15 14:30에 시작합니다.");
// → "회의는 이천이십사년 삼 월 십오 일 오후 두 시 삼십 분에 시작합니다."
```

#### English Examples

```java
import ai.typecast.autotag.TypecastAutotag;

// Phone number
String result = TypecastAutotag.autoTagEn("Call me at 555-123-4567.");
// → "Call me at five five five, one two three, four five six seven."

// Money
String result2 = TypecastAutotag.autoTagEn("Total is $1,500.");
// → "Total is one thousand five hundred dollars."

// Date and time
String result3 = TypecastAutotag.autoTagEn("Meeting is at 2:30 PM.");
// → "Meeting is at two thirty PM."
```

**Supported Patterns (Korean):**

- Phone numbers: `010-1234-5678`, `02-123-4567`, `1588-1234`
- Money: `50000원`, `1500만원`, `₩10000`
- Dates: `2024-03-15`, `2024년 3월 15일`, `20240315`
- Time: `14:30`, `오후 2시 30분`
- Order: `1등`, `3번째`, `5위`
- Ratio: `30%`, `3:7`
- Period: `3개월`, `2년`, `5일간`
- Floor: `지하 2층`, `5층`, `B1층`
- Others: scores, area, distance, weight, mileage, etc.

**Supported Patterns (English):**

- Phone numbers: `555-123-4567`, `(212) 555-1234`, `1-800-555-1234`
- Money: `$1,500`, `€100`, `50 dollars`
- Dates: `January 15, 2024`, `2024-01-15`
- Time: `2:30 PM`, `10:00 AM`
- Order: `1st place`, `2nd`, `3rd`
- Ratio: `50%`, `1:2`
- Period: `3 months`, `2 years`
- Floor: `5th floor`, `B1`, `basement level 2`
- Others: scores, area, distance, weight, temperature, etc.

### Method 2: Manual Tags Only (`manualTag`)

Use this for **legacy system compatibility** or when you need **explicit control**.
Tag format: `tagName(value)`

```java
// Name tag
String result = TypecastAutotag.manualTag("name(김철수)님 안녕하세요.");
// → "김 . 철 . 수님 안녕하세요."

// Phone tag
String result2 = TypecastAutotag.manualTag("phone(010-1234-5678)로 연락주세요.");
// → "공 . 일 . 공 . 일 . 이 . 삼 . 사 . 오 . 육 . 칠 . 팔로 연락주세요."
```

**Supported Tags (38 total):**

| Tag                  | Description            | Example                                         |
| -------------------- | ---------------------- | ----------------------------------------------- |
| `name(이름)`         | Name reading           | `name(김철수)` → 김 . 철 . 수                   |
| `phone(번호)`        | Phone number reading   | `phone(010-1234-5678)` → 공 . 일 . 공 . ...     |
| `money(금액)`        | Amount reading         | `money(50000)` → 오만 원                        |
| `date(날짜)`         | Date reading           | `date(2024-03-15)` → 이천이십사년 삼 월 십오 일 |
| `time(시간)`         | Time reading           | `time(14:30)` → 오후 두 시 삼십 분              |
| `datetime(날짜시간)` | Date + time reading    | `datetime(2024-03-15T14:30)`                    |
| `year(연도)`         | Year reading           | `year(2024)` → 이천이십사년                     |
| `month(월)`          | Month reading          | `month(3)` → 삼월                               |
| `day(일)`            | Day reading            | `day(15)` → 십오일                              |
| `order(순서)`        | Ordinal reading        | `order(3)` → 세 번째                            |
| `point(점수)`        | Score reading          | `point(95)` → 구십오 점                         |
| `piece(개수)`        | Counter (native)       | `piece(3)` → 세 개                              |
| `digits(숫자)`       | Read digits one by one | `digits(123)` → 일 . 이 . 삼                    |
| `address(주소)`      | Address reading        | `address(102동 1101호 (아파트))` → 백이동 천백일호 |
| ...and more          |                        |                                                 |

### Method 3: Hybrid Mode (`autoTagWithManual`)

**Supplement auto tagging with manual tags** for edge cases.
Manual tags are processed first, then auto tagging is applied to the rest.

```java
// Name with manual tag, amount automatically
String result = TypecastAutotag.autoTagWithManual("name(김철수)님, 잔액은 50000원입니다.");
// → "김 . 철 . 수님, 잔액은 오만 원입니다."

// Complex example
String result2 = TypecastAutotag.autoTagWithManual(
    "name(홍길동)님, 2024-03-15 14:30에 phone(02-123-4567)로 연락드리겠습니다."
);
```

## Exception Handling

```java
import ai.typecast.autotag.*;

try {
    String result = TypecastAutotag.autoTag("Some text");
} catch (LibraryNotFoundException e) {
    System.err.println("Native library not found for platform");
} catch (InitializationException e) {
    System.err.println("Library initialization failed");
} catch (ConversionException e) {
    System.err.println("Text conversion failed");
} catch (TypecastAutotagException e) {
    System.err.println("General library error");
}
```

## Platform Support

| Platform | Architecture   | Status              |
| -------- | -------------- | ------------------- |
| Linux    | x86_64         | ✅ Supported        |
| Linux    | x86 (32-bit)   | ✅ Supported        |
| Linux    | arm64          | ✅ Supported        |
| Linux    | armv7          | ✅ Supported        |
| macOS    | x86_64 + arm64 | ✅ Universal Binary |
| Windows  | x86_64         | ✅ Supported        |
| Windows  | x86 (32-bit)   | ✅ Supported        |

## Development

### Project Structure

```
java-binding/
├── src/
│   ├── main/
│   │   ├── java/ai/typecast/autotag/
│   │   │   ├── TypecastAutotag.java           # Main API class
│   │   │   ├── NativeLibraryLoader.java       # Native library loader
│   │   │   ├── TypecastAutotagException.java  # Base exception class
│   │   │   ├── LibraryNotFoundException.java  # Library not found exception
│   │   │   ├── InitializationException.java   # Initialization failure exception
│   │   │   └── ConversionException.java       # Conversion failure exception
│   │   ├── c/
│   │   │   └── typecast_autotag_jni.c         # JNI bridge code
│   │   └── resources/lib/                     # Native libraries
│   │       ├── linux/                         # Linux libraries
│   │       ├── darwin/                        # macOS libraries
│   │       └── windows/                       # Windows libraries
│   └── test/
│       └── java/ai/typecast/autotag/
│           └── TypecastAutotagTest.java       # Unit tests
├── examples/
│   └── BasicUsage.java                        # Basic usage example
├── scripts/
│   └── copy-libs.sh                           # Library copy script
├── pom.xml                                    # Maven configuration
└── README.md                                  # This file
```

### Build and Test

```bash
# From project root - builds everything automatically
pnpm java-binding:build

# Or manually:
cd java-binding
./scripts/copy-libs.sh  # Copy native libraries
mvn clean package       # Build JAR

# Install to local Maven repository
mvn install
```

### Running Tests

```bash
# From project root
pnpm test:java

# Or manually:
cd java-binding
./scripts/run-test.sh
```

### Running Examples

```bash
cd java-binding
javac -cp target/typecast-autotag-*.jar examples/BasicUsage.java
java -cp target/typecast-autotag-*.jar:examples BasicUsage
```

### Creating a Release

For maintainers who need to create a GitHub Release:

```bash
# 1. Build the JAR
pnpm java-binding:build

# 2. Create GitHub Release with gh CLI
gh release create v1.4.0 \
  java-binding/target/typecast-autotag-*.jar \
  --title "v1.4.0" \
  --notes "Release notes here"

# Or use the web interface at:
# https://github.com/neosapience/typecast-autotag/releases/new
```

## Troubleshooting

### Library Not Found

```
LibraryNotFoundException: Library not found in JAR
```

**Solution:**

1. Ensure native libraries are properly copied:
   ```bash
   ./scripts/copy-libs.sh
   ```
2. Check JAR contents:
   ```bash
   jar tf target/typecast-autotag-1.3.0.jar | grep lib/
   ```

### Initialization Failure

```
InitializationException: Failed to initialize Typecast Autotag library
```

**Solution:**

- Verify your system is a supported platform
- Check that library files have execute permissions
- Check logs for detailed error messages

### UnsatisfiedLinkError

```
java.lang.UnsatisfiedLinkError: no typecast_autotag in java.library.path
```

**Solution:**

- Verify JAR file includes native libraries
- Ensure resources are properly included during Maven build

## Performance Considerations

- **Initialization**: Library initialization is performed only once. Subsequent calls are ignored.
- **Thread Safety**: All methods are thread-safe and can be called concurrently.
- **Memory**: Native library automatically manages memory.

## Support

If you encounter any issues or need help, please open a GitHub issue.

## Related Projects

- [typecast-autotag](../README.md) - TypeScript/JavaScript version
- [python-binding](../python-binding/README.md) - Python binding
- [c-binding](../c-binding/README.md) - C library
