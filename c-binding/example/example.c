/**
 * Typecast Autotag C Library 사용 예제
 * 
 * 이 예제는 라이브러리의 세 가지 주요 함수를 보여줍니다:
 * 1. typecast_auto_tag() - 완전 자동 처리
 * 2. typecast_manual_tag() - 기존 호환 방식
 * 3. typecast_auto_tag_with_manual() - 하이브리드 방식
 * 
 * 컴파일:
 *   gcc -o example example.c -L../build -ltypecast_autotag -Wl,-rpath,../build
 * 
 * 실행:
 *   ./example
 */

#include <stdio.h>
#include <stdlib.h>
#include "typecast_autotag.h"

/* 테스트 헬퍼 함수 */
static void test_conversion(const char *label, const char *input, 
                            char* (*func)(const char*)) {
    char *result = func(input);
    if (result) {
        printf("[%s]\n", label);
        printf("  입력: %s\n", input);
        printf("  출력: %s\n", result);
        printf("\n");
        typecast_free(result);
    } else {
        printf("[%s] 변환 실패: %s\n\n", label, input);
    }
}

int main(void) {
    printf("===========================================\n");
    printf("Typecast Autotag C Library 사용 예제\n");
    printf("버전: %s\n", typecast_version());
    printf("===========================================\n\n");
    
    /* 라이브러리 초기화 */
    printf("라이브러리 초기화 중...\n");
    if (typecast_init() != 0) {
        fprintf(stderr, "오류: 라이브러리 초기화 실패\n");
        return 1;
    }
    printf("초기화 완료!\n\n");
    
    /* ==============================
     * 1. 자동 태깅 (autoTag)
     * ============================== */
    printf("==================== 자동 태깅 (autoTag) ====================\n");
    printf("설명: 텍스트에서 패턴을 자동으로 인식하여 변환합니다.\n\n");
    
    test_conversion("전화번호", 
        "전화번호는 010-1234-5678입니다.",
        typecast_auto_tag);
    
    test_conversion("금액", 
        "총 금액은 1500000원입니다.",
        typecast_auto_tag);
    
    test_conversion("날짜", 
        "회의 일정은 2024-03-15입니다.",
        typecast_auto_tag);
    
    test_conversion("시간", 
        "회의는 14:30에 시작합니다.",
        typecast_auto_tag);
    
    test_conversion("복합 패턴", 
        "2024년 1월 15일 14:30에 010-1234-5678로 연락 바랍니다. 비용은 50000원입니다.",
        typecast_auto_tag);
    
    /* ==============================
     * 2. 수동 태그 (manualTag)
     * ============================== */
    printf("==================== 수동 태그 (manualTag) ====================\n");
    printf("설명: 명시적으로 지정한 태그만 변환합니다. 기존 시스템 호환용.\n\n");
    
    test_conversion("이름 태그", 
        "name(김철수)님 안녕하세요.",
        typecast_manual_tag);
    
    test_conversion("전화번호 태그", 
        "phone(010-1234-5678)로 연락주세요.",
        typecast_manual_tag);
    
    test_conversion("금액 태그", 
        "잔액은 money(50000)원입니다.",
        typecast_manual_tag);
    
    test_conversion("복합 태그", 
        "name(홍길동)님, phone(02-123-4567)로 money(100000)원을 입금해 주세요.",
        typecast_manual_tag);
    
    /* ==============================
     * 3. 하이브리드 (autoTagWithManual)
     * ============================== */
    printf("==================== 하이브리드 (autoTagWithManual) ====================\n");
    printf("설명: 수동 태그와 자동 태깅을 함께 사용합니다.\n");
    printf("      자동 인식이 어려운 부분은 수동 태그로 보완할 수 있습니다.\n\n");
    
    test_conversion("이름 + 자동 금액", 
        "name(김철수)님, 잔액은 50000원입니다.",
        typecast_auto_tag_with_manual);
    
    test_conversion("이름 + 자동 전화번호", 
        "name(박영희)님, 010-9876-5432로 연락드렸습니다.",
        typecast_auto_tag_with_manual);
    
    test_conversion("혼합 사용", 
        "name(이순신) 장군님, 2024년 1월 1일 09:00에 money(1000000)원이 입금되었습니다.",
        typecast_auto_tag_with_manual);
    
    /* ==============================
     * 추가 예제: 다양한 패턴
     * ============================== */
    printf("==================== 추가 예제 ====================\n\n");
    
    test_conversion("순서/등수", 
        "1등부터 10등까지 시상합니다. 3번째 순서입니다.",
        typecast_auto_tag);
    
    test_conversion("비율/퍼센트", 
        "할인율은 30%이며, 비율은 3:7입니다.",
        typecast_auto_tag);
    
    test_conversion("층수", 
        "지하 2층에서 5층으로 이동하세요.",
        typecast_auto_tag);
    
    test_conversion("기간", 
        "가입 후 3개월간 무료이며, 계약 기간은 2년입니다.",
        typecast_auto_tag);
    
    /* 라이브러리 정리 */
    printf("==================== 종료 ====================\n");
    typecast_cleanup();
    printf("라이브러리 정리 완료.\n");
    
    return 0;
}

