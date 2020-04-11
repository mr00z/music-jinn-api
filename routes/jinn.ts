import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import Song, { ISongDocument } from '../models/Song';
import { getRandomIndexForAnArray } from '../helpers/utils';

const router = express.Router();
const uri = process.env.MONGO_DB;

router.get('/byMood/', async (req: Request, res: Response) => {
  const dbQuery: { moods: string | object } = { moods: '' };
  const queryStr = req.query;
  if (queryStr) {
    const { mood } = queryStr;

    if (queryStr.wantToStay === 'true') {
      dbQuery.moods = mood;
    } else {
      dbQuery.moods = { $ne: mood };
    }
  }

  await mongoose.connect(uri, { useNewUrlParser: true });
  try {
    const queryResult: ISongDocument | ISongDocument[] = await Song.find(dbQuery).exec();

    let song: ISongDocument;

    if (Array.isArray(queryResult)) {
      if (queryResult.length === 0) return res.status(204).end();
      else song = queryResult[getRandomIndexForAnArray(queryResult)];
    } else song = queryResult;

    if (!song.servicesData) await song.initializeServicesData();
    else await song.updateServicesData();

    res.send(song);
  } catch (e) {
    res.status(500).send(e);
  }
  mongoose.connection.close();
});

export default router;
