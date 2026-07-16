<div align="center">

# Typecast Autotag

**TTS 텍스트 전처리 SDK — 텍스트를 음성 친화적인 형식으로 변환**

[![Node.js](https://img.shields.io/badge/Node.js-≥18-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-success?style=for-the-badge)]()
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](./LICENSE)

[기능](#기능) •
[설치](#설치) •
[빠른 시작](#빠른-시작) •
[API](#api-레퍼런스) •
[태그](#지원-태그)

**[English Documentation](./README.md)**

---

</div>

## 언어 지원

JavaScript·브라우저 패키지는 **SSFM v3.0 TTS 전체 언어**를 지원합니다:

| 언어 단계                    | 상태                          | 언어 코드           |
| ---------------------------- | ----------------------------- | ------------------- |
| **한국어** (Korean)          | ✅ 전체 패턴 지원             | `ko`, `kor`         |
| **영어** (English)           | ✅ 전체 패턴 지원             | `en`, `eng`         |
| **일본어** (Japanese)        | ✅ 핵심 TTS 패턴 지원         | `ja`, `jpn`         |
| **중국어 간체** (简体中文)   | ✅ 핵심 TTS 패턴 지원         | `zh`, `zho`         |
| **대만 Mandarin** (繁體中文) | ✅ 핵심 TTS 패턴 지원         | `zh-TW`             |
| **그 외 SSFM v3.0 언어**     | ✅ 공통 숫자 패턴 지원 (33개) | 아래 ISO 639-3 코드 |

SSFM v3.0 공식 언어 코드(37개): `ara`, `ben`, `bul`, `ces`, `dan`, `deu`, `ell`, `eng`, `fin`, `fra`, `hin`, `hrv`, `hun`, `ind`, `ita`, `jpn`, `kor`, `msa`, `nan`, `nld`, `nor`, `pan`, `pol`, `por`, `ron`, `rus`, `slk`, `spa`, `swe`, `tam`, `tgl`, `tha`, `tur`, `ukr`, `vie`, `yue`, `zho`.

전용 규칙 모듈이 없는 33개 언어는 로케일별 소수 표기와 주요 언어의 고유 숫자 문자를 포함해 독립된 `number`, `percentage`, `phone` 패턴을 보수적으로 자동 변환합니다. 수동 태그는 `name`, `digits`, `serial`, `account`도 제공합니다. 날짜·시간·통화·단위의 의미를 별도로 추론하지 않으며, 형식화된 날짜·시간·점수·범위는 모호한 오변환으로부터 보호합니다. `nan`은 TTS가 읽을 수 있는 번체 중국어 표기 숫자를 대체 표현으로 사용합니다.

> 공식 언어 코드 37개는 현재 JavaScript·브라우저 패키지에서 제공합니다. 네이티브 C·Python·Java 바인딩은 기존 한국어·영어 진입점을 유지합니다.

## 지원 환경

### 개발 언어

| 언어        | 버전   | 패키지                                     |
| ----------- | ------ | ------------------------------------------ |
| **Node.js** | ≥18    | `@neosapience/typecast-autotag` (npm/pnpm) |
| **Browser** | Modern | `@neosapience/typecast-autotag` (ESM/UMD)  |
| **Python**  | ≥3.8   | `typecast-autotag` (pip)                   |
| **Java**    | ≥8     | `typecast-autotag` (Maven)                 |
| **C/C++**   | Any    | 네이티브 라이브러리                        |

### 서버 플랫폼

| 플랫폼      | 상태                                                      |
| ----------- | --------------------------------------------------------- |
| **Linux**   | ✅ 지원 (CentOS 6.9+, Amazon Linux 2+, Ubuntu, Debian 등) |
| **macOS**   | ✅ 지원 (Intel & Apple Silicon)                           |
| **Windows** | ✅ 지원 (Windows 10+)                                     |

### 서버 아키텍처

| 아키텍처               | 상태    |
| ---------------------- | ------- |
| **x86_64** (AMD64)     | ✅ 지원 |
| **x86** (32비트)       | ✅ 지원 |
| **arm64** (AArch64)    | ✅ 지원 |
| **armv7** (32비트 ARM) | ✅ 지원 |

---

숫자와 언어별 패턴을 자연스러운 음성 텍스트로 변환합니다. [Typecast](https://typecast.ai) TTS API 및 AICC (AI Contact Center) 환경을 위해 제작되었습니다.

```typescript
import { autoTag } from '@neosapience/typecast-autotag';

// 한국어 자동 태깅
autoTag('전화번호는 010-1234-5678입니다.', { language: 'ko' });
// → '전화번호는 공 . 일 . 공 . 일 . 이 . 삼 . 사 . 오 . 육 . 칠 . 팔 입니다.'

// 영어 자동 태깅
autoTag('Call me at 555-123-4567 tomorrow.', { language: 'en' });
// → 'Call me at five five five, one two three, four five six seven tomorrow.'

// 일본어 자동 태깅
autoTag('受付は6–9時、料金は¥12,800です。', { language: 'ja' });
// → '受付はろくじからくじ、料金はいちまんにせんはっぴゃくえんです。'

// 중국어 간체 자동 태깅
autoTag('客服时间是6–9点，费用是¥12,800。', { language: 'zh' });
// → '客服时间是六点到九点，费用是一万二千八百元。'

// 대만 Mandarin 자동 태깅
autoTag('客服時間是6–9點，費用是NT$12,800。', { language: 'zh-TW' });
// → '客服時間是六點到九點，費用是一萬二千八百新臺幣。'

// 스페인어 공통 숫자 패턴 (공식 ISO 639-3 코드)
autoTag('Total 1,234.5 and 72.5%.', { language: 'spa' });
// → 'Total mil doscientos treinta y cuatro punto cinco and setenta y dos punto cinco%.'
```

<br>

## 기능

- **TTS 37개 언어 지원**: SSFM v3.0의 모든 ISO 639-3 언어 코드와 기존 단축 코드를 지원.
- **자동 태깅**: 전화번호, 날짜, 시간, 금액 등의 패턴을 자동으로 감지하여 변환.
- **수동 태깅**: `tagName(value)` 구문으로 명시적 제어 가능.
- **제로 디펜던시**: 가볍고 빠르며 트리 쉐이킹 가능. ESM과 CommonJS 모두 지원.

<br>

## 설치

npm에서 설치합니다:

```bash
# pnpm (권장)
pnpm add @neosapience/typecast-autotag

# npm
npm install @neosapience/typecast-autotag

# yarn
yarn add @neosapience/typecast-autotag
```

아직 배포되지 않은 브랜치, 태그, 커밋은 GitHub에서 직접 설치할 수 있습니다:

```bash
# 특정 브랜치 설치
pnpm add git+https://github.com/neosapience/typecast-autotag.git#branch-name

# 특정 태그/버전 설치
pnpm add git+https://github.com/neosapience/typecast-autotag.git#v1.5.0

# 특정 커밋 설치
pnpm add git+https://github.com/neosapience/typecast-autotag.git#commit-hash
```

<br>

## 빠른 시작

### 한국어 텍스트 처리

```typescript
import { autoTag, manualTag, autoTagWithManual } from '@neosapience/typecast-autotag';

// 자동 태깅 - 패턴 자동 감지 (한국어)
autoTag('전화번호는 010-1234-5678입니다.', { language: 'ko' });
// → '전화번호는 공 . 일 . 공 . 일 . 이 . 삼 . 사 . 오 . 육 . 칠 . 팔 입니다.'

autoTag('회의는 14:30에 시작합니다.', { language: 'ko' });
// → '회의는 오후 두 시 삼십 분 에 시작합니다.'

autoTag('총 금액은 50000원입니다.', { language: 'ko' });
// → '총 금액은 오만 원 입니다.'

// 수동 태깅 - 명시적 제어
manualTag('안녕하세요, name(김철수)님.', { language: 'ko' });
// → '안녕하세요, 김 . 철 . 수님.'

manualTag('month(12) day(25)에 방문 예정입니다.', { language: 'ko' });
// → '십이월 이십오일에 방문 예정입니다.'

// 조합 - 함께 사용
autoTagWithManual('name(김철수)님, 010-1234-5678로 연락주세요.', { language: 'ko' });
// → '김 . 철 . 수 님, 공 . 일 . 공 . 일 . 이 . 삼 . 사 . 오 . 육 . 칠 . 팔 로 연락주세요.'
```

### 영어 텍스트 처리

```typescript
import { autoTag, manualTag, autoTagWithManual } from '@neosapience/typecast-autotag';

// 자동 태깅 - 패턴 자동 감지 (영어)
autoTag('Call me at 555-123-4567.', { language: 'en' });
// → 'Call me at five five five, one two three, four five six seven.'

autoTag('The meeting is at 2:30 PM.', { language: 'en' });
// → 'The meeting is at two thirty PM.'

autoTag('Total is $1,500.', { language: 'en' });
// → 'Total is one thousand five hundred dollars.'

// 수동 태깅 - 명시적 제어
manualTag('Hello, name(John Smith).', { language: 'en' });
// → 'Hello, J O H N S M I T H.'
```

### 일본어 텍스트 처리

```typescript
import { autoTag, manualTag } from '@neosapience/typecast-autotag';

autoTag('予約日は2026年7月14日、会議は14:30です。', { language: 'ja' });
// → '予約日はにせんにじゅうろくねんしちがつじゅうよっか、会議はじゅうよじさんじゅっぷんです。'

autoTag('スコアは3-2、進捗は72.5%です。', { language: 'ja' });
// → 'スコアはさんたいに、進捗はななじゅうにてんごパーセントです。'

autoTag('東京→大阪、資料は3〜5ページです。', { language: 'ja' });
// → '東京から大阪、資料はさんページからごページです。'

manualTag('暗証番号はdigits(2048)、金額はmoney(5000円)です。', { language: 'ja' });
// → '暗証番号はに・ゼロ・よん・はち、金額はごせんえんです。'
```

### 중국어 텍스트 처리

```typescript
import { autoTag, manualTag } from '@neosapience/typecast-autotag';

autoTag('预约日期是2026年7月14日，会议14:30开始。', { language: 'zh' });
// → '预约日期是二零二六年七月十四日，会议十四点三十分开始。'

autoTag('最终比分是3-2，当前进度是72.5%。', { language: 'zh' });
// → '最终比分是三比二，当前进度是百分之七十二点五。'

autoTag('北京→上海，今晚阅读第3至5页。', { language: 'zh' });
// → '北京到上海，今晚阅读第三页到五页。'

manualTag('验证码是digits(2048)，总计money(5000元)。', { language: 'zh' });
// → '验证码是二·零·四·八，总计五千元。'
```

### 대만 Mandarin 텍스트 처리

```typescript
import { autoTag, manualTag } from '@neosapience/typecast-autotag';

autoTag('手機號碼是0912-345-678，郵遞區號是10617。', { language: 'zh-TW' });
// → '手機號碼是零·九·一·二、三·四·五、六·七·八，郵遞區號是一·零·六·一·七。'

autoTag('訂單編號是AB-2048，航班號是BR108。', { language: 'zh-TW' });
// → '訂單編號是A·B、二·零·四·八，航班號是B·R·一·零·八。'

autoTag('請讀約翰福音3:16，總計NT$1,280。', { language: 'zh-TW' });
// → '請讀約翰福音三章十六節，總計一千二百八十新臺幣。'

manualTag('驗證碼是digits(2048)，總計money(5000新臺幣)。', { language: 'zh-TW' });
// → '驗證碼是二·零·四·八，總計五千新臺幣。'
```

### 언어 모듈 직접 접근

```typescript
// 한국어 모듈 직접 사용
import { korean } from '@neosapience/typecast-autotag';

korean.autoTag('010-1234-5678');
// → '공 . 일 . 공 . 일 . 이 . 삼 . 사 . 오 . 육 . 칠 . 팔'

// 영어 모듈 직접 사용
import { english } from '@neosapience/typecast-autotag';

english.autoTag('Call 555-123-4567');
// → 'Call five five five, one two three, four five six seven'

// 일본어 모듈 직접 사용
import { japanese } from '@neosapience/typecast-autotag';

japanese.autoTag('電話番号は090-1234-5678です。');
// → '電話番号はゼロ・きゅう・ゼロ、いち・に・さん・よん、ご・ろく・なな・はちです。'

// 중국어 간체 모듈 직접 사용
import { chinese } from '@neosapience/typecast-autotag';

chinese.autoTag('手机号是138-0013-8000。');
// → '手机号是一·三·八、零·零·一·三、八·零·零·零。'

// 대만 Mandarin 모듈 직접 사용
import { taiwaneseMandarin } from '@neosapience/typecast-autotag';

taiwaneseMandarin.autoTag('手機號碼是0912-345-678。');
// → '手機號碼是零·九·一·二、三·四·五、六·七·八。'
```

<br>

## API 레퍼런스

### 자동 태깅 함수

<details open>
<summary><b><code>autoTag(text, options?)</code></b> - 자동 감지된 패턴으로 텍스트 변환</summary>

```typescript
// 한국어
autoTag('전화번호는 010-1234-5678입니다.', { language: 'ko' });
// → '전화번호는 공 . 일 . 공 . 일 . 이 . 삼 . 사 . 오 . 육 . 칠 . 팔 입니다.'

// 특정 태그만 활성화
autoTag('010-1234-5678, 50000원', { language: 'ko', enabledTags: ['phone'] });
// → '공 . 일 . 공 . 일 . 이 . 삼 . 사 . 오 . 육 . 칠 . 팔, 50000원'
```

| 옵션          | 타입                | 기본값 | 설명                                    |
| ------------- | ------------------- | ------ | --------------------------------------- |
| `language`    | `SupportedLanguage` | `'ko'` | 공식 ISO 639-3 코드 또는 지원 단축 코드 |
| `enabledTags` | `string[]`          | 전체   | 활성화할 태그 유형                      |

</details>

<details>
<summary><b><code>extractAutoTags(text, options?)</code></b> - 변환 없이 패턴 추출</summary>

```typescript
extractAutoTags('전화번호는 010-1234-5678이고, 금액은 50000원입니다.', { language: 'ko' });
// [
//   { original: '010-1234-5678', tagType: 'phone', start: 6, end: 19 },
//   { original: '50000원', tagType: 'money', start: 28, end: 34 }
// ]
```

</details>

### 수동 태깅 함수

<details open>
<summary><b><code>manualTag(text, options?)</code></b> - 수동 태그 파싱 및 변환</summary>

```typescript
manualTag('안녕하세요, name(김철수) 고객님.', { language: 'ko' });
// → '안녕하세요, 김 . 철 . 수 고객님.'

manualTag('금액은 money(10000)입니다.', { language: 'ko' });
// → '금액은 만 원입니다.'
```

</details>

<details>
<summary><b><code>manualTagSelective(text, options)</code></b> - 특정 태그만 변환</summary>

```typescript
manualTagSelective('name(김철수) month(12)', { language: 'ko', allowedTags: ['name'] });
// → '김 . 철 . 수 month(12)'
```

</details>

### 조합 함수

<details open>
<summary><b><code>autoTagWithManual(text, options?)</code></b> - 자동 태그와 수동 태그 모두 적용</summary>

```typescript
autoTagWithManual('name(김철수)님, 010-1234-5678로 연락주세요.', { language: 'ko' });
// → '김 . 철 . 수 님, 공 . 일 . 공 . 일 . 이 . 삼 . 사 . 오 . 육 . 칠 . 팔 로 연락주세요.'
```

> **참고:** 수동 태그가 먼저 처리된 후 자동 태그가 적용됩니다.

</details>

### 유틸리티 함수

```typescript
import {
  getSupportedLanguages,
  getSupportedAutoTags,
  getSupportedManualTags,
  setDefaultLanguage,
  getDefaultLanguage,
} from '@neosapience/typecast-autotag';

getSupportedLanguages(); // 기존 단축 코드와 SSFM v3.0 공식 코드 37개
getSupportedAutoTags(); // ['phone', 'datetime', 'time', 'date', ...]
getSupportedManualTags(); // ['name', 'month', 'day', 'date', ...]
```

<br>

## 지원 태그

### 한국어 자동 태그 (자동 감지)

| 태그           | 설명        | 입력               | 출력                                                   |
| -------------- | ----------- | ------------------ | ------------------------------------------------------ |
| `phone`        | 전화번호    | `010-1234-5678`    | `공 . 일 . 공 . 일 . 이 . 삼 . 사 . 오 . 육 . 칠 . 팔` |
| `datetime`     | 날짜와 시간 | `2024-01-15T14:30` | `이천이십사년 일월 십오일 오후 두 시 삼십 분`          |
| `time`         | 시간        | `14:30`            | `오후 두 시 삼십 분`                                   |
| `date`         | 날짜        | `2024-01-15`       | `이천이십사년 일월 십오일`                             |
| `money`        | 금액        | `50000원`          | `오만 원`                                              |
| `year`         | 연도        | `2024년`           | `이천이십사년`                                         |
| `month`        | 월          | `12월`             | `십이월`                                               |
| `day`          | 일          | `25일`             | `이십오일`                                             |
| `order`        | 순서        | `3번째`, `2등`     | `세 번째`, `이 등`                                     |
| `point`        | 점수        | `95점`             | `구십오 점`                                            |
| `piece`        | 개수        | `5개`              | `다섯 개`                                              |
| `minsec`       | 분/초       | `5분30초`, `100ms` | `오 분 삼십 초`, `백 밀리초`                           |
| `ratio`        | 비율/퍼센트 | `50%`, `1:2`       | `오십 퍼센트`, `일 대 이`                              |
| `duration`     | 기간        | `3개월`            | `삼 개월`                                              |
| `floor`        | 층수        | `5층`, `B1층`      | `오 층`, `지하 일 층`                                  |
| `weight`       | 무게        | `5kg`, `100g`      | `오 킬로그램`, `백 그램`                               |
| `distance`     | 거리        | `5km`              | `오 킬로미터`                                          |
| `temperature`  | 온도        | `25℃`, `-5°C`      | `이십오 도`, `영하 오 도`                              |
| `volume`       | 용량        | `500ml`, `2L`      | `오백 밀리리터`, `이 리터`                             |
| `dataCapacity` | 데이터 용량 | `100GB`, `50Mbps`  | `백 기가바이트`, `오십 메가비피에스`                   |
| `inch`         | 인치        | `55인치`           | `오십오 인치`                                          |

### 영어 자동 태그 (자동 감지)

| 태그           | 설명        | 입력               | 출력                                                           |
| -------------- | ----------- | ------------------ | -------------------------------------------------------------- |
| `phone`        | 전화번호    | `555-123-4567`     | `five five five, one two three, four five six seven`           |
| `datetime`     | 날짜와 시간 | `2024-01-15T14:30` | `January fifteenth, twenty twenty-four, two thirty PM`         |
| `time`         | 시간        | `2:30 PM`          | `two thirty PM`                                                |
| `date`         | 날짜        | `January 15, 2024` | `January fifteenth, twenty twenty-four`                        |
| `money`        | 금액        | `$1,500`           | `one thousand five hundred dollars`                            |
| `year`         | 연도        | `year 2024`        | `year twenty twenty-four`                                      |
| `month`        | 월          | `January`          | `January`                                                      |
| `day`          | 일          | `the 15th`         | `the fifteenth`                                                |
| `order`        | 순서        | `1st place`        | `first place`                                                  |
| `point`        | 점수        | `95 points`        | `ninety-five points`                                           |
| `piece`        | 개수        | `5 items`          | `five items`                                                   |
| `minsec`       | 분/초       | `5m30s`, `100ms`   | `five minutes thirty seconds`, `one hundred milliseconds`      |
| `ratio`        | 비율/퍼센트 | `50%`, `1:2`       | `fifty percent`, `one to two`                                  |
| `duration`     | 기간        | `3 months`         | `three months`                                                 |
| `floor`        | 층수        | `5th floor`, `B1`  | `fifth floor`, `basement one`                                  |
| `weight`       | 무게        | `5kg`, `100lb`     | `five kilograms`, `one hundred pounds`                         |
| `distance`     | 거리        | `5km`, `100m`      | `five kilometers`, `one hundred meters`                        |
| `temperature`  | 온도        | `25°C`, `-5°F`     | `twenty-five degrees Celsius`, `minus five degrees Fahrenheit` |
| `volume`       | 용량        | `500ml`, `2L`      | `five hundred milliliters`, `two liters`                       |
| `dataCapacity` | 데이터 용량 | `100GB`, `50Mbps`  | `one hundred gigabytes`, `fifty megabits per second`           |
| `inch`         | 인치        | `55 inches`        | `fifty-five inches`                                            |

### 일본어 자동 태그 (자동 감지)

| 태그                      | 설명                      | 입력                 | 출력                                                             |
| ------------------------- | ------------------------- | -------------------- | ---------------------------------------------------------------- |
| `phone`                   | 전화번호                  | `090-1234-5678`      | `ゼロ・きゅう・ゼロ、いち・に・さん・よん、ご・ろく・なな・はち` |
| `postalCode`              | 우편번호                  | `〒100-0001`         | `郵便番号いち・ゼロ・ゼロ、ゼロ・ゼロ・ゼロ・いち`               |
| `date` / `datetime`       | 날짜와 시간               | `2026年7月14日`      | `にせんにじゅうろくねんしちがつじゅうよっか`                     |
| `time`                    | 시각                      | `14:30`              | `じゅうよじさんじゅっぷん`                                       |
| `range`                   | 시간·가격·페이지 범위     | `6–9時`              | `ろくじからくじ`                                                 |
| `money`                   | 금액                      | `¥12,800`            | `いちまんにせんはっぴゃくえん`                                   |
| `score` / `ratio`         | 점수와 비율               | `スコアは3-2`        | `スコアはさんたいに`                                             |
| `percentage` / `fraction` | 퍼센트와 분수             | `72.5%`, `1/2`       | `ななじゅうにてんごパーセント`, `にぶんのいち`                   |
| `order`                   | 장·순위·번호              | `第7章`, `No. 5`     | `だいななしょう`, `ナンバーご`                                   |
| `unit`                    | 측정 단위와 일본어 조수사 | `25kg`, `2人`, `3本` | `にじゅうごキログラム`, `ふたり`, `さんぼん`                     |
| `email`                   | 이메일 기호               | `help@example.jp`    | `help アットマーク example ドット jp`                            |
| `direction`               | 이동 방향                 | `東京→大阪`          | `東京から大阪`                                                   |
| `serial` / `account`      | 문맥형 식별자             | `注文番号はAB-2048`  | `注文番号はA・B、に・ゼロ・よん・はち`                           |
| `flight`                  | 항공편 번호               | `便名はNH2048`       | `便名はN・H・に・ゼロ・よん・はち`                               |
| `scripture`               | 성경 구절                 | `ヨハネ3:16`         | `ヨハネさんしょうじゅうろくせつ`                                 |

### 중국어 자동 태그 (자동 감지)

| 태그                      | 설명                    | 입력                   | 출력                                 |
| ------------------------- | ----------------------- | ---------------------- | ------------------------------------ |
| `phone`                   | 전화번호                | `138-0013-8000`        | `一·三·八、零·零·一·三、八·零·零·零` |
| `postalCode`              | 우편번호                | `邮编是100000`         | `邮编是一·零·零·零·零·零`            |
| `date` / `datetime`       | 날짜와 시간             | `2026年7月14日`        | `二零二六年七月十四日`               |
| `time`                    | 시각                    | `14:30`                | `十四点三十分`                       |
| `range`                   | 시간·가격·페이지 범위   | `6–9点`                | `六点到九点`                         |
| `money`                   | 금액                    | `¥12,800`              | `一万二千八百元`                     |
| `score` / `ratio`         | 점수와 비율             | `最终比分是3-2`        | `最终比分是三比二`                   |
| `percentage` / `fraction` | 퍼센트와 분수           | `72.5%`, `1/2`         | `百分之七十二点五`, `二分之一`       |
| `order`                   | 장·순위·번호            | `第7章`, `No. 5`       | `第七章`, `编号五`                   |
| `unit`                    | 측정 단위와 중국어 양사 | `25kg`, `2人`, `3本书` | `二十五千克`, `两人`, `三本书`       |
| `email`                   | 이메일 기호             | `help@example.cn`      | `help 艾特 example 点 cn`            |
| `direction`               | 이동 방향               | `北京→上海`            | `北京到上海`                         |
| `serial` / `account`      | 문맥형 식별자           | `订单编号是AB-2048`    | `订单编号是A·B、二·零·四·八`         |
| `flight`                  | 항공편 번호             | `航班号是MU512`        | `航班号是M·U·五·一·二`               |
| `scripture`               | 성경 구절               | `约翰福音3:16`         | `约翰福音三章十六节`                 |

### 대만 Mandarin 자동 태그 (자동 감지)

| 태그                 | 설명             | 입력                  | 출력                                   |
| -------------------- | ---------------- | --------------------- | -------------------------------------- |
| `phone`              | 대만 전화번호    | `0912-345-678`        | `零·九·一·二、三·四·五、六·七·八`      |
| `postalCode`         | 대만 우편번호    | `郵遞區號是10617`     | `郵遞區號是一·零·六·一·七`             |
| `date` / `datetime`  | 날짜와 시간      | `2026年7月14日`       | `二零二六年七月十四日`                 |
| `time` / `range`     | 시각과 범위      | `6–9點`               | `六點到九點`                           |
| `money`              | 대만 통화        | `NT$12,800`           | `一萬二千八百新臺幣`                   |
| `score` / `ratio`    | 점수와 비율      | `最終比數是3-2`       | `最終比數是三比二`                     |
| `unit`               | 대만식 측정 단위 | `25kg`, `30cm`, `2TB` | `二十五公斤`, `三十公分`, `二太位元組` |
| `serial` / `account` | 문맥형 식별자    | `訂單編號是AB-2048`   | `訂單編號是A·B、二·零·四·八`           |
| `flight`             | 항공편 번호      | `航班號是BR108`       | `航班號是B·R·一·零·八`                 |
| `scripture`          | 성경 구절        | `約翰福音3:16`        | `約翰福音三章十六節`                   |
| `email`              | 이메일 기호      | `help@example.tw`     | `help 小老鼠 example 點 tw`            |

### 수동 전용 태그

| 태그      | 설명                    | 한국어 구문                                                  | 영어 구문                             |
| --------- | ----------------------- | ------------------------------------------------------------ | ------------------------------------- |
| `name`    | 이름 (글자별)           | `name(김철수)` → `김 . 철 . 수`                              | `name(John)` → `J O H N`              |
| `digits`  | 숫자 (자리별)           | `digits(1234)` → `일 . 이 . 삼 . 사`                         | `digits(1234)` → `one two three four` |
| `address` | 주소 변환 (한국어 전용) | `address(102동 1101호 (엘지동, 아파트))` → `백이동 천백일호` | -                                     |

> **팁:** 모든 자동 태그는 명시적 구문으로 수동 태그로도 사용할 수 있습니다.

<br>

## 예시

<details open>
<summary><b>전화번호</b></summary>

```typescript
// 한국어
autoTag('010-1234-5678', { language: 'ko' }); // → '공 . 일 . 공 . 일 . 이 . 삼 . 사 . 오 . 육 . 칠 . 팔'
autoTag('02-123-4567', { language: 'ko' }); // → '공 . 이 . 일 . 이 . 삼 . 사 . 오 . 육 . 칠'
autoTag('1588-1234', { language: 'ko' }); // → '일 . 오 . 팔 . 팔 . 일 . 이 . 삼 . 사'
autoTag('112', { language: 'ko' }); // → '일 . 일 . 이'

// 영어
autoTag('555-123-4567', { language: 'en' }); // → 'five five five, one two three, four five six seven'
autoTag('(212) 555-1234', { language: 'en' }); // → 'two one two, five five five, one two three four'
```

</details>

<details>
<summary><b>날짜와 시간</b></summary>

```typescript
// 한국어
autoTag('2024-01-15', { language: 'ko' }); // → '이천이십사년 일월 십오일'
autoTag('2024년 6월 16일', { language: 'ko' }); // → '이천이십사년 유월 십육일'
autoTag('14:30', { language: 'ko' }); // → '오후 두 시 삼십 분'
autoTag('오전 9시 30분', { language: 'ko' }); // → '오전 아홉 시 삼십 분'

// 영어
autoTag('January 15, 2024', { language: 'en' }); // → 'January fifteenth, twenty twenty-four'
autoTag('2:30 PM', { language: 'en' }); // → 'two thirty PM'
```

</details>

<details>
<summary><b>금액</b></summary>

```typescript
// 한국어
autoTag('50000원', { language: 'ko' }); // → '오만 원'
autoTag('1,234,567원', { language: 'ko' }); // → '백이십삼만사천오백육십칠 원'
autoTag('₩10000', { language: 'ko' }); // → '만 원'

// 영어
autoTag('$50', { language: 'en' }); // → 'fifty dollars'
autoTag('$1,234.56', { language: 'en' }); // → 'one thousand two hundred thirty-four dollars and fifty-six cents'
```

</details>

<details>
<summary><b>이름</b></summary>

```typescript
// 한국어
manualTag('name(김철수)', { language: 'ko' }); // → '김 . 철 . 수'
manualTag('name(홍길동)', { language: 'ko' }); // → '홍 . 길 . 동'
manualTag('name(김John)', { language: 'ko' }); // → '김 . J . o . h . n'

// 영어
manualTag('name(John)', { language: 'en' }); // → 'J O H N'
manualTag('name(John Smith)', { language: 'en' }); // → 'J O H N S M I T H'
```

</details>

<br>

## 사용 사례

### AICC (AI Contact Center)

자동화된 전화 시스템에서 구조화된 데이터를 자연스러운 음성으로 변환하는 데 적합:

```typescript
// 한국어
const script = autoTagWithManual(
  `
  안녕하세요, name(${customerName})님.
  주문하신 상품이 ${deliveryDate}에 배송될 예정입니다.
  문의사항은 ${supportPhone}으로 연락주세요.
`,
  { language: 'ko' }
);

// 영어
const script = autoTagWithManual(
  `
  Hello, name(${customerName}).
  Your order will be delivered on ${deliveryDate}.
  For questions, call ${supportPhone}.
`,
  { language: 'en' }
);
```

### IVR 시스템

자연스러운 자동 응답 생성:

```typescript
// 한국어
autoTag('고객님의 잔액은 1,234,567원입니다.', { language: 'ko' });
// → '고객님의 잔액은 백이십삼만사천오백육십칠 원 입니다.'

// 영어
autoTag('Your balance is $1,234.56.', { language: 'en' });
// → 'Your balance is one thousand two hundred thirty-four dollars and fifty-six cents.'
```

<br>

## 고급 사용법

### 언어 모듈 직접 접근

```typescript
import { korean, english, japanese, chinese } from '@neosapience/typecast-autotag';

// 언어별 함수 사용
korean.autoTag('010-1234-5678');
english.autoTag('555-123-4567');
japanese.autoTag('090-1234-5678');
chinese.autoTag('138-0013-8000');

// 개별 태그 변환기는 언어 모듈을 통해 접근
korean.name('김철수');
english.phone('555-123-4567');
```

<br>

## 개발

### 요구사항

- Node.js >= 18
- pnpm 9.x

### 빠른 설정

```bash
# 클론 및 전체 설정 (C 바인딩 포함)
git clone <repository-url>
cd typecast-autotag
pnpm setup
```

### 명령어

| 명령어               | 설명                                |
| -------------------- | ----------------------------------- |
| `pnpm install`       | 의존성 설치                         |
| `pnpm setup`         | 전체 설정 (설치 + 빌드 + c-binding) |
| `pnpm dev`           | 감시 모드                           |
| `pnpm build`         | 프로덕션 빌드                       |
| `pnpm test`          | 모든 테스트 실행 (jest + e2e)       |
| `pnpm test:jest`     | jest 테스트만 실행                  |
| `pnpm test:e2e`      | e2e 테스트만 실행                   |
| `pnpm test:coverage` | 커버리지 포함 테스트                |
| `pnpm typecheck`     | 타입 검사                           |
| `pnpm lint`          | 코드 린트                           |
| `pnpm format`        | 코드 포맷                           |

### 기타 바인딩

| 언어   | 문서                                                         |
| ------ | ------------------------------------------------------------ |
| C/C++  | [c-binding/README.KR.md](./c-binding/README.KR.md)           |
| Python | [python-binding/README.KR.md](./python-binding/README.KR.md) |
| Java   | [java-binding/README.KR.md](./java-binding/README.KR.md)     |

### 프로젝트 구조

```
src/
├── index.ts                    # 메인 진입점
├── korean/                     # 한국어 언어 모듈
│   ├── index.ts                # 한국어 모듈 내보내기
│   ├── auto-tag.ts             # 자동 태깅 로직
│   ├── manual-tag.ts           # 수동 태깅 로직
│   ├── tags/                   # 개별 태그 변환기
│   └── utils/
│       └── number-to-korean.ts # 숫자 변환 유틸리티
├── english/                    # 영어 언어 모듈
    ├── index.ts                # 영어 모듈 내보내기
    ├── auto-tag.ts             # 자동 태깅 로직
    ├── manual-tag.ts           # 수동 태깅 로직
    ├── tags/                   # 개별 태그 변환기
    └── utils/
│       └── number-to-english.ts # 숫자 변환 유틸리티
├── japanese/                   # 일본어 언어 모듈
│   └── index.ts                # 일본어 규칙 및 숫자 읽기
├── chinese/                    # 중국어 간체 언어 모듈
│   └── index.ts                # 중국어 규칙 및 숫자 읽기
└── taiwanese-mandarin/         # 대만 Mandarin 어댑터
    └── index.ts                # 공용 중국어 규칙 위 대만식 읽기
```

<br>

## 릴리즈와 공개 배포

GitHub Release 생성은 `release-it`을 사용합니다. npm, PyPI, Maven Central 공개 레지스트리 배포 절차는 [PUBLISHING.md](./PUBLISHING.md)에 정리되어 있습니다.

현재 공개 패키지는 다음 좌표로 배포합니다:

- npm: `@neosapience/typecast-autotag`
- PyPI: `typecast-autotag`
- Maven Central: `com.neosapience:typecast-autotag`

<br>

## 라이선스

이 프로젝트는 [MIT License](./LICENSE) 로 배포됩니다 — Copyright (c) 2026 Neosapience, Inc.

<br>

---

<div align="center">

Made for [Typecast](https://typecast.ai)

**[맨 위로](#typecast-autotag)**

</div>
