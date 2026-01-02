/**
 * Terminal color utilities
 */

import { chalk } from 'zx';

export const colors = {
  red: (text: string) => chalk.red(text),
  green: (text: string) => chalk.green(text),
  yellow: (text: string) => chalk.yellow(text),
  blue: (text: string) => chalk.blue(text),
  bold: (text: string) => chalk.bold(text),
};

export function printHeader(text: string): void {
  console.log('='.repeat(46));
  console.log(`  ${text}`);
  console.log('='.repeat(46));
}

export function printSuccess(text: string): void {
  console.log(colors.green(`✓ ${text}`));
}

export function printError(text: string): void {
  console.log(colors.red(`✗ ${text}`));
}

export function printInfo(text: string): void {
  console.log(colors.blue(text));
}
