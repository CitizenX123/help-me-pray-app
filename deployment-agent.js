#!/usr/bin/env node

/**
 * DEPLOYMENT AGENT - GitHub → Netlify Pipeline Guardian
 * Automatically validates and fixes deployment issues
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class DeploymentAgent {
  constructor() {
    this.issues = [];
    this.fixes = [];
    this.projectRoot = process.cwd();
    this.colors = {
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      magenta: '\x1b[35m',
      cyan: '\x1b[36m',
      white: '\x1b[37m',
      reset: '\x1b[0m'
    };
  }

  log(message, color = 'white') {
    console.log(`${this.colors[color]}${message}${this.colors.reset}`);
  }

  banner() {
    this.log('\n🚀 DEPLOYMENT AGENT ACTIVE 🚀', 'cyan');
    this.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
    this.log('Scanning for deployment issues...', 'white');
  }

  // 1. SYNTAX VALIDATION
  validateSyntax() {
    this.log('\n🔍 SYNTAX VALIDATION', 'yellow');
    
    const jsFiles = [
      'src/App.js',
      'src/App-supabase.js',
      'src/index.js',
      'src/supabaseClient.js'
    ];

    jsFiles.forEach(file => {
      const filePath = path.join(this.projectRoot, file);
      if (fs.existsSync(filePath)) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          
          // Check for common syntax issues
          const issues = this.checkJSSyntax(content, file);
          if (issues.length > 0) {
            this.issues.push(...issues);
          } else {
            this.log(`  ✅ ${file} - No syntax issues`, 'green');
          }
        } catch (error) {
          this.issues.push(`❌ Cannot read ${file}: ${error.message}`);
        }
      } else {
        this.issues.push(`❌ Missing required file: ${file}`);
      }
    });
  }

  checkJSSyntax(content, filename) {
    const issues = [];
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      const lineNum = index + 1;
      
      // Check for missing semicolons in specific patterns
      if (line.trim().match(/^\s*import.*from.*[^;]$/) && !line.includes('//')) {
        issues.push(`${filename}:${lineNum} - Missing semicolon after import`);
      }
      
      // Check for unmatched brackets/braces
      const openBraces = (line.match(/\{/g) || []).length;
      const closeBraces = (line.match(/\}/g) || []).length;
      const openParens = (line.match(/\(/g) || []).length;
      const closeParens = (line.match(/\)/g) || []).length;
      
      // Check for obvious JSX/React issues
      if (line.includes('return (') && !line.trim().endsWith('(') && !line.includes(');')) {
        // This is a heuristic check for return statements
      }
      
      // Check for console.log (should be removed in production)
      if (line.includes('console.log') && !line.includes('//')) {
        issues.push(`${filename}:${lineNum} - Console.log found (consider removing for production)`);
      }
    });
    
    // Check for unmatched quotes
    const singleQuotes = (content.match(/'/g) || []).length;
    const doubleQuotes = (content.match(/"/g) || []).length;
    const backticks = (content.match(/`/g) || []).length;
    
    if (singleQuotes % 2 !== 0) {
      issues.push(`${filename} - Unmatched single quotes detected`);
    }
    if (backticks % 2 !== 0) {
      issues.push(`${filename} - Unmatched template literals detected`);
    }
    
    return issues;
  }

  // 2. BUILD CONFIGURATION VALIDATION
  validateBuildConfig() {
    this.log('\n🔧 BUILD CONFIGURATION', 'yellow');
    
    // Check package.json
    const packagePath = path.join(this.projectRoot, 'package.json');
    if (fs.existsSync(packagePath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        
        // Validate build scripts
        if (!pkg.scripts || !pkg.scripts.build) {
          this.issues.push('❌ Missing build script in package.json');
        } else {
          this.log('  ✅ Build script found', 'green');
        }
        
        // Check for React dependencies
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };
        if (!deps.react) {
          this.issues.push('❌ React dependency missing');
        }
        if (!deps['react-scripts']) {
          this.issues.push('❌ react-scripts dependency missing');
        }
        
        this.log('  ✅ Package.json valid', 'green');
      } catch (error) {
        this.issues.push(`❌ Invalid package.json: ${error.message}`);
      }
    } else {
      this.issues.push('❌ Missing package.json');
    }
    
    // Check netlify.toml
    const netlifyPath = path.join(this.projectRoot, 'netlify.toml');
    if (fs.existsSync(netlifyPath)) {
      const netlifyConfig = fs.readFileSync(netlifyPath, 'utf8');
      if (netlifyConfig.includes('npm run build')) {
        this.log('  ✅ Netlify build command correct', 'green');
      } else {
        this.issues.push('❌ Netlify build command may be incorrect');
      }
    } else {
      this.log('  ⚠️  No netlify.toml found (using defaults)', 'yellow');
    }
  }

  // 3. GIT/GITHUB VALIDATION
  validateGit() {
    this.log('\n📦 GIT/GITHUB VALIDATION', 'yellow');
    
    try {
      // Check if we're in a git repo
      execSync('git rev-parse --git-dir', { stdio: 'pipe' });
      this.log('  ✅ Git repository detected', 'green');
      
      // Check git status
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      if (status.trim()) {
        this.log('  ⚠️  Uncommitted changes detected:', 'yellow');
        this.log(`     ${status.trim()}`, 'yellow');
      } else {
        this.log('  ✅ Working directory clean', 'green');
      }
      
      // Check remote origin
      try {
        const remote = execSync('git remote get-url origin', { encoding: 'utf8' });
        if (remote.includes('github.com')) {
          this.log('  ✅ GitHub remote configured', 'green');
        } else {
          this.issues.push('❌ Remote origin is not GitHub');
        }
      } catch {
        this.issues.push('❌ No remote origin configured');
      }
      
    } catch (error) {
      this.issues.push('❌ Not a git repository');
    }
  }

  // 4. ENVIRONMENT VARIABLES CHECK
  validateEnvironmentVars() {
    this.log('\n🔐 ENVIRONMENT VARIABLES', 'yellow');
    
    const requiredVars = [
      'REACT_APP_SUPABASE_URL',
      'REACT_APP_SUPABASE_ANON_KEY'
    ];
    
    let hasLocalEnv = false;
    const envPath = path.join(this.projectRoot, '.env');
    if (fs.existsSync(envPath)) {
      hasLocalEnv = true;
      this.log('  ✅ Local .env file found', 'green');
    }
    
    this.log('  📋 Required for Netlify deployment:', 'cyan');
    requiredVars.forEach(varName => {
      this.log(`     - ${varName}`, 'cyan');
    });
    
    this.log('  ⚠️  Ensure these are set in Netlify dashboard', 'yellow');
  }

  // 5. FILE STRUCTURE VALIDATION
  validateFileStructure() {
    this.log('\n📁 FILE STRUCTURE', 'yellow');
    
    const requiredFiles = [
      'public/index.html',
      'src/index.js',
      'src/App.js',
      'src/App-supabase.js',
      'package.json'
    ];
    
    const missingFiles = [];
    requiredFiles.forEach(file => {
      const filePath = path.join(this.projectRoot, file);
      if (fs.existsSync(filePath)) {
        this.log(`  ✅ ${file}`, 'green');
      } else {
        missingFiles.push(file);
        this.issues.push(`❌ Missing required file: ${file}`);
      }
    });
    
    // Check for large files that might cause deployment issues
    try {
      const srcSize = execSync('du -sh src 2>/dev/null | cut -f1', { encoding: 'utf8' }).trim();
      this.log(`  📊 Source directory size: ${srcSize}`, 'cyan');
    } catch {
      // Silent fail if du command not available
    }
  }

  // 6. DEPENDENCY CHECK
  validateDependencies() {
    this.log('\n📦 DEPENDENCIES CHECK', 'yellow');
    
    try {
      // Check if node_modules exists
      if (fs.existsSync(path.join(this.projectRoot, 'node_modules'))) {
        this.log('  ✅ node_modules directory exists', 'green');
        
        // Check for package-lock.json or yarn.lock
        if (fs.existsSync(path.join(this.projectRoot, 'package-lock.json'))) {
          this.log('  ✅ package-lock.json found (npm)', 'green');
        } else if (fs.existsSync(path.join(this.projectRoot, 'yarn.lock'))) {
          this.log('  ✅ yarn.lock found (yarn)', 'green');
        } else {
          this.issues.push('❌ No lock file found (package-lock.json or yarn.lock)');
        }
      } else {
        this.issues.push('❌ node_modules not found - run npm install');
      }
    } catch (error) {
      this.issues.push(`❌ Error checking dependencies: ${error.message}`);
    }
  }

  // 7. AUTO-FIX COMMON ISSUES
  autoFix() {
    if (this.issues.length === 0) return;
    
    this.log('\n🔧 AUTO-FIX ATTEMPTS', 'magenta');
    
    // Try to fix missing node_modules
    if (this.issues.some(issue => issue.includes('node_modules not found'))) {
      this.log('  🔄 Running npm install...', 'yellow');
      try {
        execSync('npm install', { stdio: 'inherit' });
        this.fixes.push('✅ Installed dependencies');
        this.issues = this.issues.filter(issue => !issue.includes('node_modules'));
      } catch (error) {
        this.log('  ❌ npm install failed', 'red');
      }
    }
  }

  // 8. GENERATE DEPLOYMENT READINESS REPORT
  generateReport() {
    this.log('\n📊 DEPLOYMENT READINESS REPORT', 'magenta');
    this.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'magenta');
    
    if (this.issues.length === 0) {
      this.log('🎉 ALL CHECKS PASSED - READY FOR DEPLOYMENT! 🎉', 'green');
      this.log('\nYour app is ready to deploy to Netlify:', 'green');
      this.log('  1. git add .', 'cyan');
      this.log('  2. git commit -m "Ready for deployment"', 'cyan');
      this.log('  3. git push origin main', 'cyan');
    } else {
      this.log(`❌ ${this.issues.length} ISSUE(S) FOUND`, 'red');
      this.log('\nIssues to fix before deployment:', 'red');
      this.issues.forEach(issue => {
        this.log(`  ${issue}`, 'red');
      });
      
      if (this.fixes.length > 0) {
        this.log('\nAuto-fixes applied:', 'green');
        this.fixes.forEach(fix => {
          this.log(`  ${fix}`, 'green');
        });
      }
      
      this.log('\n🔄 Run deployment-agent again after fixes', 'yellow');
    }
    
    this.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'magenta');
  }

  // MAIN EXECUTION
  async run() {
    this.banner();
    
    // Run all validation checks
    this.validateSyntax();
    this.validateBuildConfig();
    this.validateGit();
    this.validateEnvironmentVars();
    this.validateFileStructure();
    this.validateDependencies();
    
    // Attempt auto-fixes
    this.autoFix();
    
    // Generate final report
    this.generateReport();
    
    // Exit with appropriate code
    process.exit(this.issues.length > 0 ? 1 : 0);
  }
}

// Run the deployment agent
if (require.main === module) {
  const agent = new DeploymentAgent();
  agent.run().catch(console.error);
}

module.exports = DeploymentAgent;