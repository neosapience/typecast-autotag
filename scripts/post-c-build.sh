#!/bin/bash

# Post C-binding build script
# Automatically copies native libraries to Python and Java bindings

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

echo "=================================================="
echo "Post C-binding Build - Auto Copy Native Libraries"
echo "=================================================="
echo ""

# Check if c-binding/build directory exists
if [ ! -d "$PROJECT_ROOT/c-binding/build" ]; then
    echo "⚠️  Warning: c-binding/build directory not found"
    echo "   Run 'pnpm c-binding:build-all' first"
    exit 0
fi

# Count library files
LIB_COUNT=$(find "$PROJECT_ROOT/c-binding/build" -type f \( -name "*.so" -o -name "*.dylib" -o -name "*.dll" \) | wc -l | tr -d ' ')

if [ "$LIB_COUNT" -eq "0" ]; then
    echo "⚠️  Warning: No native libraries found in c-binding/build"
    echo "   Build libraries first with 'pnpm c-binding:build-all'"
    exit 0
fi

echo "📦 Found $LIB_COUNT native library file(s)"
echo ""

# Copy to Python binding
echo "📋 Copying to Python binding..."
if [ -f "$PROJECT_ROOT/python-binding/scripts/copy-libs.sh" ]; then
    cd "$PROJECT_ROOT/python-binding"
    ./scripts/copy-libs.sh
    echo "✓ Python binding libraries updated"
else
    echo "⚠️  Python copy script not found"
fi

echo ""

# Copy to Java binding
echo "📋 Copying to Java binding..."
if [ -f "$PROJECT_ROOT/java-binding/scripts/copy-libs.sh" ]; then
    cd "$PROJECT_ROOT/java-binding"
    ./scripts/copy-libs.sh
    echo "✓ Java binding libraries updated"
else
    echo "⚠️  Java copy script not found"
fi

echo ""
echo "=================================================="
echo "✅ Native libraries synced to all bindings"
echo "=================================================="

