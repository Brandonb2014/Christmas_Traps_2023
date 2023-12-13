const express = require('express');
const path = require('path');
const urls = require('./Urls');

const app = express();

const PORT = process.env.PORT || 3000;

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
// app.get('/hi', (req, res) => res.sendFile(path.join(__dirname, 'public', 'hello.html')));

// Express will serve the devault html pages when navigated to them.
app.use(express.static("public"));

app.get('/api/shortUrls', (req, res) => res.json(urls));

app.get('/:id', (req, res) => {
    const { id } = req.params;

    if (!!id && id === 'easteregg') return res.redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ");

    const shortenedUrl = urls.find(url => url.id === id);
    
    if (!!shortenedUrl) return res.redirect(shortenedUrl.url);
    return res.sendFile(path.join(__dirname, 'public', '404.html'));
});

app.post('/api', (req, res) => {
    const { playerId } = req.query;
    const { sensorId } = req.query;

    if (!playerId || !sensorId) return res.status(400).json({ msg: 'Missing playerId or sensorId' });

    switch (playerId) {
        case '87':
            console.log('Evelyn just hit sensor', sensorId);
            break;
        case '5d':
            console.log('Wolf just hit sensor', sensorId);
            break;
        case '9d':
            console.log('Carson just hit sensor', sensorId);
            break;
        case '7d':
            console.log('Emerson just hit sensor', sensorId);
            break;
        case '3d':
            console.log('Eye just hit sensor', sensorId);
            break;
        default:
            break;
    }

    return res.json({ playerId: `${playerId}`, sensorId: `${sensorId}`})
});

// app.listen(PORT, () => console.log(`Server started on port:${PORT}`));

const server = app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
