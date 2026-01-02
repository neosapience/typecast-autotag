/**
 * Typecast Autotag C Library Usage Example
 * 
 * This example demonstrates the three main functions of the library:
 * 1. typecast_auto_tag() - Fully automatic processing
 * 2. typecast_manual_tag() - Legacy compatible approach
 * 3. typecast_auto_tag_with_manual() - Hybrid approach
 * 
 * Compile:
 *   gcc -o example example.c -L../build -ltypecast_autotag -Wl,-rpath,../build
 * 
 * Run:
 *   ./example
 */

#include <stdio.h>
#include <stdlib.h>
#include "typecast_autotag.h"

/* Test helper function */
static void test_conversion(const char *label, const char *input, 
                            char* (*func)(const char*)) {
    char *result = func(input);
    if (result) {
        printf("[%s]\n", label);
        printf("  Input: %s\n", input);
        printf("  Output: %s\n", result);
        printf("\n");
        typecast_free(result);
    } else {
        printf("[%s] Conversion failed: %s\n\n", label, input);
    }
}

int main(void) {
    printf("===========================================\n");
    printf("Typecast Autotag C Library Usage Example\n");
    printf("Version: %s\n", typecast_version());
    printf("===========================================\n\n");
    
    /* Initialize the library */
    printf("Initializing library...\n");
    if (typecast_init() != 0) {
        fprintf(stderr, "Error: Library initialization failed\n");
        return 1;
    }
    printf("Initialization complete!\n\n");
    
    /* ==============================
     * 1. Auto Tagging (autoTag)
     * ============================== */
    printf("==================== Auto Tagging (autoTag) ====================\n");
    printf("Description: Automatically recognizes and converts patterns in text.\n\n");
    
    test_conversion("Phone Number", 
        "전화번호는 010-1234-5678입니다.",
        typecast_auto_tag);
    
    test_conversion("Amount", 
        "총 금액은 1500000원입니다.",
        typecast_auto_tag);
    
    test_conversion("Date", 
        "회의 일정은 2024-03-15입니다.",
        typecast_auto_tag);
    
    test_conversion("Time", 
        "회의는 14:30에 시작합니다.",
        typecast_auto_tag);
    
    test_conversion("Complex Pattern", 
        "2024년 1월 15일 14:30에 010-1234-5678로 연락 바랍니다. 비용은 50000원입니다.",
        typecast_auto_tag);
    
    /* ==============================
     * 2. Manual Tag (manualTag)
     * ============================== */
    printf("==================== Manual Tag (manualTag) ====================\n");
    printf("Description: Converts only explicitly specified tags. For legacy system compatibility.\n\n");
    
    test_conversion("Name Tag", 
        "name(김철수)님 안녕하세요.",
        typecast_manual_tag);
    
    test_conversion("Phone Number Tag", 
        "phone(010-1234-5678)로 연락주세요.",
        typecast_manual_tag);
    
    test_conversion("Amount Tag", 
        "잔액은 money(50000)원입니다.",
        typecast_manual_tag);
    
    test_conversion("Complex Tags", 
        "name(홍길동)님, phone(02-123-4567)로 money(100000)원을 입금해 주세요.",
        typecast_manual_tag);
    
    /* ==============================
     * 3. Hybrid (autoTagWithManual)
     * ============================== */
    printf("==================== Hybrid (autoTagWithManual) ====================\n");
    printf("Description: Uses manual tags and auto tagging together.\n");
    printf("             Manual tags can supplement parts that are hard to recognize automatically.\n\n");
    
    test_conversion("Name + Auto Amount", 
        "name(김철수)님, 잔액은 50000원입니다.",
        typecast_auto_tag_with_manual);
    
    test_conversion("Name + Auto Phone Number", 
        "name(박영희)님, 010-9876-5432로 연락드렸습니다.",
        typecast_auto_tag_with_manual);
    
    test_conversion("Mixed Usage", 
        "name(이순신) 장군님, 2024년 1월 1일 09:00에 money(1000000)원이 입금되었습니다.",
        typecast_auto_tag_with_manual);
    
    /* ==============================
     * Additional Examples: Various Patterns
     * ============================== */
    printf("==================== Additional Examples ====================\n\n");
    
    test_conversion("Ordinals/Rankings", 
        "1등부터 10등까지 시상합니다. 3번째 순서입니다.",
        typecast_auto_tag);
    
    test_conversion("Ratios/Percentages", 
        "할인율은 30%이며, 비율은 3:7입니다.",
        typecast_auto_tag);
    
    test_conversion("Floor Numbers", 
        "지하 2층에서 5층으로 이동하세요.",
        typecast_auto_tag);
    
    test_conversion("Duration", 
        "가입 후 3개월간 무료이며, 계약 기간은 2년입니다.",
        typecast_auto_tag);
    
    /* Cleanup the library */
    printf("==================== Exit ====================\n");
    typecast_cleanup();
    printf("Library cleanup complete.\n");
    
    return 0;
}
