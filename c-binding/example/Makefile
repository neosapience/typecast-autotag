# Typecast Autotag C Library 예제 Makefile

CC ?= gcc
CFLAGS := -Wall -Wextra -O2
LDFLAGS := -L../build -ltypecast_autotag -Wl,-rpath,../build

# 헤더 경로
INCLUDES := -I../include

# 출력 파일
TARGET := example

# 소스 파일
SRC := example.c

.PHONY: all clean run

all: $(TARGET)

$(TARGET): $(SRC)
	$(CC) $(CFLAGS) $(INCLUDES) -o $@ $< $(LDFLAGS)

run: $(TARGET)
ifeq ($(shell uname),Darwin)
	DYLD_LIBRARY_PATH=../build ./$(TARGET)
else
	LD_LIBRARY_PATH=../build ./$(TARGET)
endif

clean:
	rm -f $(TARGET)

# CentOS 6.9에서 실행할 때 사용
run-centos:
	LD_LIBRARY_PATH=/path/to/lib ./$(TARGET)

