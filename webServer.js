const path = require('path');
const { spawn } = require('cross-spawn');

const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });

// Checks if Python is installed on the system
exports.CheckPython = CheckPython = async () => {
    const isPythonInstalled = spawn('python', ['--version'], { stdio: 'inherit' });
    await isPythonInstalled.on('error', (e) => {
      console.log('\nWeb server unable to start...');
      e.message = `Cannot execute command. Please verify Python v3 installation and try again.`;
      console.log(`${e.stack}\n`);
      isPythonInstalled.emit('CHECK_FAILED');
      process.exit();
    });
    await isPythonInstalled.on('exit', () => {
      console.log('\nPython installation verified...');
      isPythonInstalled.emit('CHECK_SUCCEEDED');
    });
    return isPythonInstalled;
}

// Checks is "pip" is installed
// If so, checks if "twisted" is installed
exports.CheckTwisted = CheckTwisted = async () => {
    const isTwistedInstalled = spawn('pip', ['show', 'twisted'], {encoding: "buffer" });
    await isTwistedInstalled.on('error', (e) => {
      console.log('\nWeb server unable to start...');
      e.message = `Cannot execute command. Please verify 'pip' installation and try again.`
      console.log(`${e.stack}\n`);
    });

    let count = 0;
    await isTwistedInstalled.stdout.on('data', data => {
      const newBuffer = Buffer.from(data);
      const bufferString = newBuffer.toString().trim();
      const isInstalled = bufferString.includes('Twisted');
      if (isInstalled === false) {
        count++;
        if (count <= 1) {
          isTwistedInstalled.stdout.emit('error');
        }
      } else {
        count++;
        if (count <= 1) {
          isTwistedInstalled.stdout.emit('exit');
        }
      }
    });
    await isTwistedInstalled.stdout.on('error', (e = new Error()) => {
      console.log('\nWeb server unable to start...');
      e.message = `Python package 'Twisted' required. Please install.`;
      console.log(`${e.stack}\n`);
      isTwistedInstalled.emit('CHECK_FAILED');
      process.exit();
    });
    await isTwistedInstalled.stdout.on('exit', () => {
      console.log('Twisted installation verified...');
      isTwistedInstalled.emit('CHECK_SUCCEEDED');
    });
    return isTwistedInstalled;
}

// Calls the Python package "Twisted" starting the web server
exports.WebServer = WebServer = async () => {
    const startWebServer = spawn('twistd web', ['--path', `${process.env.WEB_SERVER_ROOT_DIRECTORY}`, '--listen', `tcp:${process.env.WEB_SERVER_PORT}`], { stdio: 'inherit' });
    await startWebServer.on('error', (e) => {
      console.log('\nWeb server unable to start...');
      e.message = `Cannot execute command. Please verify 'Twisted' installation/configuration and try again.`;
      console.log(`${e.stack}\n`);
      process.exit();
    });

    // Simple replacement for the below non-functioning code
    setTimeout(() => {
      console.log('Web server started...');
      console.log(`Web server listening to http://localhost:${process.env.WEB_SERVER_PORT}\n`);
    }, 1000);

    // ** BELOW CODE IS NON-RESPONSIVE **
    // await startWebServer.on('exit', () => {
    //   console.log('Web server started... \n');
    //   console.log(`Web server listening to http://localhost:${process.env.WEB_SERVER_PORT}`);
    // });
};
