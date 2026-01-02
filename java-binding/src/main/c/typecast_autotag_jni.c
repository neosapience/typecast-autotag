/**
 * JNI Bridge for Typecast Autotag Library
 * 
 * This file provides the bridge between Java and the native C library.
 */

#include <jni.h>
#include <string.h>
#include <stdlib.h>
#include "typecast_autotag.h"

/**
 * Initialize the library
 */
JNIEXPORT jint JNICALL 
Java_ai_typecast_autotag_TypecastAutotag_nativeInit(JNIEnv *env, jclass cls) {
    return typecast_init();
}

/**
 * Cleanup the library
 */
JNIEXPORT void JNICALL 
Java_ai_typecast_autotag_TypecastAutotag_nativeCleanup(JNIEnv *env, jclass cls) {
    typecast_cleanup();
}

/**
 * Auto tag
 */
JNIEXPORT jstring JNICALL 
Java_ai_typecast_autotag_TypecastAutotag_nativeAutoTag(JNIEnv *env, jclass cls, jstring text) {
    if (text == NULL) {
        return NULL;
    }
    
    // Convert Java string to C string
    const char *input = (*env)->GetStringUTFChars(env, text, NULL);
    if (input == NULL) {
        return NULL;
    }
    
    // Call native function
    char *result = typecast_auto_tag(input);
    
    // Release input string
    (*env)->ReleaseStringUTFChars(env, text, input);
    
    if (result == NULL) {
        return NULL;
    }
    
    // Convert result to Java string
    jstring jresult = (*env)->NewStringUTF(env, result);
    
    // Free native result
    typecast_free(result);
    
    return jresult;
}

/**
 * Auto tag with manual tags
 */
JNIEXPORT jstring JNICALL 
Java_ai_typecast_autotag_TypecastAutotag_nativeAutoTagWithManual(JNIEnv *env, jclass cls, jstring text) {
    if (text == NULL) {
        return NULL;
    }
    
    const char *input = (*env)->GetStringUTFChars(env, text, NULL);
    if (input == NULL) {
        return NULL;
    }
    
    char *result = typecast_auto_tag_with_manual(input);
    
    (*env)->ReleaseStringUTFChars(env, text, input);
    
    if (result == NULL) {
        return NULL;
    }
    
    jstring jresult = (*env)->NewStringUTF(env, result);
    typecast_free(result);
    
    return jresult;
}

/**
 * Manual tag
 */
JNIEXPORT jstring JNICALL 
Java_ai_typecast_autotag_TypecastAutotag_nativeManualTag(JNIEnv *env, jclass cls, jstring text) {
    if (text == NULL) {
        return NULL;
    }
    
    const char *input = (*env)->GetStringUTFChars(env, text, NULL);
    if (input == NULL) {
        return NULL;
    }
    
    char *result = typecast_manual_tag(input);
    
    (*env)->ReleaseStringUTFChars(env, text, input);
    
    if (result == NULL) {
        return NULL;
    }
    
    jstring jresult = (*env)->NewStringUTF(env, result);
    typecast_free(result);
    
    return jresult;
}

/**
 * Get version
 */
JNIEXPORT jstring JNICALL 
Java_ai_typecast_autotag_TypecastAutotag_nativeVersion(JNIEnv *env, jclass cls) {
    const char *version = typecast_version();
    if (version == NULL) {
        return NULL;
    }
    
    return (*env)->NewStringUTF(env, version);
}

