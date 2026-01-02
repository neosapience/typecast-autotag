package ai.typecast.autotag;

/**
 * Exception thrown when text conversion fails.
 */
public class ConversionException extends TypecastAutotagException {
    
    /**
     * Constructs a new exception with the specified detail message.
     *
     * @param message the detail message
     */
    public ConversionException(String message) {
        super(message);
    }
    
    /**
     * Constructs a new exception with the specified detail message and cause.
     *
     * @param message the detail message
     * @param cause the cause of this exception
     */
    public ConversionException(String message, Throwable cause) {
        super(message, cause);
    }
}

