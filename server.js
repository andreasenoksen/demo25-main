import express from 'express';
import { TicTacToeTree, TreeNode } from './utils/ticTacToeTree.mjs';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

let games = {};
let leaderboard = {};

app.post('/games', (req, res) => {
    const gameId = Date.now().toString();
    games[gameId] = new TicTacToeTree();
    res.status(201).json({ gameId, board: games[gameId].root.state });
});

app.get('/games/:gameId', (req, res) => {
    const game = games[req.params.gameId];
    if (!game) return res.status(404).json({ error: 'Game not found' });
    res.json({ board: game.root.state });
});

app.put('/games/:gameId/move', (req, res) => {
    const { gameId } = req.params;
    const { moveIndex, player } = req.body;

    if (!games[gameId]) return res.status(404).json({ error: 'Game not found' });

    let newNode = games[gameId].insertMove(games[gameId].root, moveIndex, player);
    if (!newNode) return res.status(400).json({ error: 'Invalid move' });

    let winner = games[gameId].findWinner(newNode);
    res.json({ board: newNode.state, winner });
});

app.post('/games/:gameId/winner', (req, res) => {
    const { gameId } = req.params;
    const { winner } = req.body;

    if (!games[gameId] || !winner) return res.status(400).json({ error: 'Invalid game or winner' });

    if (!leaderboard[winner]) {
        leaderboard[winner] = 0;
    }
    leaderboard[winner] += 1;

    res.json({ message: `Leaderboard updated: ${winner} now has ${leaderboard[winner]} wins.` });
});

app.get('/leaderboard', (req, res) => {
    res.json(leaderboard);
});

app.delete('/games/:gameId', (req, res) => {
    delete games[req.params.gameId];
    res.status(204).send();
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
