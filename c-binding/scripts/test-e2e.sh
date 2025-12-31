#!/bin/bash
#
# TypeCast AutoTag C Library E2E Test Script
#
# 이 스크립트는 빌드된 .so 파일을 Amazon Linux 2와 CentOS 6.9에서 테스트합니다.
# 모든 지원 태그와 세 가지 함수(autoTag, manualTag, autoTagWithManual)를 테스트합니다.
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUILD_DIR="$SCRIPT_DIR/../build"

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 결과 카운터
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

echo "=============================================="
echo "  TypeCast AutoTag C Library E2E Test"
echo "=============================================="
echo ""

# 빌드 파일 확인
if [ ! -f "$BUILD_DIR/libtypecast_autotag.so" ]; then
    echo -e "${RED}Error: libtypecast_autotag.so not found in $BUILD_DIR${NC}"
    echo "Run ./scripts/build-linux.sh first."
    exit 1
fi

# C 테스트 프로그램 생성
TEST_PROGRAM='
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <dlfcn.h>

// 테스트 결과 구조체
typedef struct {
    int total;
    int passed;
    int failed;
} TestResult;

// 함수 포인터 타입
typedef int (*init_fn)(void);
typedef void (*cleanup_fn)(void);
typedef char* (*tag_fn)(const char*);
typedef void (*free_fn)(char*);

// 전역 함수 포인터
static init_fn typecast_init;
static cleanup_fn typecast_cleanup;
static tag_fn typecast_auto_tag;
static tag_fn typecast_manual_tag;
static tag_fn typecast_auto_tag_with_manual;
static free_fn typecast_free;

// 테스트 케이스 구조체
typedef struct {
    const char* name;
    const char* input;
    const char* expected_contains; // 결과에 포함되어야 하는 문자열 (NULL이면 검사 안함)
    int should_change; // 1이면 입력과 달라야 함
} TestCase;

// 테스트 실행
int run_test(TestResult* result, const char* test_name, tag_fn fn, const char* input, 
             const char* expected_contains, int should_change) {
    result->total++;
    
    char* output = fn(input);
    
    if (output == NULL) {
        printf("  [FAIL] %s: NULL result\\n", test_name);
        result->failed++;
        return 0;
    }
    
    int passed = 1;
    
    // should_change 검사
    if (should_change && strcmp(input, output) == 0) {
        printf("  [FAIL] %s: Output unchanged\\n", test_name);
        printf("         Input:  %s\\n", input);
        printf("         Output: %s\\n", output);
        passed = 0;
    }
    
    // expected_contains 검사
    if (passed && expected_contains != NULL && strstr(output, expected_contains) == NULL) {
        printf("  [FAIL] %s: Expected substring not found\\n", test_name);
        printf("         Input:    %s\\n", input);
        printf("         Output:   %s\\n", output);
        printf("         Expected: %s\\n", expected_contains);
        passed = 0;
    }
    
    if (passed) {
        printf("  [PASS] %s\\n", test_name);
        result->passed++;
    } else {
        result->failed++;
    }
    
    typecast_free(output);
    return passed;
}

int main() {
    TestResult result = {0, 0, 0};
    
    // 라이브러리 로드
    void* handle = dlopen("/lib_check/libtypecast_autotag.so", RTLD_NOW);
    if (!handle) {
        fprintf(stderr, "Failed to load library: %s\\n", dlerror());
        return 1;
    }
    
    // 함수 로드
    typecast_init = (init_fn)dlsym(handle, "typecast_init");
    typecast_cleanup = (cleanup_fn)dlsym(handle, "typecast_cleanup");
    typecast_auto_tag = (tag_fn)dlsym(handle, "typecast_auto_tag");
    typecast_manual_tag = (tag_fn)dlsym(handle, "typecast_manual_tag");
    typecast_auto_tag_with_manual = (tag_fn)dlsym(handle, "typecast_auto_tag_with_manual");
    typecast_free = (free_fn)dlsym(handle, "typecast_free");
    
    if (!typecast_init || !typecast_cleanup || !typecast_auto_tag || 
        !typecast_manual_tag || !typecast_auto_tag_with_manual || !typecast_free) {
        fprintf(stderr, "Failed to load functions\\n");
        dlclose(handle);
        return 1;
    }
    
    // 초기화
    if (typecast_init() != 0) {
        fprintf(stderr, "Failed to initialize library\\n");
        dlclose(handle);
        return 1;
    }
    
    printf("Library initialized successfully\\n\\n");
    
    // ============================================
    // 1. manualTag 테스트 - 모든 31개 태그
    // ============================================
    printf("=== Testing typecast_manual_tag (31 tags) ===\\n");
    
    // name 태그
    run_test(&result, "name", typecast_manual_tag, 
             "name(홍길동)님", "홍 길 동", 1);
    
    // month 태그
    run_test(&result, "month", typecast_manual_tag,
             "month(12)월", "십이", 1);
    
    // day 태그
    run_test(&result, "day", typecast_manual_tag,
             "day(25)일", "이십오", 1);
    
    // date 태그
    run_test(&result, "date", typecast_manual_tag,
             "date(2024-12-25)", "이천이십사", 1);
    
    // time 태그
    run_test(&result, "time", typecast_manual_tag,
             "time(14:30)", "시", 1);
    
    // year 태그
    run_test(&result, "year", typecast_manual_tag,
             "year(2024)년", "이천이십사", 1);
    
    // phone 태그
    run_test(&result, "phone", typecast_manual_tag,
             "phone(010-1234-5678)", "공 일 공", 1);
    
    // money 태그
    run_test(&result, "money", typecast_manual_tag,
             "money(50000)원", "오만", 1);
    
    // order 태그
    run_test(&result, "order", typecast_manual_tag,
             "order(3)번째", "세", 1);
    
    // point 태그
    run_test(&result, "point", typecast_manual_tag,
             "point(1000)점", "천", 1);
    
    // piece 태그
    run_test(&result, "piece", typecast_manual_tag,
             "piece(5)개", "다섯", 1);
    
    // digits 태그
    run_test(&result, "digits", typecast_manual_tag,
             "digits(123)", "일 이 삼", 1);
    
    // minsec 태그 (시간 형식에 따라 다른 출력)
    run_test(&result, "minsec", typecast_manual_tag,
             "minsec(05:30)", NULL, 1);
    
    // datetime 태그
    run_test(&result, "datetime", typecast_manual_tag,
             "datetime(2024-12-25T14:30:00)", "년", 1);
    
    // ratio 태그
    run_test(&result, "ratio", typecast_manual_tag,
             "ratio(3.5)배", NULL, 1);
    
    // jari 태그 (자리수 변환)
    run_test(&result, "jari", typecast_manual_tag,
             "jari(5)자리", NULL, 1);
    
    // number 태그
    run_test(&result, "number", typecast_manual_tag,
             "number(12345)", NULL, 1);
    
    // duration 태그
    run_test(&result, "duration", typecast_manual_tag,
             "duration(3)일", NULL, 1);
    
    // floor 태그 (층수 변환)
    run_test(&result, "floor", typecast_manual_tag,
             "floor(5)층", NULL, 1);
    
    // account 태그
    run_test(&result, "account", typecast_manual_tag,
             "account(123-456-789)", NULL, 1);
    
    // weight 태그
    run_test(&result, "weight", typecast_manual_tag,
             "weight(50)kg", NULL, 1);
    
    // mile 태그
    run_test(&result, "mile", typecast_manual_tag,
             "mile(1000)마일", NULL, 1);
    
    // area 태그
    run_test(&result, "area", typecast_manual_tag,
             "area(100)평", NULL, 1);
    
    // serial 태그
    run_test(&result, "serial", typecast_manual_tag,
             "serial(ABC-123)", NULL, 1);
    
    // bakil 태그
    run_test(&result, "bakil", typecast_manual_tag,
             "bakil(2박3일)", NULL, 1);
    
    // roomNumber 태그
    run_test(&result, "roomNumber", typecast_manual_tag,
             "roomNumber(1234)호", NULL, 1);
    
    // jong 태그
    run_test(&result, "jong", typecast_manual_tag,
             "jong(3)종", NULL, 1);
    
    // distance 태그
    run_test(&result, "distance", typecast_manual_tag,
             "distance(100)km", NULL, 1);
    
    // carNumber 태그
    run_test(&result, "carNumber", typecast_manual_tag,
             "carNumber(12가3456)", NULL, 1);
    
    // flight 태그
    run_test(&result, "flight", typecast_manual_tag,
             "flight(KE123)", NULL, 1);
    
    // seat 태그
    run_test(&result, "seat", typecast_manual_tag,
             "seat(12A)", NULL, 1);
    
    // lecture 태그
    run_test(&result, "lecture", typecast_manual_tag,
             "lecture(3)강", NULL, 1);
    
    printf("\\n");
    
    // ============================================
    // 2. autoTag 테스트 - 자동 인식 패턴
    // ============================================
    printf("=== Testing typecast_auto_tag ===\\n");
    
    // 전화번호 (공/영 둘 다 유효)
    run_test(&result, "auto_phone", typecast_auto_tag,
             "010-1234-5678", NULL, 1);
    
    // 금액
    run_test(&result, "auto_money", typecast_auto_tag,
             "50000원", "오만", 1);
    
    // 날짜
    run_test(&result, "auto_date", typecast_auto_tag,
             "2024년 12월 25일", "이천이십사", 1);
    
    // 시간
    run_test(&result, "auto_time", typecast_auto_tag,
             "14:30", NULL, 1);
    
    // 퍼센트
    run_test(&result, "auto_percent", typecast_auto_tag,
             "50%", "오십", 1);
    
    // 개수
    run_test(&result, "auto_count", typecast_auto_tag,
             "5개", "다섯", 1);
    
    // 순서
    run_test(&result, "auto_order", typecast_auto_tag,
             "3번째", NULL, 1);
    
    // 층
    run_test(&result, "auto_floor", typecast_auto_tag,
             "5층", "오", 1);
    
    printf("\\n");
    
    // ============================================
    // 3. autoTagWithManual 테스트 - 혼합
    // ============================================
    printf("=== Testing typecast_auto_tag_with_manual ===\\n");
    
    // 이름 + 전화번호 혼합
    run_test(&result, "mixed_name_phone", typecast_auto_tag_with_manual,
             "name(홍길동)님의 전화번호는 010-1234-5678입니다.", "홍 길 동", 1);
    
    // 이름 + 금액 혼합
    run_test(&result, "mixed_name_money", typecast_auto_tag_with_manual,
             "name(김철수)님이 50000원을 결제했습니다.", "김 철 수", 1);
    
    // 이름 + 날짜 혼합
    run_test(&result, "mixed_name_date", typecast_auto_tag_with_manual,
             "name(이영희)님의 생일은 12월 25일입니다.", "이 영 희", 1);
    
    // 복합 태그 (phone 수동 태그 + money 자동 인식)
    run_test(&result, "mixed_complex", typecast_auto_tag_with_manual,
             "phone(02-123-4567)로 연락주세요. 금액은 100000원입니다.", "십만", 1);
    
    printf("\\n");
    
    // ============================================
    // 결과 출력
    // ============================================
    printf("===========================================\\n");
    printf("Test Results:\\n");
    printf("  Total:  %d\\n", result.total);
    printf("  Passed: %d\\n", result.passed);
    printf("  Failed: %d\\n", result.failed);
    printf("===========================================\\n");
    
    // 정리
    typecast_cleanup();
    dlclose(handle);
    
    // 실패한 테스트가 있으면 1 반환
    return result.failed > 0 ? 1 : 0;
}
'

# Docker에서 테스트 실행 함수
run_docker_test() {
    local image=$1
    local name=$2
    
    echo -e "${BLUE}Testing on $name...${NC}"
    echo ""
    
    # 컨테이너 실행
    local output
    local exit_code
    
    if [[ "$image" == *"centos:6"* ]]; then
        # CentOS 6는 yum 저장소 수정 필요
        output=$(docker run --rm \
            -v "$BUILD_DIR":/lib_check \
            --platform linux/amd64 \
            "$image" sh -c "
            sed -i 's/mirrorlist/#mirrorlist/g' /etc/yum.repos.d/CentOS-Base.repo
            sed -i 's|#baseurl=http://mirror.centos.org|baseurl=http://vault.centos.org|g' /etc/yum.repos.d/CentOS-Base.repo
            yum install -y gcc > /dev/null 2>&1
            
            cat > /tmp/test.c << 'TESTCODE'
$TEST_PROGRAM
TESTCODE
            
            gcc -o /tmp/test /tmp/test.c -ldl 2>&1
            /tmp/test 2>&1
            " 2>&1)
        exit_code=$?
    else
        # Amazon Linux 2
        output=$(docker run --rm \
            -v "$BUILD_DIR":/lib_check \
            --platform linux/amd64 \
            "$image" sh -c "
            yum install -y gcc > /dev/null 2>&1
            
            cat > /tmp/test.c << 'TESTCODE'
$TEST_PROGRAM
TESTCODE
            
            gcc -o /tmp/test /tmp/test.c -ldl 2>&1
            /tmp/test 2>&1
            " 2>&1)
        exit_code=$?
    fi
    
    echo "$output"
    echo ""
    
    if [ $exit_code -eq 0 ]; then
        echo -e "${GREEN}✓ $name: ALL TESTS PASSED${NC}"
        return 0
    else
        echo -e "${RED}✗ $name: SOME TESTS FAILED${NC}"
        return 1
    fi
}

# CentOS 6.9 테스트
echo ""
echo "=============================================="
echo "  Testing on CentOS 6.9"
echo "=============================================="
if run_docker_test "quay.io/centos/centos:6" "CentOS 6.9"; then
    ((PASSED_TESTS++))
else
    ((FAILED_TESTS++))
fi
((TOTAL_TESTS++))

echo ""
echo "=============================================="
echo "  Testing on Amazon Linux 2"
echo "=============================================="
if run_docker_test "amazonlinux:2" "Amazon Linux 2"; then
    ((PASSED_TESTS++))
else
    ((FAILED_TESTS++))
fi
((TOTAL_TESTS++))

# 최종 결과
echo ""
echo "=============================================="
echo "  Final E2E Test Results"
echo "=============================================="
echo "Environments tested: $TOTAL_TESTS"
echo -e "Passed: ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed: ${RED}$FAILED_TESTS${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}All E2E tests passed!${NC}"
    exit 0
else
    echo -e "${RED}Some E2E tests failed!${NC}"
    exit 1
fi

