#!/bin/bash
# Build Linux libraries for multiple architectures using cross-compilers
# Single Docker container builds all architectures

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
echo -e "${GREEN} Linux Multi-Architecture Build${NC}"
echo -e "${GREEN} (Cross-Compilation)${NC}"
echo -e "${GREEN}============================================${NC}"

# Create build directory
mkdir -p "$BUILD_DIR"

cd "$PROJECT_DIR"

# Build the cross-compile image
echo ""
echo -e "${YELLOW}Building cross-compilation Docker image...${NC}"
docker build \
    -f Dockerfile.build.linux-multiarch \
    -t typecast-autotag-linux-multiarch \
    .

# Run the container to extract all libraries
echo ""
echo -e "${YELLOW}Extracting built libraries...${NC}"
docker run --rm \
    -v "$BUILD_DIR:/output" \
    typecast-autotag-linux-multiarch

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN} Build Complete!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo "Output files:"
ls -la "$BUILD_DIR"/libtypecast_autotag*.so 2>/dev/null || true
echo ""
echo "Architecture verification:"
for f in "$BUILD_DIR"/libtypecast_autotag*.so; do
    if [ -f "$f" ]; then
        echo "  $(basename "$f"): $(file "$f" | sed 's/.*: //')"
    fi
done
