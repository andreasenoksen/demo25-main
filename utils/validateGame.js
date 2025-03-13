export default function validateGame(req, res, next) {
    const { player_x, player_o, board, status } = req.body;
    if (!player_x || !player_o || !board || !status) {
      return res.status(400).json({ error: 'Missing required game fields' });
    }
    next();
  }
  