import mysql from 'mysql2'

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'traps_2023'
}).promise();

export async function getPlayers() {
    const [rows] = await pool.query(`
        SELECT *
        FROM players
        ORDER BY sort_order;
    `);
    return rows;
}

export async function getPlayerById(id) {
    const [row] = await pool.query(`
        SELECT *
        FROM players
        WHERE id = ?;
    `, [id]);
    return row[0];
}

export async function getPlayerSelectedMission(id) {
    const [row] = await pool.query(`
        SELECT mission_id
        FROM players
        WHERE id = ?;
    `, [id]);
    return row[0];
}

export async function getPlayerByName(name) {
    const [row] = await pool.query(`
        SELECT *
        FROM players
        WHERE name = ?;
    `, [name]);
    return row[0];
}

export async function getPlayerMissions(difficulty) {
    const [row] = await pool.query(`
        SELECT *
        FROM missions
        WHERE difficulty = ?
        ORDER BY id;
    `, [difficulty]);
    return row;
}

export async function getMissionDetails(difficulty) {
    const [row] = await pool.query(`
        SELECT *
        FROM mission_details
        WHERE difficulty = ?
        ORDER BY id;
    `, [difficulty]);
    return row;
}

export async function setPlayerDifficultyLevel(player_id, difficulty) {
    const [row] = await pool.query(`
        UPDATE players
        SET difficulty = ?
        WHERE id = ?;
    `, [difficulty, player_id]);
    return row;
}

export async function setPlayerMissionId(player_id, mission_id) {
    const [row] = await pool.query(`
        UPDATE players
        SET mission_id = ?
        WHERE id = ?;
    `, [parseInt(mission_id), player_id]);
    return row;
}

export async function clearPlayerDifficultyLevels() {
    const [row] = await pool.query(`
        UPDATE players
        SET difficulty = null;
    `);
    return row;
}

export async function clearPlayerDifficultyLevel(name) {
    const [row] = await pool.query(`
        UPDATE players
        SET difficulty = null
        WHERE name = ?;
    `, [name]);
    return await getPlayerByName(name);
}

export async function clearPlayerScans(playerId) {
    const result = await pool.query(`
        DELETE FROM new_scans
        WHERE player_id = ?;
    `, [playerId]);
    return result;
}

export async function clearPlayerData(playerId) {
    const result = await pool.query(`
        DELETE FROM player_mission_details
        WHERE player_id = ?;
    `, [playerId]);
    return result;
}

export async function saveNewScan(playerId, sensorId) {
    const getPlayerSelectedMissionResult = await getPlayerSelectedMission(playerId);
    try {
        if (getPlayerSelectedMissionResult?.mission_id ?? 0 != 0) {
            const clearPlayerScansResult = await clearPlayerScans(playerId);
            const [row] = await pool.query(`
            INSERT INTO new_scans (player_id, sensor_id, mission_id)
            VALUES (?, ?, ?);
            `, [playerId, parseInt(sensorId), parseInt(getPlayerSelectedMissionResult.mission_id)]);
            return row;
        }
    } catch (error) {
        console.log('error saving new scan:', error);
    }
}

export async function getPlayerScans(playerId) {
    const result = await pool.query(`
        SELECT * FROM new_scans
        WHERE player_id = ?;
    `, [playerId]);
    return result[0];
}

export async function insertPlayerProgress(playerId, difficulty) {
    const missionDetails = await getMissionDetails(difficulty);

    if (difficulty == "easy") {
        const sensor_ids = [2, 9, 7, 4, 1, 3, 6, 8, 5, 10];
        for (let i = 0; i < missionDetails.length; i++) {
            const [row] = await pool.query(`
            INSERT INTO player_mission_details (player_id, sensor_id, mission_id, item, img_url, img_url_complete, display, is_collected)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
            `, [playerId, parseInt(sensor_ids[i]), parseInt(missionDetails[i].mission_id), missionDetails[i].item, missionDetails[i].img_url, missionDetails[i].img_url_complete, missionDetails[i].display, false]);
        }
    }
}

export async function updatePlayerProgress(playerId, sensorId, missionId) {
    const [row] = await pool.query(`
        UPDATE player_mission_details
        SET is_collected = 1
        WHERE player_id = ?
        AND sensor_id = ?
        AND mission_id = ?;
    `, [playerId, parseInt(sensorId), parseInt(missionId)]);
    return row;
}

export async function getPlayerMissionDetails(playerId, missionId) {
    const [row] = await pool.query(`
        SELECT *
        FROM player_mission_details
        WHERE player_id = ?
        AND mission_id = ?;
    `, [playerId, parseInt(missionId)]);
    return row;
}

export async function checkPlayerProgress(playerId, sensorId, missionId) {
    if (!!playerId && !!sensorId && !!missionId) {
        const [row] = await pool.query(`
            SELECT *
            FROM player_mission_details
            WHERE player_id = ?
            AND sensor_id = ?
            AND mission_id = ?;
        `, [playerId, parseInt(sensorId), parseInt(missionId)]);
        return row[0];
    }
}