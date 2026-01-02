"""
Tests for Typecast Autotag Python binding.

These tests verify that the Python binding correctly wraps the native library
and produces the expected output for Korean TTS preprocessing.
"""

import pytest
from typecast_autotag import (
    initialize,
    cleanup,
    auto_tag,
    auto_tag_with_manual,
    manual_tag,
    version,
    TypecastAutotag,
    TypecastAutotagError,
    LibraryNotFoundError,
    InitializationError,
    ConversionError,
)


class TestInitializationCleanup:
    """Tests for library initialization and cleanup."""
    
    def test_initialize(self):
        """Test that initialize() works without error."""
        initialize()
        # Should not raise
    
    def test_initialize_idempotent(self):
        """Test that initialize() can be called multiple times."""
        initialize()
        initialize()
        initialize()
        # Should not raise
    
    def test_version(self):
        """Test that version() returns a valid version string."""
        v = version()
        assert isinstance(v, str)
        assert len(v) > 0
        # Version should match pattern like "1.0.0"
        parts = v.split(".")
        assert len(parts) >= 2


class TestAutoTag:
    """Tests for auto_tag() function."""
    
    def setup_method(self):
        """Initialize library before each test."""
        initialize()
    
    def test_phone_number(self):
        """Test phone number conversion."""
        result = auto_tag("전화번호는 010-1234-5678입니다.")
        assert "공" in result or "영" in result
        assert "다시" in result
    
    def test_money(self):
        """Test money amount conversion."""
        result = auto_tag("총 금액은 50000원입니다.")
        assert "오만" in result or "만" in result
    
    def test_date(self):
        """Test date conversion."""
        result = auto_tag("날짜는 2024-03-15입니다.")
        assert "년" in result or "월" in result or "일" in result
    
    def test_time(self):
        """Test time conversion."""
        result = auto_tag("시간은 14:30입니다.")
        assert "시" in result or "분" in result
    
    def test_empty_string(self):
        """Test empty string input."""
        result = auto_tag("")
        assert result == ""
    
    def test_plain_text(self):
        """Test text with no patterns to convert."""
        result = auto_tag("안녕하세요")
        assert result == "안녕하세요"
    
    def test_unicode(self):
        """Test proper Unicode handling."""
        result = auto_tag("한글 테스트입니다")
        assert "한글" in result


class TestManualTag:
    """Tests for manual_tag() function."""
    
    def setup_method(self):
        """Initialize library before each test."""
        initialize()
    
    def test_name_tag(self):
        """Test name tag conversion."""
        result = manual_tag("name(김철수)님 안녕하세요.")
        # Name should be split with spaces
        assert "김" in result
        assert "철" in result
        assert "수" in result
    
    def test_phone_tag(self):
        """Test phone tag conversion."""
        result = manual_tag("phone(010-1234-5678)로 연락주세요.")
        assert "공" in result or "영" in result
        assert "다시" in result
    
    def test_money_tag(self):
        """Test money tag conversion."""
        result = manual_tag("금액은 money(50000)입니다.")
        assert "오만" in result or "만" in result
    
    def test_date_tag(self):
        """Test date tag conversion."""
        result = manual_tag("date(2024-03-15)에 만나요.")
        assert "년" in result or "월" in result
    
    def test_time_tag(self):
        """Test time tag conversion."""
        result = manual_tag("time(14:30)에 회의합니다.")
        assert "시" in result or "분" in result
    
    def test_year_tag(self):
        """Test year tag conversion."""
        result = manual_tag("year(2024)년도입니다.")
        assert "이천" in result or "년" in result
    
    def test_month_tag(self):
        """Test month tag conversion."""
        result = manual_tag("month(3)입니다.")
        assert "삼" in result or "월" in result
    
    def test_day_tag(self):
        """Test day tag conversion."""
        result = manual_tag("day(15)입니다.")
        assert "십오" in result or "일" in result
    
    def test_order_tag(self):
        """Test order tag conversion."""
        result = manual_tag("order(3) 우승자입니다.")
        assert "세" in result or "번째" in result
    
    def test_digits_tag(self):
        """Test digits tag conversion."""
        result = manual_tag("digits(123) 번호입니다.")
        assert "일" in result
        assert "이" in result
        assert "삼" in result
    
    def test_point_tag(self):
        """Test point tag conversion."""
        result = manual_tag("point(95)입니다.")
        assert "점" in result or "구십오" in result
    
    def test_piece_tag(self):
        """Test piece tag conversion."""
        result = manual_tag("piece(3) 있습니다.")
        assert "개" in result or "세" in result
    
    def test_no_tags(self):
        """Test text with no tags."""
        result = manual_tag("안녕하세요")
        assert result == "안녕하세요"


class TestAutoTagWithManual:
    """Tests for auto_tag_with_manual() function."""
    
    def setup_method(self):
        """Initialize library before each test."""
        initialize()
    
    def test_mixed_name_and_money(self):
        """Test manual name tag with auto money detection."""
        result = auto_tag_with_manual("name(김철수)님, 잔액은 50000원입니다.")
        # Name should be processed manually
        assert "김" in result
        # Money should be processed automatically
        assert "오만" in result or "만" in result
    
    def test_mixed_name_and_phone(self):
        """Test manual name tag with auto phone detection."""
        result = auto_tag_with_manual("name(홍길동)님, 연락처는 010-1234-5678입니다.")
        assert "홍" in result
        assert "다시" in result  # Phone number separator
    
    def test_all_manual(self):
        """Test with all manual tags."""
        result = auto_tag_with_manual("phone(02-123-4567)로 연락주세요.")
        assert "다시" in result
    
    def test_all_auto(self):
        """Test with no manual tags."""
        result = auto_tag_with_manual("금액은 50000원입니다.")
        assert "오만" in result or "만" in result


class TestContextManager:
    """Tests for TypecastAutotag context manager."""
    
    def test_context_manager(self):
        """Test using TypecastAutotag as context manager."""
        with TypecastAutotag() as tagger:
            result = tagger.auto_tag("전화번호는 010-1234-5678입니다.")
            assert "다시" in result
    
    def test_context_manager_manual_tag(self):
        """Test manual_tag through context manager."""
        with TypecastAutotag() as tagger:
            result = tagger.manual_tag("name(김철수)님")
            assert "김" in result
    
    def test_context_manager_version(self):
        """Test version through context manager."""
        with TypecastAutotag() as tagger:
            result = tagger.version()
            assert isinstance(result, str)
    
    def test_context_manager_with_cleanup(self):
        """Test that context manager properly cleans up when requested."""
        with TypecastAutotag(cleanup_on_exit=True) as tagger:
            result = tagger.version()
            assert isinstance(result, str)
        # After exiting with cleanup_on_exit=True, resources are cleaned up
        # Re-initialize for subsequent tests
        initialize()


class TestExceptionTypes:
    """Tests for exception hierarchy."""
    
    def test_exception_hierarchy(self):
        """Test that exceptions have proper hierarchy."""
        assert issubclass(LibraryNotFoundError, TypecastAutotagError)
        assert issubclass(InitializationError, TypecastAutotagError)
        assert issubclass(ConversionError, TypecastAutotagError)
        assert issubclass(TypecastAutotagError, Exception)


class TestEdgeCases:
    """Tests for edge cases."""
    
    def setup_method(self):
        """Initialize library before each test."""
        initialize()
    
    def test_long_text(self):
        """Test with long text."""
        text = "안녕하세요. " * 100
        result = auto_tag(text)
        assert len(result) > 0
    
    def test_special_characters(self):
        """Test with special characters."""
        result = auto_tag("특수문자: !@#$%^&*()")
        assert "특수문자" in result
    
    def test_mixed_scripts(self):
        """Test with mixed Korean, English, and numbers."""
        result = auto_tag("Hello 안녕 123")
        assert "Hello" in result or "헬로" in result
        assert "안녕" in result
    
    def test_newlines(self):
        """Test with newlines in text."""
        result = auto_tag("첫 번째 줄\n두 번째 줄")
        assert "줄" in result


# Additional comprehensive tests for all manual tags
class TestAllManualTags:
    """Comprehensive tests for all 37 manual tags."""
    
    def setup_method(self):
        """Initialize library before each test."""
        initialize()
    
    def test_datetime_tag(self):
        """Test datetime tag."""
        result = manual_tag("datetime(2024-03-15T14:30)")
        assert "년" in result or "시" in result
    
    def test_minsec_tag(self):
        """Test minsec tag."""
        result = manual_tag("minsec(5m30s)")
        assert "분" in result or "초" in result
    
    def test_ratio_tag(self):
        """Test ratio tag."""
        result = manual_tag("ratio(30%)")
        assert "퍼센트" in result or "삼십" in result
    
    def test_floor_tag(self):
        """Test floor tag."""
        result = manual_tag("floor(B2)층입니다.")
        assert "지하" in result or "층" in result
    
    def test_account_tag(self):
        """Test account tag."""
        result = manual_tag("account(110-123-456789)")
        assert len(result) > 0
    
    def test_weight_tag(self):
        """Test weight tag."""
        result = manual_tag("weight(5kg)")
        assert "킬로그램" in result or "킬로" in result
    
    def test_distance_tag(self):
        """Test distance tag."""
        result = manual_tag("distance(5km)")
        assert "킬로미터" in result or "킬로" in result
    
    def test_temperature_tag(self):
        """Test temperature tag."""
        result = manual_tag("temperature(25℃)")
        assert "도" in result
    
    def test_volume_tag(self):
        """Test volume tag."""
        result = manual_tag("volume(500ml)")
        assert "밀리리터" in result or "미리" in result

