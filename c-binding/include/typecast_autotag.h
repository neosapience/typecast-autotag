/**
 * Typecast Autotag C Library
 * 
 * TTS sentence preprocessing library
 * Converts phone numbers, dates, amounts, etc. to formats suitable for speech synthesis.
 * 
 * Copyright (c) 2025 TypeCast
 * 
 * Platform support:
 * - Linux: .so (shared library)
 * - Windows: .dll (dynamic link library)
 * - macOS: .dylib (dynamic library)
 * 
 * Usage example:
 * 
 *   #include "typecast_autotag.h"
 *   
 *   int main() {
 *       // Initialize (only once at program start)
 *       if (typecast_init() != 0) {
 *           return 1;
 *       }
 *       
 *       // Auto tagging
 *       char *result = typecast_auto_tag("전화번호는 010-1234-5678입니다.");
 *       if (result) {
 *           printf("%s\n", result);  // "전화번호는 공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔입니다."
 *           typecast_free(result);
 *       }
 *       
 *       // Cleanup (at program exit)
 *       typecast_cleanup();
 *       return 0;
 *   }
 */

#ifndef TYPECAST_AUTOTAG_H
#define TYPECAST_AUTOTAG_H

#ifdef __cplusplus
extern "C" {
#endif

/* Library version */
#define TYPECAST_VERSION "1.4.0"

/*
 * DLL Export/Import macros for Windows
 * 
 * When building the library: define TYPECAST_BUILDING_DLL
 * When using the library: do not define anything (or define TYPECAST_STATIC for static linking)
 */
#if defined(_WIN32) || defined(_WIN64)
    #ifdef TYPECAST_STATIC
        #define TYPECAST_API
    #elif defined(TYPECAST_BUILDING_DLL)
        #define TYPECAST_API __declspec(dllexport)
    #else
        #define TYPECAST_API __declspec(dllimport)
    #endif
#else
    /* For GCC/Clang, use visibility attribute for symbol export */
    #if defined(__GNUC__) && __GNUC__ >= 4
        #define TYPECAST_API __attribute__((visibility("default")))
    #else
        #define TYPECAST_API
    #endif
#endif

/**
 * Initialize the library
 * 
 * Initializes the JavaScript engine and loads the conversion module.
 * Must be called once before calling any other functions.
 * 
 * Thread safety: Safe to call from multiple threads.
 * Idempotency: Returns success immediately if already initialized.
 * 
 * @return 0: success, -1: failure
 */
TYPECAST_API int typecast_init(void);

/**
 * Cleanup the library
 * 
 * Releases all allocated resources.
 * Call at program exit.
 */
TYPECAST_API void typecast_cleanup(void);

/**
 * Auto tagging (fully automatic processing)
 * 
 * Automatically recognizes and converts the following patterns in text:
 * - Phone numbers: 010-1234-5678 → 공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔
 * - Amounts: 50000원 → 오만 원
 * - Dates: 2024-01-15 → 이천이십사년 일 월 십오 일
 * - Times: 14:30 → 오후 두 시 삼십 분
 * - Others: ordinals, scores, ratios, floor numbers, etc.
 * 
 * @param text Text to convert (UTF-8 encoding)
 * @return Converted string (must be freed with typecast_free())
 *         Returns NULL on failure
 * 
 * Usage scenarios:
 * - When you want all patterns processed automatically
 * - When the input text has no manual tags
 */
TYPECAST_API char* typecast_auto_tag(const char *text);

/**
 * Auto tagging + manual tags (hybrid approach)
 * 
 * Processes manual tags first, then applies auto tagging.
 * Manual tags can be used to supplement when auto tagging misrecognizes parts.
 * 
 * Manual tag format: tagName(value)
 * Example: name(김철수), phone(010-1234-5678), money(50000)
 * 
 * @param text Text to convert (UTF-8 encoding)
 * @return Converted string (must be freed with typecast_free())
 *         Returns NULL on failure
 * 
 * Usage scenarios:
 * - When using auto tagging for most cases, but want manual tags for special cases
 * - When you want to explicitly specify patterns that are hard to recognize automatically, like names
 * 
 * Example:
 *   Input: "name(김철수)님, 잔액은 50000원입니다."
 *   Output: "김 철 수님, 잔액은 오만 원입니다."
 */
TYPECAST_API char* typecast_auto_tag_with_manual(const char *text);

/**
 * Manual tags only (legacy compatible approach)
 * 
 * Processes only tag formats in the text.
 * Does not perform automatic pattern recognition.
 * 
 * Supported tags:
 * - name(name): Name reading (space between surname and given name)
 * - phone(number): Phone number reading
 * - money(amount): Amount reading
 * - date(date): Date reading
 * - time(time): Time reading
 * - year(year): Year reading
 * - month(month): Month reading
 * - day(day): Day reading
 * - order(ordinal): Ordinal reading
 * - digits(number): Read digits one by one
 * - Various other tags supported
 * 
 * @param text Text to convert (UTF-8 encoding)
 * @return Converted string (must be freed with typecast_free())
 *         Returns NULL on failure
 * 
 * Usage scenarios:
 * - When compatibility with existing systems is required
 * - When you want explicit control over all conversions
 * 
 * Example:
 *   Input: "phone(010-1234-5678)로 연락주세요."
 *   Output: "공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔로 연락주세요."
 */
TYPECAST_API char* typecast_manual_tag(const char *text);

/* ============================================
 * English Language Functions
 * ============================================ */

/**
 * Auto tagging for English (fully automatic processing)
 * 
 * Automatically recognizes and converts the following patterns in English text:
 * - Phone numbers: 123-456-7890 → one two three, four five six, seven eight nine zero
 * - Amounts: $1,234.56 → one thousand two hundred thirty four dollars and fifty six cents
 * - Dates: 01/15/2024 → January fifteenth, twenty twenty-four
 * - Times: 2:30 PM → two thirty PM
 * - Others: ordinals, percentages, etc.
 * 
 * @param text Text to convert (UTF-8 encoding)
 * @return Converted string (must be freed with typecast_free())
 *         Returns NULL on failure
 */
TYPECAST_API char* typecast_auto_tag_english(const char *text);

/**
 * Auto tagging + manual tags for English (hybrid approach)
 * 
 * Processes manual tags first, then applies auto tagging for English.
 * 
 * @param text Text to convert (UTF-8 encoding)
 * @return Converted string (must be freed with typecast_free())
 *         Returns NULL on failure
 */
TYPECAST_API char* typecast_auto_tag_with_manual_english(const char *text);

/**
 * Manual tags only for English
 * 
 * Processes only tag formats in the text for English output.
 * 
 * @param text Text to convert (UTF-8 encoding)
 * @return Converted string (must be freed with typecast_free())
 *         Returns NULL on failure
 * 
 * Example:
 *   Input: "phone(123-456-7890) is my number."
 *   Output: "one two three, four five six, seven eight nine zero is my number."
 */
TYPECAST_API char* typecast_manual_tag_english(const char *text);

/**
 * Free memory
 * 
 * Releases strings returned by typecast_auto_tag, typecast_auto_tag_with_manual,
 * and typecast_manual_tag functions.
 * 
 * @param str String to free (NULL is also accepted)
 */
TYPECAST_API void typecast_free(char *str);

/**
 * Return version information
 * 
 * @return Library version string (static string, no need to free)
 */
TYPECAST_API const char* typecast_version(void);

#ifdef __cplusplus
}
#endif

#endif /* TYPECAST_AUTOTAG_H */
