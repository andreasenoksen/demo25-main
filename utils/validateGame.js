const validateGame = (req, res, next) => {
    const { player_x, player_o, board, status } = req.body;

    if (!player_x || !player_o || !board || !status) {
        return res.status(400).json({ error: "All fields are required for game creation!" });
    }

    next();
};

export default validateGame;
