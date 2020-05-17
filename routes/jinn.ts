import express, { Request, Response } from 'express';
import Song, { ISongDocument } from '../models/Song';
import { getRandomIndexForAnArray } from '../helpers/utils';

const router = express.Router();

router.get('/byMood/', async (req: Request, res: Response) => {
  const queryStr: { mood: string; wantToStay: string; genres?: string[] | string } = req.query;

  if (!req.query) res.status(400).end();

  try {
    const dbQuery = Song.find();

    const { mood, wantToStay } = queryStr;

    if (wantToStay === 'true') {
      dbQuery.where('moods', mood);
    } else {
      dbQuery.ne('moods', mood);
    }
    if (queryStr.genres) {
      if (Array.isArray(queryStr.genres)) dbQuery.in('genres', queryStr.genres);
      else dbQuery.where('genres', queryStr.genres);
    }

    const queryResult: ISongDocument | ISongDocument[] = await dbQuery.exec();

    let song: ISongDocument;

    if (Array.isArray(queryResult)) {
      if (queryResult.length === 0) return res.status(204).end();
      else song = queryResult[getRandomIndexForAnArray(queryResult)];
    } else song = queryResult;

    await song.updateServicesData();

    res.send(song);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

export default router;
