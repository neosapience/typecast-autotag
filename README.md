<div align="center">

# Typecast Autotag

**Text preprocessing SDK for TTS — convert text to speech-friendly Korean**

[![Node.js](https://img.shields.io/badge/Node.js-≥18-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-success?style=for-the-badge)]()
[![License](https://img.shields.io/badge/License-Private-red?style=for-the-badge)]()

[Features](#features) •
[Installation](#installation) •
[Quick Start](#quick-start) •
[API](#api-reference) •
[Tags](#supported-tags)

---

</div>

Transform phone numbers, dates, currency, and more into natural Korean speech patterns. Built for [Typecast](https://typecast.ai) TTS API and AICC (AI Contact Center) environments.

```typescript
autoTag('전화번호는 010-1234-5678입니다.');
// → '전화번호는 공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔 입니다.'
```

<br>

## Features

- **Auto-tagging**: Automatically detects and converts patterns like phone numbers, dates, times, and amounts.
- **Manual-tagging**: Explicitly tag text with `tagName(value)` syntax for precise control.
- **Korean-optimized**: Native Korean number reading with proper grammar and pronunciation.
- **Zero Dependencies**: Lightweight, fast, and tree-shakeable. Supports both ESM and CommonJS.

<br>

## Installation

GitHub 저장소에서 직접 설치합니다:

```bash
# pnpm (recommended)
pnpm add git+https://github.com/neosapience/typecast-autotag.git

# npm
npm install git+https://github.com/neosapience/typecast-autotag.git

# yarn
yarn add git+https://github.com/neosapience/typecast-autotag.git
```

특정 브랜치 또는 태그를 설치하려면:

```bash
# 특정 브랜치 설치
pnpm add git+https://github.com/neosapience/typecast-autotag.git#branch-name

# 특정 태그/버전 설치
pnpm add git+https://github.com/neosapience/typecast-autotag.git#v1.1.0

# 특정 커밋 설치
pnpm add git+https://github.com/neosapience/typecast-autotag.git#commit-hash
```

<br>

## Quick Start

```typescript
import { autoTag, manualTag, autoTagWithManual } from 'typecast-autotag';

// Auto-tagging - automatically detects patterns
autoTag('전화번호는 010-1234-5678입니다.');
// → '전화번호는 공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔 입니다.'

autoTag('회의는 14:30에 시작합니다.');
// → '회의는 오후 두 시 삼십 분 에 시작합니다.'

autoTag('총 금액은 50000원입니다.');
// → '총 금액은 오만 원 입니다.'

// Manual-tagging - explicit control
manualTag('안녕하세요, name(김철수)님.');
// → '안녕하세요, 김 철 수님.'

manualTag('month(12) day(25)에 방문 예정입니다.');
// → '십이월 이십오일에 방문 예정입니다.'

// Combined - use both together
autoTagWithManual('name(김철수)님, 010-1234-5678로 연락주세요.');
// → '김 철 수 님, 공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔 로 연락주세요.'
```

<br>

## API Reference

### Auto-tagging Functions

<details open>
<summary><b><code>autoTag(text, options?)</code></b> - Convert text with auto-detected patterns</summary>

```typescript
autoTag('내일 010-1234-5678로 전화주세요.');
// → '내일 공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔 로 전화주세요.'

// Enable specific tags only
autoTag('010-1234-5678, 50000원', { enabledTags: ['phone'] });
// → '공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔, 50000원'
```

| Option        | Type       | Default | Description         |
| ------------- | ---------- | ------- | ------------------- |
| `language`    | `'ko'`     | `'ko'`  | Language to use     |
| `enabledTags` | `string[]` | all     | Tag types to enable |

</details>

<details>
<summary><b><code>extractAutoTags(text, options?)</code></b> - Extract patterns without converting</summary>

```typescript
extractAutoTags('전화번호는 010-1234-5678이고, 금액은 50000원입니다.');
// [
//   { original: '010-1234-5678', tagType: 'phone', start: 6, end: 19 },
//   { original: '50000원', tagType: 'money', start: 28, end: 34 }
// ]
```

</details>

### Manual-tagging Functions

<details open>
<summary><b><code>manualTag(text, options?)</code></b> - Parse and convert manual tags</summary>

```typescript
manualTag('안녕하세요, name(김철수) 고객님.');
// → '안녕하세요, 김 철 수 고객님.'

manualTag('금액은 money(10000)입니다.');
// → '금액은 만 원입니다.'
```

</details>

<details>
<summary><b><code>manualTagSelective(text, options)</code></b> - Convert only specific tags</summary>

```typescript
manualTagSelective('name(김철수) month(12)', { allowedTags: ['name'] });
// → '김 철 수 month(12)'
```

</details>

<details>
<summary><b><code>extractTags(text, options?)</code></b> - Extract manual tags without converting</summary>

```typescript
extractTags('안녕하세요, name(김철수) 고객님.');
// [{ tag: 'name', value: '김철수', start: 7, end: 17 }]
```

</details>

### Combined Function

<details open>
<summary><b><code>autoTagWithManual(text, options?)</code></b> - Apply both auto and manual tags</summary>

```typescript
autoTagWithManual('name(김철수)님, 010-1234-5678로 연락주세요.');
// → '김 철 수 님, 공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔 로 연락주세요.'
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

getSupportedLanguages(); // ['ko']
getSupportedAutoTags(); // ['phone', 'datetime', 'time', 'date', ...]
getSupportedManualTags(); // ['name', 'month', 'day', 'date', ...]
```

<br>

## Supported Tags (37's)

### Auto-tags (Automatically Detected)

| Tag            | Description      | Input                | Output                                          |
| -------------- | ---------------- | -------------------- | ----------------------------------------------- |
| `phone`        | Phone numbers    | `010-1234-5678`      | `공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔`    |
| `datetime`     | Date and time    | `2024-01-15T14:30`   | `이천이십사년 일월 십오일 오후 두 시 삼십 분`   |
| `time`         | Time             | `14:30`              | `오후 두 시 삼십 분`                            |
| `date`         | Date             | `2024-01-15`         | `이천이십사년 일월 십오일`                      |
| `money`        | Currency amounts | `50000원`            | `오만 원`                                       |
| `year`         | Year             | `2024년`             | `이천이십사년`                                  |
| `month`        | Month            | `12월`               | `십이월`                                        |
| `day`          | Day              | `25일`               | `이십오일`                                      |
| `order`        | Ordinal numbers  | `3번째`, `2등`       | `세 번째`, `이 등`                              |
| `point`        | Points/scores    | `95점`               | `구십오 점`                                     |
| `piece`        | Counting         | `5개`                | `다섯 개`                                       |
| `minsec`       | Duration (m/s)   | `5분30초`, `100ms`   | `오 분 삼십 초`, `백 밀리초`                    |
| `ratio`        | Ratio/percent    | `50%`, `1:2`         | `오십 퍼센트`, `일 대 이`                       |
| `jari`         | Digit places     | `4자리`              | `네 자리`                                       |
| `number`       | Number (번)      | `3번`                | `삼 번`                                         |
| `duration`     | Period           | `3개월`, `최대 30일` | `삼 개월`, `최대 삼십일`                        |
| `floor`        | Floor numbers    | `5층`, `B1층`        | `오 층`, `지하 일 층`                           |
| `account`      | Account numbers  | `123-456-789012`     | `일 이 삼 다시 사 오 육 다시 칠 팔 구 영 일 이` |
| `weight`       | Weight           | `5kg`, `100g`        | `오 킬로그램`, `백 그램`                        |
| `mile`         | Mileage          | `500마일`            | `오백 마일`                                     |
| `area`         | Area             | `84㎡`, `25평`       | `팔십사 제곱미터`, `이십오 평`                  |
| `serial`       | Serial numbers   | `접수번호: A-1234`   | `접수번호: A-일 이 삼 사`                       |
| `bakil`        | Stay duration    | `2박3일`             | `이 박 삼 일`                                   |
| `roomNumber`   | Room numbers     | `1205호`             | `일 이 영 오 호`                                |
| `jong`         | Types/kinds      | `3종`                | `삼 종`                                         |
| `distance`     | Distance         | `5km`                | `오 킬로미터`                                   |
| `carNumber`    | Car plates       | `12가 3456`          | `일 이 가 삼 사 오 육`                          |
| `flight`       | Flight numbers   | `OZ301`              | `OZ 삼 영 일`                                   |
| `seat`         | Seat numbers     | `23A`                | `이 삼 A`                                       |
| `lecture`      | Lecture numbers  | `26강`               | `이십육 강`                                     |
| `fraction`     | Fractions        | `1/4`, `3/4`         | `사 분의 일`, `사 분의 삼`                      |
| `temperature`  | Temperature      | `25℃`, `-5°C`        | `이십오 도`, `영하 오 도`                       |
| `volume`       | Volume/capacity  | `500ml`, `2L`        | `오백 밀리리터`, `이 리터`                      |
| `dataCapacity` | Data capacity    | `100GB`, `50Mbps`    | `백 기가바이트`, `오십 메가비피에스`            |
| `inch`         | Inch             | `55인치`, `6.5"`     | `오십오 인치`, `육 쩜 오 인치`                  |

### Manual-only Tags

| Tag      | Description         | Syntax         | Output        |
| -------- | ------------------- | -------------- | ------------- |
| `name`   | Name (char-by-char) | `name(김철수)` | `김 철 수`    |
| `digits` | Digit-by-digit      | `digits(1234)` | `일 이 삼 사` |

> **Tip:** All auto-tags can also be used as manual tags with explicit syntax.

<br>

## Examples

<details open>
<summary><b>Phone Numbers</b></summary>

```typescript
autoTag('010-1234-5678'); // → '공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔'
autoTag('02-123-4567'); // → '공 이 다시 일 이 삼 다시 사 오 육 칠'
autoTag('1588-1234'); // → '일 오 팔 팔 다시 일 이 삼 사'
autoTag('112'); // → '일 일 이'
```

</details>

<details>
<summary><b>Dates and Times</b></summary>

```typescript
autoTag('2024-01-15'); // → '이천이십사년 일월 십오일'
autoTag('2024년 6월 16일'); // → '이천이십사년 유월 십육일'
autoTag('14:30'); // → '오후 두 시 삼십 분'
autoTag('오전 9시 30분'); // → '오전 아홉 시 삼십 분'
```

</details>

<details>
<summary><b>Money and Amounts</b></summary>

```typescript
autoTag('50000원'); // → '오만 원'
autoTag('1,234,567원'); // → '백이십삼만사천오백육십칠 원'
autoTag('₩10000'); // → '만 원'
```

</details>

<details>
<summary><b>Counting (Native Korean)</b></summary>

```typescript
autoTag('사과 5개'); // → '사과 다섯 개'
autoTag('강아지 3마리'); // → '강아지 세 마리'
autoTag('참석자 10명'); // → '참석자 열 명'
```

</details>

<details>
<summary><b>Names</b></summary>

```typescript
manualTag('name(김철수)'); // → '김 철 수'
manualTag('name(홍길동)'); // → '홍 길 동'
manualTag('name(김John)'); // → '김 John'
```

</details>

<br>

## Use Cases

### AICC (AI Contact Center)

Perfect for converting structured data to natural speech in automated phone systems:

```typescript
const script = autoTagWithManual(`
  안녕하세요, name(${customerName})님.
  주문하신 상품이 ${deliveryDate}에 배송될 예정입니다.
  문의사항은 ${supportPhone}으로 연락주세요.
`);
// All names, dates, and phone numbers are converted to natural Korean speech
```

### IVR Systems

Generate natural-sounding automated responses:

```typescript
autoTag('고객님의 잔액은 1,234,567원입니다.');
// → '고객님의 잔액은 백이십삼만사천오백육십칠 원 입니다.'
```

<br>

## Advanced Usage

### Direct Korean Module Access

```typescript
import { korean } from 'typecast-autotag';

// Use Korean-specific functions
korean.autoTag('010-1234-5678');
korean.manualTag('name(김철수)');

// Access individual tag converters
import { name, phone, money, date, time } from 'typecast-autotag/korean';
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

### C Binding (Optional)

For C/C++ integration, the library can be built as a native shared library. This requires a C compiler (gcc/clang).

| Command                    | Description                                |
| -------------------------- | ------------------------------------------ |
| `pnpm c-binding:all`       | Build C library (duktape + bundle + build) |
| `pnpm c-binding:duktape`   | Download Duktape                           |
| `pnpm c-binding:bundle`    | Generate JS bundle from TypeScript         |
| `pnpm c-binding:build`     | Build shared library                       |
| `pnpm c-binding:example`   | Build example program                      |
| `pnpm c-binding:test`      | Run example program                        |
| `pnpm c-binding:clean`     | Clean build artifacts                      |
| `pnpm c-binding:distclean` | Clean everything including Duktape         |

> **Note:** C binding setup is included in `pnpm setup`. If you don't need C binding, just run `pnpm install && pnpm build` instead.

See [`c-binding/README.md`](./c-binding/README.md) for detailed C library documentation.

### Project Structure

```
src/
├── index.ts                    # Main entry point
└── korean/                     # Korean language module
    ├── index.ts                # Korean module exports
    ├── auto-tag.ts             # Auto-tagging logic
    ├── manual-tag.ts           # Manual-tagging logic
    ├── tags/                   # Individual tag converters
    │   ├── account.ts          # Account number conversion
    │   ├── area.ts             # Area (㎡, 평) conversion
    │   ├── bakil.ts            # Stay duration (N박M일)
    │   ├── car-number.ts       # Car plate number conversion
    │   ├── date.ts
    │   ├── datetime.ts
    │   ├── day.ts
    │   ├── digits.ts
    │   ├── distance.ts         # Distance (km, m) conversion
    │   ├── duration.ts         # Period/duration conversion
    │   ├── flight.ts           # Flight number conversion
    │   ├── floor.ts            # Floor number conversion
    │   ├── jari.ts             # Digit places conversion
    │   ├── jong.ts             # Type/kind (N종) conversion
    │   ├── lecture.ts          # Lecture number (N강) conversion
    │   ├── mile.ts             # Mileage conversion
    │   ├── minsec.ts
    │   ├── money.ts
    │   ├── month.ts
    │   ├── name.ts
    │   ├── number.ts           # Number (번) conversion
    │   ├── order.ts
    │   ├── phone.ts
    │   ├── piece.ts
    │   ├── point.ts
    │   ├── ratio.ts            # Ratio/percent conversion
    │   ├── room-number.ts      # Room number (N호) conversion
    │   ├── seat.ts             # Seat number conversion
    │   ├── serial.ts           # Serial number conversion
    │   ├── temperature.ts      # Temperature (℃, °F) conversion
    │   ├── time.ts
    │   ├── volume.ts           # Volume (L, ml, m³) conversion
    │   ├── data-capacity.ts    # Data capacity (GB, Mbps) conversion
    │   ├── fraction.ts         # Fraction (1/4, 3/4) conversion
    │   ├── inch.ts             # Inch (55인치, 6.5") conversion
    │   ├── weight.ts           # Weight (kg, g) conversion
    │   └── year.ts
    └── utils/
        └── number-to-korean.ts # Number conversion utilities
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

| Platform | Files |
| -------- | ----- |
| macOS | `libtypecast_autotag.dylib` |
| Linux | `libtypecast_autotag.so`, `libtypecast_autotag_arm64.so`, `libtypecast_autotag_armv7.so`, `libtypecast_autotag_x86_64.so`, `libtypecast_autotag_x86.so` |
| Windows | `typecast_autotag.dll`, `typecast_autotag.lib`, `typecast_autotag_i686.dll`, `typecast_autotag_i686.lib`, `typecast_autotag_x86_64.dll`, `typecast_autotag_x86_64.lib` |
| Header | `typecast_autotag.h` |

> **Note:** Make sure to build the C bindings before releasing: `pnpm c-binding:build-all-multiarch`

<br>

---

<div align="center">

Made for [Typecast](https://typecast.ai)

**[Back to Top](#typecast-autotag)**

</div>
