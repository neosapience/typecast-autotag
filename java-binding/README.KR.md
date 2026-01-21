# Typecast Autotag Java 바인딩

TTS (Text-to-Speech) 텍스트 전처리 라이브러리의 Java 바인딩입니다.
전화번호, 날짜, 금액 등 다양한 패턴을 음성 합성에 적합한 형식으로 자동 변환합니다.

**[English Documentation](./README.md)**

## 특징

- **다국어 지원**: 한국어와 영어 텍스트 전처리 완벽 지원
- **사용 간편**: 3가지 주요 함수만으로 완전한 기능 제공
- **유연한 접근**: 완전 자동, 수동 태그, 하이브리드 모드 지원
- **폭넓은 패턴 지원**: 전화번호, 날짜, 시간, 금액, 순서 등 35개 이상 패턴 자동 인식
- **크로스 플랫폼**: Linux, Windows, macOS 지원
- **Java 8 호환**: Java 8 이상의 모든 버전에서 동작
- **스레드 안전**: 멀티스레드 환경에서 안전하게 사용 가능

## 지원 언어

| 언어 | 상태 | 예시 |
| ---- | ---- | ---- |
| **한국어** (Korean) | ✅ 전체 지원 | `010-1234-5678` → `공 . 일 . 공 . ...` |
| **영어** (English) | ✅ 전체 지원 | `555-123-4567` → `five five five, one two three...` |

## 요구사항

- Java 8 이상
- Maven 3.x 또는 Gradle 6.x 이상

### 빠른 테스트

```bash
# 프로젝트 루트에서
pnpm test:java

# 또는 빌드
pnpm java-binding:build
```

## 설치

### 방법 1: GitHub Releases에서 다운로드 (권장)

```bash
# GitHub Releases에서 최신 JAR 다운로드
# VERSION을 최신 릴리스 버전으로 교체 (예: 1.3.0)
VERSION=$(curl -s https://api.github.com/repos/neosapience/typecast-autotag/releases/latest | grep '"tag_name"' | sed -E 's/.*"v([^"]+)".*/\1/')
curl -L -o typecast-autotag-${VERSION}.jar \
  https://github.com/neosapience/typecast-autotag/releases/download/v${VERSION}/typecast-autotag-${VERSION}.jar

# 프로젝트에서 사용
javac -cp typecast-autotag-${VERSION}.jar YourApp.java
java -cp typecast-autotag-${VERSION}.jar:. YourApp
```

또는 Maven 프로젝트에 추가:

```xml
<dependency>
    <groupId>ai.typecast</groupId>
    <artifactId>typecast-autotag</artifactId>
    <version>${project.version}</version> <!-- 프로젝트 버전 사용 -->
    <scope>system</scope>
    <systemPath>${project.basedir}/lib/typecast-autotag-${project.version}.jar</systemPath>
</dependency>
```

### 방법 2: 소스에서 빌드

```bash
# 저장소 클론
git clone https://github.com/neosapience/typecast-autotag.git
cd typecast-autotag

# C 라이브러리 빌드 (필수)
pnpm install
pnpm c-binding:build-all

# Java 바인딩 빌드 (버전은 package.json에서 자동 동기화)
pnpm java-binding:build

# JAR 파일 위치: java-binding/target/typecast-autotag-{VERSION}.jar
```

### 방법 3: 로컬 Maven 저장소에 설치

```bash
# 소스에서 빌드 후
cd java-binding
mvn install

# 그 다음 pom.xml에서 사용 (버전은 pom.xml에서 확인)
<dependency>
    <groupId>ai.typecast</groupId>
    <artifactId>typecast-autotag</artifactId>
    <version>${typecast-autotag.version}</version> <!-- 설치된 버전 확인 -->
</dependency>
```

## 빠른 시작

```java
import ai.typecast.autotag.TypecastAutotag;

public class Example {
    public static void main(String[] args) {
        try {
            // 한국어 - 자동 패턴 인식 및 변환
            String result = TypecastAutotag.autoTag("전화번호는 010-1234-5678입니다.");
            System.out.println(result);
            // 출력: "전화번호는 공 . 일 . 공 . 일 . 이 . 삼 . 사 . 오 . 육 . 칠 . 팔입니다."

            String result2 = TypecastAutotag.autoTag("총 금액은 1500000원입니다.");
            System.out.println(result2);
            // 출력: "총 금액은 백오십만 원입니다."

            // 영어 - 자동 패턴 인식 및 변환
            String resultEn = TypecastAutotag.autoTagEn("Call me at 555-123-4567.");
            System.out.println(resultEn);
            // 출력: "Call me at five five five, one two three, four five six seven."

            String resultEn2 = TypecastAutotag.autoTagEn("Total is $1,500.");
            System.out.println(resultEn2);
            // 출력: "Total is one thousand five hundred dollars."

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

## API 레퍼런스

### 초기화 및 정리

```java
import ai.typecast.autotag.*;

// 초기화 (첫 사용 시 자동 호출됨)
TypecastAutotag.initialize();

// 정리 (선택사항, 리소스 해제)
TypecastAutotag.cleanup();
```

**참고:** 대부분의 경우 명시적으로 `initialize()`를 호출할 필요가 없습니다. 첫 번째 변환 함수 호출 시 자동으로 초기화됩니다.

### 변환 함수

#### 한국어 (기본)

| 메서드                | 설명        | 사용 시나리오                           |
| --------------------- | ----------- | --------------------------------------- |
| `autoTag()`           | 완전 자동   | 모든 패턴을 자동으로 처리하고 싶을 때   |
| `manualTag()`         | 수동 태그만 | 레거시 시스템 호환, 명시적 제어 필요 시 |
| `autoTagWithManual()` | 하이브리드  | 대부분 자동 + 수동 태그로 보완          |

#### 영어

| 메서드                  | 설명        | 사용 시나리오                           |
| ----------------------- | ----------- | --------------------------------------- |
| `autoTagEn()`           | 완전 자동   | 모든 패턴을 자동으로 처리하고 싶을 때   |
| `manualTagEn()`         | 수동 태그만 | 레거시 시스템 호환, 명시적 제어 필요 시 |
| `autoTagWithManualEn()` | 하이브리드  | 대부분 자동 + 수동 태그로 보완          |

### 방법 1: 완전 자동 (`autoTag` / `autoTagEn`)

텍스트의 패턴을 자동으로 인식하고 변환합니다.
**가장 편리한 방법** - 대부분의 경우 충분합니다.

#### 한국어 예시

```java
import ai.typecast.autotag.TypecastAutotag;

// 전화번호
String result = TypecastAutotag.autoTag("전화번호는 010-1234-5678입니다.");
// → "전화번호는 공 . 일 . 공 . 일 . 이 . 삼 . 사 . 오 . 육 . 칠 . 팔입니다."

// 금액
String result2 = TypecastAutotag.autoTag("총 금액은 1500000원입니다.");
// → "총 금액은 백오십만 원입니다."

// 날짜와 시간
String result3 = TypecastAutotag.autoTag("회의는 2024-03-15 14:30에 시작합니다.");
// → "회의는 이천이십사년 삼 월 십오 일 오후 두 시 삼십 분에 시작합니다."
```

#### 영어 예시

```java
import ai.typecast.autotag.TypecastAutotag;

// 전화번호
String result = TypecastAutotag.autoTagEn("Call me at 555-123-4567.");
// → "Call me at five five five, one two three, four five six seven."

// 금액
String result2 = TypecastAutotag.autoTagEn("Total is $1,500.");
// → "Total is one thousand five hundred dollars."

// 날짜와 시간
String result3 = TypecastAutotag.autoTagEn("Meeting is at 2:30 PM.");
// → "Meeting is at two thirty PM."
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

### 방법 2: 수동 태그만 (`manualTag`)

**레거시 시스템 호환**이나 **명시적 제어**가 필요할 때 사용합니다.
태그 형식: `tagName(value)`

```java
// 이름 태그
String result = TypecastAutotag.manualTag("name(김철수)님 안녕하세요.");
// → "김 . 철 . 수님 안녕하세요."

// 전화번호 태그
String result2 = TypecastAutotag.manualTag("phone(010-1234-5678)로 연락주세요.");
// → "공 . 일 . 공 . 일 . 이 . 삼 . 사 . 오 . 육 . 칠 . 팔로 연락주세요."
```

**지원 태그 (총 37개):**

| 태그                 | 설명               | 예시                                            |
| -------------------- | ------------------ | ----------------------------------------------- |
| `name(이름)`         | 이름 읽기          | `name(김철수)` → 김 . 철 . 수                   |
| `phone(번호)`        | 전화번호 읽기      | `phone(010-1234-5678)` → 공 . 일 . 공 . ...     |
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
| `digits(숫자)`       | 숫자 하나씩 읽기   | `digits(123)` → 일 . 이 . 삼                    |
| ...기타              |                    |                                                 |

### 방법 3: 하이브리드 모드 (`autoTagWithManual`)

자동 태깅이 잘못 인식하는 부분을 **수동 태그로 보완**합니다.
수동 태그가 먼저 처리되고, 나머지에 자동 태깅이 적용됩니다.

```java
// 이름은 수동 태그로, 금액은 자동으로
String result = TypecastAutotag.autoTagWithManual("name(김철수)님, 잔액은 50000원입니다.");
// → "김 . 철 . 수님, 잔액은 오만 원입니다."

// 복잡한 예시
String result2 = TypecastAutotag.autoTagWithManual(
    "name(홍길동)님, 2024-03-15 14:30에 phone(02-123-4567)로 연락드리겠습니다."
);
```

## 예외 처리

```java
import ai.typecast.autotag.*;

try {
    String result = TypecastAutotag.autoTag("Some text");
} catch (LibraryNotFoundException e) {
    System.err.println("플랫폼에 맞는 네이티브 라이브러리를 찾을 수 없음");
} catch (InitializationException e) {
    System.err.println("라이브러리 초기화 실패");
} catch (ConversionException e) {
    System.err.println("텍스트 변환 실패");
} catch (TypecastAutotagException e) {
    System.err.println("일반 라이브러리 오류");
}
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

### 프로젝트 구조

```
java-binding/
├── src/
│   ├── main/
│   │   ├── java/ai/typecast/autotag/
│   │   │   ├── TypecastAutotag.java           # 메인 API 클래스
│   │   │   ├── NativeLibraryLoader.java       # 네이티브 라이브러리 로더
│   │   │   ├── TypecastAutotagException.java  # 기본 예외 클래스
│   │   │   ├── LibraryNotFoundException.java  # 라이브러리 미발견 예외
│   │   │   ├── InitializationException.java   # 초기화 실패 예외
│   │   │   └── ConversionException.java       # 변환 실패 예외
│   │   ├── c/
│   │   │   └── typecast_autotag_jni.c         # JNI 브리지 코드
│   │   └── resources/lib/                     # 네이티브 라이브러리
│   │       ├── linux/                         # Linux 라이브러리
│   │       ├── darwin/                        # macOS 라이브러리
│   │       └── windows/                       # Windows 라이브러리
│   └── test/
│       └── java/ai/typecast/autotag/
│           └── TypecastAutotagTest.java       # 단위 테스트
├── examples/
│   └── BasicUsage.java                        # 기본 사용 예제
├── scripts/
│   └── copy-libs.sh                           # 라이브러리 복사 스크립트
├── pom.xml                                    # Maven 설정
└── README.md                                  # 이 파일
```

### 빌드 및 테스트

```bash
# 프로젝트 루트에서 - 모든 것을 자동으로 빌드
pnpm java-binding:build

# 또는 수동으로:
cd java-binding
./scripts/copy-libs.sh  # 네이티브 라이브러리 복사
mvn clean package       # JAR 빌드

# 로컬 Maven 저장소에 설치
mvn install
```

### 테스트 실행

```bash
# 프로젝트 루트에서
pnpm test:java

# 또는 수동으로:
cd java-binding
./scripts/run-test.sh
```

### 예제 실행

```bash
cd java-binding
javac -cp target/typecast-autotag-*.jar examples/BasicUsage.java
java -cp target/typecast-autotag-*.jar:examples BasicUsage
```

### 릴리스 생성

릴리스 담당자를 위한 GitHub Release 생성 방법:

```bash
# 1. JAR 빌드
pnpm java-binding:build

# 2. GitHub CLI로 릴리스 생성
gh release create v1.4.0 \
  java-binding/target/typecast-autotag-*.jar \
  --title "v1.4.0" \
  --notes "릴리스 노트"

# 또는 웹 인터페이스 사용:
# https://github.com/neosapience/typecast-autotag/releases/new
```

## 문제 해결

### 라이브러리를 찾을 수 없는 경우

```
LibraryNotFoundException: Library not found in JAR
```

**해결 방법:**

1. 네이티브 라이브러리가 제대로 복사되었는지 확인:
   ```bash
   ./scripts/copy-libs.sh
   ```
2. JAR 파일 내부를 확인:
   ```bash
   jar tf target/typecast-autotag-1.3.0.jar | grep lib/
   ```

### 초기화 실패

```
InitializationException: Failed to initialize Typecast Autotag library
```

**해결 방법:**

- 시스템이 지원되는 플랫폼인지 확인
- 라이브러리 파일에 실행 권한이 있는지 확인
- 로그에서 자세한 오류 메시지 확인

### UnsatisfiedLinkError

```
java.lang.UnsatisfiedLinkError: no typecast_autotag in java.library.path
```

**해결 방법:**

- JAR 파일에 네이티브 라이브러리가 포함되어 있는지 확인
- Maven 빌드 시 리소스가 제대로 포함되었는지 확인

## 성능 고려사항

- **초기화**: 라이브러리 초기화는 한 번만 수행됩니다. 이후 호출은 무시됩니다.
- **스레드 안전**: 모든 메서드는 스레드 안전하며 동시 호출이 가능합니다.
- **메모리**: 네이티브 라이브러리는 자동으로 메모리를 관리합니다.

## 지원

문제가 발생하거나 도움이 필요하시면 GitHub 이슈를 등록해주세요.

## 관련 프로젝트

- [typecast-autotag](../README.md) - TypeScript/JavaScript 버전
- [python-binding](../python-binding/README.KR.md) - Python 바인딩
- [c-binding](../c-binding/README.KR.md) - C 라이브러리
