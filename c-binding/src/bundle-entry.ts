/**
 * QuickJS 번들 엔트리 파일
 *
 * C 래퍼에서 호출할 함수들을 globalThis에 노출
 */
import { autoTag, autoTagWithManual, manualTag } from '../../src/korean/index';

// QuickJS에서 접근할 수 있도록 globalThis에 함수 노출
(globalThis as any).typecast = {
  autoTag: (text: string): string => {
    try {
      return autoTag(text);
    } catch (e) {
      return text;
    }
  },

  autoTagWithManual: (text: string): string => {
    try {
      // manualTag를 먼저 적용한 후 autoTag 적용
      const manualResult = manualTag(text);
      return autoTag(manualResult);
    } catch (e) {
      return text;
    }
  },

  manualTag: (text: string): string => {
    try {
      return manualTag(text);
    } catch (e) {
      return text;
    }
  },
};
