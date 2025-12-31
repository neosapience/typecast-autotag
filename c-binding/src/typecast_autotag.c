/**
 * TypeCast AutoTag C Library
 * 
 * Duktape를 임베드하여 TTS 문장 변환 기능을 C에서 사용할 수 있게 함
 * 
 * Copyright (c) 2025 TypeCast
 */

/* POSIX strdup을 위해 필요 */
#define _POSIX_C_SOURCE 200809L

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <pthread.h>

#include "duktape.h"
#include "typecast_autotag.h"
#include "autotag_bundle.h"

/* 전역 상태 */
static duk_context *g_ctx = NULL;
static pthread_mutex_t g_mutex = PTHREAD_MUTEX_INITIALIZER;
static int g_initialized = 0;

/**
 * 라이브러리 초기화
 * 
 * Duktape 힙을 생성하고 JavaScript 코드를 로드합니다.
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
    
    /* Duktape 힙 생성 */
    g_ctx = duk_create_heap_default();
    if (!g_ctx) {
        fprintf(stderr, "typecast_init: Failed to create Duktape heap\n");
        pthread_mutex_unlock(&g_mutex);
        return -1;
    }
    
    /* JavaScript 번들 로드 */
    duk_push_string(g_ctx, AUTOTAG_JS_BUNDLE);
    if (duk_peval(g_ctx) != 0) {
        const char *err = duk_safe_to_string(g_ctx, -1);
        fprintf(stderr, "typecast_init: Failed to load JS bundle: %s\n", err);
        duk_pop(g_ctx);
        duk_destroy_heap(g_ctx);
        g_ctx = NULL;
        pthread_mutex_unlock(&g_mutex);
        return -1;
    }
    duk_pop(g_ctx);  /* eval 결과 제거 */
    
    /* typecast 객체 확인 */
    duk_push_global_object(g_ctx);
    if (!duk_get_prop_string(g_ctx, -1, "typecast")) {
        fprintf(stderr, "typecast_init: typecast object not found\n");
        duk_pop_2(g_ctx);
        duk_destroy_heap(g_ctx);
        g_ctx = NULL;
        pthread_mutex_unlock(&g_mutex);
        return -1;
    }
    duk_pop_2(g_ctx);  /* typecast, global 제거 */
    
    g_initialized = 1;
    pthread_mutex_unlock(&g_mutex);
    return 0;
}

/**
 * 라이브러리 정리
 * 
 * Duktape 힙과 관련 리소스를 해제합니다.
 */
void typecast_cleanup(void) {
    pthread_mutex_lock(&g_mutex);
    
    if (!g_initialized) {
        pthread_mutex_unlock(&g_mutex);
        return;
    }
    
    if (g_ctx) {
        duk_destroy_heap(g_ctx);
        g_ctx = NULL;
    }
    
    g_initialized = 0;
    pthread_mutex_unlock(&g_mutex);
}

/**
 * JavaScript 함수 호출 헬퍼
 * 
 * @param func_name 호출할 함수 이름 (typecast 객체 내)
 * @param text 변환할 텍스트
 * @return 변환된 텍스트 (호출자가 typecast_free로 해제해야 함), 실패 시 NULL
 */
static char* call_js_function(const char *func_name, const char *text) {
    char *result = NULL;
    
    pthread_mutex_lock(&g_mutex);
    
    if (!g_initialized || !g_ctx) {
        fprintf(stderr, "typecast: Library not initialized\n");
        pthread_mutex_unlock(&g_mutex);
        return NULL;
    }
    
    /* typecast.funcName(text) 호출 */
    duk_push_global_object(g_ctx);
    duk_get_prop_string(g_ctx, -1, "typecast");
    duk_get_prop_string(g_ctx, -1, func_name);
    
    if (!duk_is_function(g_ctx, -1)) {
        fprintf(stderr, "typecast: %s is not a function\n", func_name);
        duk_pop_3(g_ctx);
        pthread_mutex_unlock(&g_mutex);
        return NULL;
    }
    
    duk_push_string(g_ctx, text);
    
    if (duk_pcall(g_ctx, 1) != 0) {
        const char *err = duk_safe_to_string(g_ctx, -1);
        fprintf(stderr, "typecast: %s error: %s\n", func_name, err);
        duk_pop_3(g_ctx);  /* error, typecast, global */
        pthread_mutex_unlock(&g_mutex);
        return NULL;
    }
    
    /* 결과 문자열 복사 */
    if (duk_is_string(g_ctx, -1)) {
        const char *str = duk_get_string(g_ctx, -1);
        if (str) {
            result = strdup(str);
        }
    }
    
    duk_pop_3(g_ctx);  /* result, typecast, global */
    pthread_mutex_unlock(&g_mutex);
    
    return result;
}

/**
 * 자동 태깅
 * 
 * 텍스트에서 전화번호, 금액, 날짜 등을 자동으로 인식하여 변환합니다.
 * 
 * @param text 변환할 텍스트
 * @return 변환된 텍스트 (typecast_free로 해제 필요), 실패 시 NULL
 */
char* typecast_auto_tag(const char *text) {
    if (!text) return NULL;
    return call_js_function("autoTag", text);
}

/**
 * 수동 태그 우선 자동 태깅
 * 
 * 수동 태그를 먼저 처리한 후 나머지에 자동 태깅을 적용합니다.
 * 
 * @param text 변환할 텍스트
 * @return 변환된 텍스트 (typecast_free로 해제 필요), 실패 시 NULL
 */
char* typecast_auto_tag_with_manual(const char *text) {
    if (!text) return NULL;
    return call_js_function("autoTagWithManual", text);
}

/**
 * 수동 태깅만
 * 
 * 명시적으로 지정된 수동 태그만 처리합니다.
 * 
 * @param text 변환할 텍스트
 * @return 변환된 텍스트 (typecast_free로 해제 필요), 실패 시 NULL
 */
char* typecast_manual_tag(const char *text) {
    if (!text) return NULL;
    return call_js_function("manualTag", text);
}

/**
 * 메모리 해제
 * 
 * 라이브러리 함수에서 반환된 문자열을 해제합니다.
 * 
 * @param str 해제할 문자열
 */
void typecast_free(char *str) {
    free(str);
}
