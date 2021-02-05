const tokenServer = require("./tokenServer").TokenProcess;
const checkNpm = require("./webServer").CheckNpm;
// const checkTwisted = require("./webServer").CheckTwisted;
const webServer = require("./webServer").WebServer;

// Starts token and web servers
(async() => {
  // Call to start token server
  tokenServer();
  
  // Calls to start web server, if checks succeed
  const isNpmLoaded = await checkNpm();
  isNpmLoaded.on('CHECK_SUCCEEDED', async () => {
    await webServer();
    isNpmLoaded.removeAllListeners();
  });
})();