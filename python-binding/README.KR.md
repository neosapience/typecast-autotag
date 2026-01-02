# Typecast Autotag Python 바인딩

TTS (Text-to-Speech) 텍스트 전처리 라이브러리의 Python 바인딩입니다.
전화번호, 날짜, 금액 등 다양한 패턴을 음성 합성에 적합한 형식으로 자동 변환합니다.

**[English Documentation](./README.md)**

## 특징

- **다국어 지원**: 한국어와 영어 텍스트 전처리 완벽 지원
- **사용 간편**: 3가지 주요 함수만으로 완전한 기능 제공
- **유연한 접근**: 완전 자동, 수동 태그, 하이브리드 모드 지원
- **폭넓은 패턴 지원**: 전화번호, 날짜, 시간, 금액, 순서 등 35개 이상 패턴 자동 인식
- **크로스 플랫폼**: Linux, Windows, macOS 지원
- **의존성 없음**: ctypes를 사용한 순수 Python (추가 pip 패키지 불필요)

## 지원 언어

| 언어 | 상태 | 예시 |
| ---- | ---- | ---- |
| **한국어** (Korean) | ✅ 전체 지원 | `010-1234-5678` → `공 일 공 다시...` |
| **영어** (English) | ✅ 전체 지원 | `555-123-4567` → `five five five, one two three...` |

## 설치

### GitHub에서 설치

```bash
# GitHub에서 직접 설치 (subdirectory 지정 필요)
pip install "git+https://github.com/neosapience/typecast-autotag-ts#subdirectory=python-binding"
```

### 소스에서 설치

```bash
git clone https://github.com/neosapience/typecast-autotag-ts.git
cd typecast-autotag-ts/python-binding
pip install .

# 또는 개발 모드로 설치
pip install -e .
```

### PyPI에서 설치 (배포 후)

```bash
pip install typecast-autotag
```

## 빠른 시작

```python
from typecast_autotag import auto_tag, auto_tag_en

# 한국어 - 자동 패턴 인식 및 변환
result = auto_tag("전화번호는 010-1234-5678입니다.")
print(result)  # "전화번호는 공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔입니다."

result = auto_tag("총 금액은 1500000원입니다.")
print(result)  # "총 금액은 백오십만 원입니다."

# 영어 - 자동 패턴 인식 및 변환
result_en = auto_tag_en("Call me at 555-123-4567.")
print(result_en)  # "Call me at five five five, one two three, four five six seven."

result_en = auto_tag_en("Total is $1,500.")
print(result_en)  # "Total is one thousand five hundred dollars."
```

## API 레퍼런스

### 초기화 및 정리

```python
from typecast_autotag import initialize, cleanup

# 초기화 (첫 사용 시 자동 호출됨)
initialize()

# 정리 (선택사항, 리소스 해제)
cleanup()
```

### 변환 함수

#### 한국어 (기본)

| 함수                     | 설명        | 사용 시나리오                           |
| ------------------------ | ----------- | --------------------------------------- |
| `auto_tag()`             | 완전 자동   | 모든 패턴을 자동으로 처리하고 싶을 때   |
| `manual_tag()`           | 수동 태그만 | 레거시 시스템 호환, 명시적 제어 필요 시 |
| `auto_tag_with_manual()` | 하이브리드  | 대부분 자동 + 수동 태그로 보완          |

#### 영어

| 함수                        | 설명        | 사용 시나리오                           |
| --------------------------- | ----------- | --------------------------------------- |
| `auto_tag_en()`             | 완전 자동   | 모든 패턴을 자동으로 처리하고 싶을 때   |
| `manual_tag_en()`           | 수동 태그만 | 레거시 시스템 호환, 명시적 제어 필요 시 |
| `auto_tag_with_manual_en()` | 하이브리드  | 대부분 자동 + 수동 태그로 보완          |

### 방법 1: 완전 자동 (`auto_tag` / `auto_tag_en`)

텍스트의 패턴을 자동으로 인식하고 변환합니다.
**가장 편리한 방법** - 대부분의 경우 충분합니다.

#### 한국어 예시

```python
from typecast_autotag import auto_tag

# 전화번호
result = auto_tag("전화번호는 010-1234-5678입니다.")
# → "전화번호는 공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔입니다."

# 금액
result = auto_tag("총 금액은 1500000원입니다.")
# → "총 금액은 백오십만 원입니다."

# 날짜와 시간
result = auto_tag("회의는 2024-03-15 14:30에 시작합니다.")
# → "회의는 이천이십사년 삼 월 십오 일 오후 두 시 삼십 분에 시작합니다."
```

#### 영어 예시

```python
from typecast_autotag import auto_tag_en

# 전화번호
result = auto_tag_en("Call me at 555-123-4567.")
# → "Call me at five five five, one two three, four five six seven."

# 금액
result = auto_tag_en("Total is $1,500.")
# → "Total is one thousand five hundred dollars."

# 날짜와 시간
result = auto_tag_en("Meeting is at 2:30 PM.")
# → "Meeting is at two thirty PM."
```

**지원 패턴 (한국어):**

- 전화번호: `010-1234-5678`, `02-123-4567`, `1588-1234`
- 금액: `50000원`, `1500만원`, `₩10000`
- 날짜: `2024-03-15`, `2024년 3월 15일`, `20240315`
- 시간: `14:30`, `오후 2시 30분`
- 순서: `1등`, `3번째`, `5위`
- 비율: `30%`, `3:7`
- 기간: `3개월`, `2년`, `5일간`
- 층수: `지하 2층`, `5층`, `B1층`
- 기타: 점수, 면적, 거리, 무게, 마일리지 등

**지원 패턴 (영어):**

- 전화번호: `555-123-4567`, `(212) 555-1234`, `1-800-555-1234`
- 금액: `$1,500`, `€100`, `50 dollars`
- 날짜: `January 15, 2024`, `2024-01-15`
- 시간: `2:30 PM`, `10:00 AM`
- 순서: `1st place`, `2nd`, `3rd`
- 비율: `50%`, `1:2`
- 기간: `3 months`, `2 years`
- 층수: `5th floor`, `B1`, `basement level 2`
- 기타: 점수, 면적, 거리, 무게, 온도 등

### 방법 2: 수동 태그만 (`manual_tag`)

**레거시 시스템 호환**이나 **명시적 제어**가 필요할 때 사용합니다.
태그 형식: `tagName(value)`

```python
from typecast_autotag import manual_tag

# 이름 태그
result = manual_tag("name(김철수)님 안녕하세요.")
# → "김 철 수님 안녕하세요."

# 전화번호 태그
result = manual_tag("phone(010-1234-5678)로 연락주세요.")
# → "공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔로 연락주세요."
```

**지원 태그 (총 37개):**

| 태그                 | 설명               | 예시                                            |
| -------------------- | ------------------ | ----------------------------------------------- |
| `name(이름)`         | 이름 읽기          | `name(김철수)` → 김 철 수                       |
| `phone(번호)`        | 전화번호 읽기      | `phone(010-1234-5678)` → 공 일 공 다시...       |
| `money(금액)`        | 금액 읽기          | `money(50000)` → 오만 원                        |
| `date(날짜)`         | 날짜 읽기          | `date(2024-03-15)` → 이천이십사년 삼 월 십오 일 |
| `time(시간)`         | 시간 읽기          | `time(14:30)` → 오후 두 시 삼십 분              |
| `datetime(날짜시간)` | 날짜+시간 읽기     | `datetime(2024-03-15T14:30)`                    |
| `year(연도)`         | 연도 읽기          | `year(2024)` → 이천이십사년                     |
| `month(월)`          | 월 읽기            | `month(3)` → 삼월                               |
| `day(일)`            | 일 읽기            | `day(15)` → 십오일                              |
| `order(순서)`        | 순서 읽기          | `order(3)` → 세 번째                            |
| `point(점수)`        | 점수 읽기          | `point(95)` → 구십오 점                         |
| `piece(개수)`        | 개수 읽기 (고유어) | `piece(3)` → 세 개                              |
| `digits(숫자)`       | 숫자 하나씩 읽기   | `digits(123)` → 일 이 삼                        |
| `minsec(시간)`       | 분초 읽기          | `minsec(5m30s)` → 오 분 삼십 초                 |
| `ratio(비율)`        | 비율/퍼센트 읽기   | `ratio(30%)` → 삼십 퍼센트                      |
| `floor(층수)`        | 층수 읽기          | `floor(B2)` → 지하 이 층                        |
| `weight(무게)`       | 무게 읽기          | `weight(5kg)` → 오 킬로그램                     |
| `distance(거리)`     | 거리 읽기          | `distance(5km)` → 오 킬로미터                   |
| `temperature(온도)`  | 온도 읽기          | `temperature(25℃)` → 이십오 도                  |
| `volume(부피)`       | 부피 읽기          | `volume(500ml)` → 오백 밀리리터                 |
| ...기타              |                    |                                                 |

### 방법 3: 하이브리드 모드 (`auto_tag_with_manual`)

자동 태깅이 잘못 인식하는 부분을 **수동 태그로 보완**합니다.
수동 태그가 먼저 처리되고, 나머지에 자동 태깅이 적용됩니다.

```python
from typecast_autotag import auto_tag_with_manual

# 이름은 수동 태그로, 금액은 자동으로
result = auto_tag_with_manual("name(김철수)님, 잔액은 50000원입니다.")
# → "김 철 수님, 잔액은 오만 원입니다."

# 복잡한 예시
result = auto_tag_with_manual(
    "name(홍길동)님, 2024-03-15 14:30에 phone(02-123-4567)로 연락드리겠습니다."
)
```

### 컨텍스트 매니저

자동 리소스 관리:

```python
from typecast_autotag import TypecastAutotag

with TypecastAutotag() as tagger:
    result = tagger.auto_tag("전화번호는 010-1234-5678입니다.")
    print(result)

    result = tagger.manual_tag("name(김철수)님")
    print(result)
# 리소스가 자동으로 정리됨
```

## 예외 처리

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
    print("플랫폼에 맞는 네이티브 라이브러리를 찾을 수 없음")
except InitializationError:
    print("라이브러리 초기화 실패")
except ConversionError:
    print("텍스트 변환 실패")
except TypecastAutotagError:
    print("일반 라이브러리 오류")
```

## 플랫폼 지원

| 플랫폼  | 아키텍처       | 상태                 |
| ------- | -------------- | -------------------- |
| Linux   | x86_64         | ✅ 지원              |
| Linux   | x86 (32비트)   | ✅ 지원              |
| Linux   | arm64          | ✅ 지원              |
| Linux   | armv7          | ✅ 지원              |
| macOS   | x86_64 + arm64 | ✅ 유니버셜 바이너리 |
| Windows | x86_64         | ✅ 지원              |
| Windows | x86 (32비트)   | ✅ 지원              |

## 개발

### 테스트 실행

```bash
cd python-binding
pip install -e ".[dev]"
pytest
```

### 패키지 빌드

```bash
cd python-binding
pip install build
python -m build
```

## 라이브러리 위치

네이티브 라이브러리는 다음 위치에 배치해야 합니다:

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

`c-binding/build/` 디렉토리에서 라이브러리를 복사할 수 있습니다:

```bash
./scripts/copy-libs.sh
```

## 라이선스

MIT License

## 지원

문제가 발생하거나 도움이 필요하시면 GitHub 이슈를 등록해주세요.
