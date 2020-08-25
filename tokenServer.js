const path = require('path');
const restify = require('restify');
const request = require('request');

const bodyParser = require('body-parser');
const corsMiddleware = require('restify-cors-middleware');

const cors = corsMiddleware({
    origins: ['*']
});

const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });

// Create HTTP token server.
const server = restify.createServer();
server.pre(cors.preflight);
server.use(cors.actual);
server.use(bodyParser.json({
    extended: false
}));
server.dl_name = 'Token server';

server.listen(process.env.port || process.env.PORT || 3500, function() {
    console.log(`\n${ server.dl_name } listening to ${ server.url }.`);
});

server.post('/directline/token', (req, res) => {
    const userId = (req.body && req.body.id) ? req.body.id : `dl_${ Date.now() + Math.random().toString(36) }`;
    const options = {
        uri: 'https://directline.botframework.com/v3/directline/tokens/generate',
        headers: {
            Authorization: `Bearer ${ process.env.directLineSecret }`,
            'Content-Type': 'application/json'
        },
        json: {
            user: {
                ID: userId
            }
        }
    };
    request.post(options, (error, response, body) => {
        if (!error && response.statusCode < 300) {
            res.send(body);
            console.log(`Someone requested a token...(${ response.statusCode })`);
        } else if (response.statusCode >= 400 && response.statusCode < 500) {
            res.send({ statusCode: response.statusCode, error: "Direct Line's generate token API returned error" });
        } else if (response.statusCode >= 500) {
            res.status(response.statusCode);
            res.send({ statusCode: response.statusCode, error: "Direct Line's generate token API couldn't be reached" });
        }
    });
});

// Listen for incoming requests.
server.post('/directline/refresh', (req, res) => {
    const options = {
        uri: 'https://directline.botframework.com/v3/directline/tokens/refresh',
        headers: {
            Authorization: `Bearer ${ req.body.token }`
        }
    };
    request.post(options, (error, response, body) => {
        if (!error && response.statusCode < 300) {
            res.send(body);
            console.log(`Someone refreshed a token...(${ response.statusCode })`);
        } else if (response.statusCode >= 400 && response.statusCode < 500) {
            res.send({ statusCode: response.statusCode, error: "Direct Line's token refresh API returned error" });
        } else if (response.statusCode >= 500) {
            res.status(response.statusCode);
            res.send({ statusCode: response.statusCode, error: "Direct Line's token refresh API couldn't be reached" });
        }
    });
});

server.post('/directline/conversations', (req, res) => {
    const userId = (req.body && req.body.id) ? req.body.id : `dl_${ Date.now() + Math.random().toString(36) }`;
    const options = {
        uri: 'https://directline.botframework.com/v3/directline/conversations',
        headers: {
            Authorization: `Bearer ${ process.env.directLineSecret }`,
            'Content-Type': 'application/json'
        },
        json: {
            user: {
                ID: userId
            }
        }
    };
    request.post(options, async (error, response, body) => {
        if (!error && response.statusCode < 300) {
            res.send(body);
            console.log(`Someone started a conversation...(${ response.statusCode })`);
        } else if (response.statusCode >= 400 && response.statusCode < 500) {
            res.send({ statusCode: response.statusCode, error: "Direct Line's conversations API returned error" });
        } else if (response.statusCode >= 500) {
            res.status(response.statusCode);
            res.send({ statusCode: response.statusCode, error: "Direct Line's conversations API couldn't be reached" });
        }
    });
});

// Listen for incoming requests.
server.post('/directline/reconnect', (req, res) => {
    const token = req.body.token;
    const conversationId = req.body.conversationId;
    const watermark = !req.body.watermark ? 0 : req.body.watermark;
    const options = {
        uri: `https://directline.botframework.com/v3/directline/conversations/${ conversationId }?watermark=${ watermark }`,
        headers: {
            Authorization: `Bearer ${ token }`
        }
    };
    request.get(options, (error, response, body) => {
        body = JSON.parse(body);
        if (!error && response.statusCode < 300) {
            res.send(body);
            console.log(`Someone reconnected to a conversation...(${ response.statusCode })`);
        } else if (response.statusCode >= 400 && response.statusCode < 500) {
            res.send({ statusCode: response.statusCode, error: "Direct Line's reconnect API returned error" });
        } else if (response.statusCode >= 500) {
            res.status(response.statusCode);
            res.send({ statusCode: response.statusCode, error: "Direct Line's reconnect API couldn't be reached" });
        }
    });
});

server.post('/speechservices/token', async (req, res) => {
    const options = {
        uri: `https://${ process.env.SPEECH_SERVICES_REGION }.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
        headers: {
            'Ocp-Apim-Subscription-Key': process.env.SPEECH_SERVICES_SUBSCRIPTION_KEY
        }
    };
    request.post(options, (error, response, body) => {
        if (!error && response.statusCode < 300) {
            body = { region: process.env.SPEECH_SERVICES_REGION, authorizationToken: body };
            res.send({
                authorizationToken: body.authorizationToken,
                region: body.region
            });
            console.log(`Someone requested a speech token...(${ response.statusCode })`);
        } else if (response.statusCode >= 400 && response.statusCode < 500) {
            res.send({ statusCode: response.statusCode, error: "CS's speech token API returned error" });
        } else if (response.statusCode >= 500) {
            res.status(response.statusCode);
            res.send({ statusCode: response.statusCode, error: "CS's speech token API couldn't be reached" });
        }
    });
});