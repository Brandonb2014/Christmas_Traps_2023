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

export async function getPlayer(id) {
    const [row] = await pool.query(`
        SELECT *
        FROM players
        WHERE id = ?
    `, [id]);
    return row[0];
}