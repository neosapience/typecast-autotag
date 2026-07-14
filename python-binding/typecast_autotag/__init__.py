"""
Typecast Autotag - TTS Text Preprocessing Library

Automatically converts phone numbers, dates, amounts, and various other patterns
into formats suitable for Korean and English text-to-speech synthesis.

Quick Start (Korean):
    >>> from typecast_autotag import auto_tag
    >>> result = auto_tag("전화번호는 010-1234-5678입니다.")
    >>> print(result)
    "전화번호는 공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔입니다."

Quick Start (English):
    >>> from typecast_autotag import auto_tag_en
    >>> result = auto_tag_en("Call me at 123-456-7890.")
    >>> print(result)
    "Call me at one two three, four five six, seven eight nine zero."

Using Context Manager:
    >>> from typecast_autotag import TypecastAutotag
    >>> with TypecastAutotag() as tagger:
    ...     result = tagger.auto_tag("금액은 50000원입니다.")
    ...     print(result)

Available Functions:
    Korean:
    - auto_tag(text): Fully automatic pattern recognition and conversion
    - auto_tag_with_manual(text): Manual tags + automatic processing
    - manual_tag(text): Process only explicit manual tags
    
    English:
    - auto_tag_en(text): Fully automatic pattern recognition for English
    - auto_tag_with_manual_en(text): Manual tags + automatic processing for English
    - manual_tag_en(text): Process only explicit manual tags for English
    
    Common:
    - initialize(): Initialize library (called automatically)
    - cleanup(): Release library resources
    - version(): Get library version

Copyright (c) 2025 TypeCast
"""

from .binding import (
    # Korean Functions
    initialize,
    cleanup,
    auto_tag,
    auto_tag_with_manual,
    manual_tag,
    version,
    # English Functions
    auto_tag_en,
    auto_tag_with_manual_en,
    manual_tag_en,
    # Context manager
    TypecastAutotag,
    # Exceptions
    TypecastAutotagError,
    LibraryNotFoundError,
    InitializationError,
    ConversionError,
)

__version__ = "1.10.0"
__author__ = "TypeCast"
__all__ = [
    # Korean Functions
    "initialize",
    "cleanup",
    "auto_tag",
    "auto_tag_with_manual",
    "manual_tag",
    "version",
    # English Functions
    "auto_tag_en",
    "auto_tag_with_manual_en",
    "manual_tag_en",
    # Context manager
    "TypecastAutotag",
    # Exceptions
    "TypecastAutotagError",
    "LibraryNotFoundError",
    "InitializationError",
    "ConversionError",
]

