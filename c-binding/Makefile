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

.PHONY: all clean duktape bundle example test

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

# Help
help:
	@echo "Typecast Autotag C Library Build System"
	@echo ""
	@echo "Targets:"
	@echo "  all          - Build shared library (default)"
	@echo "  static       - Build static library"
	@echo "  duktape      - Download Duktape"
	@echo "  bundle       - Generate JS bundle from TypeScript"
	@echo "  example      - Build example program"
	@echo "  test         - Run example program"
	@echo "  clean        - Clean build artifacts"
	@echo "  distclean    - Clean everything including Duktape"
	@echo "  docker-build - Build using Docker for CentOS 6.9 compatibility"
	@echo "  help         - Show this help"
