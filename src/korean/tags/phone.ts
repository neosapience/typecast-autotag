import { digitToPhoneKorean } from '../utils/number-to-korean';

/**
 * 전화번호를 발음하기 좋은 형태로 변환
 *
 * @param input - 변환할 전화번호 (예: '010-2055-4783')
 * @param separator - 번호 그룹 사이 구분자 (기본값: ' 다시 ')
 * @returns 발음 교정된 전화번호
 *
 * @example
 * ```typescript
 * phone('010-2055-4783'); // '공일공 다시 이공오오 다시 사칠팔삼'
 * phone('02-1234-5678'); // '공이 다시 일이삼사 다시 오육칠팔'
 * ```
 */
export function phone(input: string, separator: string = ' 다시 '): string {
  if (!input || input.length === 0) {
    return input;
  }

  // 하이픈으로 분리된 각 그룹을 변환
  const groups = input.split('-');

  const convertedGroups = groups.map((group) => {
    return group
      .split('')
      .map((char) => {
        // 숫자인 경우에만 변환
        if (/\d/.test(char)) {
          return digitToPhoneKorean(char);
        }
        return char;
      })
      .join('');
  });

  return convertedGroups.join(separator);
}
