// Importing necessary libraries
import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;
const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for PostgreSQL on Render
  },
});

// Test Database Connection
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.send(`Database connected! Current time: ${result.rows[0].now}`);
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).send(`Error connecting to the database: ${err.message}`);
  }
});

// Create a new game
app.post('/api/games', async (req, res) => {
  const { playerX, playerO, board, status } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO games (player_x, player_o, board, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [playerX, playerO, board, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating game');
  }
});

// Get all games
app.get('/api/games', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM games');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching games');
  }
});

// Get a single game by ID
app.get('/api/games/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM games WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Game not found');
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving the game');
  }
});

// Update a game by ID
app.put('/api/games/:id', async (req, res) => {
  const { id } = req.params;
  const { board, status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE games SET board = $1, status = $2 WHERE id = $3 RETURNING *',
      [board, status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send('Game not found');
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating the game');
  }
});

// Delete a game by ID
app.delete('/api/games/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM games WHERE id = $1', [id]);
    res.send('Game deleted');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting game');
  }
});

// Get leaderboard (mock implementation)
app.get('/api/leaderboard', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT player_x AS player, COUNT(*) AS wins FROM games WHERE status = $1 GROUP BY player_x ORDER BY wins DESC',
      ['winner']
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching leaderboard');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
