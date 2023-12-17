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
        ORDER BY sort_order
    `);
    return rows;
}

export async function getPlayerById(id) {
    const [row] = await pool.query(`
        SELECT *
        FROM players
        WHERE id = ?
    `, [id]);
    return row[0];
}

export async function getPlayerByName(name) {
    const [row] = await pool.query(`
        SELECT *
        FROM players
        WHERE name = ?
    `, [name]);
    return row[0];
}

export async function setPlayerDifficultyLevel(id, difficulty) {
    const [row] = await pool.query(`
        UPDATE players
        SET difficulty = ?
        WHERE id = ?;
    `, [difficulty, id]);
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

