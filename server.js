import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from 'pg';

// Load environment variables from .env file
dotenv.config();

const { Pool } = pkg;

const app = express();
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Set up the PostgreSQL connection using pg and dotenv
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,  // Required for connecting to PostgreSQL on Render
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Test the connection
app.get('/', async (req, res) => {
    try {
      const result = await pool.query('SELECT NOW()');
      res.send(`Database connected! Current time: ${result.rows[0].now}`);
    } catch (err) {
      console.error('Database connection error:', err);
      res.status(500).send('Error connecting to the database');
    }
  });
  

// CRUD Endpoints for the Tic-Tac-Toe Game
app.post('/api/games', async (req, res) => {
  const { playerX, playerO, board, status } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO games (player_x, player_o, board, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [playerX, playerO, board, status]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating game');
  }
});

app.get('/api/games', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM games');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching games');
  }
});

app.put('/api/games/:id', async (req, res) => {
  const { id } = req.params;
  const { board, status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE games SET board = $1, status = $2 WHERE id = $3 RETURNING *',
      [board, status, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating game');
  }
});

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
