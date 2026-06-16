package ai.typecast.autotag;

import org.junit.Test;
import org.junit.BeforeClass;
import org.junit.AfterClass;
import static org.junit.Assert.*;

/**
 * Unit tests for TypecastAutotag.
 * Tests both Korean and English text preprocessing functionality.
 */
public class TypecastAutotagTest {
    
    @BeforeClass
    public static void setUp() throws Exception {
        // Initialize library before running tests
        TypecastAutotag.initialize();
    }
    
    @AfterClass
    public static void tearDown() {
        // Optional cleanup after all tests
        TypecastAutotag.cleanup();
    }
    
    @Test
    public void testGetVersion() {
        String version = TypecastAutotag.getVersion();
        assertNotNull("Version should not be null", version);
        assertFalse("Version should not be empty", version.isEmpty());
        assertFalse("Version should not be 'unknown'", version.equals("unknown"));
    }
    
    @Test
    public void testAutoTag_PhoneNumber() throws Exception {
        String input = "전화번호는 010-1234-5678입니다.";
        String result = TypecastAutotag.autoTag(input);

        assertNotNull("Result should not be null", result);
        assertTrue("Result should contain converted phone number",
                   result.contains("공 . 일 . 공"));
    }
    
    @Test
    public void testAutoTag_Money() throws Exception {
        String input = "총 금액은 50000원입니다.";
        String result = TypecastAutotag.autoTag(input);
        
        assertNotNull("Result should not be null", result);
        assertTrue("Result should contain converted amount", 
                   result.contains("오만") || result.contains("만"));
    }
    
    @Test
    public void testAutoTag_Date() throws Exception {
        String input = "2024년 3월 15일";
        String result = TypecastAutotag.autoTag(input);
        
        assertNotNull("Result should not be null", result);
        assertTrue("Result should contain year", result.contains("이천이십사년"));
    }
    
    @Test
    public void testManualTag_Name() throws Exception {
        String input = "name(김철수)님 안녕하세요.";
        String result = TypecastAutotag.manualTag(input);

        assertNotNull("Result should not be null", result);
        assertTrue("Result should contain spaced name",
                   result.contains("김 . 철 . 수"));
    }
    
    @Test
    public void testManualTag_Phone() throws Exception {
        String input = "phone(010-1234-5678)로 연락주세요.";
        String result = TypecastAutotag.manualTag(input);

        assertNotNull("Result should not be null", result);
        assertTrue("Result should contain converted phone number",
                   result.contains("공 . 일 . 공"));
    }
    
    @Test
    public void testManualTag_Money() throws Exception {
        String input = "money(50000)원입니다.";
        String result = TypecastAutotag.manualTag(input);
        
        assertNotNull("Result should not be null", result);
        assertTrue("Result should contain converted amount", 
                   result.contains("오만"));
    }
    
    @Test
    public void testAutoTagWithManual() throws Exception {
        String input = "name(김철수)님, 잔액은 50000원입니다.";
        String result = TypecastAutotag.autoTagWithManual(input);

        assertNotNull("Result should not be null", result);
        assertTrue("Result should contain spaced name",
                   result.contains("김 . 철 . 수"));
        assertTrue("Result should contain converted amount",
                   result.contains("오만") || result.contains("만"));
    }
    
    @Test
    public void testAutoTag_EmptyString() throws Exception {
        String input = "";
        String result = TypecastAutotag.autoTag(input);
        
        assertNotNull("Result should not be null", result);
        assertEquals("Empty input should return empty output", "", result);
    }
    
    @Test
    public void testAutoTag_NoPatterns() throws Exception {
        String input = "안녕하세요 반갑습니다.";
        String result = TypecastAutotag.autoTag(input);
        
        assertNotNull("Result should not be null", result);
        // Should return the same text if no patterns are found
        assertEquals("Text without patterns should remain unchanged", input, result);
    }
    
    @Test(expected = IllegalArgumentException.class)
    public void testAutoTag_NullInput() throws Exception {
        TypecastAutotag.autoTag(null);
    }
    
    @Test(expected = IllegalArgumentException.class)
    public void testManualTag_NullInput() throws Exception {
        TypecastAutotag.manualTag(null);
    }
    
    @Test(expected = IllegalArgumentException.class)
    public void testAutoTagWithManual_NullInput() throws Exception {
        TypecastAutotag.autoTagWithManual(null);
    }
    
    @Test
    public void testMultiplePatterns() throws Exception {
        String input = "2024-03-15에 010-1234-5678로 50000원을 보냅니다.";
        String result = TypecastAutotag.autoTag(input);
        
        assertNotNull("Result should not be null", result);
        assertFalse("Result should be different from input", result.equals(input));
    }
    
    @Test
    public void testThreadSafety() throws Exception {
        final int threadCount = 10;
        final int iterationsPerThread = 100;
        
        Thread[] threads = new Thread[threadCount];
        final boolean[] success = new boolean[threadCount];
        
        for (int i = 0; i < threadCount; i++) {
            final int threadIndex = i;
            threads[i] = new Thread(new Runnable() {
                @Override
                public void run() {
                    try {
                        for (int j = 0; j < iterationsPerThread; j++) {
                            String input = "전화번호는 010-1234-5678입니다.";
                            String result = TypecastAutotag.autoTag(input);
                            assertNotNull("Result should not be null", result);
                        }
                        success[threadIndex] = true;
                    } catch (Exception e) {
                        e.printStackTrace();
                        success[threadIndex] = false;
                    }
                }
            });
            threads[i].start();
        }
        
        // Wait for all threads to complete
        for (Thread thread : threads) {
            thread.join();
        }
        
        // Check that all threads succeeded
        for (int i = 0; i < threadCount; i++) {
            assertTrue("Thread " + i + " should succeed", success[i]);
        }
    }
    
    @Test
    public void testInitializeMultipleTimes() throws Exception {
        // Should be safe to call multiple times
        TypecastAutotag.initialize();
        TypecastAutotag.initialize();
        TypecastAutotag.initialize();
        
        // Should still work after multiple initializations
        String result = TypecastAutotag.autoTag("010-1234-5678");
        assertNotNull("Result should not be null", result);
    }
    
    // ========================================
    // English Language Tests
    // ========================================
    
    @Test
    public void testAutoTagEn_PhoneNumber() throws Exception {
        String input = "Call me at 555-123-4567.";
        String result = TypecastAutotag.autoTagEn(input);
        
        assertNotNull("Result should not be null", result);
        assertTrue("Result should contain converted phone number", 
                   result.toLowerCase().contains("five"));
    }
    
    @Test
    public void testAutoTagEn_Money() throws Exception {
        String input = "Total is $500.";
        String result = TypecastAutotag.autoTagEn(input);
        
        assertNotNull("Result should not be null", result);
        assertTrue("Result should contain converted amount", 
                   result.toLowerCase().contains("hundred") || result.toLowerCase().contains("dollars"));
    }
    
    @Test
    public void testAutoTagEn_Date() throws Exception {
        String input = "Date is January 15, 2024.";
        String result = TypecastAutotag.autoTagEn(input);
        
        assertNotNull("Result should not be null", result);
        assertTrue("Result should contain date", 
                   result.contains("January") || result.toLowerCase().contains("fifteen"));
    }
    
    @Test
    public void testAutoTagEn_Time() throws Exception {
        String input = "Meeting at 2:30 PM.";
        String result = TypecastAutotag.autoTagEn(input);
        
        assertNotNull("Result should not be null", result);
        assertTrue("Result should contain time", 
                   result.toLowerCase().contains("two") || result.toLowerCase().contains("thirty") || result.contains("PM"));
    }
    
    @Test
    public void testManualTagEn_Name() throws Exception {
        String input = "name(John) hello.";
        String result = TypecastAutotag.manualTagEn(input);
        
        assertNotNull("Result should not be null", result);
        assertTrue("Result should contain spelled name", 
                   result.contains("J") || result.contains("O"));
    }
    
    @Test
    public void testManualTagEn_Digits() throws Exception {
        String input = "digits(123) is the code.";
        String result = TypecastAutotag.manualTagEn(input);
        
        assertNotNull("Result should not be null", result);
        assertTrue("Result should contain spelled digits", 
                   result.toLowerCase().contains("one") && result.toLowerCase().contains("two"));
    }
    
    @Test
    public void testAutoTagWithManualEn() throws Exception {
        String input = "name(John), balance is $500.";
        String result = TypecastAutotag.autoTagWithManualEn(input);
        
        assertNotNull("Result should not be null", result);
        // Name should be processed manually, money processed automatically
        assertTrue("Result should contain converted amount", 
                   result.toLowerCase().contains("hundred") || result.toLowerCase().contains("dollars"));
    }
    
    @Test
    public void testAutoTagEn_EmptyString() throws Exception {
        String input = "";
        String result = TypecastAutotag.autoTagEn(input);
        
        assertNotNull("Result should not be null", result);
        assertEquals("Empty input should return empty output", "", result);
    }
    
    @Test
    public void testAutoTagEn_NoPatterns() throws Exception {
        String input = "Hello world.";
        String result = TypecastAutotag.autoTagEn(input);
        
        assertNotNull("Result should not be null", result);
        // Should return similar text if no patterns are found
        assertTrue("Text without patterns should remain similar", result.contains("Hello"));
    }
    
    @Test(expected = IllegalArgumentException.class)
    public void testAutoTagEn_NullInput() throws Exception {
        TypecastAutotag.autoTagEn(null);
    }
    
    @Test(expected = IllegalArgumentException.class)
    public void testManualTagEn_NullInput() throws Exception {
        TypecastAutotag.manualTagEn(null);
    }
}
