#!/usr/bin/env npx tsx
/**
 * Typecast Autotag C Library E2E Test
 *
 * Tests the built libraries on multiple platforms and architectures.
 *
 * Usage:
 *   pnpm test:e2e                 # All platforms, all architectures
 *   pnpm test:e2e:linux           # Linux x86_64 only
 *   pnpm test:e2e:linux-multiarch # Linux all architectures
 *   pnpm test:e2e:windows         # Windows x86_64 only
 *   pnpm test:e2e:windows-multiarch # Windows all architectures
 *   pnpm test:e2e:macos           # macOS (universal binary)
 */

import { existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  LINUX_TEST_ENVIRONMENTS,
  LINUX_MULTIARCH_TEST_ENVIRONMENTS,
  WINDOWS_TEST_ENVIRONMENT,
  WINDOWS_MULTIARCH_TEST_ENVIRONMENTS,
  MACOS_TEST_ENVIRONMENT,
  ALL_TEST_ENVIRONMENTS,
  ALL_MULTIARCH_TEST_ENVIRONMENTS,
  type TestEnvironment,
} from './types.js';
import { runAllDockerTests, buildWindowsTestImage } from './docker-runner.js';
import { printHeader, printSuccess, printError, printInfo, colors } from './colors.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

type TestMode =
  | 'linux'
  | 'linux-multiarch'
  | 'windows'
  | 'windows-multiarch'
  | 'macos'
  | 'all'
  | 'all-multiarch';

function getTestMode(): TestMode {
  const arg = process.argv[2];
  if (arg === '--linux-multiarch') return 'linux-multiarch';
  if (arg === '--windows' || arg === '-w') return 'windows';
  if (arg === '--windows-multiarch') return 'windows-multiarch';
  if (arg === '--macos' || arg === '-m') return 'macos';
  if (arg === '--all' || arg === '-a') return 'all';
  if (arg === '--all-multiarch') return 'all-multiarch';
  return 'linux';
}

function getEnvironmentsForMode(mode: TestMode): TestEnvironment[] {
  switch (mode) {
    case 'linux-multiarch':
      return LINUX_MULTIARCH_TEST_ENVIRONMENTS;
    case 'windows':
      return [WINDOWS_TEST_ENVIRONMENT];
    case 'windows-multiarch':
      return WINDOWS_MULTIARCH_TEST_ENVIRONMENTS;
    case 'macos':
      return [MACOS_TEST_ENVIRONMENT];
    case 'all':
      return ALL_TEST_ENVIRONMENTS;
    case 'all-multiarch':
      return ALL_MULTIARCH_TEST_ENVIRONMENTS;
    case 'linux':
    default:
      return LINUX_TEST_ENVIRONMENTS;
  }
}

function getRequiredLibraries(mode: TestMode, buildDir: string): { file: string; label: string }[] {
  const libs: { file: string; label: string }[] = [];

  if (mode === 'linux' || mode === 'all') {
    libs.push({ file: 'libtypecast_autotag.so', label: 'Linux x86_64' });
  }

  if (mode === 'linux-multiarch' || mode === 'all-multiarch') {
    libs.push(
      { file: 'libtypecast_autotag_x86_64.so', label: 'Linux x86_64' },
      { file: 'libtypecast_autotag_x86.so', label: 'Linux x86' },
      { file: 'libtypecast_autotag_arm64.so', label: 'Linux arm64' },
      { file: 'libtypecast_autotag_armv7.so', label: 'Linux armv7' }
    );
  }

  if (mode === 'windows' || mode === 'all') {
    libs.push({ file: 'typecast_autotag.dll', label: 'Windows x86_64' });
  }

  if (mode === 'windows-multiarch' || mode === 'all-multiarch') {
    libs.push(
      { file: 'typecast_autotag_x86_64.dll', label: 'Windows x86_64' },
      { file: 'typecast_autotag_i686.dll', label: 'Windows i686' }
    );
  }

  if (mode === 'macos' || mode === 'all' || mode === 'all-multiarch') {
    libs.push({ file: 'libtypecast_autotag.dylib', label: 'macOS universal' });
  }

  return libs;
}

async function main(): Promise<void> {
  const buildDir = resolve(__dirname, '../../build');

  const mode = getTestMode();
  const environments = getEnvironmentsForMode(mode);
  const requiredLibs = getRequiredLibraries(mode, buildDir);

  printHeader('Typecast Autotag C Library E2E Test');
  console.log(`Mode: ${mode}`);
  console.log('');

  // Check required files exist
  let missingFiles = false;
  for (const lib of requiredLibs) {
    const libPath = resolve(buildDir, lib.file);
    if (!existsSync(libPath)) {
      printError(`${lib.file} not found in ${buildDir} (${lib.label})`);
      missingFiles = true;
    }
  }

  if (missingFiles) {
    console.log('');
    console.log('Build the required libraries first:');
    console.log('  pnpm c-binding:build-all-multiarch');
    process.exit(1);
  }

  // Build Windows test Docker image if needed (supports both x86_64 and x86)
  const needsWindowsImage =
    mode === 'windows' ||
    mode === 'all' ||
    mode === 'windows-multiarch' ||
    mode === 'all-multiarch';

  if (needsWindowsImage) {
    printInfo('Building Windows test Docker image...');
    await buildWindowsTestImage();
  }

  console.log('');

  // Run tests on all environments
  const results = await runAllDockerTests(environments, buildDir);

  // Aggregate results
  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;

  // Print final results
  console.log('');
  printHeader('Final E2E Test Results');
  console.log(`Environments tested: ${results.length}`);
  console.log(`Passed: ${colors.green(String(passedCount))}`);
  console.log(`Failed: ${colors.red(String(failedCount))}`);
  console.log('');

  // Print results for each environment
  for (const result of results) {
    if (result.passed) {
      printSuccess(`${result.name}: ALL TESTS PASSED`);
    } else {
      printError(`${result.name}: SOME TESTS FAILED`);
    }
  }

  console.log('');

  if (failedCount === 0) {
    printSuccess('All E2E tests passed!');
    process.exit(0);
  } else {
    printError('Some E2E tests failed!');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('E2E test failed:', error);
  process.exit(1);
});
