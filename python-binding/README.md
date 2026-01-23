# Typecast Autotag Python Binding

Python bindings for the TTS (Text-to-Speech) text preprocessing library.
Automatically converts various patterns like phone numbers, dates, and amounts into formats suitable for voice synthesis.

**[한국어 문서](./README.KR.md)**

## Features

- **Multi-language Support**: Full support for Korean and English text preprocessing
- **Easy to use**: Simple API with just 3 main functions
- **Flexible approach**: Supports fully automatic, manual tag, and hybrid modes
- **Wide pattern support**: Auto-recognition of 35+ patterns including phone, date, time, money, order
- **Cross-platform**: Supports Linux, Windows, and macOS
- **No dependencies**: Pure Python with ctypes (no pip packages required)

## Supported Languages

| Language | Status | Example |
| -------- | ------ | ------- |
| **Korean** (한국어) | ✅ Full Support | `010-1234-5678` → `공 . 일 . 공 . ...` |
| **English** | ✅ Full Support | `555-123-4567` → `five five five, one two three...` |

## Installation

### From GitHub

```bash
# Install from GitHub (subdirectory specification required)
pip install "git+https://github.com/neosapience/typecast-autotag#subdirectory=python-binding"
```

### From Source

```bash
git clone https://github.com/neosapience/typecast-autotag.git
cd typecast-autotag/python-binding
pip install .

# Or for development
pip install -e .
```

### From PyPI (when published)

```bash
pip install typecast-autotag
```

## Quick Start

```python
from typecast_autotag import auto_tag, auto_tag_en

# Korean - Automatic pattern recognition and conversion
result = auto_tag("전화번호는 010-1234-5678입니다.")
print(result)  # "전화번호는 공 . 일 . 공 . 일 . 이 . 삼 . 사 . 오 . 육 . 칠 . 팔입니다."

result = auto_tag("총 금액은 1500000원입니다.")
print(result)  # "총 금액은 백오십만 원입니다."

# English - Automatic pattern recognition and conversion
result_en = auto_tag_en("Call me at 555-123-4567.")
print(result_en)  # "Call me at five five five, one two three, four five six seven."

result_en = auto_tag_en("Total is $1,500.")
print(result_en)  # "Total is one thousand five hundred dollars."
```

## API Reference

### Initialization and Cleanup

```python
from typecast_autotag import initialize, cleanup

# Initialize (called automatically on first use)
initialize()

# Cleanup (optional, releases resources)
cleanup()
```

### Conversion Functions

#### Korean (Default)

| Function                 | Description      | Use Case                                           |
| ------------------------ | ---------------- | -------------------------------------------------- |
| `auto_tag()`             | Fully automatic  | When you want all patterns processed automatically |
| `manual_tag()`           | Manual tags only | Legacy system compatibility, explicit control      |
| `auto_tag_with_manual()` | Hybrid mode      | Mostly automatic + manual tags for supplements     |

#### English

| Function                    | Description      | Use Case                                           |
| --------------------------- | ---------------- | -------------------------------------------------- |
| `auto_tag_en()`             | Fully automatic  | When you want all patterns processed automatically |
| `manual_tag_en()`           | Manual tags only | Legacy system compatibility, explicit control      |
| `auto_tag_with_manual_en()` | Hybrid mode      | Mostly automatic + manual tags for supplements     |

### Method 1: Fully Automatic (`auto_tag` / `auto_tag_en`)

Automatically recognizes and converts patterns in text.
**Most convenient method** - sufficient for most cases.

#### Korean Examples

```python
from typecast_autotag import auto_tag

# Phone number
result = auto_tag("전화번호는 010-1234-5678입니다.")
# → "전화번호는 공 . 일 . 공 . 일 . 이 . 삼 . 사 . 오 . 육 . 칠 . 팔입니다."

# Money amount
result = auto_tag("총 금액은 1500000원입니다.")
# → "총 금액은 백오십만 원입니다."

# Date and time
result = auto_tag("회의는 2024-03-15 14:30에 시작합니다.")
# → "회의는 이천이십사년 삼 월 십오 일 오후 두 시 삼십 분에 시작합니다."
```

#### English Examples

```python
from typecast_autotag import auto_tag_en

# Phone number
result = auto_tag_en("Call me at 555-123-4567.")
# → "Call me at five five five, one two three, four five six seven."

# Money amount
result = auto_tag_en("Total is $1,500.")
# → "Total is one thousand five hundred dollars."

# Date and time
result = auto_tag_en("Meeting is at 2:30 PM.")
# → "Meeting is at two thirty PM."
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

### Method 2: Manual Tags Only (`manual_tag`)

Use when **legacy system compatibility** is needed or you want **explicit control**.
Tag format: `tagName(value)`

```python
from typecast_autotag import manual_tag

# Name tag
result = manual_tag("name(김철수)님 안녕하세요.")
# → "김 . 철 . 수님 안녕하세요."

# Phone tag
result = manual_tag("phone(010-1234-5678)로 연락주세요.")
# → "공 . 일 . 공 . 일 . 이 . 삼 . 사 . 오 . 육 . 칠 . 팔로 연락주세요."
```

**Supported Tags (38 total):**

| Tag                  | Description         | Example                                         |
| -------------------- | ------------------- | ----------------------------------------------- |
| `name(name)`         | Read name           | `name(김철수)` → 김 . 철 . 수                   |
| `phone(number)`      | Read phone number   | `phone(010-1234-5678)` → 공 . 일 . 공 . ...     |
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
| `digits(number)`     | Read digit by digit | `digits(123)` → 일 . 이 . 삼                    |
| `minsec(time)`       | Read min/sec        | `minsec(5m30s)` → 오 분 삼십 초                 |
| `ratio(ratio)`       | Read ratio/percent  | `ratio(30%)` → 삼십 퍼센트                      |
| `floor(floor)`       | Read floor          | `floor(B2)` → 지하 이 층                        |
| `weight(weight)`     | Read weight         | `weight(5kg)` → 오 킬로그램                     |
| `distance(distance)` | Read distance       | `distance(5km)` → 오 킬로미터                   |
| `temperature(temp)`  | Read temperature    | `temperature(25℃)` → 이십오 도                  |
| `volume(volume)`     | Read volume         | `volume(500ml)` → 오백 밀리리터                 |
| `address(address)`   | Read address        | `address(102동 1101호 (아파트))` → 백이동 천백일호 |
| ...and more          |                     |                                                 |

### Method 3: Hybrid Mode (`auto_tag_with_manual`)

**Supplement auto-tagging with manual tags** for parts that are incorrectly recognized.
Manual tags are processed first, then auto-tagging is applied to the rest.

```python
from typecast_autotag import auto_tag_with_manual

# Name with manual tag, amount automatically
result = auto_tag_with_manual("name(김철수)님, 잔액은 50000원입니다.")
# → "김 . 철 . 수님, 잔액은 오만 원입니다."

# Complex example
result = auto_tag_with_manual(
    "name(홍길동)님, 2024-03-15 14:30에 phone(02-123-4567)로 연락드리겠습니다."
)
```

### Context Manager

For automatic resource management:

```python
from typecast_autotag import TypecastAutotag

with TypecastAutotag() as tagger:
    result = tagger.auto_tag("전화번호는 010-1234-5678입니다.")
    print(result)

    result = tagger.manual_tag("name(김철수)님")
    print(result)
# Resources are automatically cleaned up
```

## Exception Handling

```python
from typecast_autotag import (
    auto_tag,
    TypecastAutotagError,
    LibraryNotFoundError,
    InitializationError,
    ConversionError,
)

try:
    result = auto_tag("Some text")
except LibraryNotFoundError:
    print("Native library not found for your platform")
except InitializationError:
    print("Failed to initialize library")
except ConversionError:
    print("Text conversion failed")
except TypecastAutotagError:
    print("General library error")
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

### Running Tests

```bash
cd python-binding
pip install -e ".[dev]"
pytest
```

### Building the Package

```bash
cd python-binding
pip install build
python -m build
```

## Library Location

The native libraries should be placed in the following locations:

```
typecast_autotag/
├── lib/
│   ├── linux/
│   │   └── libtypecast_autotag.so
│   ├── darwin/
│   │   └── libtypecast_autotag.dylib
│   └── windows/
│       └── typecast_autotag.dll
```

You can copy libraries from the `c-binding/build/` directory:

```bash
./scripts/copy-libs.sh
```

## License

MIT License

## Support

If you encounter issues or need help, please file an issue on GitHub.
