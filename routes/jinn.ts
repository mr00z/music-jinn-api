import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import MoodsMap from '../helpers/MoodsMap';
import moodsDict from '../helpers/moodsOppositesDict';
import Song, { ISongDocument, ISong } from '../models/Song';
import { getRandomIndexForAnArray } from '../helpers/utils';

const router = express.Router();
const uri = process.env.MONGO_DB;

const moodsMap = new MoodsMap(moodsDict);

router.get('/byMood/', async (req: Request, res: Response) => {
  const dbQuery = { moods: '' };
  const queryStr = req.query;
  const { mood } = queryStr;
  if (queryStr) {
    if (queryStr.wantToStay === 'true') {
      dbQuery.moods = mood;
    } else {
      const oppositeMood = moodsMap.getOppositeMood(mood);
      if (oppositeMood) {
        dbQuery.moods = oppositeMood;
      }
    }
  }

  await mongoose.connect(uri, { useNewUrlParser: true });
  try {
    const queryResult: ISongDocument | ISongDocument[] = await Song.find(dbQuery).exec();

    let song: ISong;

    if (Array.isArray(queryResult)) {
      if (queryResult.length === 0) return res.status(204).end();
      else song = queryResult[getRandomIndexForAnArray(queryResult)];
    } else song = queryResult;

    res.send(song);
  } catch (e) {
    res.status(500).send(e);
  }
  mongoose.connection.close();
});

export default router;
