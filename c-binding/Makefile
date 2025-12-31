# TypeCast AutoTag C Library Makefile
# CentOS 6.9 호환을 위해 musl-libc 정적 링크 사용

# QuickJS 버전
QUICKJS_VERSION := 2024-01-13
QUICKJS_URL := https://bellard.org/quickjs/quickjs-$(QUICKJS_VERSION).tar.xz
QUICKJS_DIR := quickjs/quickjs-$(QUICKJS_VERSION)

# 컴파일러 설정
CC ?= gcc
AR ?= ar

# 기본 플래그
CFLAGS := -Wall -Wextra -O2 -fPIC
LDFLAGS := -shared

# 디렉토리
SRC_DIR := src
INCLUDE_DIR := include
BUILD_DIR := build

# 소스 파일
WRAPPER_SRC := $(SRC_DIR)/typecast_autotag.c
BUNDLE_HEADER := $(SRC_DIR)/autotag_bundle.h

# 출력 파일
LIB_NAME := libtypecast_autotag
SHARED_LIB := $(BUILD_DIR)/$(LIB_NAME).so
STATIC_LIB := $(BUILD_DIR)/$(LIB_NAME).a

# QuickJS 정적 라이브러리
QUICKJS_LIB := $(QUICKJS_DIR)/libquickjs.a

.PHONY: all clean quickjs bundle example test

all: $(SHARED_LIB)

# QuickJS 다운로드 및 빌드
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

# JS 번들 생성
bundle:
	@echo "Bundling TypeScript..."
	@cd .. && node c-binding/scripts/bundle.js

# 공유 라이브러리 빌드
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

# 정적 라이브러리 빌드
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

# 예제 빌드
example: $(SHARED_LIB)
	@echo "Building example..."
	@cd example && $(MAKE)

# 테스트 실행
test: example
	@echo "Running example..."
ifeq ($(shell uname),Darwin)
	@cd example && DYLD_LIBRARY_PATH=../$(BUILD_DIR) ./example
else
	@cd example && LD_LIBRARY_PATH=../$(BUILD_DIR) ./example
endif

# 정리
clean:
	@rm -rf $(BUILD_DIR)
	@cd example && $(MAKE) clean 2>/dev/null || true

# QuickJS까지 정리
distclean: clean
	@rm -rf quickjs

# 헤더 파일 복사
install-headers: $(SHARED_LIB)
	@cp $(INCLUDE_DIR)/typecast_autotag.h $(BUILD_DIR)/

# Docker를 통한 정적 빌드 (CentOS 6.9 호환)
docker-build:
	@echo "Building with Docker (musl-libc for CentOS 6.9 compatibility)..."
	docker build -t typecast-autotag-builder -f Dockerfile.build .
	docker run --rm -v $(PWD)/build:/output typecast-autotag-builder

# 도움말
help:
	@echo "TypeCast AutoTag C Library Build System"
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

