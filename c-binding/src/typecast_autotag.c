/**
 * Typecast Autotag C Library
 * 
 * Embeds Duktape to enable TTS sentence conversion functionality in C
 * 
 * Platform support:
 * - Linux/macOS: Uses POSIX threads (pthread)
 * - Windows: Uses Windows API (Critical Section)
 * 
 * Copyright (c) 2025 TypeCast
 */

/* Define TYPECAST_BUILDING_DLL when building the library */
#define TYPECAST_BUILDING_DLL

/* Required for POSIX strdup on non-Windows platforms */
#if !defined(_WIN32) && !defined(_WIN64)
    #define _POSIX_C_SOURCE 200809L
#endif

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/*
 * Platform-specific threading support
 * Windows: Critical Section (lightweight mutex)
 * POSIX: pthread_mutex
 */
#if defined(_WIN32) || defined(_WIN64)
    #define WIN32_LEAN_AND_MEAN
    #include <windows.h>
    
    /* Windows thread synchronization */
    static CRITICAL_SECTION g_mutex;
    static volatile LONG g_mutex_initialized = 0;
    
    static void platform_mutex_init(void) {
        if (InterlockedCompareExchange(&g_mutex_initialized, 1, 0) == 0) {
            InitializeCriticalSection(&g_mutex);
        }
    }
    
    static void platform_mutex_lock(void) {
        platform_mutex_init();
        EnterCriticalSection(&g_mutex);
    }
    
    static void platform_mutex_unlock(void) {
        LeaveCriticalSection(&g_mutex);
    }
    
    /* Windows strdup equivalent */
    #ifndef strdup
        #define strdup _strdup
    #endif
#else
    #include <pthread.h>
    
    /* POSIX thread synchronization */
    static pthread_mutex_t g_mutex = PTHREAD_MUTEX_INITIALIZER;
    
    static void platform_mutex_lock(void) {
        pthread_mutex_lock(&g_mutex);
    }
    
    static void platform_mutex_unlock(void) {
        pthread_mutex_unlock(&g_mutex);
    }
#endif

#include "duktape.h"
#include "typecast_autotag.h"
#include "autotag_bundle.h"

/* Global state */
static duk_context *g_ctx = NULL;
static int g_initialized = 0;

/**
 * Initialize the library
 * 
 * Creates a Duktape heap and loads the JavaScript code.
 * Thread safety: Safe to call from multiple threads.
 * 
 * @return 0: success, -1: failure
 */
TYPECAST_API int typecast_init(void) {
    platform_mutex_lock();
    
    if (g_initialized) {
        platform_mutex_unlock();
        return 0;  /* Already initialized */
    }
    
    /* Create Duktape heap */
    g_ctx = duk_create_heap_default();
    if (!g_ctx) {
        fprintf(stderr, "typecast_init: Failed to create Duktape heap\n");
        platform_mutex_unlock();
        return -1;
    }
    
    /* Load JavaScript bundle */
    duk_push_string(g_ctx, AUTOTAG_JS_BUNDLE);
    if (duk_peval(g_ctx) != 0) {
        const char *err = duk_safe_to_string(g_ctx, -1);
        fprintf(stderr, "typecast_init: Failed to load JS bundle: %s\n", err);
        duk_pop(g_ctx);
        duk_destroy_heap(g_ctx);
        g_ctx = NULL;
        platform_mutex_unlock();
        return -1;
    }
    duk_pop(g_ctx);  /* Remove eval result */
    
    /* Verify typecast object exists */
    duk_push_global_object(g_ctx);
    if (!duk_get_prop_string(g_ctx, -1, "typecast")) {
        fprintf(stderr, "typecast_init: typecast object not found\n");
        duk_pop_2(g_ctx);
        duk_destroy_heap(g_ctx);
        g_ctx = NULL;
        platform_mutex_unlock();
        return -1;
    }
    duk_pop_2(g_ctx);  /* Remove typecast, global */
    
    g_initialized = 1;
    platform_mutex_unlock();
    return 0;
}

/**
 * Cleanup the library
 * 
 * Releases the Duktape heap and related resources.
 */
TYPECAST_API void typecast_cleanup(void) {
    platform_mutex_lock();
    
    if (!g_initialized) {
        platform_mutex_unlock();
        return;
    }
    
    if (g_ctx) {
        duk_destroy_heap(g_ctx);
        g_ctx = NULL;
    }
    
    g_initialized = 0;
    platform_mutex_unlock();
}

/**
 * JavaScript function call helper
 * 
 * @param func_name Function name to call (within typecast object)
 * @param text Text to convert
 * @return Converted text (caller must free with typecast_free), NULL on failure
 */
static char* call_js_function(const char *func_name, const char *text) {
    char *result = NULL;
    
    platform_mutex_lock();
    
    if (!g_initialized || !g_ctx) {
        fprintf(stderr, "typecast: Library not initialized\n");
        platform_mutex_unlock();
        return NULL;
    }
    
    /* Call typecast.funcName(text) */
    duk_push_global_object(g_ctx);
    duk_get_prop_string(g_ctx, -1, "typecast");
    duk_get_prop_string(g_ctx, -1, func_name);
    
    if (!duk_is_function(g_ctx, -1)) {
        fprintf(stderr, "typecast: %s is not a function\n", func_name);
        duk_pop_3(g_ctx);
        platform_mutex_unlock();
        return NULL;
    }
    
    duk_push_string(g_ctx, text);
    
    if (duk_pcall(g_ctx, 1) != 0) {
        const char *err = duk_safe_to_string(g_ctx, -1);
        fprintf(stderr, "typecast: %s error: %s\n", func_name, err);
        duk_pop_3(g_ctx);  /* error, typecast, global */
        platform_mutex_unlock();
        return NULL;
    }
    
    /* Copy result string */
    if (duk_is_string(g_ctx, -1)) {
        const char *str = duk_get_string(g_ctx, -1);
        if (str) {
            result = strdup(str);
        }
    }
    
    duk_pop_3(g_ctx);  /* result, typecast, global */
    platform_mutex_unlock();
    
    return result;
}

/**
 * Auto tagging
 * 
 * Automatically recognizes and converts phone numbers, amounts, dates, etc. from text.
 * 
 * @param text Text to convert
 * @return Converted text (must free with typecast_free), NULL on failure
 */
TYPECAST_API char* typecast_auto_tag(const char *text) {
    if (!text) return NULL;
    return call_js_function("autoTag", text);
}

/**
 * Auto tagging with manual tags priority
 * 
 * Processes manual tags first, then applies auto tagging to the rest.
 * 
 * @param text Text to convert
 * @return Converted text (must free with typecast_free), NULL on failure
 */
TYPECAST_API char* typecast_auto_tag_with_manual(const char *text) {
    if (!text) return NULL;
    return call_js_function("autoTagWithManual", text);
}

/**
 * Manual tagging only
 * 
 * Processes only explicitly specified manual tags.
 * 
 * @param text Text to convert
 * @return Converted text (must free with typecast_free), NULL on failure
 */
TYPECAST_API char* typecast_manual_tag(const char *text) {
    if (!text) return NULL;
    return call_js_function("manualTag", text);
}

/* ============================================
 * English Language Functions
 * ============================================ */

/**
 * Auto tagging for English
 * 
 * Automatically recognizes and converts patterns in English text.
 * 
 * @param text Text to convert
 * @return Converted text (must free with typecast_free), NULL on failure
 */
TYPECAST_API char* typecast_auto_tag_english(const char *text) {
    if (!text) return NULL;
    return call_js_function("autoTagEnglish", text);
}

/**
 * Auto tagging with manual tags priority for English
 * 
 * Processes manual tags first, then applies auto tagging for English.
 * 
 * @param text Text to convert
 * @return Converted text (must free with typecast_free), NULL on failure
 */
TYPECAST_API char* typecast_auto_tag_with_manual_english(const char *text) {
    if (!text) return NULL;
    return call_js_function("autoTagWithManualEnglish", text);
}

/**
 * Manual tagging only for English
 * 
 * Processes only explicitly specified manual tags for English output.
 * 
 * @param text Text to convert
 * @return Converted text (must free with typecast_free), NULL on failure
 */
TYPECAST_API char* typecast_manual_tag_english(const char *text) {
    if (!text) return NULL;
    return call_js_function("manualTagEnglish", text);
}

/**
 * Free memory
 * 
 * Releases strings returned by library functions.
 * 
 * @param str String to free
 */
TYPECAST_API void typecast_free(char *str) {
    free(str);
}

/**
 * Return version information
 * 
 * @return Library version string (static string, no need to free)
 */
TYPECAST_API const char* typecast_version(void) {
    return TYPECAST_VERSION;
}
