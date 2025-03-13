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

// PostgreSQL Database Setup
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

// Serve static files
app.use(express.static('public'));

// Serve index.html on root route
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

// Create new game
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

// Get game by ID
app.get('/api/games/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM games WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Game not found' });
        } else {
            res.json(result.rows[0]);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update game
app.put('/api/games/:id', async (req, res) => {
    const { id } = req.params;
    const { board, status, winner } = req.body;
    try {
        const result = await pool.query(
            'UPDATE games SET board = $1, status = $2, winner = $3 WHERE id = $4 RETURNING *',
            [board, status, winner, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Leaderboard
app.post('/api/leaderboard', async (req, res) => {
    const { winner } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO leaderboard (player, wins) VALUES ($1, 1) ON CONFLICT (player) DO UPDATE SET wins = leaderboard.wins + 1',
            [winner]
        );
        res.status(201).send('Leaderboard updated');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Leaderboard
app.get('/api/leaderboard', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM leaderboard ORDER BY wins DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Game History
app.get('/api/history', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM games ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
