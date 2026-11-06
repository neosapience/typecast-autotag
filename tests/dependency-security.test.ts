import { createRequire } from 'node:module';
import path from 'node:path';

const jestRequire = createRequire(require.resolve('jest'));
const coreRequire = createRequire(jestRequire.resolve('@jest/core'));
const configRequire = createRequire(coreRequire.resolve('jest-config'));
const packageRoot = path.dirname(configRequire.resolve('deepmerge/package.json'));

describe.each(['dist/cjs.js', 'dist/umd.js'])('deepmerge %s', (entry) => {
  const merge = require(path.join(packageRoot, entry)) as (
    target: object,
    source: object
  ) => Record<string, unknown>;

  test('does not inherit attacker properties from either input', () => {
    const poisoned = JSON.parse('{"__proto__":{"inherited":"attacker"}}');
    for (const [target, source] of [
      [poisoned, {}],
      [Object.create(null), poisoned],
      [{ nested: poisoned }, {}],
    ]) {
      const result = merge(target, source);
      const merged = (result.nested ?? result) as object;
      expect(Object.getPrototypeOf(merged)).toBe(Object.prototype);
      expect('inherited' in merged).toBe(false);
    }
    expect(merge({ list: [1], nested: { a: 1 } }, { list: [2], nested: { b: 2 } })).toEqual({
      list: [1, 2],
      nested: { a: 1, b: 2 },
    });
  });
});
