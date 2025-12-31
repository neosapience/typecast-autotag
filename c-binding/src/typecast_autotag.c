/**
 * TypeCast AutoTag C Library
 * 
 * QuickJS를 임베드하여 TTS 문장 변환 기능을 C에서 사용할 수 있게 함
 * 
 * Copyright (c) 2025 TypeCast
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <pthread.h>

#include "quickjs.h"
#include "typecast_autotag.h"
#include "autotag_bundle.h"

/* 전역 상태 */
static JSRuntime *g_runtime = NULL;
static JSContext *g_context = NULL;
static pthread_mutex_t g_mutex = PTHREAD_MUTEX_INITIALIZER;
static int g_initialized = 0;

/**
 * 라이브러리 초기화
 * 
 * QuickJS 런타임을 생성하고 JavaScript 코드를 로드합니다.
 * 스레드 안전: 여러 스레드에서 호출해도 안전합니다.
 * 
 * @return 0: 성공, -1: 실패
 */
int typecast_init(void) {
    pthread_mutex_lock(&g_mutex);
    
    if (g_initialized) {
        pthread_mutex_unlock(&g_mutex);
        return 0;  /* 이미 초기화됨 */
    }
    
    /* 런타임 생성 */
    g_runtime = JS_NewRuntime();
    if (!g_runtime) {
        fprintf(stderr, "typecast_init: Failed to create JS runtime\n");
        pthread_mutex_unlock(&g_mutex);
        return -1;
    }
    
    /* 컨텍스트 생성 */
    g_context = JS_NewContext(g_runtime);
    if (!g_context) {
        fprintf(stderr, "typecast_init: Failed to create JS context\n");
        JS_FreeRuntime(g_runtime);
        g_runtime = NULL;
        pthread_mutex_unlock(&g_mutex);
        return -1;
    }
    
    /* JavaScript 번들 실행 */
    JSValue result = JS_Eval(g_context, AUTOTAG_JS_BUNDLE, 
                             strlen(AUTOTAG_JS_BUNDLE), 
                             "<autotag_bundle>", 
                             JS_EVAL_TYPE_GLOBAL);
    
    if (JS_IsException(result)) {
        JSValue exception = JS_GetException(g_context);
        const char *error_str = JS_ToCString(g_context, exception);
        fprintf(stderr, "typecast_init: Failed to load JS bundle: %s\n", 
                error_str ? error_str : "unknown error");
        if (error_str) JS_FreeCString(g_context, error_str);
        JS_FreeValue(g_context, exception);
        JS_FreeValue(g_context, result);
        JS_FreeContext(g_context);
        JS_FreeRuntime(g_runtime);
        g_context = NULL;
        g_runtime = NULL;
        pthread_mutex_unlock(&g_mutex);
        return -1;
    }
    
    JS_FreeValue(g_context, result);
    g_initialized = 1;
    
    pthread_mutex_unlock(&g_mutex);
    return 0;
}

/**
 * 라이브러리 정리
 * 
 * 할당된 모든 리소스를 해제합니다.
 */
void typecast_cleanup(void) {
    pthread_mutex_lock(&g_mutex);
    
    if (!g_initialized) {
        pthread_mutex_unlock(&g_mutex);
        return;
    }
    
    if (g_context) {
        JS_FreeContext(g_context);
        g_context = NULL;
    }
    
    if (g_runtime) {
        JS_FreeRuntime(g_runtime);
        g_runtime = NULL;
    }
    
    g_initialized = 0;
    
    pthread_mutex_unlock(&g_mutex);
}

/**
 * JavaScript 함수 호출 (내부 헬퍼)
 */
static char* call_js_function(const char *func_name, const char *text) {
    if (!text) {
        return NULL;
    }
    
    pthread_mutex_lock(&g_mutex);
    
    if (!g_initialized) {
        fprintf(stderr, "typecast: Library not initialized. Call typecast_init() first.\n");
        pthread_mutex_unlock(&g_mutex);
        return NULL;
    }
    
    /* globalThis.typecast 객체 가져오기 */
    JSValue global = JS_GetGlobalObject(g_context);
    JSValue typecast_obj = JS_GetPropertyStr(g_context, global, "typecast");
    
    if (JS_IsUndefined(typecast_obj) || JS_IsNull(typecast_obj)) {
        fprintf(stderr, "typecast: typecast object not found\n");
        JS_FreeValue(g_context, typecast_obj);
        JS_FreeValue(g_context, global);
        pthread_mutex_unlock(&g_mutex);
        return NULL;
    }
    
    /* 함수 가져오기 */
    JSValue func = JS_GetPropertyStr(g_context, typecast_obj, func_name);
    
    if (!JS_IsFunction(g_context, func)) {
        fprintf(stderr, "typecast: %s is not a function\n", func_name);
        JS_FreeValue(g_context, func);
        JS_FreeValue(g_context, typecast_obj);
        JS_FreeValue(g_context, global);
        pthread_mutex_unlock(&g_mutex);
        return NULL;
    }
    
    /* 인자 준비 */
    JSValue arg = JS_NewString(g_context, text);
    JSValue args[1] = { arg };
    
    /* 함수 호출 */
    JSValue result = JS_Call(g_context, func, typecast_obj, 1, args);
    
    JS_FreeValue(g_context, arg);
    JS_FreeValue(g_context, func);
    JS_FreeValue(g_context, typecast_obj);
    JS_FreeValue(g_context, global);
    
    /* 결과 처리 */
    char *output = NULL;
    
    if (JS_IsException(result)) {
        JSValue exception = JS_GetException(g_context);
        const char *error_str = JS_ToCString(g_context, exception);
        fprintf(stderr, "typecast: %s error: %s\n", func_name, 
                error_str ? error_str : "unknown error");
        if (error_str) JS_FreeCString(g_context, error_str);
        JS_FreeValue(g_context, exception);
    } else if (JS_IsString(result)) {
        const char *str = JS_ToCString(g_context, result);
        if (str) {
            output = strdup(str);
            JS_FreeCString(g_context, str);
        }
    } else {
        /* 문자열이 아닌 경우 원본 반환 */
        output = strdup(text);
    }
    
    JS_FreeValue(g_context, result);
    
    pthread_mutex_unlock(&g_mutex);
    
    return output;
}

/**
 * 자동 태깅
 * 
 * 텍스트에서 전화번호, 날짜, 금액 등을 자동으로 인식하여
 * TTS 친화적인 형식으로 변환합니다.
 * 
 * @param text 변환할 텍스트 (UTF-8)
 * @return 변환된 문자열 (호출자가 typecast_free()로 해제해야 함)
 * 
 * 예시:
 *   입력: "전화번호는 010-1234-5678입니다."
 *   출력: "전화번호는 공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔입니다."
 */
char* typecast_auto_tag(const char *text) {
    return call_js_function("autoTag", text);
}

/**
 * 수동 태그와 자동 태깅 함께 적용
 * 
 * 먼저 수동 태그(예: name(김철수))를 처리한 후
 * 자동 태깅을 적용합니다.
 * 
 * @param text 변환할 텍스트 (UTF-8)
 * @return 변환된 문자열 (호출자가 typecast_free()로 해제해야 함)
 * 
 * 예시:
 *   입력: "name(김철수)님, 잔액은 50000원입니다."
 *   출력: "김 철 수님, 잔액은 오만 원입니다."
 */
char* typecast_auto_tag_with_manual(const char *text) {
    return call_js_function("autoTagWithManual", text);
}

/**
 * 수동 태그만 적용
 * 
 * 텍스트에서 태그 형식(예: name(김철수), phone(010-1234-5678))을
 * 찾아서 변환합니다. 자동 패턴 인식은 수행하지 않습니다.
 * 
 * @param text 변환할 텍스트 (UTF-8)
 * @return 변환된 문자열 (호출자가 typecast_free()로 해제해야 함)
 * 
 * 예시:
 *   입력: "name(김철수)님 안녕하세요."
 *   출력: "김 철 수님 안녕하세요."
 */
char* typecast_manual_tag(const char *text) {
    return call_js_function("manualTag", text);
}

/**
 * 메모리 해제
 * 
 * typecast_auto_tag, typecast_auto_tag_with_manual, typecast_manual_tag
 * 함수가 반환한 문자열을 해제합니다.
 * 
 * @param str 해제할 문자열 (NULL도 허용)
 */
void typecast_free(char *str) {
    if (str) {
        free(str);
    }
}

/**
 * 버전 정보 반환
 * 
 * @return 라이브러리 버전 문자열
 */
const char* typecast_version(void) {
    return TYPECAST_VERSION;
}

