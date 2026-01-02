/**
 * Docker-based test runner
 */

import { $ } from 'zx';
import type { DockerTestResult, TestEnvironment } from './types.js';
import { C_TEST_PROGRAM } from './test-program.js';
import { printInfo } from './colors.js';

/**
 * Runs tests inside a Docker container.
 */
export async function runDockerTest(
  env: TestEnvironment,
  buildDir: string
): Promise<DockerTestResult> {
  printInfo(`Testing on ${env.name}...`);
  console.log('');

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
