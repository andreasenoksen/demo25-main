import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from 'pg';
import path from 'path';

dotenv.config();
const { Pool } = pkg;

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

// Create a new game
app.post('/api/games', async (req, res) => {
    const { player_x, player_o, board, status, winner } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO games (player_x, player_o, board, status, winner) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [player_x, player_o, board, status, winner]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update leaderboard
app.post('/api/leaderboard', async (req, res) => {
    const { winner } = req.body;
    try {
        await pool.query(`
            INSERT INTO leaderboard (player, wins)
            VALUES ($1, 1)
            ON CONFLICT (player) DO UPDATE SET wins = leaderboard.wins + 1`, [winner]);
        res.status(200).send('Leaderboard Updated');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fetch leaderboard
app.get('/api/leaderboard', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM leaderboard ORDER BY wins DESC'
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fetch game history
app.get('/api/history', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM games ORDER BY created_at DESC LIMIT 10');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
