const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
    ssl: {
        rejectUnauthorized: false,
    },
    connectionTimeoutMillis: 10000,
    statement_timeout: 1000,
    parseInputDatesAsUTC: true,
});
async function initializeUserTable() {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS user_table (
                user_id SERIAL PRIMARY KEY,
                username VARCHAR(50) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                age INT,
                dob DATE,
                contact VARCHAR(20),
                address VARCHAR(255),
                image_url VARCHAR(255),
                description TEXT
            );
        `);
    } finally {
        client.release();
    }
}

initializeUserTable();

async function createUser(username, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
        'INSERT INTO user_table(username, email, password) VALUES($1, $2, $3) RETURNING *',
        [username, email, hashedPassword]
    );

    return result.rows[0];
}

async function findUserByEmail(email) {
    const result = await pool.query('SELECT * FROM user_table WHERE email = $1', [email]);
    return result.rows[0];
}


async function updateUserProfile(email, { username, age, dob, contact, address, imageUrl, description }) {
    // Convert empty string to null for INT fields
    const ageValue = age !== '' ? parseInt(age, 10) : null;
    const dobValue = dob !== '' ? new Date(dob) : null;
    const result = await pool.query(
        'UPDATE user_table SET username = $1, age = $2, dob = $3, contact = $4, address = $5, image_url = $6, description = $7 WHERE email = $8 RETURNING *',
        [username, ageValue, dobValue, contact, address, imageUrl, description, email]
    );

    return result.rows[0];
}


module.exports = {
    pool,
    createUser,
    findUserByEmail,
    updateUserProfile,
};