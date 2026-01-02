/**
 * Docker-based test runner
 */

import { $ } from 'zx';
import { writeFileSync, unlinkSync } from 'fs';
import type { DockerTestResult, TestEnvironment } from './types.js';
import { C_TEST_PROGRAM } from './test-program.js';
import { C_TEST_PROGRAM_WINDOWS } from './test-program-windows.js';
import { C_TEST_PROGRAM_MACOS } from './test-program-macos.js';
import { printInfo } from './colors.js';

/**
 * Runs Linux tests inside a Docker container.
 */
async function runLinuxDockerTest(
  env: TestEnvironment,
  buildDir: string
): Promise<DockerTestResult> {
  try {
    // Build setup commands
    const setupCommands = env.setupCommands?.join(' && ') || 'true';

    // C test program code
    const testProgram = C_TEST_PROGRAM;

    // Build Docker command
    const dockerCommand = `
      ${setupCommands}
      yum install -y gcc > /dev/null 2>&1
      
      cat > /tmp/test.c << 'TESTCODE'
${testProgram}
TESTCODE
      
      gcc -o /tmp/test /tmp/test.c -ldl 2>&1
      /tmp/test 2>&1
    `;

    // Run Docker
    const result = await $`docker run --rm \
      -v ${buildDir}:/lib_check \
      --platform linux/amd64 \
      ${env.image} sh -c ${dockerCommand}`.quiet();

    return {
      name: env.name,
      passed: result.exitCode === 0,
      output: result.stdout,
    };
  } catch (error) {
    const errorOutput = error instanceof Error ? error.message : String(error);
    return {
      name: env.name,
      passed: false,
      output: errorOutput,
    };
  }
}

/**
 * Runs Windows DLL tests using Wine inside a Docker container.
 */
async function runWindowsDockerTest(
  env: TestEnvironment,
  buildDir: string
): Promise<DockerTestResult> {
  try {
    // Windows test program code
    const testProgram = C_TEST_PROGRAM_WINDOWS;

    // Build Docker command for Wine test
    const dockerCommand = `
      # Write test program
      cat > /tmp/test.c << 'TESTCODE'
${testProgram}
TESTCODE
      
      # Compile with MinGW (Windows x64 target)
      x86_64-w64-mingw32-gcc -o /tmp/test.exe /tmp/test.c 2>&1
      
      # Copy DLL to test directory
      cp /lib_check/typecast_autotag.dll /tmp/
      
      # Run with Wine (suppress Wine debug output)
      cd /tmp && WINEDEBUG=-all wine64 ./test.exe 2>&1
    `;

    // Run Docker with pre-built Wine test image
    const result = await $`docker run --rm \
      -v ${buildDir}:/lib_check \
      --platform linux/amd64 \
      ${env.image} sh -c ${dockerCommand}`.quiet();

    return {
      name: env.name,
      passed: result.exitCode === 0,
      output: result.stdout,
    };
  } catch (error) {
    const errorOutput = error instanceof Error ? error.message : String(error);
    return {
      name: env.name,
      passed: false,
      output: errorOutput,
    };
  }
}

/**
 * Runs macOS dylib tests locally (no Docker needed).
 */
async function runMacOSLocalTest(
  env: TestEnvironment,
  buildDir: string
): Promise<DockerTestResult> {
  const testFile = '/tmp/typecast_macos_test.c';
  const testBinary = '/tmp/typecast_macos_test';

  try {
    // Check if running on macOS
    const unameResult = await $`uname -s`.quiet();
    if (unameResult.stdout.trim() !== 'Darwin') {
      return {
        name: env.name,
        passed: false,
        output: 'Error: macOS tests can only run on macOS',
      };
    }

    // C test program code (uses dlopen with .dylib)
    const testProgram = C_TEST_PROGRAM_MACOS;

    // Write test program to temp file using Node.js fs
    writeFileSync(testFile, testProgram, 'utf8');

    // Compile test program (macOS doesn't need -ldl, it's built into the system)
    await $`gcc -o ${testBinary} ${testFile}`.quiet();

    // Run test with library path
    const result = await $`DYLD_LIBRARY_PATH=${buildDir} ${testBinary}`.quiet();

    return {
      name: env.name,
      passed: result.exitCode === 0,
      output: result.stdout,
    };
  } catch (error) {
    const errorOutput = error instanceof Error ? error.message : String(error);
    return {
      name: env.name,
      passed: false,
      output: errorOutput,
    };
  } finally {
    // Cleanup
    try {
      unlinkSync(testFile);
    } catch {
      /* ignore */
    }
    try {
      unlinkSync(testBinary);
    } catch {
      /* ignore */
    }
  }
}

/**
 * Runs tests inside a Docker container (dispatches to platform-specific runner).
 */
export async function runDockerTest(
  env: TestEnvironment,
  buildDir: string
): Promise<DockerTestResult> {
  printInfo(`Testing on ${env.name}...`);
  console.log('');

  if (env.platform === 'windows') {
    return runWindowsDockerTest(env, buildDir);
  } else if (env.platform === 'macos') {
    return runMacOSLocalTest(env, buildDir);
  } else {
    return runLinuxDockerTest(env, buildDir);
  }
}

/**
 * Builds the Windows test Docker image (with Wine and MinGW).
 */
export async function buildWindowsTestImage(): Promise<void> {
  const dockerfilePath = new URL('../../Dockerfile.test.windows', import.meta.url).pathname;
  const contextPath = new URL('../../', import.meta.url).pathname;

  await $`docker build -t typecast-autotag-test-windows -f ${dockerfilePath} ${contextPath}`.quiet();
}

/**
 * Runs tests sequentially across multiple environments.
 */
export async function runAllDockerTests(
  environments: TestEnvironment[],
  buildDir: string
): Promise<DockerTestResult[]> {
  const results: DockerTestResult[] = [];

  for (const env of environments) {
    console.log('');
    console.log('='.repeat(46));
    console.log(`  Testing on ${env.name}`);
    console.log('='.repeat(46));

    const result = await runDockerTest(env, buildDir);
    results.push(result);

    console.log(result.output);
  }

  return results;
}
