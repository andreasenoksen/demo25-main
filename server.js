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

// ✅ Serve static files from 'public' folder
app.use(express.static('public'));

// ✅ Serve index.html on root route
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

// API Endpoint to check DB connection
app.get('/api', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.send(`Database connected! Current time: ${result.rows[0].now}`);
    } catch (err) {
        res.send('Error connecting to the database');
    }
});

// ✅ CRUD API for Tic-Tac-Toe

// Create new game
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

// Update game (make a move or register winner)
app.put('/api/games/:id', async (req, res) => {
    const { id } = req.params;
    const { board, status } = req.body;
    try {
        const result = await pool.query(
            'UPDATE games SET board = $1, status = $2 WHERE id = $3 RETURNING *',
            [board, status, id]
        );
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Game not found' });
        } else {
            res.json(result.rows[0]);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete game
app.delete('/api/games/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM games WHERE id = $1', [id]);
        res.status(200).send('Game deleted');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT player_x, COUNT(*) AS wins FROM games WHERE status = $1 GROUP BY player_x ORDER BY wins DESC',
            ['winner']
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
