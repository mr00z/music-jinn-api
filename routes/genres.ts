import express from 'express';
import mongoose from 'mongoose';
import Song from '../models/Song';

const router = express.Router();

router.get('/', async (req, res) => {
  await mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true });

  try {
    const genres = await Song.distinct('genres');
    res.send(genres);
  } catch (e) {
    res.status(500).send(e);
  }
  await mongoose.connection.close();
});

export default router;
