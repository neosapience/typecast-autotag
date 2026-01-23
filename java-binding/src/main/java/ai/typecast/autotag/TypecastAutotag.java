package ai.typecast.autotag;

/**
 * Typecast Autotag library for Java.
 * 
 * <p>TTS (Text-to-Speech) text preprocessing library that converts phone numbers,
 * dates, amounts, and other patterns into formats suitable for Korean speech synthesis.
 * 
 * <h2>Features</h2>
 * <ul>
 *   <li><b>Easy to use</b>: Complete functionality with just 3 main functions</li>
 *   <li><b>Flexible approach</b>: Supports fully automatic, manual tags, and hybrid modes</li>
 *   <li><b>Wide pattern support</b>: Automatically recognizes 35+ patterns including phone numbers, dates, times, amounts, order, etc.</li>
 *   <li><b>Cross-platform</b>: Supports Linux, Windows, and macOS</li>
 * </ul>
 * 
 * <h2>Quick Start</h2>
 * <pre>{@code
 * // Automatic pattern recognition and conversion
 * String result = TypecastAutotag.autoTag("전화번호는 010-1234-5678입니다.");
 * System.out.println(result); 
 * // Output: "전화번호는 공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔입니다."
 * 
 * String result2 = TypecastAutotag.autoTag("총 금액은 1500000원입니다.");
 * System.out.println(result2);
 * // Output: "총 금액은 백오십만 원입니다."
 * }</pre>
 * 
 * <h2>Usage Scenarios</h2>
 * <table border="1" summary="Comparison of usage scenarios">
 *   <caption>Method Comparison</caption>
 *   <tr>
 *     <th>Method</th>
 *     <th>Description</th>
 *     <th>Use Case</th>
 *   </tr>
 *   <tr>
 *     <td>{@link #autoTag(String)}</td>
 *     <td>Fully automatic</td>
 *     <td>When you want all patterns processed automatically</td>
 *   </tr>
 *   <tr>
 *     <td>{@link #manualTag(String)}</td>
 *     <td>Manual tags only</td>
 *     <td>Legacy system compatibility, explicit control needed</td>
 *   </tr>
 *   <tr>
 *     <td>{@link #autoTagWithManual(String)}</td>
 *     <td>Hybrid</td>
 *     <td>Mostly automatic + supplement with manual tags</td>
 *   </tr>
 * </table>
 * 
 * <h2>Thread Safety</h2>
 * <p>This class is thread-safe. The library is automatically initialized on first use
 * and can be safely called from multiple threads concurrently.
 * 
 * @since 1.3.0
 */
public final class TypecastAutotag {
    
    private static final Object LOCK = new Object();
    private static boolean initialized = false;
    
    // Load native library on class load
    static {
        try {
            NativeLibraryLoader.loadLibrary();
        } catch (LibraryNotFoundException e) {
            throw new ExceptionInInitializerError(e);
        }
    }
    
    // Private constructor to prevent instantiation
    private TypecastAutotag() {
        throw new AssertionError("Cannot instantiate utility class");
    }
    
    /**
     * Initialize the library.
     * 
     * <p>This method is called automatically on first use of any conversion function.
     * It is safe to call multiple times - subsequent calls are no-ops.
     * 
     * @throws InitializationException if initialization fails
     */
    public static void initialize() throws InitializationException {
        if (initialized) {
            return;
        }
        
        synchronized (LOCK) {
            if (initialized) {
                return;
            }
            
            int result = nativeInit();
            if (result != 0) {
                throw new InitializationException("Failed to initialize Typecast Autotag library");
            }
            
            initialized = true;
        }
    }
    
    /**
     * Clean up library resources.
     * 
     * <p>Call this when you're done using the library.
     * After calling this, you must call {@link #initialize()} again before
     * using conversion functions.
     * 
     * <p><b>Note:</b> In most applications, you don't need to call this method
     * as resources will be cleaned up when the JVM exits.
     */
    public static void cleanup() {
        synchronized (LOCK) {
            if (!initialized) {
                return;
            }
            
            nativeCleanup();
            initialized = false;
        }
    }
    
    /**
     * Automatically recognize and convert patterns in text.
     * 
     * <p>This is the most convenient method and sufficient for most cases.
     * Automatically recognizes and converts the following patterns:
     * 
     * <h3>Supported Patterns:</h3>
     * <ul>
     *   <li>Phone numbers: {@code 010-1234-5678}, {@code 02-123-4567}, {@code 1588-1234}</li>
     *   <li>Money: {@code 50000원}, {@code 1500만원}, {@code ₩10000}</li>
     *   <li>Dates: {@code 2024-03-15}, {@code 2024년 3월 15일}, {@code 20240315}</li>
     *   <li>Time: {@code 14:30}, {@code 오후 2시 30분}</li>
     *   <li>Order: {@code 1등}, {@code 3번째}, {@code 5위}</li>
     *   <li>Ratio: {@code 30%}, {@code 3:7}</li>
     *   <li>Period: {@code 3개월}, {@code 2년}, {@code 5일간}</li>
     *   <li>Floor: {@code 지하 2층}, {@code 5층}, {@code B1층}</li>
     *   <li>Others: scores, area, distance, weight, mileage, etc.</li>
     * </ul>
     * 
     * @param text Korean text to process (UTF-8)
     * @return Processed text suitable for TTS
     * @throws InitializationException if library is not initialized and auto-init fails
     * @throws ConversionException if conversion fails
     * @throws IllegalArgumentException if text is null
     * 
     * <p>Example:
     * <pre>{@code
     * String result = TypecastAutotag.autoTag("전화번호는 010-1234-5678입니다.");
     * // Output: "전화번호는 공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔입니다."
     * }</pre>
     */
    public static String autoTag(String text) throws InitializationException, ConversionException {
        if (text == null) {
            throw new IllegalArgumentException("Text cannot be null");
        }
        
        ensureInitialized();
        
        String result = nativeAutoTag(text);
        if (result == null) {
            throw new ConversionException("auto_tag conversion failed");
        }
        
        return result;
    }
    
    /**
     * Process manual tags first, then apply auto tagging.
     * 
     * <p>Use this when you want automatic processing for most patterns,
     * but need to explicitly specify certain patterns that are hard to
     * recognize automatically (like names).
     * 
     * <p><b>Manual tag format:</b> {@code tagName(value)}
     * 
     * @param text Korean text with optional manual tags (UTF-8)
     * @return Processed text suitable for TTS
     * @throws InitializationException if library is not initialized and auto-init fails
     * @throws ConversionException if conversion fails
     * @throws IllegalArgumentException if text is null
     * 
     * <p>Example:
     * <pre>{@code
     * String result = TypecastAutotag.autoTagWithManual("name(김철수)님, 잔액은 50000원입니다.");
     * // Output: "김 철 수님, 잔액은 오만 원입니다."
     * }</pre>
     */
    public static String autoTagWithManual(String text) 
            throws InitializationException, ConversionException {
        if (text == null) {
            throw new IllegalArgumentException("Text cannot be null");
        }
        
        ensureInitialized();
        
        String result = nativeAutoTagWithManual(text);
        if (result == null) {
            throw new ConversionException("auto_tag_with_manual conversion failed");
        }
        
        return result;
    }
    
    /**
     * Process only explicitly specified manual tags.
     * 
     * <p>Use this for legacy system compatibility or when you need
     * explicit control over all conversions.
     * 
     * <h3>Supported Tags (37 total):</h3>
     * <table border="1" summary="Supported manual tags">
     *   <caption>Manual Tag Reference</caption>
     *   <tr><th>Tag</th><th>Description</th><th>Example</th></tr>
     *   <tr><td>name(이름)</td><td>Name reading</td><td>{@code name(김철수)} → 김 철 수</td></tr>
     *   <tr><td>phone(번호)</td><td>Phone number</td><td>{@code phone(010-1234-5678)} → 공 일 공 다시...</td></tr>
     *   <tr><td>money(금액)</td><td>Amount</td><td>{@code money(50000)} → 오만 원</td></tr>
     *   <tr><td>date(날짜)</td><td>Date</td><td>{@code date(2024-03-15)} → 이천이십사년 삼 월 십오 일</td></tr>
     *   <tr><td>time(시간)</td><td>Time</td><td>{@code time(14:30)} → 오후 두 시 삼십 분</td></tr>
     *   <tr><td>year(연도)</td><td>Year</td><td>{@code year(2024)} → 이천이십사년</td></tr>
     *   <tr><td>month(월)</td><td>Month</td><td>{@code month(3)} → 삼월</td></tr>
     *   <tr><td>day(일)</td><td>Day</td><td>{@code day(15)} → 십오일</td></tr>
     *   <tr><td>order(순서)</td><td>Ordinal</td><td>{@code order(3)} → 세 번째</td></tr>
     *   <tr><td>digits(숫자)</td><td>Read digits one by one</td><td>{@code digits(123)} → 일 이 삼</td></tr>
     *   <tr><td colspan="3">...and many more</td></tr>
     * </table>
     * 
     * @param text Korean text with manual tags (UTF-8)
     * @return Processed text suitable for TTS
     * @throws InitializationException if library is not initialized and auto-init fails
     * @throws ConversionException if conversion fails
     * @throws IllegalArgumentException if text is null
     * 
     * <p>Example:
     * <pre>{@code
     * String result = TypecastAutotag.manualTag("phone(010-1234-5678)로 연락주세요.");
     * // Output: "공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔로 연락주세요."
     * }</pre>
     */
    public static String manualTag(String text) 
            throws InitializationException, ConversionException {
        if (text == null) {
            throw new IllegalArgumentException("Text cannot be null");
        }
        
        ensureInitialized();
        
        String result = nativeManualTag(text);
        if (result == null) {
            throw new ConversionException("manual_tag conversion failed");
        }
        
        return result;
    }
    
    // ============================================
    // English Language Methods
    // ============================================
    
    /**
     * Automatically recognize and convert patterns in English text.
     * 
     * <p>Automatically recognizes and converts the following patterns:
     * 
     * <ul>
     *   <li>Phone numbers: {@code 555-123-4567} → five five five, one two three, four five six seven</li>
     *   <li>Money: {@code $1,500} → one thousand five hundred dollars</li>
     *   <li>Dates: {@code 01/15/2024} → January fifteenth, twenty twenty-four</li>
     *   <li>Time: {@code 2:30 PM} → two thirty PM</li>
     *   <li>Others: ordinals, percentages, etc.</li>
     * </ul>
     * 
     * @param text English text to process (UTF-8)
     * @return Processed text suitable for TTS
     * @throws InitializationException if library is not initialized and auto-init fails
     * @throws ConversionException if conversion fails
     * @throws IllegalArgumentException if text is null
     * 
     * <p>Example:
     * <pre>{@code
     * String result = TypecastAutotag.autoTagEn("Call me at 555-123-4567.");
     * // Output: "Call me at five five five, one two three, four five six seven."
     * }</pre>
     */
    public static String autoTagEn(String text) throws InitializationException, ConversionException {
        if (text == null) {
            throw new IllegalArgumentException("Text cannot be null");
        }
        
        ensureInitialized();
        
        String result = nativeAutoTagEn(text);
        if (result == null) {
            throw new ConversionException("auto_tag_english conversion failed");
        }
        
        return result;
    }
    
    /**
     * Process manual tags first, then apply auto tagging for English.
     * 
     * @param text English text with optional manual tags (UTF-8)
     * @return Processed text suitable for TTS
     * @throws InitializationException if library is not initialized and auto-init fails
     * @throws ConversionException if conversion fails
     * @throws IllegalArgumentException if text is null
     * 
     * <p>Example:
     * <pre>{@code
     * String result = TypecastAutotag.autoTagWithManualEn("name(John Smith), your balance is $500.");
     * // Output: "John Smith, your balance is five hundred dollars."
     * }</pre>
     */
    public static String autoTagWithManualEn(String text) 
            throws InitializationException, ConversionException {
        if (text == null) {
            throw new IllegalArgumentException("Text cannot be null");
        }
        
        ensureInitialized();
        
        String result = nativeAutoTagWithManualEn(text);
        if (result == null) {
            throw new ConversionException("auto_tag_with_manual_english conversion failed");
        }
        
        return result;
    }
    
    /**
     * Process only explicitly specified manual tags for English.
     * 
     * @param text English text with manual tags (UTF-8)
     * @return Processed text suitable for TTS
     * @throws InitializationException if library is not initialized and auto-init fails
     * @throws ConversionException if conversion fails
     * @throws IllegalArgumentException if text is null
     * 
     * <p>Example:
     * <pre>{@code
     * String result = TypecastAutotag.manualTagEn("phone(555-123-4567) is my number.");
     * // Output: "five five five, one two three, four five six seven is my number."
     * }</pre>
     */
    public static String manualTagEn(String text) 
            throws InitializationException, ConversionException {
        if (text == null) {
            throw new IllegalArgumentException("Text cannot be null");
        }
        
        ensureInitialized();
        
        String result = nativeManualTagEn(text);
        if (result == null) {
            throw new ConversionException("manual_tag_english conversion failed");
        }
        
        return result;
    }
    
    /**
     * Get the library version.
     * 
     * @return Version string of the native library
     */
    public static String getVersion() {
        String version = nativeVersion();
        return version != null ? version : "unknown";
    }
    
    /**
     * Ensure the library is initialized.
     * 
     * @throws InitializationException if initialization fails
     */
    private static void ensureInitialized() throws InitializationException {
        if (!initialized) {
            initialize();
        }
    }
    
    // Native method declarations
    
    /**
     * Native method to initialize the library.
     * 
     * @return 0 on success, -1 on failure
     */
    private static native int nativeInit();
    
    /**
     * Native method to clean up the library.
     */
    private static native void nativeCleanup();
    
    /**
     * Native method for auto tagging.
     * 
     * @param text Text to process
     * @return Processed text, or null on failure
     */
    private static native String nativeAutoTag(String text);
    
    /**
     * Native method for auto tagging with manual tags.
     * 
     * @param text Text to process
     * @return Processed text, or null on failure
     */
    private static native String nativeAutoTagWithManual(String text);
    
    /**
     * Native method for manual tag processing.
     * 
     * @param text Text to process
     * @return Processed text, or null on failure
     */
    private static native String nativeManualTag(String text);
    
    /**
     * Native method to get library version.
     * 
     * @return Version string
     */
    private static native String nativeVersion();
    
    // English native methods
    
    /**
     * Native method for auto tagging English text.
     * 
     * @param text Text to process
     * @return Processed text, or null on failure
     */
    private static native String nativeAutoTagEn(String text);
    
    /**
     * Native method for auto tagging with manual tags for English.
     * 
     * @param text Text to process
     * @return Processed text, or null on failure
     */
    private static native String nativeAutoTagWithManualEn(String text);
    
    /**
     * Native method for manual tag processing for English.
     * 
     * @param text Text to process
     * @return Processed text, or null on failure
     */
    private static native String nativeManualTagEn(String text);
}

