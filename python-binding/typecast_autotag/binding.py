"""
Typecast Autotag Python Binding

ctypes-based bindings for the Typecast Autotag C library.
Provides TTS text preprocessing functionality for Korean text.
"""

import ctypes
import os
import sys
import platform
from pathlib import Path
from typing import Optional
from functools import lru_cache


class TypecastAutotagError(Exception):
    """Base exception for Typecast Autotag errors."""
    pass


class LibraryNotFoundError(TypecastAutotagError):
    """Raised when the native library cannot be found."""
    pass


class InitializationError(TypecastAutotagError):
    """Raised when library initialization fails."""
    pass


class ConversionError(TypecastAutotagError):
    """Raised when text conversion fails."""
    pass


@lru_cache(maxsize=1)
def _get_library_path() -> Path:
    """
    Get the path to the native library based on the current platform.
    
    Returns:
        Path to the native library file.
        
    Raises:
        LibraryNotFoundError: If the library cannot be found.
    """
    system = platform.system().lower()
    machine = platform.machine().lower()
    
    # Determine library directory
    lib_dir = Path(__file__).parent / "lib"
    
    if system == "linux":
        platform_dir = lib_dir / "linux"
        # Try architecture-specific first, then generic
        arch_map = {
            "x86_64": "libtypecast_autotag_x86_64.so",
            "amd64": "libtypecast_autotag_x86_64.so",
            "aarch64": "libtypecast_autotag_arm64.so",
            "arm64": "libtypecast_autotag_arm64.so",
            "armv7l": "libtypecast_autotag_armv7.so",
            "i686": "libtypecast_autotag_x86.so",
            "i386": "libtypecast_autotag_x86.so",
        }
        lib_name = arch_map.get(machine, "libtypecast_autotag.so")
        lib_path = platform_dir / lib_name
        if not lib_path.exists():
            lib_path = platform_dir / "libtypecast_autotag.so"
            
    elif system == "darwin":
        platform_dir = lib_dir / "darwin"
        lib_path = platform_dir / "libtypecast_autotag.dylib"
        
    elif system == "windows":
        platform_dir = lib_dir / "windows"
        arch_map = {
            "amd64": "typecast_autotag_x86_64.dll",
            "x86_64": "typecast_autotag_x86_64.dll",
            "x86": "typecast_autotag_i686.dll",
            "i686": "typecast_autotag_i686.dll",
        }
        lib_name = arch_map.get(machine, "typecast_autotag.dll")
        lib_path = platform_dir / lib_name
        if not lib_path.exists():
            lib_path = platform_dir / "typecast_autotag.dll"
    else:
        raise LibraryNotFoundError(f"Unsupported platform: {system}")
    
    if not lib_path.exists():
        raise LibraryNotFoundError(
            f"Native library not found at {lib_path}. "
            f"Please ensure the library is installed for your platform ({system}/{machine})."
        )
    
    return lib_path


class _TypecastLibrary:
    """
    Wrapper class for the native library.
    Handles loading and provides typed access to library functions.
    """
    
    def __init__(self):
        self._lib: Optional[ctypes.CDLL] = None
        self._initialized: bool = False
    
    def _load(self) -> ctypes.CDLL:
        """Load the native library and set up function signatures."""
        if self._lib is not None:
            return self._lib
            
        lib_path = _get_library_path()
        
        try:
            if platform.system().lower() == "windows":
                self._lib = ctypes.CDLL(str(lib_path), winmode=0)
            else:
                self._lib = ctypes.CDLL(str(lib_path))
        except OSError as e:
            raise LibraryNotFoundError(f"Failed to load native library: {e}")
        
        # Set up function signatures
        # int typecast_init(void)
        self._lib.typecast_init.argtypes = []
        self._lib.typecast_init.restype = ctypes.c_int
        
        # void typecast_cleanup(void)
        self._lib.typecast_cleanup.argtypes = []
        self._lib.typecast_cleanup.restype = None
        
        # char* typecast_auto_tag(const char *text)
        self._lib.typecast_auto_tag.argtypes = [ctypes.c_char_p]
        self._lib.typecast_auto_tag.restype = ctypes.c_char_p
        
        # char* typecast_auto_tag_with_manual(const char *text)
        self._lib.typecast_auto_tag_with_manual.argtypes = [ctypes.c_char_p]
        self._lib.typecast_auto_tag_with_manual.restype = ctypes.c_char_p
        
        # char* typecast_manual_tag(const char *text)
        self._lib.typecast_manual_tag.argtypes = [ctypes.c_char_p]
        self._lib.typecast_manual_tag.restype = ctypes.c_char_p
        
        # void typecast_free(char *str)
        self._lib.typecast_free.argtypes = [ctypes.c_char_p]
        self._lib.typecast_free.restype = None
        
        # const char* typecast_version(void)
        self._lib.typecast_version.argtypes = []
        self._lib.typecast_version.restype = ctypes.c_char_p
        
        # English functions
        # char* typecast_auto_tag_english(const char *text)
        self._lib.typecast_auto_tag_english.argtypes = [ctypes.c_char_p]
        self._lib.typecast_auto_tag_english.restype = ctypes.c_char_p
        
        # char* typecast_auto_tag_with_manual_english(const char *text)
        self._lib.typecast_auto_tag_with_manual_english.argtypes = [ctypes.c_char_p]
        self._lib.typecast_auto_tag_with_manual_english.restype = ctypes.c_char_p
        
        # char* typecast_manual_tag_english(const char *text)
        self._lib.typecast_manual_tag_english.argtypes = [ctypes.c_char_p]
        self._lib.typecast_manual_tag_english.restype = ctypes.c_char_p
        
        return self._lib
    
    def initialize(self) -> None:
        """Initialize the library. Must be called before any conversion functions."""
        if self._initialized:
            return
            
        lib = self._load()
        result = lib.typecast_init()
        
        if result != 0:
            raise InitializationError("Failed to initialize Typecast Autotag library")
        
        self._initialized = True
    
    def cleanup(self) -> None:
        """Clean up library resources. Should be called when done using the library."""
        if not self._initialized or self._lib is None:
            return
            
        self._lib.typecast_cleanup()
        self._initialized = False
    
    def _ensure_initialized(self) -> None:
        """Ensure the library is initialized before use."""
        if not self._initialized:
            self.initialize()
    
    def auto_tag(self, text: str) -> str:
        """
        Automatically recognize and convert patterns in text.
        
        Supported patterns:
        - Phone numbers: 010-1234-5678 → 공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔
        - Money: 50000원 → 오만 원
        - Dates: 2024-03-15 → 이천이십사년 삼 월 십오 일
        - Time: 14:30 → 오후 두 시 삼십 분
        - And many more...
        
        Args:
            text: Korean text to process (UTF-8).
            
        Returns:
            Processed text suitable for TTS.
            
        Raises:
            ConversionError: If conversion fails.
        """
        self._ensure_initialized()
        
        result = self._lib.typecast_auto_tag(text.encode('utf-8'))
        if result is None:
            raise ConversionError("auto_tag conversion failed")
        
        return result.decode('utf-8')
    
    def auto_tag_with_manual(self, text: str) -> str:
        """
        Process manual tags first, then apply auto tagging.
        
        Use this when you want automatic processing for most patterns,
        but need to explicitly specify certain patterns (like names).
        
        Manual tag format: tagName(value)
        Example: "name(김철수)님, 잔액은 50000원입니다."
        
        Args:
            text: Korean text with optional manual tags (UTF-8).
            
        Returns:
            Processed text suitable for TTS.
            
        Raises:
            ConversionError: If conversion fails.
        """
        self._ensure_initialized()
        
        result = self._lib.typecast_auto_tag_with_manual(text.encode('utf-8'))
        if result is None:
            raise ConversionError("auto_tag_with_manual conversion failed")
        
        return result.decode('utf-8')
    
    def manual_tag(self, text: str) -> str:
        """
        Process only explicitly specified manual tags.
        
        Use this for legacy system compatibility or when you need
        explicit control over all conversions.
        
        Supported tags (37 total):
        - name(name): Name reading
        - phone(number): Phone number reading
        - money(amount): Amount reading
        - date(date): Date reading
        - time(time): Time reading
        - And many more...
        
        Args:
            text: Korean text with manual tags (UTF-8).
            
        Returns:
            Processed text suitable for TTS.
            
        Raises:
            ConversionError: If conversion fails.
        """
        self._ensure_initialized()
        
        result = self._lib.typecast_manual_tag(text.encode('utf-8'))
        if result is None:
            raise ConversionError("manual_tag conversion failed")
        
        return result.decode('utf-8')
    
    def version(self) -> str:
        """
        Get the library version.
        
        Returns:
            Version string of the native library.
        """
        lib = self._load()
        result = lib.typecast_version()
        if result is None:
            return "unknown"
        return result.decode('utf-8')
    
    # English functions
    def auto_tag_en(self, text: str) -> str:
        """
        Automatically recognize and convert patterns in English text.
        
        Supported patterns:
        - Phone numbers: 123-456-7890 → one two three, four five six, ...
        - Money: $500 → five hundred dollars
        - Dates: 01/15/2024 → January fifteenth, twenty twenty-four
        - Time: 2:30 PM → two thirty PM
        - And more...
        
        Args:
            text: English text to process (UTF-8).
            
        Returns:
            Processed text suitable for TTS.
            
        Raises:
            ConversionError: If conversion fails.
        """
        self._ensure_initialized()
        
        result = self._lib.typecast_auto_tag_english(text.encode('utf-8'))
        if result is None:
            raise ConversionError("auto_tag_en conversion failed")
        
        return result.decode('utf-8')
    
    def auto_tag_with_manual_en(self, text: str) -> str:
        """
        Process manual tags first, then apply auto tagging for English.
        
        Args:
            text: English text with optional manual tags (UTF-8).
            
        Returns:
            Processed text suitable for TTS.
            
        Raises:
            ConversionError: If conversion fails.
        """
        self._ensure_initialized()
        
        result = self._lib.typecast_auto_tag_with_manual_english(text.encode('utf-8'))
        if result is None:
            raise ConversionError("auto_tag_with_manual_en conversion failed")
        
        return result.decode('utf-8')
    
    def manual_tag_en(self, text: str) -> str:
        """
        Process only explicitly specified manual tags for English.
        
        Args:
            text: English text with manual tags (UTF-8).
            
        Returns:
            Processed text suitable for TTS.
            
        Raises:
            ConversionError: If conversion fails.
        """
        self._ensure_initialized()
        
        result = self._lib.typecast_manual_tag_english(text.encode('utf-8'))
        if result is None:
            raise ConversionError("manual_tag_en conversion failed")
        
        return result.decode('utf-8')


# Global library instance
_library = _TypecastLibrary()


def initialize() -> None:
    """
    Initialize the Typecast Autotag library.
    
    This function must be called before any conversion functions.
    It is safe to call multiple times - subsequent calls are no-ops.
    
    Raises:
        InitializationError: If initialization fails.
        LibraryNotFoundError: If the native library cannot be found.
    """
    _library.initialize()


def cleanup() -> None:
    """
    Clean up Typecast Autotag library resources.
    
    Call this when you're done using the library.
    After calling this, you must call initialize() again before
    using conversion functions.
    """
    _library.cleanup()


def auto_tag(text: str) -> str:
    """
    Automatically recognize and convert patterns in text.
    
    This is the most convenient method and sufficient for most cases.
    Automatically recognizes phone numbers, amounts, dates, times, and more.
    
    Supported patterns:
    - Phone numbers: 010-1234-5678 → 공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔
    - Money: 50000원 → 오만 원
    - Dates: 2024-03-15 → 이천이십사년 삼 월 십오 일
    - Time: 14:30 → 오후 두 시 삼십 분
    - Order: 1등, 3번째, 5위
    - Ratio: 30%, 3:7
    - And many more...
    
    Args:
        text: Korean text to process (UTF-8).
        
    Returns:
        Processed text suitable for TTS.
        
    Raises:
        ConversionError: If conversion fails.
        InitializationError: If library is not initialized and auto-init fails.
        
    Example:
        >>> auto_tag("전화번호는 010-1234-5678입니다.")
        "전화번호는 공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔입니다."
    """
    return _library.auto_tag(text)


def auto_tag_with_manual(text: str) -> str:
    """
    Process manual tags first, then apply auto tagging.
    
    Use this when you want automatic processing for most patterns,
    but need to explicitly specify certain patterns that are hard to
    recognize automatically (like names).
    
    Manual tag format: tagName(value)
    
    Args:
        text: Korean text with optional manual tags (UTF-8).
        
    Returns:
        Processed text suitable for TTS.
        
    Raises:
        ConversionError: If conversion fails.
        InitializationError: If library is not initialized and auto-init fails.
        
    Example:
        >>> auto_tag_with_manual("name(김철수)님, 잔액은 50000원입니다.")
        "김 철 수님, 잔액은 오만 원입니다."
    """
    return _library.auto_tag_with_manual(text)


def manual_tag(text: str) -> str:
    """
    Process only explicitly specified manual tags.
    
    Use this for legacy system compatibility or when you need
    explicit control over all conversions.
    
    Supported tags (37 total):
    - name(name): Name reading (김철수 → 김 철 수)
    - phone(number): Phone number reading
    - money(amount): Amount reading
    - date(date): Date reading
    - time(time): Time reading
    - year(year): Year reading
    - month(month): Month reading
    - day(day): Day reading
    - order(ordinal): Ordinal reading
    - digits(number): Read digits one by one
    - And many more...
    
    Args:
        text: Korean text with manual tags (UTF-8).
        
    Returns:
        Processed text suitable for TTS.
        
    Raises:
        ConversionError: If conversion fails.
        InitializationError: If library is not initialized and auto-init fails.
        
    Example:
        >>> manual_tag("phone(010-1234-5678)로 연락주세요.")
        "공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔로 연락주세요."
    """
    return _library.manual_tag(text)


def version() -> str:
    """
    Get the library version.
    
    Returns:
        Version string of the native library.
    """
    return _library.version()


# English functions
def auto_tag_en(text: str) -> str:
    """
    Automatically recognize and convert patterns in English text.
    
    Supported patterns:
    - Phone numbers: 123-456-7890 → one two three, four five six, ...
    - Money: $500 → five hundred dollars
    - Dates: 01/15/2024 → January fifteenth, twenty twenty-four
    - Time: 2:30 PM → two thirty PM
    - And more...
    
    Args:
        text: English text to process (UTF-8).
        
    Returns:
        Processed text suitable for TTS.
        
    Raises:
        ConversionError: If conversion fails.
        InitializationError: If library is not initialized and auto-init fails.
        
    Example:
        >>> auto_tag_en("Call me at 123-456-7890.")
        "Call me at one two three, four five six, seven eight nine zero."
    """
    return _library.auto_tag_en(text)


def auto_tag_with_manual_en(text: str) -> str:
    """
    Process manual tags first, then apply auto tagging for English.
    
    Args:
        text: English text with optional manual tags (UTF-8).
        
    Returns:
        Processed text suitable for TTS.
        
    Raises:
        ConversionError: If conversion fails.
        InitializationError: If library is not initialized and auto-init fails.
        
    Example:
        >>> auto_tag_with_manual_en("name(John), balance is $500.")
        "J O H N, balance is five hundred dollars."
    """
    return _library.auto_tag_with_manual_en(text)


def manual_tag_en(text: str) -> str:
    """
    Process only explicitly specified manual tags for English.
    
    Args:
        text: English text with manual tags (UTF-8).
        
    Returns:
        Processed text suitable for TTS.
        
    Raises:
        ConversionError: If conversion fails.
        InitializationError: If library is not initialized and auto-init fails.
        
    Example:
        >>> manual_tag_en("phone(123-456-7890) is my number.")
        "one two three, four five six, seven eight nine zero is my number."
    """
    return _library.manual_tag_en(text)


class TypecastAutotag:
    """
    Context manager for Typecast Autotag library.
    
    Provides automatic initialization and cleanup.
    
    Note: Uses the global library instance to avoid state conflicts.
    The cleanup is optional and controlled by the cleanup_on_exit parameter.
    
    Example:
        >>> with TypecastAutotag() as tagger:
        ...     result = tagger.auto_tag("전화번호는 010-1234-5678입니다.")
        ...     print(result)
    """
    
    def __init__(self, cleanup_on_exit: bool = False):
        """
        Initialize the context manager.
        
        Args:
            cleanup_on_exit: If True, cleanup library resources on exit.
                           If False (default), keep library initialized for reuse.
        """
        self._cleanup_on_exit = cleanup_on_exit
    
    def __enter__(self) -> "_TypecastLibrary":
        _library.initialize()
        return _library
    
    def __exit__(self, exc_type, exc_val, exc_tb) -> None:
        if self._cleanup_on_exit:
            _library.cleanup()
        return None
    
    # Convenience properties for direct access
    @property
    def auto_tag(self):
        return _library.auto_tag
    
    @property
    def auto_tag_with_manual(self):
        return _library.auto_tag_with_manual
    
    @property
    def manual_tag(self):
        return _library.manual_tag
    
    @property
    def version(self):
        return _library.version

