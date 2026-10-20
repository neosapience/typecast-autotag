/**
 * Duktape bundle entry file
 *
 * Exposes functions to be called from the C wrapper to the global object
 * Supports both Korean and English languages
 */
import { autoTag, manualTag, autoTagWithManual } from '../../src/korean/index';
import {
  autoTag as autoTagEnglish,
  manualTag as manualTagEnglish,
  autoTagWithManual as autoTagWithManualEnglish,
} from '../../src/english/index';

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
  autoTag,
  autoTagWithManual,
  manualTag,
  autoTagEnglish,
  autoTagWithManualEnglish,
  manualTagEnglish,
};
