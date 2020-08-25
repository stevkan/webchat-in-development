const path = require('path');
const express = require('express');

const app = express();
const port = 8000;

const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });

// Create HTTP web server.
app.listen(port, () => {
    console.log(`Web server listening to http://localhost:${port}`);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/webchat.html'))
});