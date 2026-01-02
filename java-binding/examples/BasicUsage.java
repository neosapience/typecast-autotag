import ai.typecast.autotag.*;

/**
 * Basic usage examples for Typecast Autotag library.
 */
public class BasicUsage {
    
    public static void main(String[] args) {
        System.out.println("Typecast Autotag Java Binding - Basic Usage Examples");
        System.out.println("Library Version: " + TypecastAutotag.getVersion());
        System.out.println("=".repeat(60));
        System.out.println();
        
        try {
            // Example 1: Auto Tag - Phone Number
            System.out.println("Example 1: Auto Tag - Phone Number");
            String phoneText = "전화번호는 010-1234-5678입니다.";
            String phoneResult = TypecastAutotag.autoTag(phoneText);
            System.out.println("Input:  " + phoneText);
            System.out.println("Output: " + phoneResult);
            System.out.println();
            
            // Example 2: Auto Tag - Money
            System.out.println("Example 2: Auto Tag - Money");
            String moneyText = "총 금액은 1500000원입니다.";
            String moneyResult = TypecastAutotag.autoTag(moneyText);
            System.out.println("Input:  " + moneyText);
            System.out.println("Output: " + moneyResult);
            System.out.println();
            
            // Example 3: Auto Tag - Date and Time
            System.out.println("Example 3: Auto Tag - Date and Time");
            String dateTimeText = "회의는 2024-03-15 14:30에 시작합니다.";
            String dateTimeResult = TypecastAutotag.autoTag(dateTimeText);
            System.out.println("Input:  " + dateTimeText);
            System.out.println("Output: " + dateTimeResult);
            System.out.println();
            
            // Example 4: Manual Tag - Name
            System.out.println("Example 4: Manual Tag - Name");
            String nameText = "name(김철수)님 안녕하세요.";
            String nameResult = TypecastAutotag.manualTag(nameText);
            System.out.println("Input:  " + nameText);
            System.out.println("Output: " + nameResult);
            System.out.println();
            
            // Example 5: Manual Tag - Phone
            System.out.println("Example 5: Manual Tag - Phone");
            String manualPhoneText = "phone(010-1234-5678)로 연락주세요.";
            String manualPhoneResult = TypecastAutotag.manualTag(manualPhoneText);
            System.out.println("Input:  " + manualPhoneText);
            System.out.println("Output: " + manualPhoneResult);
            System.out.println();
            
            // Example 6: Hybrid - Auto Tag with Manual Tags
            System.out.println("Example 6: Hybrid - Auto Tag with Manual Tags");
            String hybridText = "name(김철수)님, 잔액은 50000원입니다.";
            String hybridResult = TypecastAutotag.autoTagWithManual(hybridText);
            System.out.println("Input:  " + hybridText);
            System.out.println("Output: " + hybridResult);
            System.out.println();
            
            // Example 7: Multiple patterns in one text
            System.out.println("Example 7: Multiple patterns in one text");
            String complexText = "2024년 3월 15일 오후 2시 30분에 02-1234-5678로 전화하여 " +
                                "50000원을 입금해주세요.";
            String complexResult = TypecastAutotag.autoTag(complexText);
            System.out.println("Input:  " + complexText);
            System.out.println("Output: " + complexResult);
            System.out.println();
            
            System.out.println("=".repeat(60));
            System.out.println("✓ All examples completed successfully!");
            
        } catch (InitializationException e) {
            System.err.println("Failed to initialize library: " + e.getMessage());
            e.printStackTrace();
        } catch (ConversionException e) {
            System.err.println("Conversion failed: " + e.getMessage());
            e.printStackTrace();
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
            e.printStackTrace();
        } finally {
            // Optional: cleanup (usually not needed)
            // TypecastAutotag.cleanup();
        }
    }
}

