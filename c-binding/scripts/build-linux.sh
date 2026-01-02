#!/bin/bash
# Typecast Autotag C Library - Linux 빌드 스크립트
# CentOS 6.9 호환 .so 파일 생성

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
BUILD_DIR="$ROOT_DIR/build"

echo "=== Typecast Autotag C Library Builder ==="
echo "Target: x86_64 Linux (CentOS 6.9 compatible)"
echo ""

# JS 번들 생성
echo "Step 1: Generating JS bundle..."
cd "$ROOT_DIR/.."
node c-binding/scripts/bundle.js
echo ""

# Docker 빌드
echo "Step 2: Building with Docker..."
cd "$ROOT_DIR"
docker build -t typecast-autotag-builder -f Dockerfile.build .
echo ""

# 결과물 추출
echo "Step 3: Extracting build artifacts..."
mkdir -p "$BUILD_DIR"
docker run --rm -v "$BUILD_DIR:/output" typecast-autotag-builder
echo ""

# 결과 확인
echo "=== Build Complete ==="
echo "Output files:"
ls -la "$BUILD_DIR/"
echo ""
echo "Library: $BUILD_DIR/libtypecast_autotag.so"
echo "Header:  $BUILD_DIR/typecast_autotag.h"

