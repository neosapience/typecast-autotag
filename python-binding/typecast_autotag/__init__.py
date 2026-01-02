"""
Typecast Autotag - TTS Text Preprocessing Library

Automatically converts phone numbers, dates, amounts, and various other patterns
into formats suitable for Korean text-to-speech synthesis.

Quick Start:
    >>> from typecast_autotag import auto_tag
    >>> result = auto_tag("전화번호는 010-1234-5678입니다.")
    >>> print(result)
    "전화번호는 공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔입니다."

Using Context Manager:
    >>> from typecast_autotag import TypecastAutotag
    >>> with TypecastAutotag() as tagger:
    ...     result = tagger.auto_tag("금액은 50000원입니다.")
    ...     print(result)

Available Functions:
    - auto_tag(text): Fully automatic pattern recognition and conversion
    - auto_tag_with_manual(text): Manual tags + automatic processing
    - manual_tag(text): Process only explicit manual tags
    - initialize(): Initialize library (called automatically)
    - cleanup(): Release library resources
    - version(): Get library version

Copyright (c) 2025 TypeCast
"""

from .binding import (
    # Functions
    initialize,
    cleanup,
    auto_tag,
    auto_tag_with_manual,
    manual_tag,
    version,
    # Context manager
    TypecastAutotag,
    # Exceptions
    TypecastAutotagError,
    LibraryNotFoundError,
    InitializationError,
    ConversionError,
)

__version__ = "1.0.0"
__author__ = "TypeCast"
__all__ = [
    # Functions
    "initialize",
    "cleanup",
    "auto_tag",
    "auto_tag_with_manual",
    "manual_tag",
    "version",
    # Context manager
    "TypecastAutotag",
    # Exceptions
    "TypecastAutotagError",
    "LibraryNotFoundError",
    "InitializationError",
    "ConversionError",
]

