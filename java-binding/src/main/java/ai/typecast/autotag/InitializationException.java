package ai.typecast.autotag;

/**
 * Exception thrown when library initialization fails.
 */
public class InitializationException extends TypecastAutotagException {
    
    /**
     * Constructs a new exception with the specified detail message.
     *
     * @param message the detail message
     */
    public InitializationException(String message) {
        super(message);
    }
    
    /**
     * Constructs a new exception with the specified detail message and cause.
     *
     * @param message the detail message
     * @param cause the cause of this exception
     */
    public InitializationException(String message, Throwable cause) {
        super(message, cause);
    }
}

