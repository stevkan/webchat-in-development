## Web Chat in Development

Web Chat in Development is designed to be a simple set-up-and-go implementation of [BotFramework-WebChat](https://github.com/microsoft/botframework-webchat) allowing the developer, with minimal effort, to run a development instance of Web Chat without requiring deployment. The components contained within include a `webchat.html` page as well as two servers: `tokenServer.js` and `webServer.js`.

### Requirements

- [Node.js](https://nodejs.org/en/) installed on your system
- A locally deployed [bot](https://docs.botframework.com)
- An Azure [bot registration](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-quickstart-registration?view=azure-bot-service-3.0)
- Either [ngrok](https://blog.botframework.com/2017/10/19/debug-channel-locally-using-ngrok/) or [Azure Service Bus](https://blog.botframework.com/2019/04/16/debugging-your-locally-hosted-v4-bot-using-azure-relays/) installed on your system

#

### Setting up
- Clone this repo and run `npm i` in the root directory
- Update the `.env` file with:
  - Your Direct Line secret, which can be obtained by adding the Direct Line channel in your bot's Channels blade in Azure. Copy the key supplied there.
  - The port to use for the token server.
  - The path to be used as the web server's root directory.
    - For example, if you choose your Documents folder, `C:\Users\<<UserName>>\Documents`, as your root directory, the web server will display the contents of that folder as the topmost viewable directory. Every file, directory, and sub-directory within the Documents folder will also be available. However, no parent directory will be accessible.
  - The port to use for the web server.

#

### Running Web Chat in Development
- Start your bot locally on your machine
- Start up ngrok, Azure Service Bus Relay, or equivalent, to create a tunnel
  - The port defined here should match the port used to run your bot
  - Update the bot registration's messaging endpoint with the generated endpoint (ngrok example: `https://j8dhs7elw.ngrok.io/api/messages`)
- Type `npm run watch` to run both servers concurrently
- Navigate to `http://localhost:<<WEB SERVER PORT>>` to test your bot and/or Web Chat