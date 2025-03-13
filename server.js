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
    const { player_x, player_o, board, status } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO games (player_x, player_o, board, status) VALUES ($1, $2, $3, $4) RETURNING *',
            [player_x, player_o, board, status]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT player_x AS player, COUNT(*) AS wins FROM games WHERE status = $1 GROUP BY player_x ORDER BY wins DESC',
            ['winner']
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get game history
app.get('/api/history', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM games ORDER BY created_at DESC LIMIT 10');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update game status
app.put('/api/games/:id', async (req, res) => {
    const { id } = req.params;
    const { board, status } = req.body;
    try {
        const result = await pool.query(
            'UPDATE games SET board = $1, status = $2 WHERE id = $3 RETURNING *',
            [board, status, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
