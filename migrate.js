#!/usr/bin/env node

/**
 * FSD Migration Script
 * 
 * This script helps automate the migration of files to the FSD architecture.
 * Run with: node migrate.js
 */

const fs = require('fs');
const path = require('path');

// Define the FSD structure
const fsdStructure = {
  'src/app': ['providers', 'router'],
  'src/pages': ['admin', 'user', 'auth', 'productivity', 'course-view', 'settings'],
  'src/widgets': ['layouts', 'navigation', 'dashboard', 'course-cards'],
  'src/features': ['admin', 'auth', 'course', 'productivity'],
  'src/entities': ['course', 'session', 'i18n', 'quiz'],
  'src/shared': ['ui', 'lib', 'api', 'config', 'assets']
};

// Create directories
function createDirectories() {
  Object.entries(fsdStructure).forEach(([parentDir, subDirs]) => {
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
      console.log(`Created directory: ${parentDir}`);
    }
    
    subDirs.forEach(subDir => {
      const fullPath = path.join(parentDir, subDir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`Created directory: ${fullPath}`);
      }
    });
  });
}

// Move files from components to shared/ui
function moveComponentsToSharedUI() {
  const uiComponentsDir = 'components/ui';
  const targetDir = 'src/shared/ui';
  
  if (!fs.existsSync(uiComponentsDir)) {
    console.log('UI components directory not found, skipping...');
    return;
  }
  
  const files = fs.readdirSync(uiComponentsDir);
  files.forEach(file => {
    const srcPath = path.join(uiComponentsDir, file);
    const destPath = path.join(targetDir, file);
    
    if (fs.statSync(srcPath).isFile()) {
      if (!fs.existsSync(path.dirname(destPath))) {
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
      }
      
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${srcPath} to ${destPath}`);
    }
  });
}

// Move context providers to entities
function moveContextsToEntities() {
  const contextsDir = 'contexts';
  
  if (!fs.existsSync(contextsDir)) {
    console.log('Contexts directory not found, skipping...');
    return;
  }
  
  // Map of context files to their destination in the FSD structure
  const contextMapping = {
    'AuthContext.tsx': 'src/entities/session/providers/auth-provider.tsx',
    'LanguageContext.tsx': 'src/entities/i18n/providers/language-provider.tsx'
  };
  
  Object.entries(contextMapping).forEach(([file, destination]) => {
    const srcPath = path.join(contextsDir, file);
    
    if (fs.existsSync(srcPath)) {
      // Ensure destination directory exists
      const destDir = path.dirname(destination);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      
      fs.copyFileSync(srcPath, destination);
      console.log(`Copied ${srcPath} to ${destination}`);
    }
  });
}

// Main execution
function main() {
  console.log('Starting FSD migration...');
  createDirectories();
  moveComponentsToSharedUI();
  moveContextsToEntities();
  console.log('Migration completed!');
  console.log('Please review the files and update imports manually.');
}

main();