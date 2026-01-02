#!/bin/bash

# Script to run Java binding verification tests

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
JAVA_BINDING_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"
VERIFICATION_DIR="$JAVA_BINDING_DIR/verification-test"

echo "=========================================="
echo "Java Binding - Verification Test"
echo "=========================================="
echo ""

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven not found. Please install Maven first."
    echo "   macOS: brew install maven"
    echo "   Ubuntu: sudo apt-get install maven"
    exit 1
fi

# Check if native libraries exist
DARWIN_LIB="$JAVA_BINDING_DIR/src/main/resources/lib/darwin/libtypecast_autotag.dylib"
if [ ! -f "$DARWIN_LIB" ]; then
    echo "❌ Native library not found: $DARWIN_LIB"
    echo "   Run: pnpm java-binding:copy-libs"
    exit 1
fi

cd "$VERIFICATION_DIR"

# Download JNA dependency if needed
if [ ! -d "target/dependency" ] || [ ! -f "target/dependency/jna-5.14.0.jar" ]; then
    echo "📦 Downloading JNA dependency..."
    mvn dependency:copy-dependencies -q
    echo "✓ JNA dependency downloaded"
    echo ""
fi

# Find Java executable
if [ -n "$JAVA_HOME" ]; then
    JAVA_CMD="$JAVA_HOME/bin/java"
    JAVAC_CMD="$JAVA_HOME/bin/javac"
elif [ -f "/opt/homebrew/Cellar/openjdk/25.0.1/libexec/openjdk.jdk/Contents/Home/bin/java" ]; then
    # Homebrew OpenJDK on Apple Silicon
    JAVA_CMD="/opt/homebrew/Cellar/openjdk/25.0.1/libexec/openjdk.jdk/Contents/Home/bin/java"
    JAVAC_CMD="/opt/homebrew/Cellar/openjdk/25.0.1/libexec/openjdk.jdk/Contents/Home/bin/javac"
elif [ -d "/opt/homebrew/opt/openjdk/libexec/openjdk.jdk/Contents/Home" ]; then
    # Homebrew OpenJDK (symlink)
    JAVA_CMD="/opt/homebrew/opt/openjdk/libexec/openjdk.jdk/Contents/Home/bin/java"
    JAVAC_CMD="/opt/homebrew/opt/openjdk/libexec/openjdk.jdk/Contents/Home/bin/javac"
elif [ -d "/usr/local/opt/openjdk/libexec/openjdk.jdk/Contents/Home" ]; then
    # Homebrew OpenJDK on Intel
    JAVA_CMD="/usr/local/opt/openjdk/libexec/openjdk.jdk/Contents/Home/bin/java"
    JAVAC_CMD="/usr/local/opt/openjdk/libexec/openjdk.jdk/Contents/Home/bin/javac"
elif command -v java &> /dev/null; then
    JAVA_CMD="java"
    JAVAC_CMD="javac"
else
    echo "❌ Java not found. Please install Java 8 or higher."
    echo "   macOS: brew install openjdk"
    echo "   Ubuntu: sudo apt-get install default-jdk"
    exit 1
fi

# Get Java version
JAVA_VERSION=$("$JAVA_CMD" -version 2>&1 | head -1 | cut -d'"' -f2 | cut -d'.' -f1)
echo "Java version: $("$JAVA_CMD" -version 2>&1 | head -1)"
echo ""

# Compile test
echo "🔨 Compiling verification test..."
"$JAVAC_CMD" -cp target/dependency/jna-5.14.0.jar:. SimpleVerificationTest.java
echo "✓ Compilation successful"
echo ""

# Run test
echo "🧪 Running verification test..."
echo ""
"$JAVA_CMD" -cp target/dependency/jna-5.14.0.jar:. SimpleVerificationTest

exit $?

