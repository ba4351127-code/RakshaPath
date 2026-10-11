const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
console.log('[RakshaPath Build] Current working directory:', process.cwd());

if (fs.existsSync(path.join(__dirname, 'frontend', 'package.json'))) {
  console.log('[RakshaPath Build] Building from project root...');
  execSync(`${npmCmd} run build`, { cwd: path.join(__dirname, 'frontend'), stdio: 'inherit', shell: true });

  const srcDist = path.join(__dirname, 'frontend', 'dist');
  const targetDist = path.join(__dirname, 'dist');
  if (fs.existsSync(srcDist)) {
    if (!fs.existsSync(targetDist)) {
      fs.mkdirSync(targetDist, { recursive: true });
    }
    fs.cpSync(srcDist, targetDist, { recursive: true });
    console.log('[RakshaPath Build] Mirrored frontend/dist to root dist/');
  }
} else {
  console.log('[RakshaPath Build] Building directly inside frontend directory...');
  execSync(`${npmCmd} run build`, { stdio: 'inherit', shell: true });
}

console.log('[RakshaPath Build] Build completed successfully.');
