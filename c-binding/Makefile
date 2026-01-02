# Typecast Autotag C Library Makefile
# Uses musl-libc static linking for CentOS 6.9 compatibility

# Duktape version
DUKTAPE_VERSION := 2.7.0
DUKTAPE_URL := https://duktape.org/duktape-$(DUKTAPE_VERSION).tar.xz
DUKTAPE_DIR := duktape/duktape-$(DUKTAPE_VERSION)

# Compiler settings
CC ?= gcc
AR ?= ar

# Default flags
CFLAGS := -Wall -Wextra -O2 -fPIC
LDFLAGS := -shared

# Directories
SRC_DIR := src
INCLUDE_DIR := include
BUILD_DIR := build

# Source files
WRAPPER_SRC := $(SRC_DIR)/typecast_autotag.c
BUNDLE_HEADER := $(SRC_DIR)/autotag_bundle.h

# Duktape source files
DUKTAPE_SRC := $(DUKTAPE_DIR)/src/duktape.c

# Output files
LIB_NAME := libtypecast_autotag
SHARED_LIB := $(BUILD_DIR)/$(LIB_NAME).so
STATIC_LIB := $(BUILD_DIR)/$(LIB_NAME).a

# macOS output files
MACOS_DYLIB := $(BUILD_DIR)/$(LIB_NAME).dylib

# Windows output files (cross-compiled)
WIN_DLL := $(BUILD_DIR)/typecast_autotag.dll
WIN_LIB := $(BUILD_DIR)/typecast_autotag.lib

# MinGW cross-compiler (for Windows DLL on Linux/macOS)
MINGW_CC ?= x86_64-w64-mingw32-gcc
MINGW_STRIP ?= x86_64-w64-mingw32-strip

# Detect OS
UNAME_S := $(shell uname -s)

.PHONY: all clean duktape bundle example test windows docker-build-windows macos

all: $(SHARED_LIB)

# Download Duktape
$(DUKTAPE_DIR):
	@echo "Downloading Duktape $(DUKTAPE_VERSION)..."
	@mkdir -p duktape
	@curl -L $(DUKTAPE_URL) -o duktape/duktape.tar.xz
	@cd duktape && tar -xf duktape.tar.xz
	@rm duktape/duktape.tar.xz

duktape: $(DUKTAPE_DIR)

# Generate JS bundle
bundle:
	@echo "Bundling TypeScript..."
	@cd .. && node c-binding/scripts/bundle.js

# Build shared library
$(SHARED_LIB): $(WRAPPER_SRC) $(DUKTAPE_DIR) $(BUNDLE_HEADER)
	@echo "Building shared library..."
	@mkdir -p $(BUILD_DIR)
	$(CC) $(CFLAGS) $(LDFLAGS) \
		-I$(INCLUDE_DIR) \
		-I$(DUKTAPE_DIR)/src \
		$(WRAPPER_SRC) \
		$(DUKTAPE_SRC) \
		-lm -lpthread \
		-o $(SHARED_LIB)
	@echo "Built: $(SHARED_LIB)"
	@cp $(INCLUDE_DIR)/typecast_autotag.h $(BUILD_DIR)/

# Build static library
static: $(WRAPPER_SRC) $(DUKTAPE_DIR) $(BUNDLE_HEADER)
	@echo "Building static library..."
	@mkdir -p $(BUILD_DIR)
	$(CC) $(CFLAGS) -c \
		-I$(INCLUDE_DIR) \
		-I$(DUKTAPE_DIR)/src \
		$(DUKTAPE_SRC) \
		-o $(BUILD_DIR)/duktape.o
	$(CC) $(CFLAGS) -c \
		-I$(INCLUDE_DIR) \
		-I$(DUKTAPE_DIR)/src \
		$(WRAPPER_SRC) \
		-o $(BUILD_DIR)/typecast_autotag.o
	$(AR) rcs $(STATIC_LIB) $(BUILD_DIR)/duktape.o $(BUILD_DIR)/typecast_autotag.o
	@echo "Built: $(STATIC_LIB)"
	@cp $(INCLUDE_DIR)/typecast_autotag.h $(BUILD_DIR)/

# Build example
example: $(SHARED_LIB)
	@echo "Building example..."
	@cd example && $(MAKE)

# Run tests
test: example
	@echo "Running example..."
ifeq ($(shell uname),Darwin)
	@cd example && DYLD_LIBRARY_PATH=../$(BUILD_DIR) ./example
else
	@cd example && LD_LIBRARY_PATH=../$(BUILD_DIR) ./example
endif

# Clean build artifacts
clean:
	@rm -rf $(BUILD_DIR)
	@cd example && $(MAKE) clean 2>/dev/null || true

# Clean everything including Duktape
distclean: clean
	@rm -rf duktape

# Copy header files
install-headers: $(SHARED_LIB)
	@cp $(INCLUDE_DIR)/typecast_autotag.h $(BUILD_DIR)/

# Docker build for static linking (CentOS 6.9 compatible)
docker-build:
	@echo "Building with Docker (musl-libc for CentOS 6.9 compatibility)..."
	docker build -t typecast-autotag-builder -f Dockerfile.build .
	docker run --rm -v $(PWD)/build:/output typecast-autotag-builder

# Windows DLL build (using MinGW cross-compiler locally)
windows: $(WRAPPER_SRC) $(DUKTAPE_DIR) $(BUNDLE_HEADER)
	@echo "Building Windows DLL..."
	@mkdir -p $(BUILD_DIR)
	@# Check if MinGW is available
	@which $(MINGW_CC) > /dev/null 2>&1 || (echo "Error: MinGW not found. Install mingw-w64 or use 'make docker-build-windows'" && exit 1)
	$(MINGW_CC) -std=c99 -Wall -O2 -shared \
		-DTYPECAST_BUILDING_DLL \
		-I$(INCLUDE_DIR) \
		-I$(DUKTAPE_DIR)/src \
		$(WRAPPER_SRC) \
		$(DUKTAPE_SRC) \
		-o $(WIN_DLL) \
		-Wl,--out-implib,$(WIN_LIB)
	$(MINGW_STRIP) $(WIN_DLL)
	@echo "Built: $(WIN_DLL)"
	@echo "Built: $(WIN_LIB)"
	@cp $(INCLUDE_DIR)/typecast_autotag.h $(BUILD_DIR)/

# Docker build for Windows DLL (MinGW-w64 in container)
docker-build-windows:
	@echo "Building Windows DLL with Docker (MinGW-w64)..."
	docker build -t typecast-autotag-builder-windows -f Dockerfile.build.windows .
	docker run --rm -v $(PWD)/build:/output typecast-autotag-builder-windows

# macOS dylib build (local build, requires macOS)
macos: $(WRAPPER_SRC) $(DUKTAPE_DIR) $(BUNDLE_HEADER)
ifeq ($(UNAME_S),Darwin)
	@echo "Building macOS dylib..."
	@mkdir -p $(BUILD_DIR)
	$(CC) $(CFLAGS) -dynamiclib \
		-DTYPECAST_BUILDING_DLL \
		-I$(INCLUDE_DIR) \
		-I$(DUKTAPE_DIR)/src \
		$(WRAPPER_SRC) \
		$(DUKTAPE_SRC) \
		-lm \
		-install_name @rpath/$(LIB_NAME).dylib \
		-o $(MACOS_DYLIB)
	@echo "Built: $(MACOS_DYLIB)"
	@cp $(INCLUDE_DIR)/typecast_autotag.h $(BUILD_DIR)/
else
	@echo "Error: macOS build requires running on macOS"
	@exit 1
endif

# macOS universal binary (Intel + Apple Silicon)
macos-universal: $(WRAPPER_SRC) $(DUKTAPE_DIR) $(BUNDLE_HEADER)
ifeq ($(UNAME_S),Darwin)
	@echo "Building macOS universal dylib (x86_64 + arm64)..."
	@mkdir -p $(BUILD_DIR)
	@# Build for x86_64
	$(CC) $(CFLAGS) -dynamiclib -arch x86_64 \
		-DTYPECAST_BUILDING_DLL \
		-I$(INCLUDE_DIR) \
		-I$(DUKTAPE_DIR)/src \
		$(WRAPPER_SRC) \
		$(DUKTAPE_SRC) \
		-lm \
		-install_name @rpath/$(LIB_NAME).dylib \
		-o $(BUILD_DIR)/$(LIB_NAME)_x86_64.dylib
	@# Build for arm64
	$(CC) $(CFLAGS) -dynamiclib -arch arm64 \
		-DTYPECAST_BUILDING_DLL \
		-I$(INCLUDE_DIR) \
		-I$(DUKTAPE_DIR)/src \
		$(WRAPPER_SRC) \
		$(DUKTAPE_SRC) \
		-lm \
		-install_name @rpath/$(LIB_NAME).dylib \
		-o $(BUILD_DIR)/$(LIB_NAME)_arm64.dylib
	@# Create universal binary
	lipo -create \
		$(BUILD_DIR)/$(LIB_NAME)_x86_64.dylib \
		$(BUILD_DIR)/$(LIB_NAME)_arm64.dylib \
		-output $(MACOS_DYLIB)
	@rm $(BUILD_DIR)/$(LIB_NAME)_x86_64.dylib $(BUILD_DIR)/$(LIB_NAME)_arm64.dylib
	@echo "Built: $(MACOS_DYLIB) (universal binary)"
	@cp $(INCLUDE_DIR)/typecast_autotag.h $(BUILD_DIR)/
else
	@echo "Error: macOS build requires running on macOS"
	@exit 1
endif

# Build all platforms
all-platforms: docker-build docker-build-windows macos-universal
	@echo "Built for all platforms:"
	@ls -la $(BUILD_DIR)/

# Help
help:
	@echo "Typecast Autotag C Library Build System"
	@echo ""
	@echo "Targets:"
	@echo "  all                 - Build shared library (default)"
	@echo "  static              - Build static library"
	@echo "  macos               - Build macOS dylib (requires macOS)"
	@echo "  macos-universal     - Build macOS universal dylib (x86_64 + arm64)"
	@echo "  windows             - Build Windows DLL (requires mingw-w64)"
	@echo "  duktape             - Download Duktape"
	@echo "  bundle              - Generate JS bundle from TypeScript"
	@echo "  example             - Build example program"
	@echo "  test                - Run example program"
	@echo "  clean               - Clean build artifacts"
	@echo "  distclean           - Clean everything including Duktape"
	@echo "  docker-build        - Build Linux .so using Docker (CentOS 6.9 compatible)"
	@echo "  docker-build-windows- Build Windows .dll using Docker (MinGW-w64)"
	@echo "  all-platforms       - Build for all platforms (Linux + Windows + macOS)"
	@echo "  help                - Show this help"
	@echo ""
	@echo "Output files:"
	@echo "  Linux:   build/libtypecast_autotag.so"
	@echo "  macOS:   build/libtypecast_autotag.dylib"
	@echo "  Windows: build/typecast_autotag.dll, build/typecast_autotag.lib"
