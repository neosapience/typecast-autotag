import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { loadConfigFromFile } from 'vite';

const { config } = await loadConfigFromFile({ command: 'build', mode: 'production' });
const plugin = config.plugins.flat().find(plugin => plugin.name === 'inline-demo-assets');
const bundle = {
  'index.html': { type: 'asset', source: '<script type="module" src="./app.js"></script><link rel="stylesheet" href="./app.css">' },
  'app.js': { type: 'chunk', code: 'const text = "</SCRIPT><!--";' },
  'app.css': { type: 'asset', source: '.test::after { content: "</STYLE>"; }' },
};
const context = { error(message) { throw new Error(message); } };
plugin.generateBundle.call(context, {}, bundle);
assert.deepEqual(Object.keys(bundle), ['index.html']);
assert.equal(bundle['index.html'].source, '<script type="module">const text = "\\x3C/SCRIPT>\\x3C!--";</script><style>.test::after { content: "\\3C /STYLE>"; }</style>');
assert.throws(() => plugin.generateBundle.call(context, {}, {}), /Missing demo HTML/);
assert.throws(() => plugin.generateBundle.call(context, {}, {
  'index.html': { type: 'asset', source: '<script src="./missing.js"></script>' },
}), /Missing script/);

assert.deepEqual(readdirSync('dist'), ['index.html']);
const html = readFileSync('dist/index.html', 'utf8');
assert.match(html, /<script type="module"/);
assert.match(html, /<style>/);
assert.ok(!/<script\b[^>]*\bsrc=/i.test(html), 'Scripts must be inlined');
assert.ok(!/<link\b[^>]*href="\.\/[^"\n]+\.css"/i.test(html), 'Local styles must be inlined');
console.log('Single HTML build and closing-tag escaping verified');
