import express from 'express';
import Song from '../models/Song';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const moods = await Song.distinct('moods');
    res.send(moods);
  } catch (e) {
    res.status(500).send(e);
  }
});

export default router;
