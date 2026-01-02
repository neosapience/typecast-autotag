package ai.typecast.autotag;

/**
 * Base exception class for Typecast Autotag library errors.
 */
public class TypecastAutotagException extends Exception {
    
    /**
     * Constructs a new exception with the specified detail message.
     *
     * @param message the detail message
     */
    public TypecastAutotagException(String message) {
        super(message);
    }
    
    /**
     * Constructs a new exception with the specified detail message and cause.
     *
     * @param message the detail message
     * @param cause the cause of this exception
     */
    public TypecastAutotagException(String message, Throwable cause) {
        super(message, cause);
    }
}

