package ai.typecast.autotag;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

/**
 * Utility class for loading platform-specific native libraries.
 * Automatically detects the operating system and architecture,
 * and extracts the appropriate native library from the JAR resources.
 */
class NativeLibraryLoader {
    
    private static final String LIB_PREFIX = "/lib/";
    private static boolean loaded = false;
    
    /**
     * Platform information holder.
     */
    private static class Platform {
        final String os;
        final String arch;
        final String extension;
        
        Platform(String os, String arch, String extension) {
            this.os = os;
            this.arch = arch;
            this.extension = extension;
        }
    }
    
    /**
     * Load the native library for the current platform.
     *
     * @throws LibraryNotFoundException if the library cannot be found or loaded
     */
    static synchronized void loadLibrary() throws LibraryNotFoundException {
        if (loaded) {
            return;
        }
        
        Platform platform = detectPlatform();
        String libraryPath = getLibraryPath(platform);
        
        try {
            // Try to extract library from JAR to a temporary file
            File tempFile = extractLibraryFromJar(libraryPath, platform.extension);
            System.load(tempFile.getAbsolutePath());
            loaded = true;
        } catch (IOException e) {
            throw new LibraryNotFoundException(
                "Failed to extract and load native library: " + libraryPath, e);
        } catch (UnsatisfiedLinkError e) {
            throw new LibraryNotFoundException(
                "Failed to load native library: " + libraryPath + 
                ". The library may be incompatible with your system.", e);
        }
    }
    
    /**
     * Detect the current platform (OS and architecture).
     *
     * @return Platform information
     * @throws LibraryNotFoundException if the platform is unsupported
     */
    private static Platform detectPlatform() throws LibraryNotFoundException {
        String osName = System.getProperty("os.name").toLowerCase();
        String osArch = System.getProperty("os.arch").toLowerCase();
        
        String os;
        String extension;
        
        if (osName.contains("linux")) {
            os = "linux";
            extension = ".so";
        } else if (osName.contains("mac") || osName.contains("darwin")) {
            os = "darwin";
            extension = ".dylib";
        } else if (osName.contains("windows")) {
            os = "windows";
            extension = ".dll";
        } else {
            throw new LibraryNotFoundException("Unsupported operating system: " + osName);
        }
        
        // Normalize architecture name
        String arch = normalizeArch(osArch);
        
        return new Platform(os, arch, extension);
    }
    
    /**
     * Normalize architecture name to match library naming.
     *
     * @param arch Raw architecture string from system property
     * @return Normalized architecture name
     */
    private static String normalizeArch(String arch) {
        if (arch.equals("x86_64") || arch.equals("amd64")) {
            return "x86_64";
        } else if (arch.equals("aarch64") || arch.equals("arm64")) {
            return "arm64";
        } else if (arch.equals("armv7") || arch.equals("armv7l")) {
            return "armv7";
        } else if (arch.equals("x86") || arch.equals("i386") || arch.equals("i686")) {
            return "x86";
        }
        return arch;
    }
    
    /**
     * Get the library path within the JAR for the given platform.
     *
     * @param platform Platform information
     * @return Resource path to the library
     */
    private static String getLibraryPath(Platform platform) {
        String libraryName = getLibraryName(platform);
        return LIB_PREFIX + platform.os + "/" + libraryName;
    }
    
    /**
     * Get the library file name for the given platform.
     *
     * @param platform Platform information
     * @return Library file name
     */
    private static String getLibraryName(Platform platform) {
        if (platform.os.equals("windows")) {
            // Windows naming: typecast_autotag_x86_64.dll or typecast_autotag_i686.dll
            if (platform.arch.equals("x86_64")) {
                return "typecast_autotag_x86_64.dll";
            } else if (platform.arch.equals("x86")) {
                return "typecast_autotag_i686.dll";
            } else {
                return "typecast_autotag.dll";
            }
        } else if (platform.os.equals("darwin")) {
            // macOS uses universal binary
            return "libtypecast_autotag.dylib";
        } else {
            // Linux naming: libtypecast_autotag_x86_64.so, libtypecast_autotag_arm64.so, etc.
            if (platform.arch.equals("x86_64")) {
                return "libtypecast_autotag_x86_64.so";
            } else if (platform.arch.equals("arm64")) {
                return "libtypecast_autotag_arm64.so";
            } else if (platform.arch.equals("armv7")) {
                return "libtypecast_autotag_armv7.so";
            } else if (platform.arch.equals("x86")) {
                return "libtypecast_autotag_x86.so";
            } else {
                return "libtypecast_autotag.so";
            }
        }
    }
    
    /**
     * Extract the library from the JAR to a temporary file.
     *
     * @param resourcePath Path to the library within the JAR
     * @param extension File extension
     * @return Temporary file containing the extracted library
     * @throws IOException if extraction fails
     */
    private static File extractLibraryFromJar(String resourcePath, String extension) 
            throws IOException {
        InputStream in = NativeLibraryLoader.class.getResourceAsStream(resourcePath);
        
        if (in == null) {
            throw new IOException("Library not found in JAR: " + resourcePath);
        }
        
        try {
            // Create a temporary file
            Path tempFile = Files.createTempFile("typecast_autotag", extension);
            tempFile.toFile().deleteOnExit();
            
            // Copy the library from JAR to the temporary file
            Files.copy(in, tempFile, StandardCopyOption.REPLACE_EXISTING);
            
            // Make it executable on Unix-like systems
            tempFile.toFile().setExecutable(true);
            
            return tempFile.toFile();
        } finally {
            in.close();
        }
    }
}

