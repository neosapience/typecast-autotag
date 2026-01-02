#!/bin/bash
# Typecast Autotag C Library - macOS 빌드 스크립트
# macOS용 Universal Binary (.dylib) 생성 (Intel + Apple Silicon)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
BUILD_DIR="$ROOT_DIR/build"

echo "=== Typecast Autotag C Library - macOS Builder ==="
echo "Target: macOS Universal Binary (.dylib)"
echo ""

# macOS 체크
if [[ "$(uname -s)" != "Darwin" ]]; then
    echo "Error: This script must be run on macOS"
    exit 1
fi

# JS 번들 생성
echo "Step 1: Generating JS bundle..."
cd "$ROOT_DIR/.."
node c-binding/scripts/bundle.js
echo ""

# Duktape 다운로드 (없는 경우)
echo "Step 2: Checking Duktape..."
cd "$ROOT_DIR"
if [ ! -d "duktape/duktape-2.7.0" ]; then
    make duktape
fi
echo ""

# macOS Universal Binary 빌드
echo "Step 3: Building macOS Universal Binary..."
make macos-universal
echo ""

# 결과 확인
echo "=== Build Complete ==="
echo "Output files:"
ls -la "$BUILD_DIR/"*.dylib 2>/dev/null || echo "No dylib files found"
echo ""

# 아키텍처 확인
echo "Architecture info:"
file "$BUILD_DIR/libtypecast_autotag.dylib"
lipo -info "$BUILD_DIR/libtypecast_autotag.dylib"
echo ""

echo "Library: $BUILD_DIR/libtypecast_autotag.dylib"
echo "Header:  $BUILD_DIR/typecast_autotag.h"

