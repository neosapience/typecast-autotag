<div align="center">

# Typecast Autotag

**Text preprocessing SDK for TTS — convert text to speech-friendly format**

[![Node.js](https://img.shields.io/badge/Node.js-≥18-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-success?style=for-the-badge)]()
[![License](https://img.shields.io/badge/License-Private-red?style=for-the-badge)]()

[Features](#features) •
[Installation](#installation) •
[Quick Start](#quick-start) •
[API](#api-reference) •
[Tags](#supported-tags)

**[한국어 문서](./README.KR.md)**

---

</div>

## Language Support

This library supports **multiple languages** for TTS text preprocessing:

| Language            | Status          | Module    |
| ------------------- | --------------- | --------- |
| **Korean** (한국어) | ✅ Full Support | `korean`  |
| **English**         | ✅ Full Support | `english` |

## Supported Environments

### Development Languages

| Language    | Version | Package                       |
| ----------- | ------- | ----------------------------- |
| **Node.js** | ≥18     | `typecast-autotag` (npm/pnpm) |
| **Browser** | Modern  | `typecast-autotag` (ESM/UMD)  |
| **Python**  | ≥3.8    | `typecast-autotag` (pip)      |
| **Java**    | ≥8      | `typecast-autotag` (Maven)    |
| **C/C++**   | Any     | Native library                |

### Server Platforms

| Platform    | Status                                                            |
| ----------- | ----------------------------------------------------------------- |
| **Linux**   | ✅ Supported (CentOS 6.9+, Amazon Linux 2+, Ubuntu, Debian, etc.) |
| **macOS**   | ✅ Supported (Intel & Apple Silicon)                              |
| **Windows** | ✅ Supported (Windows 10+)                                        |

### Server Architectures

| Architecture           | Status       |
| ---------------------- | ------------ |
| **x86_64** (AMD64)     | ✅ Supported |
| **x86** (32-bit)       | ✅ Supported |
| **arm64** (AArch64)    | ✅ Supported |
| **armv7** (32-bit ARM) | ✅ Supported |

---

Transform phone numbers, dates, currency, and more into natural speech patterns. Built for [Typecast](https://typecast.ai) TTS API and AICC (AI Contact Center) environments.

```typescript
import { autoTag } from 'typecast-autotag';

// English auto-tagging
autoTag('Call me at 555-123-4567 tomorrow.', { language: 'en' });
// → 'Call me at five five five, one two three, four five six seven tomorrow.'

// Korean auto-tagging
autoTag('전화번호는 010-1234-5678입니다.', { language: 'ko' });
// → '전화번호는 공 . 일 . 공 . 일 . 이 . 삼 . 사 . 오 . 육 . 칠 . 팔 입니다.'
```

<br>

## Features

- **Multi-language Support**: Full support for Korean and English text preprocessing.
- **Auto-tagging**: Automatically detects and converts patterns like phone numbers, dates, times, and amounts.
- **Manual-tagging**: Explicitly tag text with `tagName(value)` syntax for precise control.
- **Zero Dependencies**: Lightweight, fast, and tree-shakeable. Supports both ESM and CommonJS.

<br>

## Installation

Install directly from GitHub repository:

```bash
# pnpm (recommended)
pnpm add git+https://github.com/neosapience/typecast-autotag.git

# npm
npm install git+https://github.com/neosapience/typecast-autotag.git

# yarn
yarn add git+https://github.com/neosapience/typecast-autotag.git
```

To install a specific branch or tag:

```bash
# Install specific branch
pnpm add git+https://github.com/neosapience/typecast-autotag.git#branch-name

# Install specific tag/version
pnpm add git+https://github.com/neosapience/typecast-autotag.git#v1.5.0

# Install specific commit
pnpm add git+https://github.com/neosapience/typecast-autotag.git#commit-hash
```

<br>

## Quick Start

### English Text Processing

```typescript
import { autoTag, manualTag, autoTagWithManual } from 'typecast-autotag';

// Auto-tagging - automatically detects patterns (English)
autoTag('Call me at 555-123-4567.', { language: 'en' });
// → 'Call me at five five five, one two three, four five six seven.'

autoTag('The meeting is at 2:30 PM.', { language: 'en' });
// → 'The meeting is at two thirty PM.'

autoTag('Total is $1,500.', { language: 'en' });
// → 'Total is one thousand five hundred dollars.'

// Manual-tagging - explicit control
manualTag('Hello, name(John Smith).', { language: 'en' });
// → 'Hello, J O H N S M I T H.'

manualTag('month(12) day(25) is Christmas.', { language: 'en' });
// → 'December twenty-fifth is Christmas.'
```

### Korean Text Processing

```typescript
import { autoTag, manualTag, autoTagWithManual } from 'typecast-autotag';

// Auto-tagging - automatically detects patterns (Korean)
autoTag('전화번호는 010-1234-5678입니다.', { language: 'ko' });
// → '전화번호는 공 . 일 . 공 . 일 . 이 . 삼 . 사 . 오 . 육 . 칠 . 팔 입니다.'

autoTag('회의는 14:30에 시작합니다.', { language: 'ko' });
// → '회의는 오후 두 시 삼십 분 에 시작합니다.'

autoTag('총 금액은 50000원입니다.', { language: 'ko' });
// → '총 금액은 오만 원 입니다.'

// Manual-tagging - explicit control
manualTag('안녕하세요, name(김철수)님.', { language: 'ko' });
// → '안녕하세요, 김 . 철 . 수님.'

// Combined - use both together
autoTagWithManual('name(김철수)님, 010-1234-5678로 연락주세요.', { language: 'ko' });
// → '김 . 철 . 수 님, 공 . 일 . 공 . 일 . 이 . 삼 . 사 . 오 . 육 . 칠 . 팔 로 연락주세요.'
```

### Direct Language Module Access

```typescript
// Use English module directly
import { english } from 'typecast-autotag';

english.autoTag('Call 555-123-4567');
// → 'Call five five five, one two three, four five six seven'

// Use Korean module directly
import { korean } from 'typecast-autotag';

korean.autoTag('010-1234-5678');
// → '공 . 일 . 공 . 일 . 이 . 삼 . 사 . 오 . 육 . 칠 . 팔'
```

<br>

## API Reference

### Auto-tagging Functions

<details open>
<summary><b><code>autoTag(text, options?)</code></b> - Convert text with auto-detected patterns</summary>

```typescript
// English
autoTag('Call 555-123-4567 tomorrow.', { language: 'en' });
// → 'Call five five five, one two three, four five six seven tomorrow.'

// Enable specific tags only
autoTag('$500, 555-1234', { language: 'en', enabledTags: ['phone'] });
// → '$500, five five five, one two three four'
```

| Option        | Type         | Default | Description         |
| ------------- | ------------ | ------- | ------------------- |
| `language`    | `'ko'｜'en'` | `'ko'`  | Language to use     |
| `enabledTags` | `string[]`   | all     | Tag types to enable |

</details>

<details>
<summary><b><code>extractAutoTags(text, options?)</code></b> - Extract patterns without converting</summary>

```typescript
extractAutoTags('Phone is 555-123-4567, total is $500.', { language: 'en' });
// [
//   { original: '555-123-4567', tagType: 'phone', start: 9, end: 21 },
//   { original: '$500', tagType: 'money', start: 33, end: 37 }
// ]
```

</details>

### Manual-tagging Functions

<details open>
<summary><b><code>manualTag(text, options?)</code></b> - Parse and convert manual tags</summary>

```typescript
manualTag('Hello, name(John).', { language: 'en' });
// → 'Hello, J O H N.'

manualTag('Amount is money(10000).', { language: 'en' });
// → 'Amount is ten thousand dollars.'
```

</details>

<details>
<summary><b><code>manualTagSelective(text, options)</code></b> - Convert only specific tags</summary>

```typescript
manualTagSelective('name(John) month(12)', { language: 'en', allowedTags: ['name'] });
// → 'J O H N month(12)'
```

</details>

<details>
<summary><b><code>extractTags(text, options?)</code></b> - Extract manual tags without converting</summary>

```typescript
extractTags('Hello, name(John).');
// [{ tag: 'name', value: 'John', start: 7, end: 17 }]
```

</details>

### Combined Function

<details open>
<summary><b><code>autoTagWithManual(text, options?)</code></b> - Apply both auto and manual tags</summary>

```typescript
autoTagWithManual('name(John), call 555-123-4567.', { language: 'en' });
// → 'J O H N, call five five five, one two three, four five six seven.'
```

> **Note:** Manual tags are processed first, then auto-tags are applied.

</details>

### Utility Functions

```typescript
import {
  getSupportedLanguages,
  getSupportedAutoTags,
  getSupportedManualTags,
  setDefaultLanguage,
  getDefaultLanguage,
} from 'typecast-autotag';

getSupportedLanguages(); // ['ko', 'en']
getSupportedAutoTags(); // ['phone', 'datetime', 'time', 'date', ...]
getSupportedManualTags(); // ['name', 'month', 'day', 'date', ...]
```

<br>

## Supported Tags

### English Auto-tags (Automatically Detected)

| Tag            | Description      | Input              | Output                                                         |
| -------------- | ---------------- | ------------------ | -------------------------------------------------------------- |
| `phone`        | Phone numbers    | `555-123-4567`     | `five five five, one two three, four five six seven`           |
| `datetime`     | Date and time    | `2024-01-15T14:30` | `January fifteenth, twenty twenty-four, two thirty PM`         |
| `time`         | Time             | `2:30 PM`          | `two thirty PM`                                                |
| `date`         | Date             | `January 15, 2024` | `January fifteenth, twenty twenty-four`                        |
| `money`        | Currency amounts | `$1,500`           | `one thousand five hundred dollars`                            |
| `year`         | Year             | `year 2024`        | `year twenty twenty-four`                                      |
| `month`        | Month            | `January`          | `January`                                                      |
| `day`          | Day              | `the 15th`         | `the fifteenth`                                                |
| `order`        | Ordinal numbers  | `1st place`        | `first place`                                                  |
| `point`        | Points/scores    | `95 points`        | `ninety-five points`                                           |
| `piece`        | Counting         | `5 items`          | `five items`                                                   |
| `minsec`       | Duration (m/s)   | `5m30s`, `100ms`   | `five minutes thirty seconds`, `one hundred milliseconds`      |
| `ratio`        | Ratio/percent    | `50%`, `1:2`       | `fifty percent`, `one to two`                                  |
| `duration`     | Period           | `3 months`         | `three months`                                                 |
| `floor`        | Floor numbers    | `5th floor`, `B1`  | `fifth floor`, `basement one`                                  |
| `weight`       | Weight           | `5kg`, `100lb`     | `five kilograms`, `one hundred pounds`                         |
| `distance`     | Distance         | `5km`, `100m`      | `five kilometers`, `one hundred meters`                        |
| `temperature`  | Temperature      | `25°C`, `-5°F`     | `twenty-five degrees Celsius`, `minus five degrees Fahrenheit` |
| `volume`       | Volume/capacity  | `500ml`, `2L`      | `five hundred milliliters`, `two liters`                       |
| `dataCapacity` | Data capacity    | `100GB`, `50Mbps`  | `one hundred gigabytes`, `fifty megabits per second`           |
| `inch`         | Inch             | `55 inches`        | `fifty-five inches`                                            |

### Korean Auto-tags (Automatically Detected)

| Tag            | Description      | Input              | Output                                        |
| -------------- | ---------------- | ------------------ | --------------------------------------------- |
| `phone`        | Phone numbers    | `010-1234-5678`    | `공 . 일 . 공 . 일 . 이 . 삼 . 사 . 오 . 육 . 칠 . 팔`  |
| `datetime`     | Date and time    | `2024-01-15T14:30` | `이천이십사년 일월 십오일 오후 두 시 삼십 분` |
| `time`         | Time             | `14:30`            | `오후 두 시 삼십 분`                          |
| `date`         | Date             | `2024-01-15`       | `이천이십사년 일월 십오일`                    |
| `money`        | Currency amounts | `50000원`          | `오만 원`                                     |
| `year`         | Year             | `2024년`           | `이천이십사년`                                |
| `month`        | Month            | `12월`             | `십이월`                                      |
| `day`          | Day              | `25일`             | `이십오일`                                    |
| `order`        | Ordinal numbers  | `3번째`, `2등`     | `세 번째`, `이 등`                            |
| `point`        | Points/scores    | `95점`             | `구십오 점`                                   |
| `piece`        | Counting         | `5개`              | `다섯 개`                                     |
| `minsec`       | Duration (m/s)   | `5분30초`, `100ms` | `오 분 삼십 초`, `백 밀리초`                  |
| `ratio`        | Ratio/percent    | `50%`, `1:2`       | `오십 퍼센트`, `일 대 이`                     |
| `duration`     | Period           | `3개월`            | `삼 개월`                                     |
| `floor`        | Floor numbers    | `5층`, `B1층`      | `오 층`, `지하 일 층`                         |
| `weight`       | Weight           | `5kg`, `100g`      | `오 킬로그램`, `백 그램`                      |
| `distance`     | Distance         | `5km`              | `오 킬로미터`                                 |
| `temperature`  | Temperature      | `25℃`, `-5°C`      | `이십오 도`, `영하 오 도`                     |
| `volume`       | Volume/capacity  | `500ml`, `2L`      | `오백 밀리리터`, `이 리터`                    |
| `dataCapacity` | Data capacity    | `100GB`, `50Mbps`  | `백 기가바이트`, `오십 메가비피에스`          |
| `inch`         | Inch             | `55인치`           | `오십오 인치`                                 |

### Manual-only Tags

| Tag      | Description         | English Syntax                        | Korean Syntax                  |
| -------- | ------------------- | ------------------------------------- | ------------------------------ |
| `name`   | Name (char-by-char) | `name(John)` → `J O H N`              | `name(김철수)` → `김 . 철 . 수`    |
| `digits` | Digit-by-digit      | `digits(1234)` → `one two three four` | `digits(1234)` → `1 . 2 . 3 . 4` |

> **Tip:** All auto-tags can also be used as manual tags with explicit syntax.

<br>

## Examples

<details open>
<summary><b>Phone Numbers</b></summary>

```typescript
// English
autoTag('555-123-4567', { language: 'en' }); // → 'five five five, one two three, four five six seven'
autoTag('(212) 555-1234', { language: 'en' }); // → 'two one two, five five five, one two three four'
autoTag('1-800-555-1234', { language: 'en' }); // → 'one, eight zero zero, five five five, one two three four'
autoTag('911', { language: 'en' }); // → 'nine one one'

// Korean
autoTag('010-1234-5678', { language: 'ko' }); // → '공 . 일 . 공 . 일 . 이 . 삼 . 사 . 오 . 육 . 칠 . 팔'
autoTag('02-123-4567', { language: 'ko' }); // → '공 . 이 . 일 . 이 . 삼 . 사 . 오 . 육 . 칠'
```

</details>

<details>
<summary><b>Dates and Times</b></summary>

```typescript
// English
autoTag('January 15, 2024', { language: 'en' }); // → 'January fifteenth, twenty twenty-four'
autoTag('2:30 PM', { language: 'en' }); // → 'two thirty PM'
autoTag('10:00 AM', { language: 'en' }); // → 'ten AM'

// Korean
autoTag('2024-01-15', { language: 'ko' }); // → '이천이십사년 일월 십오일'
autoTag('14:30', { language: 'ko' }); // → '오후 두 시 삼십 분'
```

</details>

<details>
<summary><b>Money and Amounts</b></summary>

```typescript
// English
autoTag('$50', { language: 'en' }); // → 'fifty dollars'
autoTag('$1,234.56', { language: 'en' }); // → 'one thousand two hundred thirty-four dollars and fifty-six cents'
autoTag('€100', { language: 'en' }); // → 'one hundred euros'

// Korean
autoTag('50000원', { language: 'ko' }); // → '오만 원'
autoTag('1,234,567원', { language: 'ko' }); // → '백이십삼만사천오백육십칠 원'
```

</details>

<details>
<summary><b>Names</b></summary>

```typescript
// English
manualTag('name(John)', { language: 'en' }); // → 'J O H N'
manualTag('name(John Smith)', { language: 'en' }); // → 'J O H N S M I T H'

// Korean
manualTag('name(김철수)', { language: 'ko' }); // → '김 . 철 . 수'
manualTag('name(홍길동)', { language: 'ko' }); // → '홍 . 길 . 동'
```

</details>

<br>

## Use Cases

### AICC (AI Contact Center)

Perfect for converting structured data to natural speech in automated phone systems:

```typescript
// English
const script = autoTagWithManual(
  `
  Hello, name(${customerName}).
  Your order will be delivered on ${deliveryDate}.
  For questions, call ${supportPhone}.
`,
  { language: 'en' }
);

// Korean
const script = autoTagWithManual(
  `
  안녕하세요, name(${customerName})님.
  주문하신 상품이 ${deliveryDate}에 배송될 예정입니다.
  문의사항은 ${supportPhone}으로 연락주세요.
`,
  { language: 'ko' }
);
```

### IVR Systems

Generate natural-sounding automated responses:

```typescript
// English
autoTag('Your balance is $1,234.56.', { language: 'en' });
// → 'Your balance is one thousand two hundred thirty-four dollars and fifty-six cents.'

// Korean
autoTag('고객님의 잔액은 1,234,567원입니다.', { language: 'ko' });
// → '고객님의 잔액은 백이십삼만사천오백육십칠 원 입니다.'
```

<br>

## Advanced Usage

### Direct Language Module Access

```typescript
import { korean, english } from 'typecast-autotag';

// Use language-specific functions
korean.autoTag('010-1234-5678');
english.autoTag('555-123-4567');

// Access individual tag converters
import { name, phone, money, date, time } from 'typecast-autotag/korean';
import { name as nameEn, phone as phoneEn } from 'typecast-autotag/english';
```

<br>

## Development

### Prerequisites

- Node.js >= 18
- pnpm 9.x

### Quick Setup

```bash
# Clone and setup everything (including C binding)
git clone <repository-url>
cd typecast-autotag
pnpm setup
```

### Commands

| Command              | Description                              |
| -------------------- | ---------------------------------------- |
| `pnpm install`       | Install dependencies                     |
| `pnpm setup`         | Full setup (install + build + c-binding) |
| `pnpm dev`           | Watch mode                               |
| `pnpm build`         | Build for production                     |
| `pnpm test`          | Run all tests (jest + e2e)               |
| `pnpm test:jest`     | Run jest tests only                      |
| `pnpm test:e2e`      | Run e2e tests only                       |
| `pnpm test:coverage` | Run tests with coverage                  |
| `pnpm typecheck`     | Type check                               |
| `pnpm lint`          | Lint code                                |
| `pnpm format`        | Format code                              |

### Other Bindings

| Language | Documentation                                          |
| -------- | ------------------------------------------------------ |
| C/C++    | [c-binding/README.md](./c-binding/README.md)           |
| Python   | [python-binding/README.md](./python-binding/README.md) |
| Java     | [java-binding/README.md](./java-binding/README.md)     |

### Project Structure

```
src/
├── index.ts                    # Main entry point
├── korean/                     # Korean language module
│   ├── index.ts                # Korean module exports
│   ├── auto-tag.ts             # Auto-tagging logic
│   ├── manual-tag.ts           # Manual-tagging logic
│   ├── tags/                   # Individual tag converters
│   └── utils/
│       └── number-to-korean.ts # Number conversion utilities
└── english/                    # English language module
    ├── index.ts                # English module exports
    ├── auto-tag.ts             # Auto-tagging logic
    ├── manual-tag.ts           # Manual-tagging logic
    ├── tags/                   # Individual tag converters
    └── utils/
        └── number-to-english.ts # Number conversion utilities
```

<br>

## Releasing

This project uses [release-it](https://github.com/release-it/release-it) for automated GitHub Releases.

### Setup

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Add your GitHub Personal Access Token to `.env`:

```bash
GITHUB_TOKEN=<your-github-token>
```

> Generate a token at [GitHub Settings → Tokens](https://github.com/settings/tokens) with `repo` scope.

### Creating a Release

```bash
# Dry run (preview without publishing)
pnpm release:dry

# Create a release
pnpm release
```

This will:

- Run tests and build
- Bump version based on [Conventional Commits](https://www.conventionalcommits.org/)
- Generate/update `CHANGELOG.md`
- Create a Git tag
- Create a GitHub Release with pre-built C binding binaries attached

### Release Assets

The following pre-built binaries are automatically attached to each release:

| Platform | Files                                                                                                                                                                  |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| macOS    | `libtypecast_autotag.dylib`                                                                                                                                            |
| Linux    | `libtypecast_autotag.so`, `libtypecast_autotag_arm64.so`, `libtypecast_autotag_armv7.so`, `libtypecast_autotag_x86_64.so`, `libtypecast_autotag_x86.so`                |
| Windows  | `typecast_autotag.dll`, `typecast_autotag.lib`, `typecast_autotag_i686.dll`, `typecast_autotag_i686.lib`, `typecast_autotag_x86_64.dll`, `typecast_autotag_x86_64.lib` |
| Header   | `typecast_autotag.h`                                                                                                                                                   |

> **Note:** Make sure to build the C bindings before releasing: `pnpm c-binding:build-all-multiarch`

<br>

---

<div align="center">

Made for [Typecast](https://typecast.ai)

**[Back to Top](#typecast-autotag)**

</div>
