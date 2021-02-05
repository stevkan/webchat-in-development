const path = require('path');
const { spawn } = require('cross-spawn');

const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });

// Checks if NPM is installed on the system
exports.CheckNpm = CheckNpm = async () => {
    const isNpmInstalled = spawn('npm', ['--version'], { stdio: 'inherit' });
    await isNpmInstalled.on('error', (e) => {
      console.log('\nWeb server unable to start...');
      e.message = `Cannot execute command. Please verify 'npm' installation and try again.`;
      console.log(`${e.stack}\n`);
      isPythonInstalled.emit('CHECK_FAILED');
      process.exit();
    });
    await isNpmInstalled.on('exit', () => {
      console.log('\nNpm installation verified...');
      isNpmInstalled.emit('CHECK_SUCCEEDED');
    });
    return isNpmInstalled;
}

// Calls 'npx serve' starting the web server
exports.WebServer = WebServer = async () => {
  setTimeout(() => {
    console.log('Web server started...');
  }, 1000);

  const startWebServer = spawn('npx serve', [`${process.env.WEB_SERVER_ROOT_DIRECTORY}`, '-l', `${process.env.WEB_SERVER_PORT}`], { stdio: 'inherit' });
  await startWebServer.on('error', (e) => {
    console.log('\nWeb server unable to start...');
    e.message = `Cannot execute 'npx serve' command. Please verify installation/configuration and try again.`;
    console.log(`${e.stack}\n`);
    process.exit();
  });
};
