#!/bin/bash
# Typecast Autotag C Library - Windows DLL 빌드 스크립트
# Docker에서 MinGW-w64를 사용하여 Windows DLL 생성

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
BUILD_DIR="$ROOT_DIR/build"

echo "=== Typecast Autotag C Library - Windows DLL Builder ==="
echo "Target: x86_64 Windows (.dll)"
echo ""

# JS 번들 생성
echo "Step 1: Generating JS bundle..."
cd "$ROOT_DIR/.."
node c-binding/scripts/bundle.js
echo ""

# Docker 빌드
echo "Step 2: Building Windows DLL with Docker (MinGW-w64)..."
cd "$ROOT_DIR"
docker build -t typecast-autotag-builder-windows -f Dockerfile.build.windows .
echo ""

# 결과물 추출
echo "Step 3: Extracting build artifacts..."
mkdir -p "$BUILD_DIR"
docker run --rm -v "$BUILD_DIR:/output" typecast-autotag-builder-windows
echo ""

# 결과 확인
echo "=== Build Complete ==="
echo "Output files:"
ls -la "$BUILD_DIR/"*.dll "$BUILD_DIR/"*.lib 2>/dev/null || true
echo ""
echo "DLL:    $BUILD_DIR/typecast_autotag.dll"
echo "LIB:    $BUILD_DIR/typecast_autotag.lib (import library)"
echo "Header: $BUILD_DIR/typecast_autotag.h"

