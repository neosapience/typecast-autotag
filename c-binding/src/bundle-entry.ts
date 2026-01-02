/**
 * Duktape bundle entry file
 *
 * Exposes functions to be called from the C wrapper to the global object
 */
import { autoTag, manualTag } from '../../src/korean/index';

// Access global object in Duktape (ES5) environment
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

// Expose functions to global object - errors are thrown to be captured in C
globalObj.typecast = {
  autoTag: (text: string): string => {
    return autoTag(text);
  },

  // autoTagWithManual: Apply manualTag first, then apply autoTag
  autoTagWithManual: (text: string): string => {
    const manualTagged = manualTag(text);
    return autoTag(manualTagged);
  },

  manualTag: (text: string): string => {
    return manualTag(text);
  },
};
