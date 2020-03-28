import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import Song, { ISongDocument, ISongQuery } from '../models/Song';

const router = express.Router();
const uri = process.env.MONGO_DB;
const DEFAULT_PAGE = 1;
const DEFAULT_RESULTS_PER_PAGE = 10;

router.get('/', async (req: Request, res: Response) => {
  const queryStr: ISongQuery = req.query;
  let { page, resultsPerPage } = queryStr;
  if (!page || !resultsPerPage) {
    page = DEFAULT_PAGE;
    resultsPerPage = DEFAULT_RESULTS_PER_PAGE;
  }
  await mongoose.connect(uri, { useNewUrlParser: true });
  try {
    const collationSettings = { locale: 'en', strength: 2 };

    const foundSongs: ISongDocument[] = await Song.find(queryStr)
      .collation(collationSettings)
      .skip(resultsPerPage * page - resultsPerPage)
      .limit(resultsPerPage)
      .exec();

    const songsCount = await Song.countDocuments(queryStr)
      .collation(collationSettings)
      .exec();

    res.send({
      songs: foundSongs,
      currentPage: page,
      pagesCount: Math.ceil(songsCount / resultsPerPage),
      resultsCount: songsCount
    });
  } catch (e) {
    res.status(500).send(e);
  }
  mongoose.connection.close();
});

export default router;
