#!/bin/bash
# Build Linux libraries for multiple architectures
# CentOS 6.9+ compatible (glibc 2.12 for x86_64/x86)
#
# Build Strategy:
# - x86_64/x86: Native build on CentOS 6 (glibc 2.12)
# - arm64/armv7: Cross-compile with Debian Stretch (glibc 2.24)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BUILD_DIR="$PROJECT_DIR/build"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN} Linux Multi-Architecture Build${NC}"
echo -e "${GREEN} (CentOS 6.9+ Compatible)${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "${CYAN}Build targets:${NC}"
echo -e "  x86_64: CentOS 6 native (glibc 2.12)"
echo -e "  x86:    CentOS 6 native (glibc 2.12)"
echo -e "  arm64:  Debian Stretch cross-compile (glibc 2.24)"
echo -e "  armv7:  Debian Stretch cross-compile (glibc 2.24)"

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
echo -e "${GREEN} (CentOS 6.9+ Compatible)${NC}"
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
echo ""
echo -e "${CYAN}Compatibility:${NC}"
echo "  x86_64/x86: CentOS 6.9+ (glibc 2.12+)"
echo "  arm64/armv7: Debian Stretch+ (glibc 2.24+)"