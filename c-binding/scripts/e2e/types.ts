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
export type ArchType = 'x86_64' | 'x86' | 'arm64' | 'armv7' | 'i686';

export interface TestEnvironment {
  name: string;
  image: string;
  platform: PlatformType;
  arch?: ArchType;
  dockerPlatform?: string; // e.g., "linux/amd64", "linux/arm64"
  libraryFile?: string; // e.g., "libtypecast_autotag_x86_64.so"
  setupCommands?: string[];
}

/**
 * Linux test environments (.so) - x86_64 only (default)
 */
export const LINUX_TEST_ENVIRONMENTS: TestEnvironment[] = [
  {
    name: 'CentOS 6.9 (x86_64)',
    image: 'quay.io/centos/centos:6',
    platform: 'linux',
    arch: 'x86_64',
    dockerPlatform: 'linux/amd64',
    libraryFile: 'libtypecast_autotag.so',
    setupCommands: [
      "sed -i 's/mirrorlist/#mirrorlist/g' /etc/yum.repos.d/CentOS-Base.repo",
      "sed -i 's|#baseurl=http://mirror.centos.org|baseurl=http://vault.centos.org|g' /etc/yum.repos.d/CentOS-Base.repo",
    ],
  },
  {
    name: 'Amazon Linux 2 (x86_64)',
    image: 'amazonlinux:2',
    platform: 'linux',
    arch: 'x86_64',
    dockerPlatform: 'linux/amd64',
    libraryFile: 'libtypecast_autotag.so',
  },
];

/**
 * Linux multi-architecture test environments
 * Includes CentOS 6.9 compatibility tests for x86_64/x86
 */
export const LINUX_MULTIARCH_TEST_ENVIRONMENTS: TestEnvironment[] = [
  // ============================================
  // x86_64 - Test on CentOS 6.9 (target compatibility)
  // ============================================
  {
    name: 'CentOS 6.9 (x86_64) - Target Compat',
    image: 'quay.io/centos/centos:6',
    platform: 'linux',
    arch: 'x86_64',
    dockerPlatform: 'linux/amd64',
    libraryFile: 'libtypecast_autotag_x86_64.so',
    setupCommands: [
      "sed -i 's/mirrorlist/#mirrorlist/g' /etc/yum.repos.d/CentOS-Base.repo",
      "sed -i 's|#baseurl=http://mirror.centos.org|baseurl=http://vault.centos.org|g' /etc/yum.repos.d/CentOS-Base.repo",
    ],
  },
  // Also test on CentOS 7 (common enterprise environment)
  {
    name: 'CentOS 7 (x86_64)',
    image: 'quay.io/centos/centos:7',
    platform: 'linux',
    arch: 'x86_64',
    dockerPlatform: 'linux/amd64',
    libraryFile: 'libtypecast_autotag_x86_64.so',
    setupCommands: [
      // CentOS 7 vault repos for EOL
      "sed -i 's/mirrorlist/#mirrorlist/g' /etc/yum.repos.d/CentOS-*.repo 2>/dev/null || true",
      "sed -i 's|#baseurl=http://mirror.centos.org|baseurl=http://vault.centos.org|g' /etc/yum.repos.d/CentOS-*.repo 2>/dev/null || true",
    ],
  },
  // Test on Amazon Linux 2 (common cloud environment)
  {
    name: 'Amazon Linux 2 (x86_64)',
    image: 'amazonlinux:2',
    platform: 'linux',
    arch: 'x86_64',
    dockerPlatform: 'linux/amd64',
    libraryFile: 'libtypecast_autotag_x86_64.so',
  },
  // ============================================
  // x86 (32-bit) - Test on CentOS 6
  // ============================================
  {
    name: 'CentOS 6 (x86/i386)',
    image: 'i386/centos:6',
    platform: 'linux',
    arch: 'x86',
    dockerPlatform: 'linux/386',
    libraryFile: 'libtypecast_autotag_x86.so',
    setupCommands: [
      "sed -i 's/mirrorlist/#mirrorlist/g' /etc/yum.repos.d/CentOS-Base.repo",
      "sed -i 's|#baseurl=http://mirror.centos.org|baseurl=http://vault.centos.org|g' /etc/yum.repos.d/CentOS-Base.repo",
    ],
  },
  // ============================================
  // arm64 - Test on Debian Bullseye (glibc 2.31)
  // ============================================
  {
    name: 'Debian Bullseye (arm64)',
    image: 'arm64v8/debian:bullseye-slim',
    platform: 'linux',
    arch: 'arm64',
    dockerPlatform: 'linux/arm64',
    libraryFile: 'libtypecast_autotag_arm64.so',
  },
  // ============================================
  // armv7 (32-bit ARM) - Test on Debian Bullseye
  // ============================================
  {
    name: 'Debian Bullseye (armv7)',
    image: 'arm32v7/debian:bullseye-slim',
    platform: 'linux',
    arch: 'armv7',
    dockerPlatform: 'linux/arm/v7',
    libraryFile: 'libtypecast_autotag_armv7.so',
  },
];

/**
 * Windows test environment (.dll via Wine) - x86_64 only (default)
 */
export const WINDOWS_TEST_ENVIRONMENT: TestEnvironment = {
  name: 'Windows (Wine x86_64)',
  image: 'typecast-autotag-test-windows',
  platform: 'windows',
  arch: 'x86_64',
  libraryFile: 'typecast_autotag.dll',
};

/**
 * Windows multi-architecture test environments
 * Both use same Docker image (has both wine32 and wine64)
 */
export const WINDOWS_MULTIARCH_TEST_ENVIRONMENTS: TestEnvironment[] = [
  {
    name: 'Windows (Wine x86_64)',
    image: 'typecast-autotag-test-windows',
    platform: 'windows',
    arch: 'x86_64',
    libraryFile: 'typecast_autotag_x86_64.dll',
  },
  {
    name: 'Windows (Wine x86/i686)',
    image: 'typecast-autotag-test-windows',
    platform: 'windows',
    arch: 'i686',
    libraryFile: 'typecast_autotag_i686.dll',
  },
];

/**
 * macOS test environment (.dylib, local execution)
 * macOS universal binary supports both x86_64 and arm64
 */
export const MACOS_TEST_ENVIRONMENT: TestEnvironment = {
  name: 'macOS (local, universal binary)',
  image: '', // Not used for macOS (local execution)
  platform: 'macos',
  libraryFile: 'libtypecast_autotag.dylib',
};

/**
 * All test environments (default architectures only)
 */
export const TEST_ENVIRONMENTS: TestEnvironment[] = [...LINUX_TEST_ENVIRONMENTS];

/**
 * All test environments including Windows and macOS (default architectures)
 */
export const ALL_TEST_ENVIRONMENTS: TestEnvironment[] = [
  ...LINUX_TEST_ENVIRONMENTS,
  WINDOWS_TEST_ENVIRONMENT,
  MACOS_TEST_ENVIRONMENT,
];

/**
 * All test environments with all architectures
 */
export const ALL_MULTIARCH_TEST_ENVIRONMENTS: TestEnvironment[] = [
  ...LINUX_MULTIARCH_TEST_ENVIRONMENTS,
  ...WINDOWS_MULTIARCH_TEST_ENVIRONMENTS,
  MACOS_TEST_ENVIRONMENT,
];
