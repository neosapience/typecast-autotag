#!/bin/bash
# Build Windows DLLs for multiple architectures using MinGW-w64
# Supports: x86_64 (64-bit), x86 (32-bit)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BUILD_DIR="$PROJECT_DIR/build"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN} Windows Multi-Architecture Build${NC}"
echo -e "${GREEN}============================================${NC}"

# Create build directory
mkdir -p "$BUILD_DIR"

cd "$PROJECT_DIR"

# Architecture configurations
# Format: "win_arch"
ARCHITECTURES=(
    "x86_64"
    "i686"
)

# Build for each architecture
for WIN_ARCH in "${ARCHITECTURES[@]}"; do
    echo ""
    echo -e "${GREEN}Building Windows ${WIN_ARCH}...${NC}"
    
    # Build the image
    docker build \
        --build-arg "WIN_ARCH=$WIN_ARCH" \
        -f Dockerfile.build.windows-multiarch \
        -t "typecast-autotag-windows-${WIN_ARCH}" \
        .
    
    # Run the container to extract the DLL
    docker run --rm \
        -v "$BUILD_DIR:/output" \
        "typecast-autotag-windows-${WIN_ARCH}"
    
    echo -e "${GREEN}✓ Built: typecast_autotag_${WIN_ARCH}.dll${NC}"
done

# Create default DLL symlinks (x86_64)
echo ""
echo -e "${YELLOW}Creating default DLL copies (x86_64)...${NC}"
cd "$BUILD_DIR"
if [ -f "typecast_autotag_x86_64.dll" ]; then
    cp "typecast_autotag_x86_64.dll" "typecast_autotag.dll"
    cp "typecast_autotag_x86_64.lib" "typecast_autotag.lib"
fi

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN} Build Complete!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo "Output files:"
ls -la "$BUILD_DIR"/typecast_autotag*.dll "$BUILD_DIR"/typecast_autotag*.lib 2>/dev/null || true
echo ""
echo "Architecture verification:"
for f in "$BUILD_DIR"/typecast_autotag*.dll; do
    if [ -f "$f" ]; then
        echo "  $(basename "$f"): $(file "$f" | sed 's/.*: //')"
    fi
done

