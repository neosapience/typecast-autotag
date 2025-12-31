/**
 * Duktape 번들 엔트리 파일
 *
 * C 래퍼에서 호출할 함수들을 전역 객체에 노출
 */
import { autoTag, manualTag } from '../../src/korean/index';

// Duktape (ES5) 환경에서 전역 객체 접근
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalObj: any =
  typeof globalThis !== 'undefined'
    ? globalThis
    : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
        ? global
        : typeof self !== 'undefined'
          ? self
          : Function('return this')();

// 전역 객체에 함수 노출 - 에러는 throw하여 C에서 캡처
globalObj.typecast = {
  autoTag: (text: string): string => {
    return autoTag(text);
  },

  // autoTagWithManual: manualTag 먼저 적용 후 autoTag 적용
  autoTagWithManual: (text: string): string => {
    const manualTagged = manualTag(text);
    return autoTag(manualTagged);
  },

  manualTag: (text: string): string => {
    return manualTag(text);
  },
};
