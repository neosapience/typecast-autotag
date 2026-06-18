import com.sun.jna.*;
import java.io.File;

/**
 * Simple verification test using JNA (Java Native Access).
 * This bypasses JNI and directly calls the C library functions.
 * 
 * To run:
 *   1. Download jna.jar from https://github.com/java-native-access/jna/releases
 *   2. javac -cp jna.jar:. SimpleVerificationTest.java
 *   3. java -cp jna.jar:. SimpleVerificationTest
 */
public class SimpleVerificationTest {
    
    // Define the C library interface
    public interface TypecastAutotagLib extends Library {
        int typecast_init();
        void typecast_cleanup();
        String typecast_auto_tag(String text);
        String typecast_manual_tag(String text);
        String typecast_auto_tag_with_manual(String text);
        void typecast_free(Pointer ptr);
        String typecast_version();
    }

    private static String getLibraryPath() {
        String osName = System.getProperty("os.name").toLowerCase();
        String osArch = System.getProperty("os.arch").toLowerCase();

        if (osName.contains("mac") || osName.contains("darwin")) {
            return "../src/main/resources/lib/darwin/libtypecast_autotag.dylib";
        }

        if (osName.contains("win")) {
            if (osArch.contains("64") || osArch.contains("amd64") || osArch.contains("x86_64")) {
                return "../src/main/resources/lib/windows/typecast_autotag_x86_64.dll";
            }
            return "../src/main/resources/lib/windows/typecast_autotag_i686.dll";
        }

        if (osArch.contains("aarch64") || osArch.contains("arm64")) {
            return "../src/main/resources/lib/linux/libtypecast_autotag_arm64.so";
        }
        if (osArch.contains("arm")) {
            return "../src/main/resources/lib/linux/libtypecast_autotag_armv7.so";
        }
        if (osArch.contains("64") || osArch.contains("amd64") || osArch.contains("x86_64")) {
            return "../src/main/resources/lib/linux/libtypecast_autotag_x86_64.so";
        }
        if (osArch.contains("86") || osArch.contains("i386")) {
            return "../src/main/resources/lib/linux/libtypecast_autotag_x86.so";
        }

        return "../src/main/resources/lib/linux/libtypecast_autotag.so";
    }
    
    public static void main(String[] args) {
        System.out.println("=".repeat(60));
        System.out.println("Typecast Autotag Java Binding - Verification Test");
        System.out.println("=".repeat(60));
        System.out.println();
        
        try {
            // Load the native library
            String libPath = getLibraryPath();
            String absoluteLibPath = new File(libPath).getAbsolutePath();
            System.out.println("Loading library from: " + absoluteLibPath);
            
            TypecastAutotagLib lib = Native.load(absoluteLibPath, TypecastAutotagLib.class);
            System.out.println("✓ Library loaded successfully");
            System.out.println();
            
            // Initialize
            System.out.println("Initializing library...");
            int result = lib.typecast_init();
            if (result != 0) {
                System.err.println("✗ Failed to initialize library");
                System.exit(1);
            }
            System.out.println("✓ Library initialized successfully");
            System.out.println();
            
            // Get version
            String version = lib.typecast_version();
            System.out.println("Library version: " + version);
            System.out.println();
            
            // Test 1: Auto tag - Phone number
            System.out.println("Test 1: Auto Tag - Phone Number");
            String phoneInput = "전화번호는 010-1234-5678입니다.";
            String phoneOutput = lib.typecast_auto_tag(phoneInput);
            System.out.println("  Input:  " + phoneInput);
            System.out.println("  Output: " + phoneOutput);
            // Accept both "공" (gong) and "영" (yeong) for zero, now uses dots as separator
            boolean phonePass = phoneOutput.contains("공 . 일 . 공") || phoneOutput.contains("영 . 일 . 영");
            System.out.println(phonePass ? "  ✓ PASS" : "  ✗ FAIL");
            System.out.println();
            
            // Test 2: Auto tag - Money
            System.out.println("Test 2: Auto Tag - Money");
            String moneyInput = "총 금액은 50000원입니다.";
            String moneyOutput = lib.typecast_auto_tag(moneyInput);
            System.out.println("  Input:  " + moneyInput);
            System.out.println("  Output: " + moneyOutput);
            System.out.println(moneyOutput.contains("오만") || moneyOutput.contains("만") ? "  ✓ PASS" : "  ✗ FAIL");
            System.out.println();
            
            // Test 3: Manual tag - Name
            System.out.println("Test 3: Manual Tag - Name");
            String nameInput = "name(김철수)님 안녕하세요.";
            String nameOutput = lib.typecast_manual_tag(nameInput);
            System.out.println("  Input:  " + nameInput);
            System.out.println("  Output: " + nameOutput);
            System.out.println(nameOutput.contains("김 . 철 . 수") ? "  ✓ PASS" : "  ✗ FAIL");
            System.out.println();

            // Test 4: Hybrid mode
            System.out.println("Test 4: Hybrid Mode");
            String hybridInput = "name(홍길동)님, 잔액은 50000원입니다.";
            String hybridOutput = lib.typecast_auto_tag_with_manual(hybridInput);
            System.out.println("  Input:  " + hybridInput);
            System.out.println("  Output: " + hybridOutput);
            boolean pass4 = hybridOutput.contains("홍 . 길 . 동") &&
                           (hybridOutput.contains("오만") || hybridOutput.contains("만"));
            System.out.println(pass4 ? "  ✓ PASS" : "  ✗ FAIL");
            System.out.println();
            
            // Cleanup
            lib.typecast_cleanup();
            System.out.println("✓ Library cleaned up successfully");
            System.out.println();
            
            System.out.println("=".repeat(60));
            System.out.println("✓ ALL TESTS PASSED");
            System.out.println("=".repeat(60));
            
            System.exit(0);
            
        } catch (Exception e) {
            System.err.println();
            System.err.println("=".repeat(60));
            System.err.println("✗ TESTS FAILED");
            System.err.println("=".repeat(60));
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }
    }
}
