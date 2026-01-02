/**
 * E2E test type definitions
 */

export interface TestResult {
  total: number;
  passed: number;
  failed: number;
}

export interface DockerTestResult {
  name: string;
  passed: boolean;
  output: string;
}

export type PlatformType = 'linux' | 'windows' | 'macos';

export interface TestEnvironment {
  name: string;
  image: string;
  platform: PlatformType;
  setupCommands?: string[];
}

/**
 * Linux test environments (.so)
 */
export const LINUX_TEST_ENVIRONMENTS: TestEnvironment[] = [
  {
    name: 'CentOS 6.9',
    image: 'quay.io/centos/centos:6',
    platform: 'linux',
    setupCommands: [
      "sed -i 's/mirrorlist/#mirrorlist/g' /etc/yum.repos.d/CentOS-Base.repo",
      "sed -i 's|#baseurl=http://mirror.centos.org|baseurl=http://vault.centos.org|g' /etc/yum.repos.d/CentOS-Base.repo",
    ],
  },
  {
    name: 'Amazon Linux 2',
    image: 'amazonlinux:2',
    platform: 'linux',
  },
];

/**
 * Windows test environment (.dll via Wine)
 */
export const WINDOWS_TEST_ENVIRONMENT: TestEnvironment = {
  name: 'Windows (Wine)',
  image: 'typecast-autotag-test-windows',
  platform: 'windows',
};

/**
 * macOS test environment (.dylib, local execution)
 */
export const MACOS_TEST_ENVIRONMENT: TestEnvironment = {
  name: 'macOS (local)',
  image: '', // Not used for macOS (local execution)
  platform: 'macos',
};

/**
 * All test environments
 */
export const TEST_ENVIRONMENTS: TestEnvironment[] = [...LINUX_TEST_ENVIRONMENTS];

/**
 * All test environments including Windows and macOS
 */
export const ALL_TEST_ENVIRONMENTS: TestEnvironment[] = [
  ...LINUX_TEST_ENVIRONMENTS,
  WINDOWS_TEST_ENVIRONMENT,
  MACOS_TEST_ENVIRONMENT,
];
