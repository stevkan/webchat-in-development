const tokenServer = require("./tokenServer").TokenProcess;
const checkPython = require("./webServer").CheckPython;
const checkTwisted = require("./webServer").CheckTwisted;
const webServer = require("./webServer").WebServer;

// Starts token and web servers
(async() => {
  // Call to start token server
  tokenServer();
  
  // Calls to start web server, if checks succeed
  const isPythonLoaded = await checkPython();
  isPythonLoaded.on('CHECK_SUCCEEDED', async () => {
    isPythonLoaded.removeAllListeners();
    const isTwistedLoaded = await checkTwisted();
    isTwistedLoaded.on('CHECK_SUCCEEDED', async () => {
      isTwistedLoaded.removeAllListeners();
      await webServer();
    });
  });
})();