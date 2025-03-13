-- Create 'games' table
CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    player_x VARCHAR(255) NOT NULL,
    player_o VARCHAR(255) NOT NULL,
    board VARCHAR(9) NOT NULL,
    status VARCHAR(50) NOT NULL,
    winner VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create 'leaderboard' table
CREATE TABLE IF NOT EXISTS leaderboard (
    player VARCHAR(255) PRIMARY KEY,
    wins INT DEFAULT 1
);
