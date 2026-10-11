const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
console.log('[RakshaPath Install] Current working directory:', process.cwd());

if (fs.existsSync(path.join(__dirname, 'frontend', 'package.json'))) {
  console.log('[RakshaPath Install] Installing dependencies for frontend from root...');
  execSync(`${npmCmd} install --no-audit --no-fund`, { cwd: path.join(__dirname, 'frontend'), stdio: 'inherit', shell: true });
} else {
  console.log('[RakshaPath Install] Installing dependencies inside frontend directory...');
  execSync(`${npmCmd} install --no-audit --no-fund`, { stdio: 'inherit', shell: true });
}

console.log('[RakshaPath Install] Dependencies installed successfully.');
