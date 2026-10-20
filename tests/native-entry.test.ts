import '../c-binding/src/bundle-entry';
import { korean, english } from '../src';

const native = (
  globalThis as typeof globalThis & {
    typecast: Record<string, (text: string) => string>;
  }
).typecast;

describe('native bundle entry points', () => {
  it.each([
    ['autoTagWithManual', korean],
    ['autoTagWithManualEnglish', english],
  ] as const)(
    '%s preserves expanded manual output and the original input limit',
    (name, module) => {
      const input = 'phone(010-1234-5678) '.repeat(400);
      expect(native[name](input)).toBe(module.manualTag(input));
      expect(() => native[name]('x'.repeat(10001))).toThrow(RangeError);
    }
  );
  it('reads negative currency through the native English entry', () => {
    expect(native.autoTagEnglish('-$50')).toBe('minus fifty dollars');
  });
});
