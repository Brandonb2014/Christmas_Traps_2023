// npm run dev to run with nodemon
import express from 'express';
import { getPlayers, getPlayerByName, setPlayerDifficultyLevel, clearPlayerDifficultyLevels, clearPlayerDifficultyLevel } from './database.js';

const app = express();
app.set("view engine", "ejs");

const PORT = process.env.PORT || 3000;

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/setPlayerDifficultyLevel", async (req, res) => {
    const { id, difficulty } = req.query;

    if (!id || !difficulty) return res.status(400).json({ msg: 'Missing playerId or difficulty' });

    const result = await setPlayerDifficultyLevel(id, difficulty);
    res.render("intro.ejs");
});

app.get("/clearPlayerDifficultyLevels", async (req, res) => {
    const result = await clearPlayerDifficultyLevels();
    res.send(result);
});

app.get("/clearPlayerDifficultyLevel/:name", async (req, res) => {
    const { name } = req.params;
    
    const result = await clearPlayerDifficultyLevel(name);
    res.send(result);
});

app.get("/", async (req, res) => {
    const players = await getPlayers();
    res.render("index.ejs", {
        players,
    });
});

// Express will fall back to the public folder.
app.use(express.static("public"));

app.get("/player/:name", async (req, res) => {
    const { name } = req.params;
    if (!name) return res.status(400).json({ msg: 'Player Name is required' });

    const player = await getPlayerByName(name);
    return res.send(player);
});

app.get("/players", async (req, res) => {
    const players = await getPlayers();
    res.send(players);
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

    return res.json({ playerId: `${playerId}`, sensorId: `${sensorId}`});
});

const server = app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
