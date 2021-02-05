/* eslint-disable no-multi-assign */
const path = require('path');
const { spawn } = require('cross-spawn');
const logger = require('console').log;

const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });

// Checks if NPM is installed on the system
// eslint-disable-next-line no-undef
exports.CheckNpm = CheckNpm = async () => {
  const isNpmInstalled = spawn('npm', ['--version'], { stdio: 'inherit' });
  await isNpmInstalled.on('error', (e) => {
    logger('\nWeb server unable to start...');
    e.message = 'Cannot execute command. Please verify \'npm\' installation and try again.';
    logger(`${ e.stack }\n`);
    isNpmInstalled.emit('CHECK_FAILED');
    process.exit();
  });
  await isNpmInstalled.on('exit', () => {
    logger('\nNpm installation verified...');
    isNpmInstalled.emit('CHECK_SUCCEEDED');
  });
  return isNpmInstalled;
};

// Calls 'npx serve' starting the web server
// eslint-disable-next-line no-undef
exports.WebServer = WebServer = async () => {
  setTimeout(() => {
    logger('Web server started...');
  }, 1000);

  const startWebServer = spawn('npx serve', [`${ process.env.WEB_SERVER_ROOT_DIRECTORY }`, '-l', `${ process.env.WEB_SERVER_PORT }`], { stdio: 'inherit' });
  await startWebServer.on('error', (e) => {
    logger('\nWeb server unable to start...');
    e.message = 'Cannot execute \'npx serve\' command. Please verify installation/configuration and try again.';
    logger(`${ e.stack }\n`);
    process.exit();
  });
};
