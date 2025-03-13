import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from 'pg';
import path from 'path';

import logger from './utils/logger.js';
import validateGame from './utils/validateGame.js';
import errorHandler from './utils/errorHandler.js';

dotenv.config();
const { Pool } = pkg;

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use(logger);

app.use(express.static('public', {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.json')) {
            res.set('Content-Type', 'application/json');
        }
    }
}));

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

app.post('/api/games', validateGame, async (req, res, next) => {
    const { player_x, player_o, board, status, winner } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO games (player_x, player_o, board, status, winner) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [player_x, player_o, board, status, winner]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        next(err);
    }
});

app.get('/api/games/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM games WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Game not found' });
        } else {
            res.json(result.rows[0]);
        }
    } catch (err) {
        next(err);
    }
});

app.put('/api/games/:id', async (req, res, next) => {
    const { id } = req.params;
    const { board, status, winner } = req.body;
    try {
        const result = await pool.query(
            'UPDATE games SET board = $1, status = $2, winner = $3 WHERE id = $4 RETURNING *',
            [board, status, winner, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        next(err);
    }
});

app.post('/api/leaderboard', async (req, res, next) => {
    const { winner } = req.body;
    try {
        await pool.query(
            'INSERT INTO leaderboard (player, wins) VALUES ($1, 1) ON CONFLICT (player) DO UPDATE SET wins = leaderboard.wins + 1',
            [winner]
        );
        res.status(201).send('Leaderboard updated');
    } catch (err) {
        next(err);
    }
});

app.get('/api/leaderboard', async (req, res, next) => {
    try {
        const result = await pool.query('SELECT * FROM leaderboard ORDER BY wins DESC');
        res.json(result.rows);
    } catch (err) {
        next(err);
    }
});

app.get('/api/history', async (req, res, next) => {
    try {
        const result = await pool.query('SELECT * FROM games ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        next(err);
    }
});

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
