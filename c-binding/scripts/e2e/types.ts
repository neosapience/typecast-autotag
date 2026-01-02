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

export interface TestEnvironment {
  name: string;
  image: string;
  setupCommands?: string[];
}

export const TEST_ENVIRONMENTS: TestEnvironment[] = [
  {
    name: 'CentOS 6.9',
    image: 'quay.io/centos/centos:6',
    setupCommands: [
      "sed -i 's/mirrorlist/#mirrorlist/g' /etc/yum.repos.d/CentOS-Base.repo",
      "sed -i 's|#baseurl=http://mirror.centos.org|baseurl=http://vault.centos.org|g' /etc/yum.repos.d/CentOS-Base.repo",
    ],
  },
  {
    name: 'Amazon Linux 2',
    image: 'amazonlinux:2',
  },
];
