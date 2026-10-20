const { execFileSync } = require('node:child_process');
const { version } = require('../package.json');

const expected = process.env.GITHUB_SHA;
if (!expected) throw new Error('GITHUB_SHA is required to verify the release tag');

const tag = `refs/tags/v${version}`;
const refs = new Map(
  execFileSync('git', ['ls-remote', 'origin', tag, `${tag}^{}`], { encoding: 'utf8' })
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [sha, ref] = line.split(/\s+/);
      return [ref, sha];
    })
);
const actual = refs.get(`${tag}^{}`) || refs.get(tag);
if (actual && actual !== expected) {
  throw new Error(`${tag} points to ${actual}, expected ${expected}`);
}
console.log(
  actual ? `${tag} matches the publishing commit` : `${tag} will be created after publishing`
);
