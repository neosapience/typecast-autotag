import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

it('checks missing, lightweight, annotated, conflicting, and inaccessible release tags', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'autotag-release-tag-'));
  const git = (...args: string[]) =>
    execFileSync(
      'git',
      [
        '-c',
        'user.name=Autotag test',
        '-c',
        'user.email=test@example.invalid',
        '-c',
        'commit.gpgsign=false',
        '-c',
        'tag.gpgsign=false',
        '-c',
        'core.hooksPath=/dev/null',
        ...args,
      ],
      { cwd: dir, encoding: 'utf8', stdio: 'pipe' }
    ).trim();
  try {
    fs.mkdirSync(path.join(dir, 'scripts'));
    fs.copyFileSync(
      'scripts/verify-release-tag.js',
      path.join(dir, 'scripts/verify-release-tag.js')
    );
    fs.writeFileSync(path.join(dir, 'package.json'), '{"version":"1.2.3"}');
    git('init');
    git('commit', '--allow-empty', '-m', 'release fixture');
    git('remote', 'add', 'origin', dir);
    const sha = git('rev-parse', 'HEAD');
    const verify = (expected = sha) =>
      execFileSync(process.execPath, ['scripts/verify-release-tag.js'], {
        cwd: dir,
        env: { ...process.env, GITHUB_SHA: expected },
        encoding: 'utf8',
        stdio: 'pipe',
      });
    expect(() => verify('')).toThrow();
    expect(verify()).toContain('will be created after publishing');
    git('tag', 'v1.2.3');
    expect(verify()).toContain('matches the publishing commit');
    expect(() => verify('0'.repeat(40))).toThrow();
    git('tag', '-d', 'v1.2.3');
    git('tag', '-a', 'v1.2.3', '-m', 'annotated release');
    expect(verify()).toContain('matches the publishing commit');
    expect(() => verify('0'.repeat(40))).toThrow();
    git('remote', 'set-url', 'origin', path.join(dir, 'missing-repository'));
    expect(() => verify()).toThrow();
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
