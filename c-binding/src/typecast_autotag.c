/**
 * Typecast Autotag C Library
 * 
 * Embeds Duktape to enable TTS sentence conversion functionality in C
 * 
 * Copyright (c) 2025 TypeCast
 */

/* Required for POSIX strdup */
#define _POSIX_C_SOURCE 200809L

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <pthread.h>

#include "duktape.h"
#include "typecast_autotag.h"
#include "autotag_bundle.h"

/* Global state */
static duk_context *g_ctx = NULL;
static pthread_mutex_t g_mutex = PTHREAD_MUTEX_INITIALIZER;
static int g_initialized = 0;

/**
 * Initialize the library
 * 
 * Creates a Duktape heap and loads the JavaScript code.
 * Thread safety: Safe to call from multiple threads.
 * 
 * @return 0: success, -1: failure
 */
int typecast_init(void) {
    pthread_mutex_lock(&g_mutex);
    
    if (g_initialized) {
        pthread_mutex_unlock(&g_mutex);
        return 0;  /* Already initialized */
    }
    
    /* Create Duktape heap */
    g_ctx = duk_create_heap_default();
    if (!g_ctx) {
        fprintf(stderr, "typecast_init: Failed to create Duktape heap\n");
        pthread_mutex_unlock(&g_mutex);
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
        pthread_mutex_unlock(&g_mutex);
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
        pthread_mutex_unlock(&g_mutex);
        return -1;
    }
    duk_pop_2(g_ctx);  /* Remove typecast, global */
    
    g_initialized = 1;
    pthread_mutex_unlock(&g_mutex);
    return 0;
}

/**
 * Cleanup the library
 * 
 * Releases the Duktape heap and related resources.
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
 * JavaScript function call helper
 * 
 * @param func_name Function name to call (within typecast object)
 * @param text Text to convert
 * @return Converted text (caller must free with typecast_free), NULL on failure
 */
static char* call_js_function(const char *func_name, const char *text) {
    char *result = NULL;
    
    pthread_mutex_lock(&g_mutex);
    
    if (!g_initialized || !g_ctx) {
        fprintf(stderr, "typecast: Library not initialized\n");
        pthread_mutex_unlock(&g_mutex);
        return NULL;
    }
    
    /* Call typecast.funcName(text) */
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
    
    /* Copy result string */
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
 * Auto tagging
 * 
 * Automatically recognizes and converts phone numbers, amounts, dates, etc. from text.
 * 
 * @param text Text to convert
 * @return Converted text (must free with typecast_free), NULL on failure
 */
char* typecast_auto_tag(const char *text) {
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
char* typecast_auto_tag_with_manual(const char *text) {
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
char* typecast_manual_tag(const char *text) {
    if (!text) return NULL;
    return call_js_function("manualTag", text);
}

/**
 * Free memory
 * 
 * Releases strings returned by library functions.
 * 
 * @param str String to free
 */
void typecast_free(char *str) {
    free(str);
}
