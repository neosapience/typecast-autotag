import { numberToKorean } from '../utils/number-to-korean';

/**
 * address 함수의 옵션
 */
export interface AddressOptions {
  /**
   * 숫자와 단위 사이 공백 포함 여부
   * @default false
   */
  includeSpace?: boolean;
}

/**
 * 괄호 안의 내용을 제거
 * - ( ) 괄호와 그 안의 내용 제거 (전각 괄호 포함)
 * - [ ] 대괄호와 그 안의 내용 제거 (전각 대괄호 포함)
 * - 연속된 공백을 하나로 정리
 */
function removeBracketedContent(text: string): string {
  // ( ) 괄호 안의 내용 제거 (전각 괄호 （）도 포함)
  // 괄호 앞뒤의 공백도 함께 제거
  let result = text.replace(/\s*[(（][^)）]*[)）]\s*/g, ' ');
  // [ ] 대괄호 안의 내용 제거 (전각 대괄호 ［］도 포함)
  result = result.replace(/\s*[[［][^\]］]*[\]］]\s*/g, ' ');
  // 연속된 공백을 하나로 정리
  result = result.replace(/\s+/g, ' ').trim();
  return result;
}

/**
 * 특수문자를 묵음 처리
 * - 슬래시(/), 쉼표(,), 물음표(?) 등을 공백으로 대체
 */
function removeSpecialChars(text: string): string {
  // 슬래시를 공백으로 대체
  let result = text.replace(/\//g, ' ');
  // 앞쪽의 쉼표 제거 (예: ", 102동" → "102동")
  result = result.replace(/^[,\s]+/, '');
  // 쉼표를 공백으로 대체
  result = result.replace(/,/g, ' ');
  // 물음표를 공백으로 대체
  result = result.replace(/[?？]/g, ' ');
  // 연속된 공백을 하나로 정리
  result = result.replace(/\s+/g, ' ').trim();
  return result;
}

/**
 * N동을 한글로 변환 (예: 102동 → 백이동)
 * @param match - 매칭된 문자열 (예: "102동")
 * @param includeSpace - 공백 포함 여부
 */
function convertDong(match: string, includeSpace: boolean): string {
  const numMatch = match.match(/^(\d+)\s*동$/);
  if (numMatch) {
    const num = parseInt(numMatch[1] ?? '0', 10);
    if (!isNaN(num) && num > 0) {
      const space = includeSpace ? ' ' : '';
      return numberToKorean(num) + space + '동';
    }
  }
  return match;
}

/**
 * N호를 한글로 변환 (예: 1101호 → 천백일호)
 * @param match - 매칭된 문자열 (예: "1101호")
 * @param includeSpace - 공백 포함 여부
 */
function convertHo(match: string, includeSpace: boolean): string {
  const numMatch = match.match(/^(\d+)\s*호$/);
  if (numMatch) {
    const num = parseInt(numMatch[1] ?? '0', 10);
    if (!isNaN(num) && num > 0) {
      const space = includeSpace ? ' ' : '';
      return numberToKorean(num) + space + '호';
    }
  }
  return match;
}

/**
 * N층을 한글로 변환 (예: 1층 → 일층)
 * @param match - 매칭된 문자열 (예: "1층")
 * @param includeSpace - 공백 포함 여부
 */
function convertFloor(match: string, includeSpace: boolean): string {
  const numMatch = match.match(/^(\d+)\s*층$/);
  if (numMatch) {
    const num = parseInt(numMatch[1] ?? '0', 10);
    if (!isNaN(num) && num > 0) {
      const space = includeSpace ? ' ' : '';
      return numberToKorean(num) + space + '층';
    }
  }
  return match;
}

/**
 * N-M 형태를 한글로 변환 (예: 102-1808 → 백이 다시 천팔백팔)
 * N-M호 형태도 지원 (예: 210-405호 → 이백십 다시 사백오호)
 * @param match - 매칭된 문자열 (예: "102-1808" 또는 "210-405호")
 * @param includeSpace - 공백 포함 여부
 */
function convertHyphenatedNumber(match: string, includeSpace: boolean): string {
  // N-M호 형태 (호가 붙은 경우)
  const hoMatch = match.match(/^(\d+)-(\d+)\s*호$/);
  if (hoMatch) {
    const num1 = parseInt(hoMatch[1] ?? '0', 10);
    const num2 = parseInt(hoMatch[2] ?? '0', 10);
    if (!isNaN(num1) && !isNaN(num2) && num1 > 0 && num2 > 0) {
      const space = includeSpace ? ' ' : '';
      return numberToKorean(num1) + ' 다시 ' + numberToKorean(num2) + space + '호';
    }
    return match;
  }

  // N-M 형태 (호가 없는 경우)
  const numMatch = match.match(/^(\d+)-(\d+)$/);
  if (numMatch) {
    const num1 = parseInt(numMatch[1] ?? '0', 10);
    const num2 = parseInt(numMatch[2] ?? '0', 10);
    if (!isNaN(num1) && !isNaN(num2) && num1 > 0 && num2 > 0) {
      return numberToKorean(num1) + ' 다시 ' + numberToKorean(num2);
    }
  }
  return match;
}

/**
 * 단독 숫자를 한글로 변환 (예: 33 → 삼십삼)
 * @param match - 매칭된 문자열 (예: "33")
 */
function convertNumber(match: string): string {
  const num = parseInt(match, 10);
  if (!isNaN(num) && num > 0) {
    return numberToKorean(num);
  }
  return match;
}

/**
 * N/N호 형식을 변환 (예: 104/4122호 → 백사 사천백이십이호)
 * @param match - 매칭된 문자열 (예: "104/4122호")
 * @param includeSpace - 공백 포함 여부
 */
function convertSlashHo(match: string, includeSpace: boolean): string {
  const slashMatch = match.match(/^(\d+)\/(\d+)\s*호$/);
  if (slashMatch) {
    const num1 = parseInt(slashMatch[1] ?? '0', 10);
    const num2 = parseInt(slashMatch[2] ?? '0', 10);
    if (!isNaN(num1) && !isNaN(num2) && num1 > 0 && num2 > 0) {
      const space = includeSpace ? ' ' : '';
      return numberToKorean(num1) + ' ' + numberToKorean(num2) + space + '호';
    }
  }
  return match;
}

/**
 * 주소를 TTS용 한글로 변환
 *
 * 주소 처리 규칙:
 * - 괄호 `( )` 또는 `[ ]` 안의 내용은 제거
 * - N동 → 한자어 수사 + 동 (예: 102동 → 백이동)
 * - N호 → 한자어 수사 + 호 (예: 1101호 → 천백일호)
 * - N/N호 → 한자어 수사 + 공백 + 한자어 수사호 (예: 104/4122호 → 백사 사천백이십이호)
 * - N-M → 한자어 수사 다시 한자어 수사 (예: 611-9 → 육백십일 다시 구)
 * - N층 → 한자어 수사 + 층 (예: 1층 → 일층)
 * - 특수문자 (슬래시, 쉼표, 물음표) 묵음 처리
 *
 * @param input - 변환할 주소 문자열
 * @param options - 옵션 (공백 포함 여부)
 * @returns 한글 주소 표현
 *
 * @example
 * ```typescript
 * address('우성베스토피아 102동 1101호 ( 엘지동, 우성베스토피아 )');
 * // '우성베스토피아 백이동 천백일호'
 *
 * address('113동2602호(엘지동, 더샵 염주센트럴파크)');
 * // '백십삼동 이천육백이호'
 *
 * address('611-9 원조닭한마리 1층');
 * // '육백십일 다시 구 원조닭한마리 일층'
 *
 * address('102-1808');
 * // '백이 다시 천팔백팔'
 *
 * address('104/4122호');
 * // '백사 사천백이십이호'
 * ```
 */
export function address(input: string, options?: AddressOptions): string {
  const includeSpace = options?.includeSpace ?? false;

  const trimmed = input.trim();
  if (trimmed === '') return input;

  // 1. 괄호 안의 내용 제거
  let result = removeBracketedContent(trimmed);

  // 2. N/N호 형식 변환 (특수문자 처리 전에 먼저 처리)
  result = result.replace(/\d+\/\d+\s*호/g, (match) => convertSlashHo(match, includeSpace));

  // 3. 특수문자 묵음 처리
  result = removeSpecialChars(result);

  // 4. N동N호 변환 (공백 없이 붙어있는 경우: 113동2602호 → 백십삼동 이천육백이호)
  result = result.replace(/(\d+)\s*동(\d+)\s*호/g, (_match, dongNum: string, hoNum: string) => {
    const dong = parseInt(dongNum, 10);
    const ho = parseInt(hoNum, 10);
    if (!isNaN(dong) && !isNaN(ho) && dong > 0 && ho > 0) {
      const space = includeSpace ? ' ' : '';
      return numberToKorean(dong) + space + '동 ' + numberToKorean(ho) + space + '호';
    }
    return _match;
  });

  // 4-1. N동N 변환 (호 없이 동+숫자만 있는 경우: 101동1512 → 백일동 천오백십이)
  // 뒤에 '호'가 없는 경우만 처리
  result = result.replace(/(\d+)\s*동(\d+)(?!호)/g, (_match, dongNum: string, roomNum: string) => {
    const dong = parseInt(dongNum, 10);
    const room = parseInt(roomNum, 10);
    if (!isNaN(dong) && !isNaN(room) && dong > 0 && room > 0) {
      const space = includeSpace ? ' ' : '';
      return numberToKorean(dong) + space + '동 ' + numberToKorean(room);
    }
    return _match;
  });

  // 5. N동 변환 (예: 102동 → 백이동)
  // 숫자 + 동 (뒤에 숫자가 오지 않는 경우)
  result = result.replace(/(\d+)\s*동(?!\d)/g, (match) => convertDong(match, includeSpace));

  // 6. N-M호 변환 (예: 210-405호 → 이백십 다시 사백오호)
  result = result.replace(/\d+-\d+\s*호/g, (match) => convertHyphenatedNumber(match, includeSpace));

  // 7. N호 변환 (예: 1101호 → 천백일호)
  result = result.replace(/(\d+)\s*호/g, (match) => convertHo(match, includeSpace));

  // 8. N층 변환 (예: 1층 → 일층)
  result = result.replace(/(\d+)\s*층/g, (match) => convertFloor(match, includeSpace));

  // 9. N-M 변환 (예: 102-1808 → 백이 다시 천팔백팔, 611-9 → 육백십일 다시 구)
  // 이미 처리된 N-M호 패턴은 건너뛰고, 남은 N-M만 처리
  result = result.replace(/\d+-\d+/g, (match) => convertHyphenatedNumber(match, includeSpace));

  // 10. 단독 숫자 변환 (예: 33 → 삼십삼)
  // 다른 패턴으로 처리되지 않은 단독 숫자만 변환
  // 앞뒤가 한글, 공백, 문장 시작/끝인 경우
  result = result.replace(/(?<=^|[가-힣\s])(\d+)(?=$|[가-힣\s])/g, (match) => convertNumber(match));

  return result;
}
