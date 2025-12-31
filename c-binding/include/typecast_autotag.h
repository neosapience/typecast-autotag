/**
 * TypeCast AutoTag C Library
 * 
 * TTS 문장 전처리 라이브러리
 * 전화번호, 날짜, 금액 등을 음성 합성에 적합한 형식으로 변환합니다.
 * 
 * Copyright (c) 2025 TypeCast
 * 
 * 사용 예시:
 * 
 *   #include "typecast_autotag.h"
 *   
 *   int main() {
 *       // 초기화 (프로그램 시작 시 한 번만)
 *       if (typecast_init() != 0) {
 *           return 1;
 *       }
 *       
 *       // 자동 태깅
 *       char *result = typecast_auto_tag("전화번호는 010-1234-5678입니다.");
 *       if (result) {
 *           printf("%s\n", result);  // "전화번호는 공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔입니다."
 *           typecast_free(result);
 *       }
 *       
 *       // 정리 (프로그램 종료 시)
 *       typecast_cleanup();
 *       return 0;
 *   }
 */

#ifndef TYPECAST_AUTOTAG_H
#define TYPECAST_AUTOTAG_H

#ifdef __cplusplus
extern "C" {
#endif

/* 라이브러리 버전 */
#define TYPECAST_VERSION "1.0.0"

/**
 * 라이브러리 초기화
 * 
 * JavaScript 엔진을 초기화하고 변환 모듈을 로드합니다.
 * 다른 함수를 호출하기 전에 반드시 한 번 호출해야 합니다.
 * 
 * 스레드 안전: 여러 스레드에서 호출해도 안전합니다.
 * 멱등성: 이미 초기화된 경우 즉시 성공을 반환합니다.
 * 
 * @return 0: 성공, -1: 실패
 */
int typecast_init(void);

/**
 * 라이브러리 정리
 * 
 * 할당된 모든 리소스를 해제합니다.
 * 프로그램 종료 시 호출하세요.
 */
void typecast_cleanup(void);

/**
 * 자동 태깅 (완전 자동 처리)
 * 
 * 텍스트에서 다음 패턴을 자동으로 인식하여 변환합니다:
 * - 전화번호: 010-1234-5678 → 공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔
 * - 금액: 50000원 → 오만 원
 * - 날짜: 2024-01-15 → 이천이십사년 일 월 십오 일
 * - 시간: 14:30 → 오후 두 시 삼십 분
 * - 기타: 순서, 점수, 비율, 층수 등
 * 
 * @param text 변환할 텍스트 (UTF-8 인코딩)
 * @return 변환된 문자열 (반드시 typecast_free()로 해제해야 함)
 *         실패 시 NULL 반환
 * 
 * 사용 시나리오:
 * - 모든 패턴을 자동으로 처리하고 싶을 때
 * - 입력 텍스트에 수동 태그가 없을 때
 */
char* typecast_auto_tag(const char *text);

/**
 * 자동 태깅 + 수동 태그 (하이브리드 방식)
 * 
 * 수동 태그를 먼저 처리한 후 자동 태깅을 적용합니다.
 * 자동 태깅이 잘못 인식하는 부분이 있을 때 수동 태그로 보완할 수 있습니다.
 * 
 * 수동 태그 형식: tagName(value)
 * 예: name(김철수), phone(010-1234-5678), money(50000)
 * 
 * @param text 변환할 텍스트 (UTF-8 인코딩)
 * @return 변환된 문자열 (반드시 typecast_free()로 해제해야 함)
 *         실패 시 NULL 반환
 * 
 * 사용 시나리오:
 * - 대부분은 자동 태깅을 사용하되, 일부 특수한 경우 수동 태그로 처리하고 싶을 때
 * - 이름처럼 자동 인식이 어려운 패턴을 명시적으로 지정하고 싶을 때
 * 
 * 예시:
 *   입력: "name(김철수)님, 잔액은 50000원입니다."
 *   출력: "김 철 수님, 잔액은 오만 원입니다."
 */
char* typecast_auto_tag_with_manual(const char *text);

/**
 * 수동 태그만 적용 (기존 호환 방식)
 * 
 * 텍스트에서 태그 형식만 처리합니다.
 * 자동 패턴 인식은 수행하지 않습니다.
 * 
 * 지원하는 태그:
 * - name(이름): 이름 읽기 (성과 이름 사이에 공백)
 * - phone(번호): 전화번호 읽기
 * - money(금액): 금액 읽기
 * - date(날짜): 날짜 읽기
 * - time(시간): 시간 읽기
 * - year(연도): 연도 읽기
 * - month(월): 월 읽기
 * - day(일): 일 읽기
 * - order(순서): 순서 읽기
 * - digits(숫자): 숫자를 한 자리씩 읽기
 * - 기타 다양한 태그 지원
 * 
 * @param text 변환할 텍스트 (UTF-8 인코딩)
 * @return 변환된 문자열 (반드시 typecast_free()로 해제해야 함)
 *         실패 시 NULL 반환
 * 
 * 사용 시나리오:
 * - 기존 시스템과의 호환성이 필요할 때
 * - 모든 변환을 명시적으로 제어하고 싶을 때
 * 
 * 예시:
 *   입력: "phone(010-1234-5678)로 연락주세요."
 *   출력: "공 일 공 다시 일 이 삼 사 다시 오 육 칠 팔로 연락주세요."
 */
char* typecast_manual_tag(const char *text);

/**
 * 메모리 해제
 * 
 * typecast_auto_tag, typecast_auto_tag_with_manual, typecast_manual_tag
 * 함수가 반환한 문자열을 해제합니다.
 * 
 * @param str 해제할 문자열 (NULL도 허용됨)
 */
void typecast_free(char *str);

/**
 * 버전 정보 반환
 * 
 * @return 라이브러리 버전 문자열 (정적 문자열, 해제 불필요)
 */
const char* typecast_version(void);

#ifdef __cplusplus
}
#endif

#endif /* TYPECAST_AUTOTAG_H */

