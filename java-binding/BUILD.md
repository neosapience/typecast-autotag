# Build Guide for Typecast Autotag Java Binding

이 문서는 Java 바인딩을 빌드하고 테스트하는 방법을 설명합니다.

## 필요 사항

- Java Development Kit (JDK) 8 이상
- Maven 3.x
- C 컴파일러 (JNI 네이티브 코드 컴파일용, 선택사항)

## Maven 설치

### macOS (Homebrew 사용)

```bash
brew install maven
```

### Ubuntu/Debian

```bash
sudo apt-get update
sudo apt-get install maven
```

### Windows (Chocolatey 사용)

```powershell
choco install maven
```

## 빌드 단계

### 1. 네이티브 라이브러리 복사

먼저 c-binding의 빌드된 라이브러리를 java-binding으로 복사해야 합니다:

```bash
cd java-binding
./scripts/copy-libs.sh
```

이 스크립트는 다음 라이브러리들을 복사합니다:
- Linux: `libtypecast_autotag*.so`
- macOS: `libtypecast_autotag.dylib`
- Windows: `typecast_autotag*.dll`

### 2. Maven 빌드

```bash
# 컴파일만
mvn clean compile

# 테스트 포함 빌드
mvn clean test

# JAR 파일 생성
mvn clean package

# 로컬 Maven 저장소에 설치
mvn clean install
```

### 3. 빌드 결과 확인

빌드가 성공하면 다음 파일들이 생성됩니다:

```
target/
├── typecast-autotag-1.3.0.jar              # 메인 JAR
├── typecast-autotag-1.3.0-sources.jar      # 소스 JAR
├── typecast-autotag-1.3.0-javadoc.jar      # Javadoc JAR
└── classes/                                 # 컴파일된 클래스 파일
```

## JNI 네이티브 코드 (고급)

Java 바인딩은 JNI를 통해 C 라이브러리와 통신합니다. 현재 구조에서는 이미 빌드된 C 라이브러리를 사용합니다.

### JNI 헤더 생성 (필요한 경우)

Java 8의 경우:

```bash
javah -classpath target/classes -d src/main/c ai.typecast.autotag.TypecastAutotag
```

Java 9 이상의 경우:

```bash
javac -h src/main/c src/main/java/ai/typecast/autotag/TypecastAutotag.java
```

### JNI 브리지 컴파일 (이미 완료됨)

JNI 브리지 코드(`src/main/c/typecast_autotag_jni.c`)는 C 라이브러리와 함께 컴파일되어야 합니다.
현재는 c-binding에서 이미 모든 기능이 포함된 라이브러리를 제공하므로 별도로 컴파일할 필요가 없습니다.

## 테스트 실행

```bash
# 모든 테스트 실행
mvn test

# 특정 테스트만 실행
mvn test -Dtest=TypecastAutotagTest

# 테스트 건너뛰고 빌드
mvn package -DskipTests
```

## 예제 실행

```bash
# 예제 컴파일
javac -cp target/typecast-autotag-1.3.0.jar examples/BasicUsage.java

# 예제 실행 (Unix/Linux/macOS)
java -cp target/typecast-autotag-1.3.0.jar:examples BasicUsage

# 예제 실행 (Windows)
java -cp target/typecast-autotag-1.3.0.jar;examples BasicUsage
```

## Maven 캐시 정리

문제가 발생하면 Maven 캐시를 정리해보세요:

```bash
# Maven 로컬 저장소 캐시 정리
mvn dependency:purge-local-repository

# 완전 정리 후 재빌드
mvn clean install -U
```

## IDE에서 프로젝트 열기

### IntelliJ IDEA

1. File > Open
2. java-binding 폴더의 `pom.xml` 선택
3. "Open as Project" 선택
4. Maven 자동 import 대기

### Eclipse

1. File > Import > Maven > Existing Maven Projects
2. java-binding 폴더 선택
3. Finish

### VS Code

1. java-binding 폴더 열기
2. Java Extension Pack 설치
3. Maven for Java 확장 설치
4. 자동으로 프로젝트 감지됨

## 문제 해결

### Maven이 설치되지 않음

```bash
# 버전 확인
mvn -version

# 설치 안 되어 있으면 위의 "Maven 설치" 섹션 참조
```

### 네이티브 라이브러리를 찾을 수 없음

```bash
# 라이브러리 복사 스크립트 재실행
./scripts/copy-libs.sh

# JAR 내용 확인
jar tf target/typecast-autotag-1.3.0.jar | grep lib/
```

### 테스트 실패

```bash
# 더 자세한 로그와 함께 테스트 실행
mvn test -X

# 특정 테스트만 디버그
mvn test -Dtest=TypecastAutotagTest -X
```

### Java 버전 문제

```bash
# 현재 Java 버전 확인
java -version
javac -version

# Java 8 이상이 필요합니다
```

## 배포 (선택사항)

Maven Central에 배포하려면:

```bash
# GPG 서명 설정 (한 번만)
gpg --gen-key

# 릴리스 빌드
mvn clean deploy -P release

# Nexus Staging Plugin 사용
mvn nexus-staging:release
```

## 추가 리소스

- [Maven 공식 문서](https://maven.apache.org/guides/)
- [JNI 프로그래밍 가이드](https://docs.oracle.com/javase/8/docs/technotes/guides/jni/)
- [Java 패키징 가이드](https://maven.apache.org/guides/mini/guide-creating-archetypes.html)

