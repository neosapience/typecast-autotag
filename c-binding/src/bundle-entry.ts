/**
 * Duktape 번들 엔트리 파일
 *
 * C 래퍼에서 호출할 함수들을 전역 객체에 노출
 */
import { autoTag, autoTagWithManual, manualTag } from '../../src/korean/index';

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

  autoTagWithManual: (text: string): string => {
    return autoTagWithManual(text);
  },

  manualTag: (text: string): string => {
    return manualTag(text);
  },
};
