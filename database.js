import mysql from 'mysql2'

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'traps_2023'
}).promise();

export async function getPlayers() {
    const [rows] = await pool.query("SELECT * FROM players");
    return rows;
}

export async function getPlayer(id) {
    const [rows] = await pool.query("SELECT * FROM players WHERE");
    return rows;
}