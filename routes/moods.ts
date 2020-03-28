import express from 'express';
import mongoose from 'mongoose';
import Song from '../models/Song';

const router = express.Router();

router.get('/', async (req, res) => {
  await mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true });

  try {
    const moods = await Song.distinct('moods');
    res.send(moods);
  } catch (e) {
    res.status(500).send(e);
  }
  mongoose.connection.close();
});

export default router;
