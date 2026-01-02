package ai.typecast.autotag;

/**
 * Exception thrown when the native library cannot be found or loaded.
 */
public class LibraryNotFoundException extends TypecastAutotagException {
    
    /**
     * Constructs a new exception with the specified detail message.
     *
     * @param message the detail message
     */
    public LibraryNotFoundException(String message) {
        super(message);
    }
    
    /**
     * Constructs a new exception with the specified detail message and cause.
     *
     * @param message the detail message
     * @param cause the cause of this exception
     */
    public LibraryNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}

