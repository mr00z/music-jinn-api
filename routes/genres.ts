import express from 'express';
import Song from '../models/Song';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const genres = await Song.distinct('genres');
    res.send(genres);
  } catch (e) {
    res.status(500).send(e);
  }
});

export default router;
