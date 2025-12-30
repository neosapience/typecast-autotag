# typecast-autotag

Text preprocessing SDK for Typecast TTS API. Automatically converts phone numbers, dates, names, and other patterns into speech-friendly formats for AICC (AI Contact Center) environments.

## Features

- **Tag-based conversion**: Explicit tag syntax for precise control over text conversion
- **Automatic pattern detection**: Intelligent pattern recognition for common formats (phone numbers, dates, etc.)
- **Korean language support**: Optimized for Korean TTS pronunciation
- **Zero dependencies**: Lightweight and easy to integrate

## Installation

```bash
pnpm add typecast-autotag
# or
npm install typecast-autotag
# or
yarn add typecast-autotag
```

## Usage

### Tag-based Conversion

Use explicit tags to mark text that needs conversion:

```typescript
import { convertScript } from 'typecast-autotag';

const input = '안녕하세요, name(김형우) 고객님. month(12) day(25)에 방문 예정입니다.';
const output = convertScript(input);
// Result: '안녕하세요, 김 형 우 고객님. 12월 25일에 방문 예정입니다.'
```

### Supported Tags

| Tag            | Description                      | Example                                                          |
| -------------- | -------------------------------- | ---------------------------------------------------------------- |
| `name(이름)`   | Read name character by character | `name(김형우)` → `김 형 우`                                      |
| `phone(번호)`  | Convert phone number             | `phone(010-2055-4783)` → `공일공 다시 이공오오 다시 사칠팔삼`    |
| `month(월)`    | Month notation                   | `month(12)` → `십이월`                                           |
| `day(일)`      | Day notation                     | `day(25)` → `이십오일`                                           |
| `date(날짜)`   | Birth date conversion            | `date(19940616)` → `천구백구십사년 육월 십육일생`                |
| `minsec(분초)` | Waiting time                     | `minsec(3m20s)` → `상담사연결까지 약 삼분 이십초 소요예정입니다` |
| `digits(숫자)` | Read digits one by one           | `digits(123456)` → `일 이 삼 사 오 륙`                           |

### Automatic Pattern Detection

Automatically detect and convert common patterns without explicit tags:

```typescript
import { autoConvert } from 'typecast-autotag';

const input = '010-2055-4783으로 연락 부탁드립니다.';
const output = autoConvert(input, { phone: true, date: true });
// Result: '공일공 다시 이공오오 다시 사칠팔삼으로 연락 부탁드립니다.'
```

## Development

### Prerequisites

- Node.js >= 18
- pnpm >= 9

### Setup

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build
pnpm build

# Lint
pnpm lint

# Format
pnpm format
```

### Scripts

| Script               | Description                         |
| -------------------- | ----------------------------------- |
| `pnpm build`         | Build the library using microbundle |
| `pnpm dev`           | Watch mode for development          |
| `pnpm test`          | Run tests                           |
| `pnpm test:watch`    | Run tests in watch mode             |
| `pnpm test:coverage` | Run tests with coverage report      |
| `pnpm lint`          | Run ESLint                          |
| `pnpm lint:fix`      | Run ESLint with auto-fix            |
| `pnpm format`        | Format code with Prettier           |
| `pnpm typecheck`     | Run TypeScript type checking        |

## API Reference

### `convertScript(input, options?)`

Converts tagged script text into speech-friendly format.

**Parameters:**

- `input` (string): The input text containing tags to convert
- `options` (ConvertOptions, optional): Conversion options

**Returns:** The converted text with all tags processed

### `autoConvert(input, options?)`

Automatically detects and converts patterns in text.

**Parameters:**

- `input` (string): The input text to process
- `options` (AutoConvertOptions, optional): Options to control pattern detection

**Returns:** The converted text with detected patterns processed
