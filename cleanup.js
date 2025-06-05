#!/usr/bin/env node

/**
 * Cleanup Script for Removing FSD Structure
 * 
 * This script helps remove the FSD structure files that were added.
 * Run with: node cleanup.js
 */

const fs = require('fs');
const path = require('path');

// Files to remove
const filesToRemove = [
  'MIGRATION_PLAN.md',
  'FSD_GUIDELINES.md',
  'PROJECT_MIGRATION.md',
  'SETUP.md',
  'migrate.js'
];

// Directories to remove recursively
const dirsToRemove = [
  'src'
];

// Remove files
function removeFiles() {
  filesToRemove.forEach(file => {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(`Removed file: ${file}`);
    } else {
      console.log(`File not found: ${file}`);
    }
  });
}

// Remove directories recursively
function removeDirs() {
  dirsToRemove.forEach(dir => {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
      console.log(`Removed directory: ${dir}`);
    } else {
      console.log(`Directory not found: ${dir}`);
    }
  });
}

// Main execution
function main() {
  console.log('Starting cleanup...');
  removeFiles();
  removeDirs();
  console.log('Cleanup completed!');
  console.log('You can now continue with your original project structure.');
}

main();