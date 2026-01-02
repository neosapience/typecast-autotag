#!/usr/bin/env node
/**
 * Sync Python binding version with the main package version
 *
 * Usage: node scripts/sync-python-version.js <version>
 * Example: node scripts/sync-python-version.js 1.2.0
 */

const fs = require('fs');
const path = require('path');

const version = process.argv[2];

if (!version) {
  console.error('Error: Version argument is required');
  console.error('Usage: node scripts/sync-python-version.js <version>');
  process.exit(1);
}

// Validate version format
if (!/^\d+\.\d+\.\d+/.test(version)) {
  console.error(`Error: Invalid version format: ${version}`);
  console.error('Expected format: X.Y.Z (e.g., 1.2.0)');
  process.exit(1);
}

const pyprojectPath = path.join(__dirname, '..', 'python-binding', 'pyproject.toml');
const initPath = path.join(__dirname, '..', 'python-binding', 'typecast_autotag', '__init__.py');

// Update pyproject.toml
try {
  let pyprojectContent = fs.readFileSync(pyprojectPath, 'utf8');
  pyprojectContent = pyprojectContent.replace(/^version\s*=\s*"[^"]+"/m, `version = "${version}"`);
  fs.writeFileSync(pyprojectPath, pyprojectContent);
  console.log(`✓ Updated pyproject.toml to version ${version}`);
} catch (error) {
  console.error(`Error updating pyproject.toml: ${error.message}`);
  process.exit(1);
}

// Update __init__.py
try {
  let initContent = fs.readFileSync(initPath, 'utf8');
  initContent = initContent.replace(/__version__\s*=\s*"[^"]+"/, `__version__ = "${version}"`);
  fs.writeFileSync(initPath, initContent);
  console.log(`✓ Updated __init__.py to version ${version}`);
} catch (error) {
  console.error(`Error updating __init__.py: ${error.message}`);
  process.exit(1);
}

console.log(`\n✓ Python binding version synced to ${version}`);
