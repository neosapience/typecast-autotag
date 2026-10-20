import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

describe('independent package versions', () => {
  it('does not synchronize native or Python versions during npm release or builds', () => {
    const manifest = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const config = JSON.parse(fs.readFileSync('.release-it.json', 'utf8'));
    expect(JSON.stringify({ scripts: manifest.scripts, hooks: config.hooks })).not.toMatch(
      /sync:version|sync-python-version/
    );
    expect(config.github.assets).toBeUndefined();
  });

  it('updates both Python fields without changing npm or Java', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'autotag-version-'));
    try {
      for (const file of [
        'scripts/sync-python-version.js',
        'python-binding/pyproject.toml',
        'python-binding/typecast_autotag/__init__.py',
        'package.json',
        'java-binding/pom.xml',
      ]) {
        fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
        fs.copyFileSync(file, path.join(dir, file));
      }
      const script = path.join(dir, 'scripts/sync-python-version.js');
      execFileSync(process.execPath, [script, '3.0.1']);
      expect(fs.readFileSync(path.join(dir, 'python-binding/pyproject.toml'), 'utf8')).toContain(
        'version = "3.0.1"'
      );
      expect(
        fs.readFileSync(path.join(dir, 'python-binding/typecast_autotag/__init__.py'), 'utf8')
      ).toContain('__version__ = "3.0.1"');
      for (const file of ['package.json', 'java-binding/pom.xml'])
        expect(fs.readFileSync(path.join(dir, file), 'utf8')).toBe(fs.readFileSync(file, 'utf8'));
      expect(() =>
        execFileSync(process.execPath, [script, '3.0.1-invalid'], { stdio: 'pipe' })
      ).toThrow();
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});
