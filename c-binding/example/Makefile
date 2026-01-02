# Typecast Autotag C Library Example Makefile

CC ?= gcc
CFLAGS := -Wall -Wextra -O2
LDFLAGS := -L../build -ltypecast_autotag -Wl,-rpath,../build

# Header path
INCLUDES := -I../include

# Output file
TARGET := example

# Source file
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

# Use when running on CentOS 6.9
run-centos:
	LD_LIBRARY_PATH=/path/to/lib ./$(TARGET)
