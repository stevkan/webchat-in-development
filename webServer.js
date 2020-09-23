const path = require('path');
const { App } = require('@tinyhttp/app');
const fs = require('fs');

const app = new App();
const PORT = 8000;

const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });

const logger = (req, res, next) => {
    res.on('finish', () => console.log(`${req.method} ${req.url} ${res.statusCode}`));
    next();
}

// Create HTTP web server.
app
    .use(logger)
    .get('/', (_, res, next) => {
        try {
            fs.readFile('./public/webchat.html', function read(err, data) {
                if (err) {
                    throw err;
                }
                res.send(data.toString())
            });
        } catch(e) {
            next(e)
        }
    })
    .listen(PORT, () => console.log(`Web server listening to http://localhost:${PORT}`));