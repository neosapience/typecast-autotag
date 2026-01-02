/**
 * Windows C Test Program Code
 *
 * This C code is compiled with MinGW and executed via Wine inside Docker containers.
 * Uses LoadLibrary/GetProcAddress instead of dlopen/dlsym.
 */

export const C_TEST_PROGRAM_WINDOWS = `
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <windows.h>

// Test result structure
typedef struct {
    int total;
    int passed;
    int failed;
} TestResult;

// Function pointer types
typedef int (*init_fn)(void);
typedef void (*cleanup_fn)(void);
typedef char* (*tag_fn)(const char*);
typedef void (*free_fn)(char*);

// Global function pointers
static init_fn typecast_init;
static cleanup_fn typecast_cleanup;
static tag_fn typecast_auto_tag;
static tag_fn typecast_manual_tag;
static tag_fn typecast_auto_tag_with_manual;
static free_fn typecast_free;

// Run a single test
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
    
    // Check should_change
    if (should_change && strcmp(input, output) == 0) {
        printf("  [FAIL] %s: Output unchanged\\n", test_name);
        printf("         Input:  %s\\n", input);
        printf("         Output: %s\\n", output);
        passed = 0;
    }
    
    // Check expected_contains
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
    
    // Load library using Windows API
    HMODULE handle = LoadLibraryA("typecast_autotag.dll");
    if (!handle) {
        fprintf(stderr, "Failed to load library: error code %lu\\n", GetLastError());
        return 1;
    }
    
    // Load functions using GetProcAddress
    typecast_init = (init_fn)GetProcAddress(handle, "typecast_init");
    typecast_cleanup = (cleanup_fn)GetProcAddress(handle, "typecast_cleanup");
    typecast_auto_tag = (tag_fn)GetProcAddress(handle, "typecast_auto_tag");
    typecast_manual_tag = (tag_fn)GetProcAddress(handle, "typecast_manual_tag");
    typecast_auto_tag_with_manual = (tag_fn)GetProcAddress(handle, "typecast_auto_tag_with_manual");
    typecast_free = (free_fn)GetProcAddress(handle, "typecast_free");
    
    if (!typecast_init || !typecast_cleanup || !typecast_auto_tag || 
        !typecast_manual_tag || !typecast_auto_tag_with_manual || !typecast_free) {
        fprintf(stderr, "Failed to load functions\\n");
        FreeLibrary(handle);
        return 1;
    }
    
    // Initialize
    if (typecast_init() != 0) {
        fprintf(stderr, "Failed to initialize library\\n");
        FreeLibrary(handle);
        return 1;
    }
    
    printf("Library initialized successfully\\n\\n");
    
    // ============================================
    // 1. manualTag tests - all 37 tags
    // ============================================
    printf("=== Testing typecast_manual_tag (37 tags) ===\\n");
    
    // name tag
    run_test(&result, "name", typecast_manual_tag, 
             "name(홍길동)님", "홍 길 동", 1);
    
    // month tag
    run_test(&result, "month", typecast_manual_tag,
             "month(12)월", "십이", 1);
    
    // day tag
    run_test(&result, "day", typecast_manual_tag,
             "day(25)일", "이십오", 1);
    
    // date tag
    run_test(&result, "date", typecast_manual_tag,
             "date(2024-12-25)", "이천이십사", 1);
    
    // time tag
    run_test(&result, "time", typecast_manual_tag,
             "time(14:30)", "시", 1);
    
    // year tag
    run_test(&result, "year", typecast_manual_tag,
             "year(2024)년", "이천이십사", 1);
    
    // phone tag
    run_test(&result, "phone", typecast_manual_tag,
             "phone(010-1234-5678)", "공 일 공", 1);
    
    // money tag
    run_test(&result, "money", typecast_manual_tag,
             "money(50000)원", "오만", 1);
    
    // order tag
    run_test(&result, "order", typecast_manual_tag,
             "order(3)번째", "세", 1);
    
    // point tag
    run_test(&result, "point", typecast_manual_tag,
             "point(1000)점", "천", 1);
    
    // piece tag
    run_test(&result, "piece", typecast_manual_tag,
             "piece(5)개", "다섯", 1);
    
    // digits tag
    run_test(&result, "digits", typecast_manual_tag,
             "digits(123)", "일 이 삼", 1);
    
    // minsec tag (output varies by time format)
    run_test(&result, "minsec", typecast_manual_tag,
             "minsec(05:30)", NULL, 1);
    
    // datetime tag
    run_test(&result, "datetime", typecast_manual_tag,
             "datetime(2024-12-25T14:30:00)", "년", 1);
    
    // ratio tag
    run_test(&result, "ratio", typecast_manual_tag,
             "ratio(3.5)배", NULL, 1);
    
    // jari tag (digit count conversion)
    run_test(&result, "jari", typecast_manual_tag,
             "jari(5)자리", NULL, 1);
    
    // number tag
    run_test(&result, "number", typecast_manual_tag,
             "number(12345)", NULL, 1);
    
    // duration tag
    run_test(&result, "duration", typecast_manual_tag,
             "duration(3)일", NULL, 1);
    
    // floor tag (floor number conversion)
    run_test(&result, "floor", typecast_manual_tag,
             "floor(5)층", NULL, 1);
    
    // account tag
    run_test(&result, "account", typecast_manual_tag,
             "account(123-456-789)", NULL, 1);
    
    // weight tag
    run_test(&result, "weight", typecast_manual_tag,
             "weight(50)kg", NULL, 1);
    
    // mile tag
    run_test(&result, "mile", typecast_manual_tag,
             "mile(1000)마일", NULL, 1);
    
    // area tag
    run_test(&result, "area", typecast_manual_tag,
             "area(100)평", NULL, 1);
    
    // serial tag
    run_test(&result, "serial", typecast_manual_tag,
             "serial(ABC-123)", NULL, 1);
    
    // bakil tag
    run_test(&result, "bakil", typecast_manual_tag,
             "bakil(2박3일)", NULL, 1);
    
    // roomNumber tag
    run_test(&result, "roomNumber", typecast_manual_tag,
             "roomNumber(1234)호", NULL, 1);
    
    // jong tag
    run_test(&result, "jong", typecast_manual_tag,
             "jong(3)종", NULL, 1);
    
    // distance tag
    run_test(&result, "distance", typecast_manual_tag,
             "distance(100)km", NULL, 1);
    
    // carNumber tag
    run_test(&result, "carNumber", typecast_manual_tag,
             "carNumber(12가3456)", NULL, 1);
    
    // flight tag
    run_test(&result, "flight", typecast_manual_tag,
             "flight(KE123)", NULL, 1);
    
    // seat tag
    run_test(&result, "seat", typecast_manual_tag,
             "seat(12A)", NULL, 1);
    
    // lecture tag
    run_test(&result, "lecture", typecast_manual_tag,
             "lecture(3)강", NULL, 1);
    
    // fraction tag
    run_test(&result, "fraction", typecast_manual_tag,
             "fraction(1/2)", NULL, 1);
    
    // temperature tag
    run_test(&result, "temperature", typecast_manual_tag,
             "temperature(25℃)", NULL, 1);
    
    // volume tag
    run_test(&result, "volume", typecast_manual_tag,
             "volume(500ml)", NULL, 1);
    
    // dataCapacity tag
    run_test(&result, "dataCapacity", typecast_manual_tag,
             "dataCapacity(100GB)", NULL, 1);
    
    // inch tag
    run_test(&result, "inch", typecast_manual_tag,
             "inch(65인치)", NULL, 1);
    
    printf("\\n");
    
    // ============================================
    // 2. autoTag tests - auto-recognition patterns
    // ============================================
    printf("=== Testing typecast_auto_tag ===\\n");
    
    // Phone number (both 공/영 are valid)
    run_test(&result, "auto_phone", typecast_auto_tag,
             "010-1234-5678", NULL, 1);
    
    // Money
    run_test(&result, "auto_money", typecast_auto_tag,
             "50000원", "오만", 1);
    
    // Date
    run_test(&result, "auto_date", typecast_auto_tag,
             "2024년 12월 25일", "이천이십사", 1);
    
    // Time
    run_test(&result, "auto_time", typecast_auto_tag,
             "14:30", NULL, 1);
    
    // Percent
    run_test(&result, "auto_percent", typecast_auto_tag,
             "50%", "오십", 1);
    
    // Count
    run_test(&result, "auto_count", typecast_auto_tag,
             "5개", "다섯", 1);
    
    // Order
    run_test(&result, "auto_order", typecast_auto_tag,
             "3번째", NULL, 1);
    
    // Floor
    run_test(&result, "auto_floor", typecast_auto_tag,
             "5층", "오", 1);
    
    printf("\\n");
    
    // ============================================
    // 3. autoTagWithManual tests - mixed mode
    // ============================================
    printf("=== Testing typecast_auto_tag_with_manual ===\\n");
    
    // Name + phone mixed
    run_test(&result, "mixed_name_phone", typecast_auto_tag_with_manual,
             "name(홍길동)님의 전화번호는 010-1234-5678입니다.", "홍 길 동", 1);
    
    // Name + money mixed
    run_test(&result, "mixed_name_money", typecast_auto_tag_with_manual,
             "name(김철수)님이 50000원을 결제했습니다.", "김 철 수", 1);
    
    // Name + date mixed
    run_test(&result, "mixed_name_date", typecast_auto_tag_with_manual,
             "name(이영희)님의 생일은 12월 25일입니다.", "이 영 희", 1);
    
    // Complex tags (phone manual tag + money auto-recognition)
    run_test(&result, "mixed_complex", typecast_auto_tag_with_manual,
             "phone(02-123-4567)로 연락주세요. 금액은 100000원입니다.", "십만", 1);
    
    printf("\\n");
    
    // ============================================
    // Results
    // ============================================
    printf("===========================================\\n");
    printf("Test Results:\\n");
    printf("  Total:  %d\\n", result.total);
    printf("  Passed: %d\\n", result.passed);
    printf("  Failed: %d\\n", result.failed);
    printf("===========================================\\n");
    
    // Cleanup
    typecast_cleanup();
    FreeLibrary(handle);
    
    // Return 1 if any tests failed
    return result.failed > 0 ? 1 : 0;
}
`;
