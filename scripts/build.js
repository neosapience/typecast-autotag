#!/usr/bin/env node

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const esbuild = require('esbuild');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const isWatch = process.argv.includes('--watch');

const sharedOptions = {
  entryPoints: [path.join(rootDir, 'src/index.ts')],
  bundle: true,
  platform: 'neutral',
  target: ['es2020'],
  sourcemap: true,
  minify: true,
  logLevel: 'info',
};

const builds = [
  {
    ...sharedOptions,
    outfile: path.join(distDir, 'index.js'),
    format: 'cjs',
  },
  {
    ...sharedOptions,
    outfile: path.join(distDir, 'index.mjs'),
    format: 'esm',
  },
  {
    ...sharedOptions,
    outfile: path.join(distDir, 'index.umd.js'),
    format: 'iife',
    globalName: 'typecastAutotag',
  },
];

function runTsc() {
  const result = spawnSync(
    'pnpm',
    ['exec', 'tsc', '--project', 'tsconfig.build.json', '--emitDeclarationOnly'],
    {
      cwd: rootDir,
      stdio: 'inherit',
    }
  );

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

async function buildOnce() {
  fs.rmSync(distDir, { recursive: true, force: true });
  fs.mkdirSync(distDir, { recursive: true });
  await Promise.all(builds.map((options) => esbuild.build(options)));
  runTsc();
}

function watchTypeDeclarations() {
  const srcDir = path.join(rootDir, 'src');
  const tsconfigBuild = path.join(rootDir, 'tsconfig.build.json');
  let tscTimer;

  const scheduleTsc = () => {
    clearTimeout(tscTimer);
    tscTimer = setTimeout(() => {
      runTsc();
    }, 100);
  };

  const onSourceChange = (eventType, filename) => {
    if (!filename) {
      scheduleTsc();
      return;
    }

    if (
      filename.endsWith('.ts') ||
      filename.endsWith('.tsx') ||
      filename === 'tsconfig.build.json'
    ) {
      scheduleTsc();
    }
  };

  const watchers = [];
  watchers.push(fs.watch(srcDir, { recursive: true }, onSourceChange));
  watchers.push(fs.watch(tsconfigBuild, () => scheduleTsc()));

  return watchers;
}

async function watch() {
  fs.rmSync(distDir, { recursive: true, force: true });
  fs.mkdirSync(distDir, { recursive: true });

  const contexts = await Promise.all(builds.map((options) => esbuild.context(options)));
  await Promise.all(contexts.map((context) => context.watch()));
  runTsc();
  watchTypeDeclarations();
  console.log('Watching for changes...');
}

(isWatch ? watch() : buildOnce()).catch((error) => {
  console.error(error);
  process.exit(1);
});
