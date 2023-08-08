import express from 'express';
import GameData from '../model/GameData.js';

const router = express.Router();

router.post('/match-history/', async (req, res) => {
  const data = new GameData(req.body);
  try {
    const response = await data.save();

    res.status(200).json({ message: 'Match history saved successfully!' });
  } catch (error) {
    console.error('Error saving match history:', error);
    res.status(500).json({ error: 'Failed to save match history.' });
  }
});

router.get('/', async (req, res) => {
  try {
    const perPage = 10;
    const page = parseInt(req.query.page) || 1;

    const totalGames = await GameData.countDocuments();
    const totalPages = Math.ceil(totalGames / perPage);

    const games = await GameData.find()
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.status(200).json({ games, totalPages });
  } catch (error) {
    console.error('Error retrieving match history:', error);
    res.status(500).json({ error: 'Failed to retrieve match history.' });
  }
});

router.get('/match-history/:gameId', async (req, res) => {
  try {
    const gameId = req.params.gameId;
    const game = await GameData.findById(gameId);

    if (!game) {
      return res.status(404).json({ error: 'Game not found.' });
    }

    res.status(200).json(game);
  } catch (error) {
    console.error('Error retrieving match details:', error);
    res.status(500).json({ error: 'Failed to retrieve match details.' });
  }
});


export default router;

