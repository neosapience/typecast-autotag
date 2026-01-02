#!/usr/bin/env npx tsx
/**
 * Typecast Autotag C Library E2E Test
 *
 * Tests the built .so file on Amazon Linux 2 and CentOS 6.9.
 * Tests all supported tags and three functions (autoTag, manualTag, autoTagWithManual).
 *
 * Usage:
 *   pnpm test:e2e
 */

import { existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { TEST_ENVIRONMENTS } from './types.js';
import { runAllDockerTests } from './docker-runner.js';
import { printHeader, printSuccess, printError, colors } from './colors.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main(): Promise<void> {
  const buildDir = resolve(__dirname, '../../build');
  const libPath = resolve(buildDir, 'libtypecast_autotag.so');

  printHeader('Typecast Autotag C Library E2E Test');
  console.log('');

  // Check build file exists
  if (!existsSync(libPath)) {
    printError(`libtypecast_autotag.so not found in ${buildDir}`);
    console.log('Run ./scripts/build-linux.sh first.');
    process.exit(1);
  }

  // Run tests on all environments
  const results = await runAllDockerTests(TEST_ENVIRONMENTS, buildDir);

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
