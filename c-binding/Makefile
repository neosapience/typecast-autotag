# Typecast Autotag C Library Makefile
# Uses musl-libc static linking for CentOS 6.9 compatibility

# QuickJS version
QUICKJS_VERSION := 2024-01-13
QUICKJS_URL := https://bellard.org/quickjs/quickjs-$(QUICKJS_VERSION).tar.xz
QUICKJS_DIR := quickjs/quickjs-$(QUICKJS_VERSION)

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

# Output files
LIB_NAME := libtypecast_autotag
SHARED_LIB := $(BUILD_DIR)/$(LIB_NAME).so
STATIC_LIB := $(BUILD_DIR)/$(LIB_NAME).a

# QuickJS static library
QUICKJS_LIB := $(QUICKJS_DIR)/libquickjs.a

.PHONY: all clean quickjs bundle example test

all: $(SHARED_LIB)

# Download and build QuickJS
$(QUICKJS_DIR):
	@echo "Downloading QuickJS $(QUICKJS_VERSION)..."
	@mkdir -p quickjs
	@curl -L $(QUICKJS_URL) -o quickjs/quickjs.tar.xz
	@cd quickjs && tar -xf quickjs.tar.xz
	@rm quickjs/quickjs.tar.xz

$(QUICKJS_LIB): $(QUICKJS_DIR)
	@echo "Building QuickJS..."
	@cd $(QUICKJS_DIR) && $(MAKE) libquickjs.a CC=$(CC)

quickjs: $(QUICKJS_LIB)

# Generate JS bundle
bundle:
	@echo "Bundling TypeScript..."
	@cd .. && node c-binding/scripts/bundle.js

# Build shared library
$(SHARED_LIB): $(WRAPPER_SRC) $(QUICKJS_LIB) $(BUNDLE_HEADER)
	@echo "Building shared library..."
	@mkdir -p $(BUILD_DIR)
	$(CC) $(CFLAGS) $(LDFLAGS) \
		-I$(INCLUDE_DIR) \
		-I$(QUICKJS_DIR) \
		$(WRAPPER_SRC) \
		$(QUICKJS_LIB) \
		-lm -lpthread -ldl \
		-o $(SHARED_LIB)
	@echo "Built: $(SHARED_LIB)"
	@cp $(INCLUDE_DIR)/typecast_autotag.h $(BUILD_DIR)/

# Build static library
static: $(WRAPPER_SRC) $(QUICKJS_LIB) $(BUNDLE_HEADER)
	@echo "Building static library..."
	@mkdir -p $(BUILD_DIR)
	$(CC) $(CFLAGS) -c \
		-I$(INCLUDE_DIR) \
		-I$(QUICKJS_DIR) \
		$(WRAPPER_SRC) \
		-o $(BUILD_DIR)/typecast_autotag.o
	$(AR) rcs $(STATIC_LIB) $(BUILD_DIR)/typecast_autotag.o
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

# Clean everything including QuickJS
distclean: clean
	@rm -rf quickjs

# Copy header files
install-headers: $(SHARED_LIB)
	@cp $(INCLUDE_DIR)/typecast_autotag.h $(BUILD_DIR)/

# Docker build for static linking (CentOS 6.9 compatible)
docker-build:
	@echo "Building with Docker (musl-libc for CentOS 6.9 compatibility)..."
	docker build -t typecast-autotag-builder -f Dockerfile.build .
	docker run --rm -v $(PWD)/build:/output typecast-autotag-builder

# Help
help:
	@echo "Typecast Autotag C Library Build System"
	@echo ""
	@echo "Targets:"
	@echo "  all          - Build shared library (default)"
	@echo "  static       - Build static library"
	@echo "  quickjs      - Download and build QuickJS"
	@echo "  bundle       - Generate JS bundle from TypeScript"
	@echo "  example      - Build example program"
	@echo "  test         - Run example program"
	@echo "  clean        - Clean build artifacts"
	@echo "  distclean    - Clean everything including QuickJS"
	@echo "  docker-build - Build using Docker for CentOS 6.9 compatibility"
	@echo "  help         - Show this help"

