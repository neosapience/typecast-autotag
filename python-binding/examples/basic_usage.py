#!/usr/bin/env python3
"""
Typecast Autotag - Basic Usage Examples

This script demonstrates the basic usage of the Typecast Autotag library
for TTS text preprocessing.
"""

from typecast_autotag import (
    initialize,
    cleanup,
    auto_tag,
    auto_tag_with_manual,
    manual_tag,
    version,
    TypecastAutotag,
)


def example_auto_tag():
    """Example: Fully automatic pattern recognition."""
    print("=" * 60)
    print("Example 1: auto_tag() - Fully Automatic")
    print("=" * 60)
    
    examples = [
        "전화번호는 010-1234-5678입니다.",
        "총 금액은 1500000원입니다.",
        "회의는 2024-03-15 14:30에 시작합니다.",
        "1등으로 입상했습니다.",
        "진행률은 85%입니다.",
    ]
    
    for text in examples:
        result = auto_tag(text)
        print(f"  Input:  {text}")
        print(f"  Output: {result}")
        print()


def example_manual_tag():
    """Example: Manual tag processing only."""
    print("=" * 60)
    print("Example 2: manual_tag() - Manual Tags Only")
    print("=" * 60)
    
    examples = [
        ("name(김철수)님 안녕하세요.", "Name tag"),
        ("phone(010-1234-5678)로 연락주세요.", "Phone tag"),
        ("금액은 money(50000)입니다.", "Money tag"),
        ("date(2024-03-15)에 만나요.", "Date tag"),
        ("time(14:30)에 회의합니다.", "Time tag"),
        ("order(3) 우승자입니다.", "Order tag"),
        ("digits(1234)번입니다.", "Digits tag"),
    ]
    
    for text, description in examples:
        result = manual_tag(text)
        print(f"  [{description}]")
        print(f"  Input:  {text}")
        print(f"  Output: {result}")
        print()


def example_auto_tag_with_manual():
    """Example: Hybrid approach - manual tags + auto tagging."""
    print("=" * 60)
    print("Example 3: auto_tag_with_manual() - Hybrid Approach")
    print("=" * 60)
    
    examples = [
        "name(김철수)님, 잔액은 50000원입니다.",
        "name(홍길동)님, 2024-03-15 14:30에 phone(02-123-4567)로 연락드리겠습니다.",
        "name(이영희)님의 주문번호는 order(3)번이며, 배송비는 3000원입니다.",
    ]
    
    for text in examples:
        result = auto_tag_with_manual(text)
        print(f"  Input:  {text}")
        print(f"  Output: {result}")
        print()


def example_context_manager():
    """Example: Using context manager."""
    print("=" * 60)
    print("Example 4: TypecastAutotag Context Manager")
    print("=" * 60)
    
    with TypecastAutotag() as tagger:
        result = tagger.auto_tag("전화번호는 010-1234-5678입니다.")
        print(f"  Input:  전화번호는 010-1234-5678입니다.")
        print(f"  Output: {result}")
        print()
        
        result = tagger.manual_tag("name(박지성)님")
        print(f"  Input:  name(박지성)님")
        print(f"  Output: {result}")
        print()


def example_all_manual_tags():
    """Example: Demonstrating all 37 manual tags."""
    print("=" * 60)
    print("Example 5: All Manual Tags (37 tags)")
    print("=" * 60)
    
    tags = [
        ("name(김철수)", "이름 읽기"),
        ("phone(010-1234-5678)", "전화번호 읽기"),
        ("money(50000)", "금액 읽기"),
        ("date(2024-03-15)", "날짜 읽기"),
        ("time(14:30)", "시간 읽기"),
        ("datetime(2024-03-15T14:30)", "날짜+시간 읽기"),
        ("year(2024)", "연도 읽기"),
        ("month(3)", "월 읽기"),
        ("day(15)", "일 읽기"),
        ("order(3)", "순서 읽기"),
        ("point(95)", "점수 읽기"),
        ("piece(3)", "개수 읽기 (고유어)"),
        ("digits(123)", "숫자 하나씩 읽기"),
        ("minsec(5m30s)", "분초 읽기"),
        ("ratio(30%)", "비율/퍼센트 읽기"),
        ("floor(B2)", "층수 읽기"),
        ("weight(5kg)", "무게 읽기"),
        ("distance(5km)", "거리 읽기"),
        ("temperature(25℃)", "온도 읽기"),
        ("volume(500ml)", "부피 읽기"),
    ]
    
    for tag_text, description in tags:
        result = manual_tag(tag_text)
        print(f"  {description}: {tag_text} → {result}")
    print()


def main():
    """Main function demonstrating all examples."""
    print()
    print("╔══════════════════════════════════════════════════════════╗")
    print("║        Typecast Autotag Python Binding Examples          ║")
    print("╚══════════════════════════════════════════════════════════╝")
    print()
    
    # Show version
    print(f"Library Version: {version()}")
    print()
    
    # Initialize library (called automatically, but explicit is clearer)
    initialize()
    
    try:
        example_auto_tag()
        example_manual_tag()
        example_auto_tag_with_manual()
        example_context_manager()
        example_all_manual_tags()
    finally:
        # Clean up resources
        cleanup()
    
    print("=" * 60)
    print("All examples completed successfully!")
    print("=" * 60)


if __name__ == "__main__":
    main()

