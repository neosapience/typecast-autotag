#!/usr/bin/env node

/**
 * Sync version from package.json to all binding files
 */

const fs = require('fs');
const path = require('path');

// Read version from package.json
const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

console.log(`📦 Syncing version: ${version}`);

// 1. Update java-binding/pom.xml
const pomPath = path.join(__dirname, '../java-binding/pom.xml');
let pomContent = fs.readFileSync(pomPath, 'utf8');
pomContent = pomContent.replace(
  /<version>\d+\.\d+\.\d+<\/version>/,
  `<version>${version}</version>`
);
fs.writeFileSync(pomPath, pomContent);
console.log('✓ Updated java-binding/pom.xml');

// 2. Update python-binding/pyproject.toml
const pyprojectPath = path.join(__dirname, '../python-binding/pyproject.toml');
let pyprojectContent = fs.readFileSync(pyprojectPath, 'utf8');
pyprojectContent = pyprojectContent.replace(/version = "\d+\.\d+\.\d+"/, `version = "${version}"`);
fs.writeFileSync(pyprojectPath, pyprojectContent);
console.log('✓ Updated python-binding/pyproject.toml');

// 3. Update c-binding version header
const cVersionPath = path.join(__dirname, '../c-binding/include/typecast_autotag.h');
let cVersionContent = fs.readFileSync(cVersionPath, 'utf8');
cVersionContent = cVersionContent.replace(
  /#define TYPECAST_VERSION "\d+\.\d+\.\d+"/,
  `#define TYPECAST_VERSION "${version}"`
);
fs.writeFileSync(cVersionPath, cVersionContent);
console.log('✓ Updated c-binding/include/typecast_autotag.h');

console.log(`\n✅ All versions synced to ${version}`);
