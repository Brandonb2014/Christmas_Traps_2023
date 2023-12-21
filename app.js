// npm run dev to run with nodemon
import express from 'express';
import { getPlayers, getPlayerByName, setPlayerDifficultyLevel, clearPlayerDifficultyLevels, clearPlayerDifficultyLevel, getPlayerMissions, saveNewScan, insertPlayerProgress, getPlayerMissionDetails, setPlayerMissionId, getPlayerScans, clearPlayerScans, checkPlayerProgress, updatePlayerProgress, clearPlayerData } from './database.js';

const app = express();
app.set("view engine", "ejs");

const PORT = process.env.PORT || 3000;

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

app.get("/setPlayerDifficultyLevel", async (req, res) => {
    const { id, difficulty } = req.query;

    if (!id || !difficulty) return res.status(400).json({ msg: 'Missing playerId or difficulty' });

    const clearPlayerDataResponse = await clearPlayerData(id);

    const insertPlayerProgressResult = await insertPlayerProgress(id, difficulty);

    const setPlayerDifficultyLevelResult = await setPlayerDifficultyLevel(id, difficulty);
    res.render("intro.ejs", {
        id, difficulty,
    });
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

app.get("/dashboard", async (req, res) => {
    const { id, difficulty } = req.query;

    // Reset the mission_id of the player back to 0.
    const setPlayerMissionIdResponse = await setPlayerMissionId(id, 0);

    const missions = await getPlayerMissions(difficulty);
    res.render("dashboard.ejs", {
        id, difficulty, missions,
    });
});

app.get("/mission", async (req, res) => {
    const { id, missionId, difficulty } = req.query;

    const setPlayerMissionIdResponse = await setPlayerMissionId(id, missionId);

    const missionDetails = await getPlayerMissionDetails(id, missionId);
    // console.log('missionDetails:', missionDetails);
    res.render("mission.ejs", {
        id, missionId, missionDetails, difficulty,
    });
});

app.get("/checkNewScans", async (req, res) => {
    const { id, missionId } = req.query;

    const getPlayerScansResponse = await getPlayerScans(id);
    // console.log('getPlayerScansResponse:', getPlayerScansResponse);

    if (!!getPlayerScansResponse && !!getPlayerScansResponse[0]?.sensor_id) {
        const {sensor_id} = getPlayerScansResponse[0];
    // console.log('getPlayerScansResponse:', getPlayerScansResponse);
        if (!!getPlayerScansResponse && !!sensor_id && !!missionId) {
            const clearPlayerScansResponse = await clearPlayerScans(id);

            // checkPlayerProgress grabs from the player_mission_details table using the player_id, sensor_id, and mission_id
            const checkPlayerProgressResponse = await checkPlayerProgress(id, sensor_id, missionId);
            if (!!checkPlayerProgressResponse) {
                // if data comes back, then we know that the player hit a sensor that is in their mission and we need to update the progress
                const updatePlayerProgressResponse = await updatePlayerProgress(id, sensor_id, missionId);
                return res.send(checkPlayerProgressResponse);
            }
            return res.status(200).json({ msg: 'No player progress response' });
        }
        return res.status(200).json({ msg: 'Missing sensor_id or mission_id' });
    }
    return res.status(200).json({ msg: 'No player scans' }); 
});

app.post('/api', async (req, res) => {
    const { playerId } = req.query;
    const { sensorId } = req.query;
// console.log('api was just hit');
    if (!playerId || !sensorId) return res.status(400).json({ msg: 'Missing playerId or sensorId' });

    const result = await saveNewScan(playerId, sensorId);
    // res.send(result);



    switch (playerId) {
        case '87':
            console.log('Evelyn just hit sensor', sensorId, new Date());
            break;
        case '5d':
            console.log('Shelby just hit sensor', sensorId, new Date());
            break;
        case '9d':
            console.log('Carson just hit sensor', sensorId, new Date());
            break;
        case '7d':
            console.log('Emerson just hit sensor', sensorId, new Date());
            break;
        case '3d':
            console.log('Ollie just hit sensor', sensorId, new Date());
            break;
        case '2b':
            console.log('Grayson just hit sensor', sensorId, new Date());
            break;
        case 'a3':
            console.log('Guest - Pink Emerald just hit sensor', sensorId, new Date());
            break;
        case '91':
            console.log('Guest - Crescent Moon just hit sensor', sensorId, new Date());
            break;
        default:
            break;
    }

    return res.json({ playerId: `${playerId}`, sensorId: `${sensorId}`});
});

const server = app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
