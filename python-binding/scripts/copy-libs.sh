#!/bin/bash
#
# Copy native libraries from c-binding/build to python-binding/typecast_autotag/lib
#
# Usage:
#   ./scripts/copy-libs.sh
#
# This script copies all available native libraries for different platforms.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHON_BINDING_DIR="$(dirname "$SCRIPT_DIR")"
C_BINDING_BUILD_DIR="$(dirname "$PYTHON_BINDING_DIR")/c-binding/build"
LIB_DIR="$PYTHON_BINDING_DIR/typecast_autotag/lib"

echo "================================================"
echo "  Copying native libraries to Python binding"
echo "================================================"
echo ""
echo "Source: $C_BINDING_BUILD_DIR"
echo "Target: $LIB_DIR"
echo ""

# Check if c-binding/build exists
if [ ! -d "$C_BINDING_BUILD_DIR" ]; then
    echo "Error: c-binding/build directory not found."
    echo "Please build the C library first:"
    echo "  cd c-binding && make all-platforms"
    exit 1
fi

# Create target directories
mkdir -p "$LIB_DIR/linux"
mkdir -p "$LIB_DIR/darwin"
mkdir -p "$LIB_DIR/windows"

# Copy Linux libraries
echo "Copying Linux libraries..."
LINUX_COPIED=0
for lib in "$C_BINDING_BUILD_DIR"/libtypecast_autotag*.so; do
    if [ -f "$lib" ]; then
        cp -v "$lib" "$LIB_DIR/linux/"
        LINUX_COPIED=$((LINUX_COPIED + 1))
    fi
done
if [ $LINUX_COPIED -eq 0 ]; then
    echo "  (no Linux .so files found)"
else
    echo "  Copied $LINUX_COPIED Linux library/libraries"
fi

# Copy macOS libraries
echo ""
echo "Copying macOS libraries..."
MACOS_COPIED=0
for lib in "$C_BINDING_BUILD_DIR"/libtypecast_autotag*.dylib; do
    if [ -f "$lib" ]; then
        cp -v "$lib" "$LIB_DIR/darwin/"
        MACOS_COPIED=$((MACOS_COPIED + 1))
    fi
done
if [ $MACOS_COPIED -eq 0 ]; then
    echo "  (no macOS .dylib files found)"
else
    echo "  Copied $MACOS_COPIED macOS library/libraries"
fi

# Copy Windows libraries
echo ""
echo "Copying Windows libraries..."
WINDOWS_COPIED=0
for lib in "$C_BINDING_BUILD_DIR"/typecast_autotag*.dll; do
    if [ -f "$lib" ]; then
        cp -v "$lib" "$LIB_DIR/windows/"
        WINDOWS_COPIED=$((WINDOWS_COPIED + 1))
    fi
done
if [ $WINDOWS_COPIED -eq 0 ]; then
    echo "  (no Windows .dll files found)"
else
    echo "  Copied $WINDOWS_COPIED Windows library/libraries"
fi

echo ""
echo "================================================"
echo "  Summary"
echo "================================================"
echo "Linux:   $LINUX_COPIED library/libraries"
echo "macOS:   $MACOS_COPIED library/libraries"
echo "Windows: $WINDOWS_COPIED library/libraries"
echo ""

# List what was copied
echo "Contents of $LIB_DIR:"
find "$LIB_DIR" -type f -name "*.so" -o -name "*.dylib" -o -name "*.dll" 2>/dev/null | sort | while read -r f; do
    SIZE=$(du -h "$f" | cut -f1)
    echo "  $(basename "$(dirname "$f")")/$(basename "$f") ($SIZE)"
done

echo ""
echo "Done!"

