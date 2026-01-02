#!/usr/bin/env npx tsx
/**
 * Typecast Autotag C Library E2E Test
 *
 * Tests the built .so file on Amazon Linux 2 and CentOS 6.9.
 * Tests the built .dll file on Windows (via Wine).
 * Tests all supported tags and three functions (autoTag, manualTag, autoTagWithManual).
 *
 * Usage:
 *   pnpm test:e2e           # Linux only (default)
 *   pnpm test:e2e:all       # Linux + Windows
 *   pnpm test:e2e:windows   # Windows only
 */

import { existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  LINUX_TEST_ENVIRONMENTS,
  WINDOWS_TEST_ENVIRONMENT,
  ALL_TEST_ENVIRONMENTS,
  type TestEnvironment,
} from './types.js';
import { runAllDockerTests, buildWindowsTestImage } from './docker-runner.js';
import { printHeader, printSuccess, printError, printInfo, colors } from './colors.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

type TestMode = 'linux' | 'windows' | 'all';

function getTestMode(): TestMode {
  const arg = process.argv[2];
  if (arg === '--windows' || arg === '-w') return 'windows';
  if (arg === '--all' || arg === '-a') return 'all';
  return 'linux';
}

function getEnvironmentsForMode(mode: TestMode): TestEnvironment[] {
  switch (mode) {
    case 'windows':
      return [WINDOWS_TEST_ENVIRONMENT];
    case 'all':
      return ALL_TEST_ENVIRONMENTS;
    case 'linux':
    default:
      return LINUX_TEST_ENVIRONMENTS;
  }
}

async function main(): Promise<void> {
  const buildDir = resolve(__dirname, '../../build');
  const linuxLibPath = resolve(buildDir, 'libtypecast_autotag.so');
  const windowsDllPath = resolve(buildDir, 'typecast_autotag.dll');

  const mode = getTestMode();
  const environments = getEnvironmentsForMode(mode);

  printHeader('Typecast Autotag C Library E2E Test');
  console.log(`Mode: ${mode}`);
  console.log('');

  // Check required files exist based on mode
  if (mode === 'linux' || mode === 'all') {
    if (!existsSync(linuxLibPath)) {
      printError(`libtypecast_autotag.so not found in ${buildDir}`);
      console.log('Run: pnpm c-binding:build-linux');
      process.exit(1);
    }
  }

  if (mode === 'windows' || mode === 'all') {
    if (!existsSync(windowsDllPath)) {
      printError(`typecast_autotag.dll not found in ${buildDir}`);
      console.log('Run: pnpm c-binding:build-windows');
      process.exit(1);
    }

    // Build Windows test Docker image if needed
    printInfo('Building Windows test Docker image...');
    await buildWindowsTestImage();
    console.log('');
  }

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
