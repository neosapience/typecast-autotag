#!/bin/bash

# Script to copy native libraries from c-binding/build to java-binding resources

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/../.." && pwd )"
C_BUILD_DIR="$PROJECT_ROOT/c-binding/build"
JAVA_LIB_DIR="$SCRIPT_DIR/../src/main/resources/lib"

echo "Copying native libraries from c-binding to java-binding..."
echo "Source: $C_BUILD_DIR"
echo "Destination: $JAVA_LIB_DIR"
echo ""

# Create directories
mkdir -p "$JAVA_LIB_DIR/linux"
mkdir -p "$JAVA_LIB_DIR/darwin"
mkdir -p "$JAVA_LIB_DIR/windows"

# Copy Linux libraries
echo "Copying Linux libraries..."
if [ -f "$C_BUILD_DIR/libtypecast_autotag_x86_64.so" ]; then
    cp "$C_BUILD_DIR/libtypecast_autotag_x86_64.so" "$JAVA_LIB_DIR/linux/"
    echo "  ✓ libtypecast_autotag_x86_64.so"
fi
if [ -f "$C_BUILD_DIR/libtypecast_autotag_x86.so" ]; then
    cp "$C_BUILD_DIR/libtypecast_autotag_x86.so" "$JAVA_LIB_DIR/linux/"
    echo "  ✓ libtypecast_autotag_x86.so"
fi
if [ -f "$C_BUILD_DIR/libtypecast_autotag_arm64.so" ]; then
    cp "$C_BUILD_DIR/libtypecast_autotag_arm64.so" "$JAVA_LIB_DIR/linux/"
    echo "  ✓ libtypecast_autotag_arm64.so"
fi
if [ -f "$C_BUILD_DIR/libtypecast_autotag_armv7.so" ]; then
    cp "$C_BUILD_DIR/libtypecast_autotag_armv7.so" "$JAVA_LIB_DIR/linux/"
    echo "  ✓ libtypecast_autotag_armv7.so"
fi
if [ -f "$C_BUILD_DIR/libtypecast_autotag.so" ]; then
    cp "$C_BUILD_DIR/libtypecast_autotag.so" "$JAVA_LIB_DIR/linux/"
    echo "  ✓ libtypecast_autotag.so (generic)"
fi

# Copy macOS library
echo "Copying macOS library..."
if [ -f "$C_BUILD_DIR/libtypecast_autotag.dylib" ]; then
    cp "$C_BUILD_DIR/libtypecast_autotag.dylib" "$JAVA_LIB_DIR/darwin/"
    echo "  ✓ libtypecast_autotag.dylib"
fi

# Copy Windows libraries
echo "Copying Windows libraries..."
if [ -f "$C_BUILD_DIR/typecast_autotag_x86_64.dll" ]; then
    cp "$C_BUILD_DIR/typecast_autotag_x86_64.dll" "$JAVA_LIB_DIR/windows/"
    echo "  ✓ typecast_autotag_x86_64.dll"
fi
if [ -f "$C_BUILD_DIR/typecast_autotag_i686.dll" ]; then
    cp "$C_BUILD_DIR/typecast_autotag_i686.dll" "$JAVA_LIB_DIR/windows/"
    echo "  ✓ typecast_autotag_i686.dll"
fi
if [ -f "$C_BUILD_DIR/typecast_autotag.dll" ]; then
    cp "$C_BUILD_DIR/typecast_autotag.dll" "$JAVA_LIB_DIR/windows/"
    echo "  ✓ typecast_autotag.dll (generic)"
fi

echo ""
echo "✓ Native libraries copied successfully!"
echo ""
echo "Contents:"
echo "Linux:"
ls -lh "$JAVA_LIB_DIR/linux/" 2>/dev/null || echo "  (none)"
echo ""
echo "macOS:"
ls -lh "$JAVA_LIB_DIR/darwin/" 2>/dev/null || echo "  (none)"
echo ""
echo "Windows:"
ls -lh "$JAVA_LIB_DIR/windows/" 2>/dev/null || echo "  (none)"

