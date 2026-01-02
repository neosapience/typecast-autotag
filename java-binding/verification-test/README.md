# Java Binding Verification Test

이 디렉토리에는 Java 바인딩이 실제로 작동하는지 확인하는 간단한 검증 테스트가 포함되어 있습니다.

## 왜 JNA를 사용하나요?

현재 Java 바인딩은 JNI를 사용하도록 설계되어 있지만, JNI 브리지 코드가 C 라이브러리에 컴파일되어 있지 않습니다. JNA(Java Native Access)를 사용하면 별도의 JNI 코드 없이 직접 네이티브 라이브러리 함수를 호출할 수 있습니다.

## 실행 방법

### 1. JNA 다운로드

```bash
cd verification-test
curl -L -O https://repo1.maven.org/maven2/net/java-native-access/jna/5.14.0/jna-5.14.0.jar
```

### 2. 컴파일

```bash
javac -cp jna-5.14.0.jar:. SimpleVerificationTest.java
```

### 3. 실행

```bash
java -cp jna-5.14.0.jar:. SimpleVerificationTest
```

## 예상 출력

```
============================================================
Typecast Autotag Java Binding - Verification Test
============================================================

Loading library from: ../src/main/resources/lib/darwin/libtypecast_autotag.dylib
✓ Library loaded successfully

Initializing library...
✓ Library initialized successfully

Library version: 1.0.0

Test 1: Auto Tag - Phone Number
  Input:  전화번호는 010-1234-5678입니다.
  Output: 전화번호는 공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔입니다.
  ✓ PASS

Test 2: Auto Tag - Money
  Input:  총 금액은 50000원입니다.
  Output: 총 금액은 오만 원입니다.
  ✓ PASS

Test 3: Manual Tag - Name
  Input:  name(김철수)님 안녕하세요.
  Output: 김 철 수님 안녕하세요.
  ✓ PASS

Test 4: Hybrid Mode
  Input:  name(홍길동)님, 잔액은 50000원입니다.
  Output: 홍 길 동님, 잔액은 오만 원입니다.
  ✓ PASS

✓ Library cleaned up successfully

============================================================
✓ ALL TESTS PASSED
============================================================
```

## 테스트 내용

이 테스트는 다음을 검증합니다:

1. **라이브러리 로딩** - 네이티브 라이브러리를 성공적으로 로드할 수 있는지
2. **초기화** - 라이브러리 초기화가 성공하는지
3. **Auto Tag** - 전화번호, 금액 등의 자동 변환이 작동하는지
4. **Manual Tag** - 수동 태그 처리가 작동하는지
5. **Hybrid Mode** - 자동 + 수동 태그 혼합 모드가 작동하는지
6. **정리** - 리소스 정리가 정상적으로 되는지

## 주의사항

- 이 테스트는 macOS용입니다. Linux/Windows에서는 라이브러리 경로를 수정해야 합니다.
- JNA는 검증 목적으로만 사용됩니다. 실제 배포에는 JNI 바인딩을 사용해야 합니다.

## 다음 단계

이 검증 테스트가 성공하면 다음을 진행할 수 있습니다:

1. JNI 브리지 코드를 C 라이브러리에 포함하여 재빌드
2. 또는 JNA 기반 바인딩으로 변경 고려
3. 실제 애플리케이션에 통합 테스트
