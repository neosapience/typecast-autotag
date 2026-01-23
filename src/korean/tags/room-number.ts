import { numberToKorean } from '../utils/number-to-korean';

/**
 * roomNumber 함수의 옵션
 */
export interface RoomNumberOptions {
  /**
   * 숫자와 단위 사이 공백 포함 여부
   * @default false
   */
  includeSpace?: boolean;
}

/**
 * 호실 번호를 한글로 변환
 *
 * 호실 번호는 한자어 수사로 읽습니다:
 * - 1205호 → 천이백오호
 * - 302호 → 삼백이호
 * - 202호 → 이백이호
 *
 * @param input - 변환할 호실 번호 (문자열)
 * @param options - 옵션 (공백 포함 여부)
 * @returns 한글 호실 번호 표현
 *
 * @example
 * ```typescript
 * roomNumber('1205호');  // '천이백오호'
 * roomNumber('302호');   // '삼백이호'
 * roomNumber('501');     // '오백일'
 * ```
 */
export function roomNumber(input: string, options?: RoomNumberOptions): string {
  const includeSpace = options?.includeSpace ?? false;

  const trimmed = input.trim();
  if (trimmed === '') return input;

  // N호 패턴 매칭
  const matchWithHo = trimmed.match(/^(\d+)\s*호$/);
  if (matchWithHo) {
    const num = parseInt(matchWithHo[1] ?? '0', 10);
    if (!isNaN(num) && num > 0) {
      const space = includeSpace ? ' ' : '';
      return numberToKorean(num) + space + '호';
    }
  }

  // 숫자만 있는 경우
  const matchNumberOnly = trimmed.match(/^(\d+)$/);
  if (matchNumberOnly) {
    const num = parseInt(matchNumberOnly[1] ?? '0', 10);
    if (!isNaN(num) && num > 0) {
      return numberToKorean(num);
    }
  }

  return input;
}
